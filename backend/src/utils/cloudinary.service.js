import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    const res = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
    fs.unlinkSync(filePath); // cleanup temp file
    return res;
  } catch (err) {
    fs.unlinkSync(filePath); // cleanup even if upload fails
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
    return null;
  }
};