import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:5000/api";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          password: form.password,
          confPassword: form.confirmPassword, // sesuai field yang diharapkan backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registrasi gagal, coba lagi.");
        return;
      }

      // Registrasi berhasil → arahkan ke halaman login
      navigate("/login?registered=true");
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card auth-card--register">
        <div className="auth-logo">
          <span className="logo-icon">🌙</span>
          <span className="logo-text">SleepSync</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Buat akun baru</h1>
          <p className="auth-subtitle">Mulai pantau pola tidur Anda hari ini</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              className="form-input"
              placeholder="Nama lengkap Anda"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="Minimal 8 karakter"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Konfirmasi Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                className="form-input"
                placeholder="Ulangi password Anda"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}{" "}
            <span className="btn-arrow"></span>
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun?{" "}
          <a href="/login" className="auth-link">
            Masuk sekarang
          </a>
        </p>
      </div>
    </div>
  );
}
