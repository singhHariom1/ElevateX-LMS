import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
  try {
    if (!file) {
      throw new Error("File is required for upload");
    }
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.error("Error uploading media to Cloudinary:", error);
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting media from Cloudinary:", error);
    throw error;
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for video deletion");
    }
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    throw error;
  }
};
