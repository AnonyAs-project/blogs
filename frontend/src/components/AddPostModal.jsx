// AddPostModal.js
import React, { useState } from "react";
import UploadImage from "../components/UploadImages";

const AddPostModal = ({ isOpen, onClose, onAddPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      onAddPost(title, content, imageUrl);
      setTitle("");
      setContent("");
      setImageUrl("")
      onClose();
    } else {
      alert("Please fill the fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full h-[80%] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Add New Post
        </h2>
        <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
          >
            Add Post
          </button>
        </form>
        <button
          onClick={onClose}
          className="w-full text-red-600 py-2 mt-4 border-t border-gray-300 rounded-md hover:bg-red-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddPostModal;
