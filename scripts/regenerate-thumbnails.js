import connectDB from "../src/db/index.js";
import mongoose from "mongoose";
import { Video } from "../src/models/video.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async function main() {
  try {
    await connectDB();

    const videos = await Video.find().lean();

    let updated = 0;
    for (const v of videos) {
      try {
        const thumb = v.thumbnail || "";
        // if thumbnail looks like a video file (mp4) or is missing, try to build an image thumbnail
        if (
          !thumb ||
          /\.mp4($|\?)/i.test(thumb) ||
          /video\/upload/i.test(thumb)
        ) {
          const videoUrl = v.videoFile || thumb;
          if (!videoUrl) continue;

          // extract public_id from the URL's last path segment (remove extension)
          const parts = videoUrl.split("/");
          const last = parts[parts.length - 1] || "";
          const publicId = last.replace(/\.[^/.]+$/, "");

          if (!publicId) continue;

          const newThumb = cloudinary.url(publicId, {
            resource_type: "video",
            format: "jpg",
            transformation: [{ width: 480, height: 270, crop: "fill" }],
          });

          await Video.updateOne(
            { _id: v._id },
            { $set: { thumbnail: newThumb } }
          );
          updated++;
        }
      } catch (e) {
        console.error("Failed to update video", v._id, e.message);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("Script error:", err);
    process.exit(1);
  }
})();
