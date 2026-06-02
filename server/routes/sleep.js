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
    user_id,
    sleep_duration,
    quality_of_sleep,
    physical_activity,
    stress_level,
    bmi_category,
    blood_pressure,
    heart_rate,
    daily_steps,
    sleep_disorder,
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

// Statistik publik semua user (untuk landing page) 
router.get("/sleep-stats/public", (req, res) => {
  const query = `
    SELECT 
      ROUND(AVG(sleep_duration), 1)          AS avg_duration,
      ROUND(AVG(quality_of_sleep) * 10, 0)   AS avg_quality_score,
      COUNT(*)                                AS total_records,
      COUNT(DISTINCT user_id)                 AS total_users,
      SUM(CASE WHEN sleep_disorder = 'None' THEN 1 ELSE 0 END) AS normal_count
    FROM sleep_analysis
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    const data = results[0];
    return res.status(200).json({
      avg_duration: data.avg_duration || 7.5,
      quality_score: data.avg_quality_score || 75,
      total_users: data.total_users || 0,
      total_records: data.total_records || 0,
    });
  });
});

export default router;
