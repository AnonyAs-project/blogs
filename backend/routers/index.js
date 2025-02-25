const router = require("express").Router();
const userRoutes = require("../routers/users");
const postRoutes = require("../routers/posts");
const commentRoutes = require("../routers/comments");
const cloudinaryRoutes = require("../routers/cloudinary");
const notificationsRoutes = require("../routers/notifications");
const friendsRoutes = require("../routers/friends");
const passportRoutes = require("../routers/passport");
const authMiddleware = require("../middlewares/auth");

router.use("/users", userRoutes);
router.use("/posts", authMiddleware, postRoutes);
router.use("/friends", authMiddleware, friendsRoutes);
router.use("/comments", authMiddleware, commentRoutes);
router.use("/notifications", authMiddleware, notificationsRoutes);
router.use("/generate-signature", cloudinaryRoutes);
router.use("/auth", passportRoutes)

module.exports = router;
