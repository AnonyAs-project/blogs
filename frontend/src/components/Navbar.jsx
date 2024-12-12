import React, { useState } from "react";
import { FaBlog } from "react-icons/fa"; // Icon for the website
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // State to manage mobile menu visibility

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <FaBlog className="text-white text-2xl" />
            <span className="text-white text-xl font-semibold">My Blog</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow-md transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
