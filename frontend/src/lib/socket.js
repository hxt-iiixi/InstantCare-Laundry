import { io } from "socket.io-client";
let socket;
export function getSocket() {
  if (!socket) {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    socket = io(base, { withCredentials: true });
    socket.on("connect", () => socket.emit("join:church", ""));
  }
  return socket;
}