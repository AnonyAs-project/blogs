import React, { useState, useRef } from "react";
import { API_URL } from "../../config";
import Avatar from "react-avatar";
import { FaRegCircleUser } from "react-icons/fa6";
import Loading from "./Loading";

export default function AddFriends({ token }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);


  const timer = useRef(null);
  const controller = useRef(new AbortController());

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setHasSearched(false);

    if (timer.current) clearTimeout(timer.current);
    controller.current.abort();
    controller.current = new AbortController();

    if (term) {
      timer.current = setTimeout(async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${API_URL}/users/search?searchTerm=${term}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              signal: controller.current.signal,
            }
          );

          const data = await response.json();
          setFriendsList(data.users || []);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Fetch error: ", err);
            setFriendsList([]);
          }
        } finally {
          setIsLoading(false);
          setHasSearched(true);
        }
      }, 800);
    } else {
      setFriendsList([]);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/friends/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSearchTerm("")
      setFriendsList([]);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-friends-container m-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Add Friends</h2>

      <input
        type="text"
        placeholder="Search by name, email, or username"
        value={searchTerm}
        onChange={handleSearchChange}
        className="p-2 w-full rounded-md bg-gray-700 text-white mb-4"
      />
      {friendsList && friendsList.length > 0 ? (
        <div className="max-h-96 overflow-y-auto friend-list">
          {friendsList.map((friend) => (
            <div
              key={friend._id}
              className="flex justify-between items-center p-2 bg-gray-800 mb-2 rounded-md"
            >
              <div className="flex items-center gap-3 mb-4">
                {friend.image ? (
                  <img src={friend.image} className="w-10 h-10 rounded-full" />
                ) : (
                  <Avatar
                    name={friend.name || "Anonymous"}
                    size="40"
                    round={true}
                  />
                )}
                <span className="text-white">{friend.name}</span>
              </div>
                <div className="flex gap-2">
              <button
                onClick={() => handleSendRequest(friend._id)}
                className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <FaRegCircleUser />
                Add Friend
              </button>
              {friend.role === "admin" && 
              <button
              // onClick={() => handleSendRequest(friend._id)}
              className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <FaRegCircleUser />
                Admin
              </button>
              }
              </div>
            </div>
          ))}
        </div>
      ) : (
        hasSearched &&
        searchTerm.length > 0 &&
        !isLoading && <p className="text-gray-400">No users found.</p>
      )}
      {isLoading && <Loading />}
    </div>
  );
}
