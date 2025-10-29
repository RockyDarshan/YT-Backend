import { Video } from "../models/video.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";

export const uploadVideo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new apiError("No video file provided", 400));
  }

  const { title, description, isPublished } = req.body;
  const videoUploadResult = await uploadOnCloudinary(req.file.path, "videos");

  const newVideo = new Video({
    videoFile: videoUploadResult.secure_url,
    thumbnail: videoUploadResult.secure_url, // Placeholder for thumbnail
    title,
    description,
    isPublished: isPublished !== undefined ? isPublished : true,
    owner: req.user._id,
  });
  await newVideo.save();

  apiResponse(res, 201, true, "Video uploaded successfully", newVideo);
});

export const getVideoById = asyncHandler(async (req, res, next) => {
  const videoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new apiError("Invalid video ID", 400));
  }
  const video = await Video.findById(videoId).populate(
    "owner",
    "username email"
  );
  if (!video) {
    return next(new apiError("Video not found", 404));
  }
  apiResponse(res, 200, true, "Video retrieved successfully", video);
});

export const incrementVideoViews = asyncHandler(async (req, res, next) => {
  const videoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new apiError("Invalid video ID", 400));
  }
  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!video) {
    return next(new apiError("Video not found", 404));
  }
  apiResponse(res, 200, true, "Video views incremented successfully", video);
});

export const deleteVideo = asyncHandler(async (req, res, next) => {
  const videoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new apiError("Invalid video ID", 400));
  }
  const video = await Video.findById(videoId);
  if (!video) {
    return next(new apiError("Video not found", 404));
  }
  await video.remove();
  apiResponse(res, 200, true, "Video deleted successfully");
});

export const getAllVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find()
    .populate("owner", "username email")
    .sort({ createdAt: -1 });
  apiResponse(res, 200, true, "Videos retrieved successfully", videos);
});

export const getUserVideos = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const videos = await Video.find({ owner: userId })
    .populate("owner", "username email")
    .sort({ createdAt: -1 });
  apiResponse(res, 200, true, "User's videos retrieved successfully", videos);
});

export const updateVideoDetails = asyncHandler(async (req, res, next) => {
  const videoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new apiError("Invalid video ID", 400));
  }
  const { title, description, isPublished } = req.body;
  const video = await Video.findById(videoId);
  if (!video) {
    return next(new apiError("Video not found", 404));
  }
  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;
  if (isPublished !== undefined) video.isPublished = isPublished;
  await video.save();
  apiResponse(res, 200, true, "Video details updated successfully", video);
});

export const searchVideos = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(new apiError("Search query is required", 400));
  }
  const videos = await Video.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  }).populate("owner", "username email");
  apiResponse(res, 200, true, "Search results retrieved successfully", videos);
});
export const getTrendingVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find()
    .sort({ views: -1 })
    .limit(10)
    .populate("owner", "username email");
  apiResponse(res, 200, true, "Trending videos retrieved successfully", videos);
});
export const getRecentVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("owner", "username email");
  apiResponse(res, 200, true, "Recent videos retrieved successfully", videos);
});
