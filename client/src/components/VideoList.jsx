import React from "react";
import VideoCard from "./VideoCard";

export default function VideoList({ videos }) {
  if (!videos || videos.length === 0) return <p>No videos found.</p>;
  return (
    <div className="video-list">
      {videos.map((v) => (
        <VideoCard key={v._id} video={v} />
      ))}
    </div>
  );
}
