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

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return null;
    }

    // Determine resource type based on file extension
    const fileExt = filePath.split(".").pop().toLowerCase();
    const isVideo = ["mp4", "mov", "avi", "webm"].includes(fileExt);

    const uploadOptions = {
      resource_type: isVideo ? "video" : "auto",
      ...(isVideo
        ? {
            eager: [{ width: 480, height: 270, crop: "fill", format: "jpg" }],
            eager_async: false,
          }
        : {}),
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

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
    console.error("Error uploading to Cloudinary:", error);
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

const deleteFromCloudinary = async (publicId, resourceType = "video") => {
  try {
    if (!publicId) return null;

    // Delete the main resource (video or image)
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    console.error("Error deleting from cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
