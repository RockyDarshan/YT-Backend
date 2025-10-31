import React, { useEffect, useState } from "react";
import { getCurrentUser, getUserVideos } from "../api";
import VideoList from "../components/VideoList";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getCurrentUser(), getUserVideos()])
      .then(([u, vids]) => {
        if (mounted) {
          setUser(u);
          setVideos(vids || []);
        }
      })
      .catch((e) => {
        console.error("Failed to load profile data", e);
        if (mounted) setErr(e);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (err) return <p>Failed to load profile</p>;
  if (!user) return <p>No user data</p>;

  return (
    <section className="profile-page">
      <div className="profile-cover mb-6">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="cover"
            className="w-full h-48 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md">
            <span className="text-gray-500">No cover image</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-20 h-20 rounded-full border border-gray-200"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {user.fullname || user.username}
          </h2>
          <p className="text-sm text-gray-600">@{user.username}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">My videos</h3>
        <VideoList videos={videos} />
      </div>
    </section>
  );
}
