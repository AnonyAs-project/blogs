import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import Avatar from "react-avatar";
import Loading from "./Loading";

const FriendsTabs = ({ token, navigate }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/friends/accept/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send friend request");
      }

      console.log(data);
      getFriends()
      getFriendsRequests()
    } catch (error) {
      console.error("Error sending friend request:", error.message);
    }finally{
      setIsLoading(false);
    }
  };

  const getFriends = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/friends`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message);
      }
      console.log(data)
      setFriends(data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }finally{
      setIsLoading(false);
    }
  };
  const getFriendsRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/friends/requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message);
      }
      console.log(data)
      setFriendRequests(data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getFriends();
    getFriendsRequests();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 bg-gray-900 p-6 rounded-lg shadow-lg overflow-auto max-h-[250px] friend-list">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`flex-1 py-2 text-center ${
            tabIndex === 0
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setTabIndex(0)}
        >
          Friends ({friends.length})
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            tabIndex === 1
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setTabIndex(1)}
        >
          Requests ({friendRequests.length})
        </button>
      </div>

      {/* Friends List */}
      {tabIndex === 0 && (
        <div className="space-y-3">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {friend.users[0].image ? (
                    <img
                      src={friend.image}
                      className="w-10 h-10 rounded-full"
                      alt="Friend"
                    />
                  ) : (
                    <Avatar
                    name={friend.users[0].name || "Anonymous"}
                    size="40"
                    round={true}
                  />
                  )}
                  <span className="text-white">{friend.users[0].name}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No friends yet.</p>
          )}
        </div>
      )}

      {/* Friend Requests List */}
      {tabIndex === 1 && (
        <div className="space-y-3">
          {friendRequests.length > 0 ? (
            friendRequests.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {req.users[0].image ? (
                    <img
                      src={req.users[0].image}
                      className="w-10 h-10 rounded-full"
                      alt="Request"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      {req.users[0].name[0]}{" "}
                    </div>
                  )}
                  <span className="text-white">{req.users[0].name}</span>{" "}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    onClick={() => handleAccept(req._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    // onClick={() => handleDecline(req._id)} // Uncomment to handle decline
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending requests.</p>
          )}
        </div>
      )}
      {isLoading && <Loading />}
    </div>
  );
};

export default FriendsTabs;
