import React, { useState } from "react";
import { API_URL } from "../../config";
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import randomColor from 'randomcolor'; 
export default function PostsComponent({ post, getAllPosts }) {
  const token = localStorage.getItem("blogs-token");

  const [showComments, setIsShowComments] = useState(false);
  const [comments, setComments] = useState({});
  const [comment, setComment] = useState("");



  const getPostComments = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/comments/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (postId, message) => {
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: message,
          postId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setComment("");
      getPostComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowComments = (postId) => {
    setIsShowComments((prev) => !prev);
    getPostComments(postId);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      getAllPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      key={post._id}
      className="relative bg-white rounded-lg shadow-lg mt-4 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      <span
        className="absolute top-4 right-4 text-red-500 text-xl cursor-pointer"
        onClick={() => handleDeletePost(post._id)}
      >
        ×
      </span>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          {post.title}
        </h2>

        <p className="text-gray-700 text-base mb-4">{post.content}</p>
        <button
          className="bg-blue-600 text-white py-2 px-4 m-auto mt-8 rounded-lg text-sm font-semibold hover:bg-blue-700"
          onClick={() => handleShowComments(post._id)}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
        <div className="mt-5 py-2 flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Add comment"
            className="flex-1"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <button
            className="bg-blue-600 text-white py-2 rounded-lg px-4"
            onClick={() => sendMessage(post._id, comment)}
          >
            Send
          </button>
        </div>
        {showComments && (
          <div className="py-4 mt-10">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-2 items-center flex-wrap border-t py-4"
                >
                
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      fontSize: "14px",
                     
                    }}
                  >
                    {comment.userId?.name[0].toUpperCase()}
                  </Avatar>
                  <div>{comment.content}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
