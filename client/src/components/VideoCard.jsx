import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <article className="video-card">
      <Link to={`/watch/${video._id}`} className="block">
        <div className="thumb">
          <img
            src={video.thumbnail || "https://via.placeholder.com/320x180"}
            alt={video.title}
            className="w-full h-44 object-cover"
          />
        </div>
      </Link>
      <div className="meta">
        <h4 className="title text-sm">
          <Link to={`/watch/${video._id}`} className="hover:underline">
            {video.title}
          </Link>
        </h4>
        <p className="channel text-xs text-gray-500">
          {video.owner?.username || video.ownerName || "Unknown channel"}
        </p>
      </div>
    </article>
  );
}
