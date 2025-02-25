const express = require("express");
const passport = require("passport");
const { googleCallback, logout } = require("../controllers/passport");

const router = express.Router();

// Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle Google OAuth callback without session management
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

// Logout route
router.get("/logout", logout);

module.exports = router;
