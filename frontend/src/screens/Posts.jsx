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
        className="h-[calc(100vh-64px)]  w-full "
        style={{
          backgroundImage:
            "url(https://cdn.pixabay.com/photo/2015/10/02/15/00/diary-968592_640.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black bg-opacity-50"></div>
        <div className="relative text-center text-[#ffffffb3]  flex flex-col justify-center items-center h-full p-4">
          <h1 className="text-lg md:text-4xl font-bold mb-4">
            Welcome to Your Blog
          </h1>
          <p className="text-md md:text-lg">
            Explore stories, ideas, and insights to ignite your imagination and
            fuel your journey.
          </p>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-8 py-16">
        <h1 className="text-4xl font-extrabold text-white text-center mb-16">
          Explore Our Posts
        </h1>
        <div className="text-center">
          <button
            className="bg-indigo-600 text-white py-2 px-6 rounded-full shadow-lg transition duration-300 hover:bg-indigo-700"
            onClick={() => setIsModalOpen(true)}
          >
            Add Post
          </button>
        </div>

        <div className="md:w-[60%] m-auto">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post?._id} className="mb-8">
                <PostsComponent
                  post={post}
                  getAllPosts={() => getAllPosts(currentPage)}
                  userId={userId}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">
              No posts available.
            </p>
          )}

          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            onPageChange={handlePageClick}
            pageCount={totalPages}
            previousLabel="< Prev"
            containerClassName="flex justify-between items-center w-full mx-auto mt-6 px-4 max-w-full overflow-x-auto"
            pageClassName="cursor-pointer px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 transition duration-300"
            activeClassName="font-bold bg-indigo-500 text-white border-indigo-500"
            previousClassName="cursor-pointer px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 transition duration-300"
            nextClassName="cursor-pointer px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 transition duration-300"
            disabledClassName="opacity-50 cursor-not-allowed"
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            breakClassName="cursor-pointer px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md" // styling for the break label
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
