import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db.js"; // ganti dari db ke pool
import { sendVerificationCode } from "../utils/sendEmail.js";

const router = express.Router();

// Simpan kode sementara di memori: { email: { code, expiresAt } }
const resetCodes = new Map();

// Kirim kode verifikasi ke email
router.post("/forgot-password/send-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email wajib diisi." });
  }

  try {
    // Cek email terdaftar pakai PostgreSQL
    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    // Selalu balas sukses meski email tidak ada — hindari user enumeration
    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "Jika email terdaftar, kode verifikasi telah dikirim.",
      });
    }

    // Buat kode 6 digit
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 menit

    resetCodes.set(email, { code, expiresAt });

    await sendVerificationCode(email, code);
    return res.status(200).json({
      message: "Jika email terdaftar, kode verifikasi telah dikirim.",
    });
  } catch (err) {
    console.error("Gagal kirim email:", err.message);
    return res.status(500).json({
      message: "Gagal mengirim email. Coba beberapa saat lagi.",
    });
  }
});

// Reset password dengan kode verifikasi
router.post("/forgot-password/reset", async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter." });
  }

  const stored = resetCodes.get(email);

  if (!stored) {
    return res.status(400).json({
      message: "Kode verifikasi tidak ditemukan. Minta kode baru.",
    });
  }

  if (Date.now() > stored.expiresAt) {
    resetCodes.delete(email);
    return res.status(400).json({
      message: "Kode verifikasi sudah kedaluwarsa. Minta kode baru.",
    });
  }

  if (stored.code !== code) {
    return res.status(400).json({ message: "Kode verifikasi salah." });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    resetCodes.delete(email);

    return res.status(200).json({
      message: "Password berhasil direset. Silakan login.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;