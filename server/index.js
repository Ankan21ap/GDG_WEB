import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../.env") }); // always load root .env

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Route imports
import eventRoutes from "./routes/event.js";
import rsvpRoutes from "./routes/rsvp.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json({ limit: "5mb" })); // 5mb to handle base64 QR codes
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/events", eventRoutes);
app.use("/api/rsvp", rsvpRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── MongoDB Connection ─────────────────────────────────────────────────────────
async function connectDB() {
  if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅  MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

let server;

// ── Start ──────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  server = app.listen(PORT, () => {
    console.log(`🚀  Server running at http://localhost:${PORT}`);
    console.log(`📋  Health check: http://localhost:${PORT}/api/health`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌  Port ${PORT} is already in use. Run: lsof -ti :${PORT} | xargs kill -9`);
    } else {
      console.error("❌  Server error:", err.message);
    }
    process.exit(1);
  });
});

// Graceful shutdown for nodemon (SIGUSR2) and termination signals
async function shutdown() {
  if (server) {
    server.close();
  }
  try {
    await mongoose.connection.close();
  } catch {}
}

process.on("SIGTERM", async () => {
  await shutdown();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await shutdown();
  process.exit(0);
});

process.once("SIGUSR2", async () => {
  await shutdown();
  process.kill(process.pid, "SIGUSR2");
});
