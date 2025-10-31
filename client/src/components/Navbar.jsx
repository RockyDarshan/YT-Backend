import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate("/");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const term = (q || "").trim();
    if (!term) return;
    navigate(`/search?query=${encodeURIComponent(term)}`);
    setQ("");
    setShowMobileSearch(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="flex items-center space-x-4">
          <Link to="/" className="brand flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 15l5.19-3L10 9v6z" />
              <path d="M21 6.5v11c0 .83-.67 1.5-1.5 1.5H4.5C3.67 19 3 18.33 3 17.5v-11C3 5.67 3.67 5 4.5 5h15C20.33 5 21 5.67 21 6.5z" />
            </svg>
            <span>YT Clone</span>
          </Link>

          {/* desktop search - hidden on very small screens */}
          <form
            onSubmit={submitSearch}
            className="hidden sm:flex items-center nav-search"
            role="search"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search videos"
              className="search-input px-3 py-2 rounded-l-md border border-gray-200 bg-white w-64 focus:outline-none text-black"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-700"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-4">
          {/* show mobile search icon */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-200 hover:bg-gray-800"
            onClick={() => setShowMobileSearch((s) => !s)}
            aria-label="Open search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16l-4 4m0 0l4-4m-4 4V4"
              />
            </svg>
          </button>

          <Link
            to="/upload"
            className="text-sm hidden sm:inline-flex items-center bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
          >
            Upload
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={doLogout}
                className="text-sm bg-gray-800 px-3 py-1 rounded text-gray-100 hover:bg-gray-700"
              >
                Logout
              </button>
              <Link to={`/c/${user.username}`} className="flex items-center">
                <img
                  src={user.avatar || "https://via.placeholder.com/28"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-gray-700"
                />
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="nav-auth-link">
                Login
              </Link>
              <Link to="/register" className="nav-auth-register">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* mobile search input overlay */}
        {showMobileSearch && (
          <div className="sm:hidden mt-2 w-full">
            <form onSubmit={submitSearch} className="flex">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search videos"
                aria-label="Search videos"
                className="w-full px-3 py-2 rounded-l-md border border-gray-200 bg-white focus:outline-none text-black"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-700"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
