import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category is required.",
      });
    }

    // Validate course title length
    if (courseTitle.trim().length < 3 || courseTitle.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Course title must be between 3 and 100 characters.",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      success: true,
      course,
      message: "Course created.",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = "", sortByPrice = "" } = req.query;

    // Initialize the base search criteria
    let searchCriteria = {
      isPublished: true,
    };

    // Handle text search if query exists
    if (query && query.trim() !== "") {
      searchCriteria.$or = [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    // Handle category filtering if categories exist
    if (categories && categories.trim() !== "") {
      const categoryArray = categories.split(",");
      searchCriteria.category = { $in: categoryArray };
    }

    // Define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; // sort by price in ascending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // descending
    }

    console.log("Search criteria:", JSON.stringify(searchCriteria));

    let courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error("Error searching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search courses",
    });
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error("Error getting published courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published courses",
    });
  }
};
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error("Error getting creator courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get creator courses",
    });
  }
};
export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.id;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    // Validate course price if provided
    if (coursePrice !== undefined && (isNaN(coursePrice) || coursePrice < 0)) {
      return res.status(400).json({
        success: false,
        message: "Course price must be a positive number.",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    // Check if user is the creator of the course
    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      // Delete old thumbnail if it exists (use stored publicId if available, fallback to URL parsing)
      if (course.courseThumbnailPublicId) {
        try {
          await deleteMediaFromCloudinary(course.courseThumbnailPublicId);
        } catch (error) {
          console.error("Error deleting old thumbnail:", error);
          // Continue even if deletion fails
        }
      } else if (course.courseThumbnail) {
        // Fallback: Try to extract publicId from URL (less reliable)
        try {
          const urlParts = course.courseThumbnail.split("/upload/");
          if (urlParts.length > 1) {
            const pathAfterUpload = urlParts[1];
            const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
            const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
            if (publicId) {
              await deleteMediaFromCloudinary(publicId);
            }
          }
        } catch (error) {
          console.error("Error parsing and deleting old thumbnail URL:", error);
        }
      }
      // Upload new thumbnail on Cloudinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
      courseThumbnailPublicId: courseThumbnail?.public_id, // Store publicId for reliable deletion
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }
    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error getting course by id:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course by id",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    const userId = req.id;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title and course ID are required",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // Check if course exists and user is the creator
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add lectures to this course",
      });
    }

    // create lecture
    const lecture = await Lecture.create({ lectureTitle });

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      lecture,
      message: "Lecture created successfully.",
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
    });
  }
};
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // SECURITY CHECK: Verify user is either creator or enrolled
    // Check if user is the creator
    if (course.creator.toString() === userId) {
      return res.status(200).json({
        success: true,
        lectures: course.lectures,
      });
    }

    // Check if user is enrolled in the course
    const isEnrolled = course.enrolledStudents.some(
      (studentId) => studentId.toString() === userId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course. Please purchase the course to access lectures.",
      });
    }

    // User is enrolled, return lectures
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error("Error getting lectures:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lectures",
    });
  }
};
export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lectureId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or lecture ID format",
      });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found!",
      });
    }

    // Check if course exists and user is the creator
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit lectures in this course",
      });
    }

    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course still has the lecture id if it was not already added
    if (!course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    console.error("Error updating lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture",
    });
  }
};
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lecture ID format",
      });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found!",
      });
    }

    // Find the course that contains this lecture and check ownership
    const course = await Course.findOne({ lectures: lectureId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course containing this lecture not found",
      });
    }

    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove lectures from this course",
      });
    }

    // Delete the lecture
    await Lecture.findByIdAndDelete(lectureId);
    // delete the lecture from cloudinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    course.lectures = course.lectures.filter(
      (id) => id.toString() !== lectureId
    );
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    console.error("Error removing lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture",
    });
  }
};
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lecture ID format",
      });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found!",
      });
    }
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("Error getting lecture by id:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture by id",
    });
  }
};

// publich unpublish course logic

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true, false
    const userId = req.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    // Check if user is the creator of the course
    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to publish/unpublish this course",
      });
    }
    // publish status based on the query paramter
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update publish status",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    // Check if user is the creator of the course
    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    // Delete course thumbnail from Cloudinary if exists
    if (course.courseThumbnailPublicId) {
      try {
        await deleteMediaFromCloudinary(course.courseThumbnailPublicId);
      } catch (error) {
        console.error("Error deleting course thumbnail:", error);
        // Continue even if deletion fails
      }
    } else if (course.courseThumbnail) {
      // Fallback: Try to extract publicId from URL
      try {
        const urlParts = course.courseThumbnail.split("/upload/");
        if (urlParts.length > 1) {
          const pathAfterUpload = urlParts[1];
          const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
          const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
          if (publicId) {
            await deleteMediaFromCloudinary(publicId);
          }
        }
      } catch (error) {
        console.error("Error parsing and deleting course thumbnail URL:", error);
      }
    }

    // Delete all lectures associated with the course
    for (const lectureId of course.lectures) {
      const lecture = await Lecture.findById(lectureId);
      if (lecture && lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }
      await Lecture.findByIdAndDelete(lectureId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};
