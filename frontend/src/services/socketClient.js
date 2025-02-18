import { io } from "socket.io-client";

// Get token from localStorage (or any storage method you're using)
const token = localStorage.getItem("blogs-token");

const socket = io(import.meta.env.VITE_CLIENT_BASE_URL, {
  auth: { token }, // Send token with WebSocket handshake
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
  socket.emit("connected", { message: "Client connected successfully" });
});

socket.on("confirmation", (data) => {
  console.log("Server response:", data.message);
});

export default socket;
