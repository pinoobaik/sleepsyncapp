import express from "express";
import db from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Simpan Analisis
router.post("/sleep-analysis", verifyToken, (req, res) => {
  const user_id = req.user.id;

  const {
    sleep_duration,
    quality_of_sleep,
    physical_activity,
    stress_level,
    bmi_category,
    blood_pressure,
    heart_rate,
    daily_steps,
    sleep_disorder,
  } = req.body;

  const query = `
    INSERT INTO sleep_analysis 
    (user_id, sleep_duration, quality_of_sleep, physical_activity,
     stress_level, bmi_category, blood_pressure, heart_rate,
     daily_steps, sleep_disorder) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id, sleep_duration, quality_of_sleep, physical_activity,
    stress_level, bmi_category, blood_pressure, heart_rate,
    daily_steps, sleep_disorder,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({
      message: "Data analisis tidur berhasil disimpan!",
      dataId: result.insertId,
    });
  });
});

// ─── Ambil Riwayat Analisis (butuh login) ────────────────────
// JOIN dengan tabel users untuk ambil gender, usia, pekerjaan
router.get("/sleep-analysis", verifyToken, (req, res) => {
  const user_id = req.user.id;

  const query = `
    SELECT 
      sa.*,
      u.gender,
      u.usia   AS age,
      u.pekerjaan AS occupation
    FROM sleep_analysis sa
    JOIN users u ON sa.user_id = u.id
    WHERE sa.user_id = ?
    ORDER BY sa.id DESC
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.status(200).json(results);
  });
});

export default router;