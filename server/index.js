import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import forgotPasswordRoutes from "./routes/forgotPassword.js";
import authRoutes from "./routes/auth.js";
import sleepRoutes from "./routes/sleep.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware 
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Static files (foto profil)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes 
app.use("/api", authRoutes);
app.use("/api", sleepRoutes);
app.use("/api/profile", profileRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend SleepSync berjalan 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

// forgot pass
app.use("/api", forgotPasswordRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server SleepSync running on http://localhost:${PORT}`);
});