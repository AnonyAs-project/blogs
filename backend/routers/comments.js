const express = require("express");

const router = express.Router();

const {
  createComment,
  deleteComment,
  updateComment,
  getAllComments,
  getPostComments,
} = require("../controllers/comments");

router.get("/", getAllComments);
router.get("/:id", getPostComments);
router.post("/", createComment);
router.delete("/:id", deleteComment);
router.put("/:id", updateComment);

module.exports = router;
