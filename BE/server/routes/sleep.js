import express from "express";
import pool from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Simpan Analisis (INSERT dengan RETURNING id)
router.post("/sleep-analysis", verifyToken, async (req, res) => {
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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id
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

  try {
    const result = await pool.query(query, values);
    const insertedId = result.rows[0].id;
    return res.status(201).json({
      message: "Data analisis tidur berhasil disimpan!",
      dataId: insertedId,
    });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// Ambil Riwayat Analisis (butuh login) - JOIN
router.get("/sleep-analysis", verifyToken, async (req, res) => {
  const user_id = req.user.id;

  const query = `
    SELECT 
      sa.*,
      u.gender,
      u.usia AS age,
      u.pekerjaan AS occupation
    FROM sleep_analysis sa
    JOIN users u ON sa.user_id = u.id
    WHERE sa.user_id = $1
    ORDER BY sa.id DESC
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Statistik publik semua user (untuk landing page)
router.get("/sleep-stats/public", async (req, res) => {
  const query = `
    SELECT 
      ROUND(AVG(sleep_duration), 1)          AS avg_duration,
      ROUND(AVG(quality_of_sleep) * 10, 0)   AS avg_quality_score,
      COUNT(*)                                AS total_records,
      COUNT(DISTINCT user_id)                 AS total_users,
      SUM(CASE WHEN sleep_disorder = 'None' THEN 1 ELSE 0 END) AS normal_count
    FROM sleep_analysis
  `;

  try {
    const result = await pool.query(query);
    const data = result.rows[0];
    return res.status(200).json({
      avg_duration: data.avg_duration || 7.5,
      quality_score: data.avg_quality_score || 75,
      total_users: data.total_users || 0,
      total_records: data.total_records || 0,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;