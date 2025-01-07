const Comment = require("../models/comment");
const Post = require("../models/post");
const mongoose = require("mongoose");
const Notification = require("../models/notifications");

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

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid postId format" });
  }

  try {
    const comments = await Comment.find({ postId }).populate("userId");
    res.status(200).json({ comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Error getting comments for post" });
  }
};

const createComment = async (req, res) => {
  try {
    const userId = req.id;
    const { content, postId } = req.body;
    const comment = new Comment({ userId: userId, content, postId });
    await comment.save();

    const post = await Post.findById(postId).populate("userId");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const postOwnerId = post.userId._id.toString();
    if (postOwnerId !== userId) {
      const notification = new Notification({
        sender: userId,
        receiver: postOwnerId,
        message: `${userId} has commented on your post.`,
        postId: post._id,
      });
      await notification.save();

      req.io.to(postOwnerId).emit("newNotification", notification);

      console.log(`Emitting "newNotification" to post owner ${postOwnerId}`);
    }

    res.status(201).json({ message: "Comment created successfully" });
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
