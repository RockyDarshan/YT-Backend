import React from "react";

export default function VideoPlayer({ video }) {
  if (!video) return <p>Loading...</p>;
  return (
    <div className="video-player space-y-4">
      <div className="w-full flex justify-center">
        <video
          controls
          src={video.videoFile || video.videoUrl}
          poster={
            video.thumbnail ||
            "https://via.placeholder.com/1280x720?text=No+preview"
          }
          className="player rounded-md shadow-md max-w-full"
        />
      </div>
      <div className="px-2">
        <h2 className="text-xl font-semibold">{video.title}</h2>
        <p className="channel text-sm text-gray-500">
          {video.owner?.username || video.ownerName || "Unknown channel"}
        </p>
        <p className="description mt-2 text-gray-700">{video.description}</p>
      </div>
    </div>
  );
}
