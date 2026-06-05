import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { nama, email, password, confPassword } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nama || !email || !password || !confPassword) {
    return res.status(400).json({ message: "Semua data harus diisi!" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter" });
  }
  if (password !== confPassword) {
    return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok!" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users (nama, email, password) VALUES ($1, $2, $3)",
      [nama, email, hashedPassword]
    );

    return res.status(201).json({ message: "Registrasi Berhasil!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan Password wajib diisi!" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login Berhasil!",
      token,
      user: { id: user.id, nama: user.nama, email: user.email },
    });
  } catch (error) {
  console.error(error);

  return res.status(500).json({
    message: "Authentication error",
  });
}
});

// LOGOUT
router.post("/logout", (req, res) => {
  return res.status(200).json({ message: "Logout Berhasil!" });
});

export default router;