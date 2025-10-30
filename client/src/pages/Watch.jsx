import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideo } from "../api";
import VideoPlayer from "../components/VideoPlayer";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    getVideo(id)
      .then((data) => {
        if (mounted) setVideo(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [id]);

  if (loading) return <p>Loading video...</p>;

  return (
    <section className="watch">
      <VideoPlayer video={video} />
    </section>
  );
}
