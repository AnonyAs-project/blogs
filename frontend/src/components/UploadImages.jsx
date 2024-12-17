import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import Loading from "../components/Loading"

const ImageUpload = ({ imageUrl, setImageUrl }) => {
  const token = localStorage.getItem("blogs-token");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [error, setError] = useState("");
  const [signatureData, setSignatureData] = useState({
    signature: "",
    timestamp: "",
    api_key: "",
  });

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const res = await fetch(`${API_URL}/generate-signature`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        
        setSignatureData(data);
      } catch (error) {
        console.error("Error fetching signature data", error);
        setError("Failed to fetch signature. Please try again later.");
      }
    };

    fetchSignature();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first!");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("api_key", signatureData.api_key);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("folder", "blog-images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      

      if (data.error) {
        setError(data.error.message);
      } else {
        setImageUrl(data.secure_url);
        setImage(null)
      }

      setLoading(false);
    } catch (error) {
      console.error("Error uploading image", error);
      setError("Error uploading image. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">Post Image</h2>

      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <button
        onClick={handleUpload}
        disabled={loading || !image}
        className={`px-4 py-2 text-white font-semibold rounded-md focus:outline-none transition-all ${
          loading || !image
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {imageUrl && (
        <div className="mt-6 text-center">
          <h4 className="text-lg font-medium">Image Preview:</h4>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="mt-4 w-52 h-auto border-2 border-gray-300 rounded-md"
          />
        </div>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default ImageUpload;
