import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import mongoose from "mongoose";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or user ID format",
      });
    }

    // step-1 fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Step-2 If no progress found, return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // Step-3 Return the user's course progress alog with course details
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error("Error getting course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course progress",
    });
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lectureId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course, lecture or user ID format",
      });
    }

    const courseIdObj = new mongoose.Types.ObjectId(courseId);
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const lectureIdObj = new mongoose.Types.ObjectId(lectureId);

    // fetch or create course progress
    let courseProgress = await CourseProgress.findOne({
      courseId: courseIdObj,
      userId: userIdObj,
    });

    if (!courseProgress) {
      // If no progress exist, create a new record
      courseProgress = new CourseProgress({
        userId: userIdObj,
        courseId: courseIdObj,
        completed: false,
        lectureProgress: [],
      });
    }

    // find the lecture progress in the course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId.toString() === lectureId
    );

    if (lectureIndex !== -1) {
      // if lecture already exist, update its status
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // Add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId: lectureIdObj,
        viewed: true,
      });
    }

    // if all lecture is complete
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.lectures.length === lectureProgressLength) {
      courseProgress.completed = true;
    }

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.error("Error updating lecture progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture progress",
    });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or user ID format",
      });
    }

    const courseProgress = await CourseProgress.findOne({
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    courseProgress.lectureProgress.forEach(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as completed.",
    });
  } catch (error) {
    console.error("Error marking course as completed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as completed",
    });
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or user ID format",
      });
    }

    const courseProgress = await CourseProgress.findOne({
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    courseProgress.lectureProgress.forEach(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as incompleted.",
    });
  } catch (error) {
    console.error("Error marking course as incompleted:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as incompleted",
    });
  }
};
