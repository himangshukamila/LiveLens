




import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { connectDB } from "./config/db.js";
import imagesRouter from "./routes/images.js";
import authRoutes from "./routes/auth.js";

const PORT = process.env.PORT || 5000;

const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

const app = express();
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: CLIENT_ORIGINS,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(helmet());
app.use(express.json({ limit: "25mb" }));
app.use(cors({ origin: CLIENT_ORIGINS }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

const publicDir = path.join(process.cwd(), "public");
const uploadsDir = path.join(publicDir, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  const origin = req.headers.origin;
  if (origin && CLIENT_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  next();
});

app.use(express.static(publicDir));
app.use("/api/images", imagesRouter);
app.use("/api/auth", authRoutes);

//  Socket.IO 
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);


  socket.on("register", (role) => {
    socket.join(role); // joins room "controller" or "display"
    console.log(`Socket ${socket.id} registered as: ${role}`);
  });

  // Emoji reaction 
  
  socket.on("emoji_reaction", (data) => {
    console.log("Emoji from controller:", data);
    io.to("display").emit("emoji_reaction", {
      emojiId: data.emojiId,
      emoji: data.emoji,
      time: Date.now(),
    });
  });

  // Image closed 
  
  socket.on("image_closed", () => {
    console.log("image_closed from display →  redirecting controller to login");
    io.to("controller").emit("redirect_to_login");
  });


  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start
(async function start() {
  try {
    const MONGO_URI = process.env.MONGO_URI || "";
    if (MONGO_URI) {
      await connectDB(MONGO_URI);
      console.log("Connected to MongoDB");
    } else {
      console.log("No MONGO_URI — skipping DB (images still saved to disk).");
    }
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();




















// // REMOVE this
// import { Server as IOServer } from "socket.io";
// const io = new IOServer(server, { cors: {...} });

// // ADD this
// import { WebSocketServer } from "ws";
// const wss = new WebSocketServer({ server });

// // Store clients by room manually (no built-in rooms)
// const rooms = { controller: null, display: null };

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   ws.on("message", (raw) => {
//     const { type, data } = JSON.parse(raw);

//     if (type === "register") {
//       rooms[data.role] = ws; // save reference
//     }

//     if (type === "emoji_reaction") {
//       // send only to display
//       if (rooms.display?.readyState === 1) {
//         rooms.display.send(JSON.stringify({ type: "emoji_reaction", data }));
//       }
//     }

//     if (type === "image_closed") {
//       // send only to controller
//       if (rooms.controller?.readyState === 1) {
//         rooms.controller.send(JSON.stringify({ type: "redirect_to_login" }));
//       }
//     }
//   });

//   ws.on("close", () => {
//     // clean up room when device disconnects
//     if (rooms.controller === ws) rooms.controller = null;
//     if (rooms.display === ws)    rooms.display = null;
//   });
// });