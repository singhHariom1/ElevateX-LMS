import express from "express";
import multer from "multer";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 500MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }
  next();
};

router
  .route("/upload-video")
  .post(
    isAuthenticated,
    upload.single("file"),
    handleMulterError,
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "No file provided. Please select a video file.",
          });
        }

        // Validate file type
        if (!req.file.mimetype.startsWith("video/")) {
          return res.status(400).json({
            success: false,
            message: "Invalid file type. Only video files are allowed.",
          });
        }

        const result = await uploadMedia(req.file.path);

        if (!result || !result.secure_url) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload video to cloud storage",
          });
        }

        res.status(200).json({
          success: true,
          message: "Video uploaded successfully.",
          data: {
            secure_url: result.secure_url,
            public_id: result.public_id,
            url: result.secure_url, // Also include as 'url' for backward compatibility
          },
        });
      } catch (error) {
        console.error("Error uploading file:", error);

        // Handle Cloudinary errors
        if (error.http_code) {
          return res.status(error.http_code).json({
            success: false,
            message: error.message || "Error uploading to cloud storage",
          });
        }

        res.status(500).json({
          success: false,
          message: "Error uploading file",
          error: error.message,
        });
      }
    }
  );
export default router;
