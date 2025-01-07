import { useEffect, useState } from "react";
import { FaBlog } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import socket from "../services/socketClient";
import { FaRegBell } from "react-icons/fa";
import { API_URL } from "../../config";

const Navbar = () => {
  const token = localStorage.getItem("blogs-token");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };
  useEffect(() => {
    fetchNotifications();

    // Handle live notifications via WebSocket
    const handleNewNotification = (newNotification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [token]);

  const handleLogout = () => {
    logout();
    socket.disconnect();
    navigate("/login");
  };

  const handleReadNotification = async (notification) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notification._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ read: true }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      fetchNotifications();
      console.log(data);
    } catch (err) {
      console.error("Error read notifications:", err);
    }
  };

  // the problem of when refresh the current user stay and the other closes ..
  const notificationsCount = notifications?.filter((e) => !e.read).length;
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="flex gap-4 items-center cursor-pointer"
          onClick={() => setIsNotificationsOpen((prev) => !prev)}
        >
          <Link to="/">
            <div className="flex items-center space-x-2">
              <FaBlog className="text-white text-2xl" />
              <span className="text-white text-xl font-semibold">My Blog</span>
            </div>
          </Link>
          {/* Notification Bell with Counter */}
          <div className="relative">
            <FaRegBell className="text-white  text-2xl cursor-pointer transition duration-200 ease-in-out transform hover:scale-110" />
            {notificationsCount > 0 && notificationsCount && (
              <div className="absolute select-none top-[-8px] right-[-8px] flex items-center justify-center w-5 h-5 text-xs bg-red-600 text-white rounded-full font-bold">
                {notificationsCount > 0 && notificationsCount}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Dropdown */}
        {isNotificationsOpen && notifications?.length > 0 && (
          <div className="absolute z-[500] mt-2 top-12 left-0 bg-white w-[350px] max-h-72 rounded-lg shadow-xl overflow-y-auto border border-gray-300">
            <div className="py-2">
              {notifications?.map((notification) => (
                <div
                  key={notification._id}
                  className={`relative p-4 border-b border-gray-200 rounded-lg transition-all ease-in-out duration-200 my-2 cursor-pointer ${
                    notification.read ? "bg-gray-100" : "bg-red-100"
                  }`}
                  onClick={() => handleReadNotification(notification)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-sm text-gray-700">
                      {notification.sender?.name}
                    </strong>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {console.log(notification)}
                  <div className="text-sm text-gray-700">
                    commented on your post:{" "}
                    <Link
                      to={`#${notification.postId}`}
                      className="text-blue-600 hover:underline"
                    >
                      Link
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md shadow-md transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
