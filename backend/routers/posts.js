const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getUserPosts,
  getPost,
  deletePost,
  createPost,
  updatePost,
} = require("../controllers/posts");

router.get("/", getAllPosts);
router.get("/post/user", getUserPosts);
router.get("/post/:id", getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

module.exports = router;
