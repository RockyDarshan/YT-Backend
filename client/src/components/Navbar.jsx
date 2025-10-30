import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          YT Clone
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/upload" className="text-sm text-gray-200 hover:text-white">
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
              <Link
                to="/login"
                className="text-sm text-gray-200 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-200 hover:text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
