require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routers/passport");
require("./config/passport");
const session = require("express-session");


const app = express();

app.use(express.json());
app.use(cors());


app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey", // Change this in production
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/auth", authRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

module.exports = app;
