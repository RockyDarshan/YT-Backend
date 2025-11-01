import React from "react";
import VideoCard from "./VideoCard";

export default function VideoList({
  videos: initialVideos,
  onVideoDeleted,
  showDelete = false,
}) {
  const [videos, setVideos] = React.useState(initialVideos);

  React.useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);

  const handleDelete = (deletedId) => {
    setVideos(videos.filter((v) => v._id !== deletedId));
    if (onVideoDeleted) onVideoDeleted(deletedId);
  };

  if (!videos || videos.length === 0) return <p>No videos found.</p>;

  return (
    <div className="video-list grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((v) => (
        <VideoCard
          key={v._id}
          video={v}
          onDelete={handleDelete}
          showDelete={showDelete}
        />
      ))}
    </div>
  );
}
