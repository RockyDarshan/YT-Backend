import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!avatar) return alert("Avatar is required");
    const fd = new FormData();
    fd.append("fullname", fullname);
    fd.append("email", email);
    fd.append("username", username);
    fd.append("password", password);
    fd.append("avatar", avatar);
    if (coverImage) fd.append("coverImage", coverImage);
    try {
      setLoading(true);
      await register(fd);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={submit} className="auth-form space-y-3">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Avatar (required)</label>
          <input
            className="w-full"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Cover Image (optional)
          </label>
          <input
            className="w-full"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </section>
  );
}
