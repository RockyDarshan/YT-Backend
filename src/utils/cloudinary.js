import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    // console.log("Upload successful:", result.url);

    // delete local temp file if it exists (guarded)
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error("Failed to delete temp file after upload:", e);
    }

    return result;
  } catch (error) {
    // try to remove local file if present, but DO NOT re-throw fs errors
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error("Failed to delete temp file on upload error:", e);
    }

    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
