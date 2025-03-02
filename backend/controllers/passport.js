const jwt = require("jsonwebtoken");

// see the problem of no userId when creating post with user joined by google 
const googleCallback = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // Generate JWT token for the authenticated user
  const token = jwt.sign(
    { id: req.user._id, email: req.user.email },
    process.env.SECRET,
    { expiresIn: "7d" }
  );

  // Redirect to your frontend app (ensure the URL matches your frontend port)
  res.redirect(`http://localhost:5173/auth-success?token=${token}`);
};

const logout = (req, res) => {
  // With JWT authentication, logout is usually handled on the client
  // by removing the token. Optionally, you can implement token blacklisting.
  res.json({ message: "Logout endpoint hit - remove token client-side" });
};

module.exports = { googleCallback, logout };
