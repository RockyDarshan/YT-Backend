import React from "react";
import { Link } from "react-router-dom";

const PLACEHOLDER = "https://via.placeholder.com/480x270?text=No+thumbnail";

export default function VideoCard({ video }) {
  const handleImgError = (e) => {
    if (e?.target) e.target.src = PLACEHOLDER;
  };

  return (
    <article className="video-card transform hover:scale-[1.01] transition-shadow duration-150">
      <Link to={`/watch/${video._id}`} className="block">
        <div className="thumb relative bg-gray-50">
          <img
            src={video?.thumbnail || PLACEHOLDER}
            alt={video?.title || "video"}
            onError={handleImgError}
            loading="lazy"
            className="w-full h-44 object-cover"
          />
          <div className="thumb-overlay pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* simple play icon */}
            <div className="w-14 h-14 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6 ml-1"
              >
                <path d="M5 3v18l15-9z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      <div className="meta">
        <h4 className="title text-sm line-clamp-2">
          <Link to={`/watch/${video._id}`} className="hover:underline">
            {video?.title}
          </Link>
        </h4>
        <p className="channel text-xs text-gray-500">
          {video?.owner?.username || video?.ownerName || "Unknown channel"}
        </p>
      </div>
    </article>
  );
}
