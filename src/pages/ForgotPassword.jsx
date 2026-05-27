import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: form reset, 2: sukses
  const [form, setForm] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendCode = () => {
    if (!form.email) return;
    setSending(true);
    // Simulasi kirim kode (ganti dengan API call)
    setTimeout(() => {
      setSending(false);
      setCodeSent(true);
      console.log("Kode dikirim ke:", form.email);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password:", form);
    setStep(2);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🌙</span>
          <span className="logo-text">SleepSync</span>
        </div>

        {step === 1 ? (
          <>
            <div className="auth-header">
              <div className="icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className="auth-title auth-title--sm">Lupa Password?</h1>
              <p className="auth-subtitle">
                Masukkan email, minta kode verifikasi, lalu buat password baru Anda.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>

              {/* ── Email + tombol kirim kode ── */}
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
                <button
                  type="button"
                  className={`btn-send-code ${codeSent ? "btn-send-code--sent" : ""}`}
                  onClick={handleSendCode}
                  disabled={!form.email || sending || codeSent}
                >
                  {sending ? (
                    <>
                      <span className="spinner" /> Mengirim...
                    </>
                  ) : codeSent ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Kode Terkirim
                    </>
                  ) : (
                    "Kirim Kode Verifikasi"
                  )}
                </button>
              </div>

              {/* ── Kode Verifikasi ── */}
              <div className="form-group">
                <label className="form-label">Kode Verifikasi</label>
                <input
                  type="text"
                  name="verificationCode"
                  className="form-input form-input--code"
                  placeholder="Masukkan 6 digit kode"
                  value={form.verificationCode}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />
                {codeSent && (
                  <span className="form-hint">
                    Kode telah dikirim ke <strong>{form.email}</strong>. Cek inbox atau spam Anda.
                  </span>
                )}
              </div>

              {/* ── Password Baru ── */}
              <div className="form-group">
                <label className="form-label">Password Baru</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    className="form-input"
                    placeholder="Minimal 8 karakter"
                    value={form.newPassword}
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
              </div>

              <button type="submit" className="btn-primary">
                Reset Password <span className="btn-arrow"></span>
              </button>
            </form>

            <p className="auth-footer">
              <Link to="/login" className="auth-link auth-link--back">
                 Kembali ke halaman masuk
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="auth-header">
              <div className="icon-circle icon-circle--success">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="auth-title auth-title--sm">Password Berhasil Direset!</h1>
              <p className="auth-subtitle">
                Password Anda telah diperbarui. Silakan masuk dengan password baru Anda.
              </p>
            </div>

            <div className="auth-form">
              <div className="info-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Gunakan password baru Anda untuk masuk</span>
              </div>

              <Link to="/login" className="btn-primary" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Masuk Sekarang <span className="btn-arrow">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
