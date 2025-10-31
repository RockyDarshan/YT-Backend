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

    // For video files, request an eager-generated thumbnail (jpg) so we can
    // display a preview on the frontend. Use resource_type 'video' to ensure
    // Cloudinary generates video-derived transformations.
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      eager: [{ width: 480, height: 270, crop: "fill", format: "jpg" }],
      eager_async: false,
    });

    // delete local temp file if it exists (guarded)
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error("Failed to delete temp file after upload:", e);
    }

    // attach a thumbnail url if Cloudinary returned eager transformations
    const thumbnail = result?.eager?.[0]?.secure_url || null;
    return { ...result, thumbnail };
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
