require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routers/index");
const cors = require("cors");
const http = require("http");
const socketIoMiddleware = require("./middlewares/socket");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(socketIoMiddleware(io));
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
    console.log("Initial rooms", socket.rooms); 

  // Register event to allow room assignment dynamically
  socket.on("register", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);

    // Send confirmation to the client
    socket.emit("confirmation", {
      message: `User with ID ${userId} registered successfully.`,
    });
  });
  socket.on("leave", (userId) => {
    socket.leave(userId);
    console.log(`Socket ${socket.id} left room ${userId}`);
  });
  
  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
  headers: true, 
});


app.use(limiter);
app.use("/api", router);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected successfully to database");
  })
  .catch((err) => {
    console.error(`Error connecting to database ${err}`);
  });
server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT}`);
});
