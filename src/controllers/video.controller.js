import { Video } from "../models/video.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";

export const uploadVideo = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new apiError("No video file provided", 400));
    }

    if (!req.file.path) {
      return next(new apiError("File upload failed - no file path", 400));
    }

    const { title, description, isPublished } = req.body;

    if (!title?.trim()) {
      return next(new apiError("Title is required", 400));
    }

    const videoUploadResult = await uploadOnCloudinary(req.file.path);

    if (!videoUploadResult?.secure_url) {
      return next(new apiError("Failed to upload video to cloud storage", 500));
    }

    const newVideo = new Video({
      videoFile: videoUploadResult.secure_url,
      // use eager-generated thumbnail if available, otherwise fall back to video url
      thumbnail: videoUploadResult.thumbnail || videoUploadResult.secure_url,
      title: title.trim(),
      description: description?.trim() || "",
      isPublished: isPublished !== undefined ? isPublished : true,
      owner: req.user._id,
    });

    await newVideo.save();

    return res
      .status(201)
      .json(new apiResponse(201, newVideo, "Video uploaded successfully"));
  } catch (error) {
    console.error("Video upload error:", error);
    return next(new apiError("Failed to process video upload", 500));
  }
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
  return res
    .status(200)
    .json(new apiResponse(200, video, "Video retrieved successfully"));
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
  return res
    .status(200)
    .json(new apiResponse(200, video, "Video views incremented successfully"));
});

export const deleteVideo = asyncHandler(async (req, res, next) => {
  const videoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new apiError("Invalid video ID", 400));
  }

  // Find the video and check ownership
  const video = await Video.findById(videoId);
  if (!video) {
    return next(new apiError("Video not found", 404));
  }

  // Check if the user owns the video
  if (video.owner.toString() !== req.user._id.toString()) {
    return next(
      new apiError("Unauthorized: You can only delete your own videos", 403)
    );
  }

  // Extract public ID from video URL (everything after the last / and before the file extension)
  const videoPublicId = video.videoFile.split("/").slice(-1)[0].split(".")[0];

  // Delete from Cloudinary first
  const cloudinaryResult = await deleteFromCloudinary(videoPublicId, "video");
  if (!cloudinaryResult || cloudinaryResult.result !== "ok") {
    console.error("Failed to delete video from Cloudinary:", cloudinaryResult);
    return next(new apiError("Failed to delete video from cloud storage", 500));
  }

  // If Cloudinary delete successful, remove from database
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Video deleted successfully"));
});

export const getAllVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find({ isPublished: true })
    .populate("owner", "username email")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new apiResponse(200, videos, "Videos retrieved successfully"));
});

export const getUserVideos = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const videos = await Video.find({ owner: userId })
    .populate("owner", "username email")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new apiResponse(200, videos, "User's videos retrieved successfully"));
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
  return res
    .status(200)
    .json(new apiResponse(200, video, "Video details updated successfully"));
});

export const searchVideos = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(new apiError("Search query is required", 400));
  }

  // Use aggregation to also search by owner's username
  const regex = new RegExp(query, "i");
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
  const skip = (page - 1) * limit;

  // Use aggregation to also search by owner's username and paginate
  const agg = [
    { $match: { isPublished: true } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
          { "owner.username": { $regex: regex } },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        results: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const aggResult = await Video.aggregate(agg).exec();
  const results = (aggResult[0] && aggResult[0].results) || [];
  const totalCount =
    (aggResult[0] &&
      aggResult[0].totalCount[0] &&
      aggResult[0].totalCount[0].count) ||
    0;
  const totalPages = Math.ceil(totalCount / limit);

  const payload = {
    videos: results,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages,
    },
  };
  return res
    .status(200)
    .json(
      new apiResponse(200, payload, "Search results retrieved successfully")
    );
});
export const getTrendingVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find({ isPublished: true })
    .sort({ views: -1 })
    .limit(10)
    .populate("owner", "username email");
  return res
    .status(200)
    .json(
      new apiResponse(200, videos, "Trending videos retrieved successfully")
    );
});
export const getRecentVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("owner", "username email");
  return res
    .status(200)
    .json(new apiResponse(200, videos, "Recent videos retrieved successfully"));
});
