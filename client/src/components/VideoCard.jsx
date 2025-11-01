import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { deleteVideo } from "../api";
import { AuthContext } from "../context/AuthContext";

const PLACEHOLDER = "https://via.placeholder.com/480x270?text=No+thumbnail";

export default function VideoCard({ video, onDelete, showDelete = false }) {
  const { user } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImgError = (e) => {
    if (e?.target) e.target.src = PLACEHOLDER;
  };

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    const toastId = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>Delete this video?</span>
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete();
            }}
          >
            Delete
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      ),
      {
        duration: 6000,
      }
    );
  };

  const confirmDelete = async () => {
    const deleteToast = toast.loading("Deleting video...");

    try {
      setIsDeleting(true);
      await deleteVideo(video._id);
      if (onDelete) onDelete(video._id);
      toast.success("Video deleted successfully", { id: deleteToast });
    } catch (error) {
      console.error("Failed to delete video:", error);
      toast.error("Failed to delete video. Please try again.", {
        id: deleteToast,
      });
    } finally {
      setIsDeleting(false);
    }
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
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="title text-sm line-clamp-2">
              <Link to={`/watch/${video._id}`} className="hover:underline">
                {video?.title}
              </Link>
            </h4>
            <p className="channel text-xs text-gray-500">
              {video?.owner?.username || video?.ownerName || "Unknown channel"}
            </p>
          </div>

          {/* Show delete button only if showDelete is true and user owns the video */}
          {showDelete &&
            (() => {
              const ownerId =
                typeof video.owner === "string"
                  ? video.owner
                  : video.owner?._id;
              return String(user?._id) === String(ownerId);
            })() && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`ml-2 p-1.5 rounded-full transition-all duration-200 group ${
                  isDeleting
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-transparent hover:bg-red-600 hover:shadow-sm"
                }`}
                title={isDeleting ? "Deleting..." : "Delete video"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isDeleting
                      ? "text-gray-400"
                      : "text-gray-500 group-hover:text-white"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            )}
        </div>
      </div>
    </article>
  );
}
