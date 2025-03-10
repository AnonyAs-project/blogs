import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import Avatar from "react-avatar";
import socket from "../services/socketClient";

import Loading from "./Loading";
export default function PostsComponent({ post, getAllPosts, userId }) {
  const token = localStorage.getItem("blogs-token");
  const [showComments, setIsShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleNewComment = (data) => {
      setComments((prev) => {
        if (prev.some((c) => c._id === data.comment._id)) {
          return prev;
        }
        return [...prev, data.comment];
      });
    };

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment);
    };
  }, [socket, post._id]);

  const getPostComments = async (postId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/comments/${postId}?page=${currentPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setComments((prevComments) => {
        const existingIds = new Set(prevComments.map((c) => c._id));
        const uniqueComments = data.comments.filter(
          (c) => !existingIds.has(c._id)
        );
        return [...prevComments, ...uniqueComments];
      });
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (postId, message) => {
    if (!message.trim()) return;
    try {
      setIsLoading(true);
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
      // getPostComments(postId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowComments = (postId) => {
    if (!showComments && comments.length === 0) {
      setComments([]);
      setCurrentPage(1);
      getPostComments(postId);
    }
    setIsShowComments((prev) => !prev);
  };

  const handleDeletePost = async (postId) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const handleViewMore = () => {
    if (!isLoading && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (currentPage > 1) {
      getPostComments(post._id);
    }
  }, [currentPage]);
 
  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg mt-4 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {isLoading && <Loading />}
      {post.userId._id === userId && (
        <span
          className="absolute top-1 right-4 text-red-500 text-xl cursor-pointer"
          onClick={() => handleDeletePost(post._id)}
        >
          ×
        </span>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {post.userId?.image ? (
            <img src={post.userId?.image} className="w-10 h-10 rounded-full" />
          ) : (
            <Avatar
              name={post.userId?.name || "Anonymous"}
              size="40"
              round={true}
            />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-white">
              {post.userId?.name}
            </span>
            <span className="text-gray-400">
              {post.createdAt && new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      {post.image && (
        <div className="w-full my-4 overflow-hidden">
          <img
            src={post.image}
            alt="Post Cover"
            className="m-auto object-cover rounded-md max-h-[400px] transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
          {post.title}
        </h2>

        <p className="text-gray-300 text-base mb-4">{post.content}</p>
        <button
          className="bg-indigo-600 text-white py-2 px-4 m-auto mt-8 rounded-lg text-sm font-semibold hover:bg-indigo-700"
          onClick={() => handleShowComments(post._id)}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
        <div className="mt-5 py-2 flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Add comment"
            className="flex-1 p-2 bg-gray-700 text-white rounded-md"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <button
            className="bg-indigo-600 text-white py-2 rounded-lg px-4 hover:bg-indigo-700"
            onClick={() => sendMessage(post._id, comment)}
          >
            Send
          </button>
        </div>
        {showComments && (
          <div className="py-4 mt-10">
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 bg-gray-700 p-4 rounded-lg shadow-sm"
                  >
                    <Avatar
                      name={comment.userId?.name || "Anonymous"}
                      size="40"
                      round={true}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">
                          {comment.userId?.name || "Anonymous"}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No comments yet. Be the first to comment!
              </p>
            )}
            {totalPages > currentPage && !isLoading && (
              <div
                className="mt-4 text-center text-indigo-500 cursor-pointer hover:underline"
                onClick={() => handleViewMore()}
              >
                {isLoading ? "Loading..." : "View More"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
