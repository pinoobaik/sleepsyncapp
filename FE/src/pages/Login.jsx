import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cek apakah baru saja redirect dari Register
  const justRegistered = new URLSearchParams(location.search).get("registered") === "true";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login gagal, coba lagi.");
        return;
      }

      // Simpan token & data user ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect ke dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🌙</span>
          <span className="logo-text">SleepSync</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Selamat datang<br />kembali</h1>
          <p className="auth-subtitle">Masuk untuk melihat pola tidur Anda hari ini</p>
        </div>

        {/* Banner sukses setelah registrasi */}
        {justRegistered && (
          <div className="auth-success">
            Akun berhasil dibuat! Silakan masuk.
          </div>
        )}

        {/* Tampilkan pesan error jika ada */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="forgot-link-wrapper">
              <a href="/forgot-password" className="forgot-link">Lupa password?</a>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"} <span className="btn-arrow"></span>
          </button>
        </form>

        <p className="auth-footer">
          Belum punya akun?{" "}
          <a href="/register" className="auth-link">Daftar sekarang</a>
        </p>
      </div>
    </div>
  );
}