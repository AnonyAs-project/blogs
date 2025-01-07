import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_CLIENT_BASE_URL);

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);  // Log when the client connects
    socket.emit("connected", { message: "Client connected successfully" });  // Send a confirmation message to the server
  });
  
  // Listen for a "confirmation" event from the server
  socket.on("confirmation", (data) => {
    console.log("Server response:", data.message);  // Handle the server's response
  });

export default socket;