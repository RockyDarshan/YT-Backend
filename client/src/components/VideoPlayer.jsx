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
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{video.title}</h2>
            <p className="description mt-2 text-gray-700">
              {video.description}
            </p>
          </div>

          {/* Channel info block similar to YouTube: avatar + name + subscribe */}
          <div className="channel-block flex-shrink-0 w-56 p-3 border border-gray-100 rounded-md">
            <a
              href={`/c/${encodeURIComponent(video.owner?.username || "")}`}
              className="flex items-center space-x-3"
            >
              <img
                src={video.owner?.avatar || "https://via.placeholder.com/48"}
                alt={video.owner?.username || "channel"}
                className="w-12 h-12 rounded-full border"
              />
              <div>
                <div className="font-medium text-sm">
                  {video.owner?.fullname || video.owner?.username || "Unknown"}
                </div>
                <div className="text-xs text-gray-500">
                  @{video.owner?.username || ""}
                </div>
              </div>
            </a>

            <div className="mt-3">
              <button className="w-full bg-red-600 text-white text-sm py-1 rounded hover:bg-red-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
