const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAdmin = async (req, res, next) => {
    try {
      const user = await User.findById(req.id);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied: Admins only" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking role" });
    }
  };


  module.exports = isAdmin;
