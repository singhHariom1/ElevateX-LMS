import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters.",
      });
    }

    // Add password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters with letters and numbers",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email.",
      });
    }

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let updatedData = { name };

    // Only process photo if a new one was uploaded
    if (profilePhoto) {
      // Delete old photo if it exists (use stored publicId if available, fallback to URL parsing)
      if (user.photoPublicId) {
        try {
          await deleteMediaFromCloudinary(user.photoPublicId);
        } catch (error) {
          console.error("Error deleting old photo:", error);
          // Continue even if deletion fails
        }
      } else if (user.photoUrl) {
        // Fallback: Try to extract publicId from URL (less reliable)
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        try {
          const urlParts = user.photoUrl.split("/upload/");
          if (urlParts.length > 1) {
            // Get everything after /upload/ and remove version and extension
            const pathAfterUpload = urlParts[1];
            // Remove version prefix (v1234567890/) if present
            const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
            // Remove file extension
            const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
            if (publicId) {
              await deleteMediaFromCloudinary(publicId);
            }
          }
        } catch (error) {
          console.error("Error parsing and deleting old photo URL:", error);
        }
      }

      // Upload new photo
      const cloudResponse = await uploadMedia(profilePhoto.path);
      updatedData.photoUrl = cloudResponse.secure_url;
      updatedData.photoPublicId = cloudResponse.public_id; // Store publicId for reliable deletion
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
