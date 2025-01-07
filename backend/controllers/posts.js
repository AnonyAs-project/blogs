const Post = require("../models/post");
const Notification = require("../models/notifications");

const createPost = async (req, res) => {
  try {
    const userId = req.id;

    const { title, content, image } = req.body;
    const post = new Post({ title, content, userId, image });
    await post.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating post" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId");

    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts: [] });
    }

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting all posts" });
  }
};

const getPost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting post" });
  }
};

const getUserPosts = async (req, res) => {
  const userId = req.id;
  try {
    const userPosts = await Post.find({ userId });
    if (userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json({ userPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting user posts" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, userId: req.id },
      { title, content },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating post" });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  // test deleting a post willl delete with it the notiifcations or not .. => soft delete
  try {
    const post = await Post.findOneAndDelete({ _id: postId, userId: req.id });
    if (post) {
      await Notification.updateMany(
        { postId: postId }, 
        { $set: { deleted: true } } 
      );
      return res.status(200).json({ message: "Post deleted successfully" });
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting post" });
  }
};

module.exports = {
  getAllPosts,
  getUserPosts,
  getPost,
  deletePost,
  createPost,
  updatePost,
};
