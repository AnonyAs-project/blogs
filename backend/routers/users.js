const router = require("express").Router();
const authMiddleware = require("../middlewares/auth")

 
const {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllUsers,
  userSearch
} = require("../controllers/users");

router.get("/", getAllUsers);
router.post("/signup", createUser)
router.post("/login", loginUser);
router.put("/", authMiddleware,  updateUser);
router.delete("/", authMiddleware, deleteUser)
router.get("/search", authMiddleware, userSearch)

module.exports = router;