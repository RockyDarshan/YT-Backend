import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, upload.single("video"), uploadVideo);
router.get("/:id", getVideoById);
router.put("/:id/views", incrementVideoViews);
router.delete("/:id", verifyJWT, deleteVideo);
router.get("/", getAllVideos);
router.get("/user", verifyJWT, getUserVideos);
router.put("/:id", verifyJWT, updateVideoDetails);
router.get("/search", searchVideos);
router.get("/trending", getTrendingVideos);
router.get("/recent", getRecentVideos);
const videoId = req.params.id;

if (!mongoose.Types.ObjectId.isValid(videoId)) {
  return next(new apiError("Invalid video ID", 400));
}
router.put("/:id", verifyJWT, updateVideoDetails);
const { title, description, isPublished } = req.body;
const video = await Video.findByIdAndUpdate(
  videoId,
  { title, description, isPublished },
  { new: true }
);
if (!video) {
  return next(new apiError("Video not found", 404));
}
apiResponse(res, 200, true, "Video details updated successfully", video);

export default router;
