import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/blogsImg.jpg";
import ImageUpload from "../components/UploadImages";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    formData.image = imageUrl;

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // if (!formData.image) {
    //   toast.error("Please upload the image first.");
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          "An error occurred while signing up. Please try again."
        );
      }

      const data = await response.json();
      if (data.token) {
        login(data.token);
        navigate("/");
      }
      toast.success("Signup successful!");
    } catch (error) {
      toast.error(error.message);
      console.error("Error during signup:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleFileInputChange = (e) => {
  //   const file = e.target.files[0];
  //   console.log(file);
  //   if (file) {
  //     if (!file.type.startsWith("image/")) {
  //       alert("Please upload a valid image.");
  //       return;
  //     }
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert("File size exceeds 5MB.");
  //       return;
  //     }
  //   }
  //   setSelectedFile(file);
  // };

  // useEffect(() => {
  //   if (!selectedFile) {
  //     setPreview(null);
  //     return;
  //   }

  //   const objectUrl = URL.createObjectURL(selectedFile);
  //   setPreview(objectUrl);

  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [selectedFile]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {loading && <Loading />}
      <div className="flex-1 flex justify-center items-center bg-white">
        <img src={logo} alt="logo" className="" style={{ height: "100vh" }} />
      </div>
      <div className="flex-1 flex justify-center items-center bg-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl shadow-2xl w-full max-w-md transform transition-all "
        >
          <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
            Create Account
          </h2>
          <ImageUpload
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            loading={loading}
            setLoading={setLoading}
          />
          {/* <div>
            <input
              type="file"
              id="uploadImg"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <label htmlFor="uploadImg">
              <img
                src={
                  (preview && preview) ||
                  `https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png`
                }
                alt="placeholder img"
                width={100}
                className="rounded-full my-2 m-auto cursor-pointer"
              />
            </label>
          </div> */}

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your full name"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your email address"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700 mb-2"
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
              placeholder="Choose a secure password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
