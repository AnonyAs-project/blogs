import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import PostsComponent from "../components/PostsComponent";
import AddPostModal from "../components/AddPostModal";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const token = localStorage.getItem("blogs-token");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getAllPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      if (response.status === 401) {
        navigate("/login");
      }
      if (!response.ok) {
        throw new Error(data.message);
      }
      setPosts(data.posts);
    } catch (err) {
      console.error(err);
    }
  };

  const addPost = async (title, content, image) => {
    console.log(title, content, image)
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, image }),
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

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8">
      <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-16">
        Explore Our Posts
      </h1>
      <div className="text-center">
        <button
          className="bg-blue-600  text-white py-2 px-4 rounded-lg mb-6"
          onClick={() => setIsModalOpen(true)}
        >
          Add Post
        </button>
      </div>

      <div className="md:w-[80%] m-auto">
        {posts.length > 0 ? (
          posts &&
          posts.map((post) => (
            <PostsComponent
              key={post?._id}
              post={post}
              getAllPosts={getAllPosts}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No posts available.
          </p>
        )}
      </div>

      <AddPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPost={addPost}
      />
    </div>
  );
}
