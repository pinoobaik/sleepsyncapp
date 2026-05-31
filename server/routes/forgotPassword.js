import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
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

  // Cek apakah email terdaftar
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      // Selalu balas sukses meski email tidak ada — hindari user enumeration
      if (results.length === 0) {
        return res.status(200).json({
          message: "Jika email terdaftar, kode verifikasi telah dikirim.",
        });
      }

      // Buat kode 6 digit
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 menit

      // Simpan kode di memori
      resetCodes.set(email, { code, expiresAt });

      try {
        await sendVerificationCode(email, code);
        return res.status(200).json({
          message: "Jika email terdaftar, kode verifikasi telah dikirim.",
        });
      } catch (emailErr) {
        console.error("Gagal kirim email:", emailErr.message);
        return res.status(500).json({
          message: "Gagal mengirim email. Coba beberapa saat lagi.",
        });
      }
    }
  );
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

  // Cek kode
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

  // Kode valid — hash password baru
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err) => {
        if (err) return res.status(500).json({ message: err.message });

        // Hapus kode setelah berhasil dipakai
        resetCodes.delete(email);

        return res.status(200).json({
          message: "Password berhasil direset. Silakan login.",
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;