import express from "express";
import pool from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/uploadProfile.js";

const router = express.Router();

// Gunakan environment variable untuk base URL backend
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// get profile
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        nama,
        email,
        nomor_hp,
        pekerjaan,
        kota,
        usia,
        gender,
        profile_picture
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      ...user,
      profile_picture: user.profile_picture
        ? `${BACKEND_URL}/uploads/${user.profile_picture}`
        : null,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

// update profile (tidak perlu diubah)
router.put("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { nama, nomor_hp, pekerjaan, kota, usia, gender } = req.body;

  try {
    await pool.query(
      `
      UPDATE users
      SET
        nama = $1,
        nomor_hp = $2,
        pekerjaan = $3,
        kota = $4,
        usia = $5,
        gender = $6
      WHERE id = $7
      `,
      [nama, nomor_hp, pekerjaan, kota, usia, gender, userId]
    );

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

// upload pp
router.put("/photo", verifyToken, upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "File foto tidak ditemukan",
    });
  }

  const userId = req.user.id;
  const filename = req.file.filename;

  try {
    await pool.query(
      "UPDATE users SET profile_picture = $1 WHERE id = $2",
      [filename, userId]
    );

    return res.status(200).json({
      message: "Foto profil berhasil diperbarui",
      profile_picture: `${BACKEND_URL}/uploads/${filename}`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default router;