const router = require("express").Router()
const userRoutes = require("../routers/users")
const postRoutes = require("../routers/posts")
const commentRoutes = require("../routers/comments")
const cloudinaryRoutes = require("../routers/cloudinary")
const authMiddleware = require("../middlewares/auth")


router.use("/users", userRoutes)
router.use("/posts", authMiddleware, postRoutes)
router.use("/comments", authMiddleware, commentRoutes)
router.use("/generate-signature", authMiddleware, cloudinaryRoutes)


module.exports = router;