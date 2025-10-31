import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadVideo,
  getVideoById,
  incrementVideoViews,
  deleteVideo,
  getAllVideos,
  getUserVideos,
  updateVideoDetails,
  searchVideos,
  getTrendingVideos,
  getRecentVideos,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/").post(verifyJWT, upload.single("video"), uploadVideo);
// static routes first so they don't get captured by the dynamic :id route
router.get("/", getAllVideos);
router.get("/user", verifyJWT, getUserVideos);
router.get("/search", searchVideos);
router.get("/trending", getTrendingVideos);
router.get("/recent", getRecentVideos);

// dynamic id-based routes (placed after static routes)
router.get("/:id", getVideoById);
router.put("/:id/views", incrementVideoViews);
router.delete("/:id", verifyJWT, deleteVideo);
router.put("/:id", verifyJWT, updateVideoDetails);

export default router;
