import React, { useEffect, useState } from "react";
import { getVideos } from "../api";
import VideoList from "../components/VideoList";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getVideos()
      .then((data) => {
        console.log("Fetched videos:", data); // Debug log
        if (mounted) setVideos(data || []);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        if (mounted) setVideos([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <section className="home">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trending</h1>
      </div>
      <VideoList videos={videos} />
    </section>
  );
}
