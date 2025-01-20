import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../config";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import logo from "../assets/blogsImg.jpg";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Invalid credentials. Please try again.");
        } else {
          throw new Error(
            "An unexpected error occurred. Please try again later."
          );
        }
      }

      const data = await response.json();
      toast.success("Login successful!");
      if (data.token) {
        login(data.token);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error during login:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {loading && <Loading />}
      {/* Left Section: Logo */}
      <div className="flex-1 flex justify-center items-center bg-white">
        <img
          src={logo}
          alt="logo" 
          className=""
          style={{height: "100vh"}}
        />
      </div>

      {/* Right Section: Login Form */}
      <div className="flex-1 flex justify-center items-center bg-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
        >
          <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Log in to access your favorite blogs!
          </p>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
