const Friend = require("../models/friend");
const User = require("../models/user");
const mongoose = require("mongoose");

const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.id;

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid friend ID" });
    }

    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend" });
    }

    // ✅ Sort user IDs
    const sortedUsers = [userId, friendId];

    // ✅ Check if friendship already exists
    const existingRequest = await Friend.findOne({ users: sortedUsers });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already sent or accepted" });
    }

    // ✅ Save new friend request with sorted users
    const friendRequest = new Friend({ users: sortedUsers, status: "pending" });

    await friendRequest.save();
    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const [sender, receiver] = friendRequest.users;

    if (receiver.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userId = req.id;
    const friendRequests = await Friend.find({
      status: "pending",
      "users.1": userId,
    }).populate({
      path: "users",
      select: "name email",
      match: { _id: { $ne: userId } },
    });

    res.json(friendRequests);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.id;

    const friends = await Friend.find({
      users: userId,
      status: "accepted",
    }).populate({
      path: "users",
      select: "name email",
      match: { _id: { $ne: userId } },
    });

    res.json(friends);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
};
