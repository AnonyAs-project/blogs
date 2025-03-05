require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routers/index");
const cors = require("cors");
const http = require("http");
const socketIoMiddleware = require("./middlewares/socket");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
const logger = require("./config/logger");
const passport = require("passport"); 
require("./config/passport");
// require("./config/cron")

// handle errors in a good way in front end to show relevant messages .. and backend if needed
// try vercel on full stack
// join github with princeprincess acc .. and deploy with vercel the current project

// Log app start
logger.info("App started");
logger.warn("This is a warning");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; 
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

app.use(socketIoMiddleware(io));
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  logger.info(`Socket ${socket.id} connected. Initial rooms: ${Array.from(socket.rooms)}`);

  socket.on("register", (userId) => {  
    socket.join(userId); 
    logger.info(`Socket ${socket.id} joined room ${userId}`); 

    socket.emit("confirmation", {
      message: `User with ID ${userId} registered successfully.`, 
    });
  });

  socket.on("leave", (userId) => {
    socket.leave(userId);
    logger.info(`Socket ${socket.id} left room ${userId}`); 
  });

  socket.on("disconnect", () => {
    logger.info(`Socket ${socket.id} disconnected`);
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});


app.use(limiter);
app.use(passport.initialize());
app.use("/api", router);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("Connected successfully to database");
  })
  .catch((err) => {
    logger.error("Error connecting to database", { error: err.message });
  });

// Start server
server.listen(process.env.PORT || 3000, () => {
  logger.info(`Server listening on port ${process.env.PORT || 3000}`);
});
