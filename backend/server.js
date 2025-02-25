// server.js
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const logger = require("./config/logger");
const jwt = require("jsonwebtoken");

const server = http.createServer(app);


console.log("server is working")

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log("server is working")

// Socket.IO authentication middleware
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

// Import your custom socket middleware if you have one
const socketIoMiddleware = require("./middlewares/socket");
app.use(socketIoMiddleware(io));

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

// Start the server
server.listen(process.env.PORT || 3000, () => {
  logger.info(`Server listening on port ${process.env.PORT || 3000}`);
});
