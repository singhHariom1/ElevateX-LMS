import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/course-progress/${courseId}`, // Use FRONTEND_URL env var
      cancel_url: `${FRONTEND_URL}/course-detail/${courseId}`,    // Use FRONTEND_URL env var
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log("Webhook received with signature:", sig ? "Present" : "Missing");
    console.log("Webhook secret:", secret ? "Present" : "Missing");

    if (!sig || !secret) {
      console.error("Missing stripe signature or webhook secret");
      return res.status(400).send("Missing stripe signature or webhook secret");
    }

    event = stripe.webhooks.constructEvent(req.body, sig, secret);
    console.log("Webhook event received:", event.type);
    console.log("Event data:", JSON.stringify(event.data.object, null, 2));
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("Processing checkout.session.completed event");

    try {
      const session = event.data.object;
      console.log("Session ID:", session.id);
      console.log("Looking for purchase with paymentId:", session.id);

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        console.error("Purchase not found for session ID:", session.id);
        return res.status(404).json({ message: "Purchase not found" });
      }

      console.log("Found purchase:", purchase._id);
      console.log("Current purchase status:", purchase.status);

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
        console.log("Updated amount to:", purchase.amount);
      }
      purchase.status = "completed";
      console.log("Setting status to completed");

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        console.log("Updating lectures to be visible");
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
        console.log("Updated lectures to be visible");
      } else {
        console.log("No lectures to update");
      }

      await purchase.save();
      console.log("Updated purchase status to completed");

      // Update user's enrolledCourses
      console.log("Updating user's enrolled courses");
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );
      console.log("Updated user's enrolled courses");

      // Update course to add user ID to enrolledStudents
      console.log("Updating course's enrolled students");
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );
      console.log("Updated course's enrolled students");

      return res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    console.log("Ignoring event type:", event.type);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed" // Only consider completed purchases
    });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id; // Get the user ID from the request

    const purchasedCourse = await CoursePurchase.find({
      userId: userId, // Filter by user ID
      status: "completed",
    }).populate("courseId");

    // Always return an array, even if empty
    return res.status(200).json({
      success: true,
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchased courses",
      error: error.message
    });
  }
};

export const fixCoursePurchaseStatus = async (req, res) => {
  try {
    const userId = req.id;

    // Find all pending purchases for this user
    const pendingPurchases = await CoursePurchase.find({
      userId,
      status: "pending"
    }).populate("courseId");

    if (!pendingPurchases || pendingPurchases.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No pending purchases found to fix"
      });
    }

    let fixedCount = 0;

    // Update each pending purchase
    for (const purchase of pendingPurchases) {
      // Update purchase status to completed
      purchase.status = "completed";
      await purchase.save();

      // Make all lectures visible
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      fixedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Fixed ${fixedCount} pending purchases`,
      fixedPurchases: fixedCount
    });
  } catch (error) {
    console.error("Error fixing course purchase status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fix course purchase status",
      error: error.message
    });
  }
};

export const getInstructorSales = async (req, res) => {
  try {
    const instructorId = req.id;

    // Find all courses created by this instructor
    const instructorCourses = await Course.find({ creator: instructorId });
    const courseIds = instructorCourses.map(course => course._id);

    // Find all completed purchases for these courses
    const purchasedCourses = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate("courseId");

    // Calculate total sales and revenue
    const totalSales = purchasedCourses.length;
    const totalRevenue = purchasedCourses.reduce((acc, purchase) => acc + (purchase.amount || 0), 0);

    // Group sales by course
    const courseSales = instructorCourses.map(course => {
      const coursePurchases = purchasedCourses.filter(purchase =>
        purchase.courseId._id.toString() === course._id.toString()
      );

      return {
        name: course.courseTitle,
        price: course.coursePrice,
        sales: coursePurchases.length,
        revenue: coursePurchases.reduce((acc, purchase) => acc + (purchase.amount || 0), 0)
      };
    });

    return res.status(200).json({
      success: true,
      totalSales,
      totalRevenue,
      courseSales
    });
  } catch (error) {
    console.error("Error fetching instructor sales:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor sales",
      error: error.message
    });
  }
};
