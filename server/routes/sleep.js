import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Route Simpan Analisis
router.post("/sleep-analysis", (req, res) => {
  const {
    user_id,
    gender,
    age,
    occupation,
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

  if (!user_id) {
    return res
      .status(400)
      .json({ message: "User ID tidak ditemukan, silakan login ulang." });
  }

  const query = `
        INSERT INTO sleep_analysis 
        (user_id, gender, age, occupation, sleep_duration, quality_of_sleep, physical_activity, stress_level, bmi_category, blood_pressure, heart_rate, daily_steps, sleep_disorder) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    user_id,
    gender,
    age,
    occupation,
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
      message: "Data analisis tidur SleepSync berhasil disimpan!",
      dataId: result.insertId,
    });
  });
});

// Route Ambil Riwayat
router.get("/sleep-analysis/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.query(
    "SELECT * FROM sleep_analysis WHERE user_id = ? ORDER BY id DESC",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json(results);
    }
  );
});

export default router;
