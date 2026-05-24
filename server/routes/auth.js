import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const router = express.Router();

// Route Register
router.post("/register", async (req, res) => {
  const { nama, email, password, confPassword } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Semua data harus diisi!" });
  }

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ message: "Password dan Konfirmasi Password tidak cocok!" });
  }

  try {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length > 0) {
          return res.status(400).json({ message: "Email sudah terdaftar!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query(
          "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
          [nama, email, hashedPassword],
          (err) => {
            if (err) return res.status(500).json({ message: err.message });
            return res.status(201).json({ message: "Registrasi Berhasil!" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan Password wajib diisi!" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Akun tidak ditemukan / salah!" });
      }

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Password salah!" });
      }

      res.status(200).json({
        message: "Login Berhasil!",
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
        },
      });
    }
  );
});

export default router;
