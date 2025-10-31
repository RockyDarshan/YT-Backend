import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChannel } from "../api";

export default function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getChannel(username)
      .then((data) => {
        if (mounted) setChannel(data);
      })
      .catch((err) => {
        console.error("Failed to fetch channel", err);
        if (mounted) setError(err);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [username]);

  if (loading) return <p>Loading channel...</p>;
  if (error) return <p>Error loading channel</p>;
  if (!channel) return <p>Channel not found</p>;

  return (
    <section className="channel-page">
      <div className="channel-banner bg-gray-100 rounded-md overflow-hidden mb-4">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt={`${channel.username} cover`}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No cover image</span>
          </div>
        )}
      </div>

      <div className="channel-header flex items-center space-x-4 mb-6">
        <img
          src={channel.avatar}
          alt={channel.username}
          className="w-20 h-20 rounded-full border border-gray-200"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {channel.fullname || channel.username}
          </h2>
          <p className="text-sm text-gray-600">@{channel.username}</p>
          <p className="text-sm text-gray-500">
            {channel.subscriberCount} subscribers
          </p>
        </div>
      </div>

      {/* placeholder - channel videos listing could go here */}
      <div>
        <h3 className="text-lg font-medium mb-2">About</h3>
        <p className="text-sm text-gray-700">{channel.email}</p>
      </div>
    </section>
  );
}
