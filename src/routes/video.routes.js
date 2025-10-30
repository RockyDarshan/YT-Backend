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
router.get("/:id", getVideoById);
router.put("/:id/views", incrementVideoViews);
router.delete("/:id", verifyJWT, deleteVideo);
router.get("/", getAllVideos);
router.get("/user", verifyJWT, getUserVideos);
router.put("/:id", verifyJWT, updateVideoDetails);
router.get("/search", searchVideos);
router.get("/trending", getTrendingVideos);
router.get("/recent", getRecentVideos);

export default router;
