import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import PostsComponent from "../components/PostsComponent";
import AddPostModal from "../components/AddPostModal";
import { useNavigate } from "react-router-dom";
import useSocket from "../services/useSocket";
import ReactPaginate from "react-paginate";

export default function Posts() {
  const token = localStorage.getItem("blogs-token");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const postsPerPage = 2;

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);
  useSocket(userId);

  const getAllPosts = async (page = 1) => {
    try {
      const response = await fetch(
        `${API_URL}/posts?page=${page}&postsLimit=${postsPerPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const addPost = async (title, content, image) => {
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
      console.error("Failed to add post:", err);
    }
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    getAllPosts(selectedPage);
  };

  useEffect(() => {
    getAllPosts(currentPage);
  }, []);

  return (
    <>
      <div
        className="h-[calc(100vh-64px)]  w-full"
        style={{
          backgroundImage:
            "url(https://cdn.pixabay.com/photo/2015/10/02/15/00/diary-968592_640.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black bg-opacity-50"></div>
        {/* contiune this section and change the ui of the site */}
      </div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8">
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-16">
          Explore Our Posts
        </h1>
        <div className="text-center">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-6"
            onClick={() => setIsModalOpen(true)}
          >
            Add Post
          </button>
        </div>

        <div className="md:w-[60%] m-auto">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostsComponent
                key={post?._id}
                post={post}
                getAllPosts={() => getAllPosts(currentPage)}
                userId={userId}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No posts available.
            </p>
          )}

          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            onPageChange={handlePageClick}
            pageCount={totalPages}
            previousLabel="< Previous"
            containerClassName="flex justify-between items-center w-full mx-auto mt-6 px-4"
            pageClassName="cursor-pointer px-3 py-1 border rounded-md"
            activeClassName="font-bold bg-blue-500 text-white border-blue-500"
            previousClassName="cursor-pointer px-3 py-1 border rounded-md bg-gray-100"
            nextClassName="cursor-pointer px-3 py-1 border rounded-md bg-gray-100"
            disabledClassName="opacity-50 cursor-not-allowed"
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            renderOnZeroPageCount={null}
          />
        </div>

        <AddPostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddPost={addPost}
        />
      </div>
    </>
  );
}
