import express from "express";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
const ML_SERVER = process.env.ML_SERVER_URL || "http://localhost:5001";

// POST /api/predict 
router.post("/predict", verifyToken, async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVER}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({
        message: "ML server error: " + (err.error || "Unknown error"),
      });
    }

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    console.error("Gagal terhubung ke ML server:", error.message);
    return res.status(503).json({
      message: "ML server tidak tersedia. Jalankan: cd ml_server && python app.py",
    });
  }
});

export default router;