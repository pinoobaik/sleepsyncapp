import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes         from "./routes/auth.js";
import sleepRoutes        from "./routes/sleep.js";
import profileRoutes      from "./routes/profile.js";
import forgotPasswordRoutes from "./routes/forgotPassword.js";
import predictRoutes      from "./routes/predict.js";

dotenv.config();

const app    = express();
const PORT   = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Middleware 
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://sleepsyncapp.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Static files 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes (semua WAJIB sebelum app.listen) 
app.use("/api",          authRoutes);
app.use("/api",          sleepRoutes);
app.use("/api/profile",  profileRoutes);
app.use("/api",          forgotPasswordRoutes);
app.use("/api",          predictRoutes);

// Health check 
app.get("/", (req, res) => {
  res.send("Backend SleepSync berjalan");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

// Start server 
app.listen(PORT, () => {
  console.log(`Server SleepSync running on http://localhost:${PORT}`);
});