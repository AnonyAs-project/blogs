const router = require("express").Router();
const authMiddleware = require("../middlewares/auth")

 
const {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllUsers,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.post("/signup", createUser)
router.post("/login", loginUser);
router.put("/", authMiddleware,  updateUser);
router.delete("/", authMiddleware, deleteUser)

module.exports = router;