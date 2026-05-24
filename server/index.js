import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import sleepRoutes from "./routes/sleep.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sambungan rute ke Express
app.use("/api", authRoutes);
app.use("/api", sleepRoutes);

// Endpoint Test Utama
app.get("/", (req, res) => {
  res.send("Backend SleepSync berjalan 🚀");
});

// run Server
app.listen(PORT, () => {
  console.log(`Server SleepSync running on http://localhost:${PORT}`);
});
