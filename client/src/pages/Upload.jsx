import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Upload() {
  const { user } = useAuth() || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a video file");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("video", file);
    try {
      setLoading(true);
      const res = await uploadVideo(fd);
      // assume API returns created video with _id
      navigate(`/watch/${res._id}`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload">
      <h1 className="text-2xl font-bold mb-4">Upload</h1>
      <form onSubmit={submit} className="upload-form">
        <label className="block text-sm font-medium">Title</label>
        <input
          className="w-full px-3 py-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="block text-sm font-medium">Video file</label>
        <input
          className="w-full"
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </section>
  );
}
