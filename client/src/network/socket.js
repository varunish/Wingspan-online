import { io } from "socket.io-client";

// Use environment variable or fall back to current location (production) or localhost (development)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.PROD ? window.location.origin : "http://localhost:3000");

export const socket = io(SOCKET_URL);
