const Comment = require("../models/comment");
const Post = require("../models/post");
const mongoose = require("mongoose");
const Notification = require("../models/notifications");
const User = require("../models/user");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting comments" });
  }
};

const getPostComments = async (req, res) => {
  const postId = req.params.id;

  const page = parseInt(req.query.page) || 1;
  const limit = 2;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid postId format" });
  }

  try {
    const comments = await Comment.find({ postId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId");
    const totalComments = await Comment.countDocuments({ postId });
    const totalPages = Math.ceil(totalComments / limit);

    res
      .status(200)
      .json({ comments, currentPage: page, totalComments, totalPages });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Error getting comments for post" });
  }
};

const createComment = async (req, res) => {
  try {
    const userId = req.id;
    const { content, postId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ message: "Content and postId are required." });
    }

    const comment = new Comment({ userId, content, postId });
    await comment.save();

    const post = await Post.findById(postId).populate("userId");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postOwnerId = post.userId._id.toString();

    if (postOwnerId !== userId) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const notification = new Notification({
        sender: user,
        receiver: postOwnerId,
        message: `${user.name} has commented on your post.`,
        postId: post._id,
      });
      await notification.save();

      req.io.to(postOwnerId).emit("newNotification", notification);

    }

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating comment" });
  }
};


const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
 
    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      userId: req.id,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error deleting comment", error: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, userId: req.id },
      { content },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res
      .status(200)
      .json({ message: "Comment updated successfully", updatedComment });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating comment", error: err.message });
  }
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
  getAllComments,
  getPostComments,
};
