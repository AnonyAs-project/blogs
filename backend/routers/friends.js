const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
} = require("../controllers/friends");

router.get("/", getFriends);  // Get list of friends
router.get("/requests", getFriendRequests);  // Get pending friend requests for the logged-in user
router.post("/:friendId", sendFriendRequest);  // Send friend request
router.put("/accept/:requestId", acceptFriendRequest);  // Accept friend request

module.exports = router;
