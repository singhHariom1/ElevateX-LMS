import multer from "multer";

// Configure multer with file size limits and type validation
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Accept video files for video uploads
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } 
    // Accept image files for profile/thumbnail uploads
    else if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } 
    // Reject other file types
    else {
      cb(new Error("Only video and image files are allowed"), false);
    }
  },
});

export default upload;
