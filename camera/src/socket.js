import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// transports: polling first, then websocket.
// This stops the "WebSocket closed before connection established" browser warning.
// What was happening: Socket.IO tried WebSocket immediately, the browser logged
// a warning when it closed during the handshake negotiation, then it fell back
// to polling anyway. Starting with polling skips that failed first attempt,
// then Socket.IO silently upgrades to WebSocket in the background.
export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
