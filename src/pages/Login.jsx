import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      setIsError(false);
      setMessage(response.data.message);

      localStorage.setItem("user_id", response.data.user.id);
      localStorage.setItem("user_nama", response.data.user.nama);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setIsError(true);
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Tidak dapat terhubung ke server backend.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* 🔙 BUTTON POJOK ATAS */}
        <button
          className="back-btn-top"
          onClick={() => navigate("/")}
          aria-label="Kembali ke Beranda"
        >
          &larr;
        </button>

        <h2>Login</h2>
        <p>Masuk ke akun Anda untuk melanjutkan</p>

        {/* 🚨 TEMPAT MEMUNCULKAN MESSAGE BACKEND */}
        {message && (
          <div
            style={{
              color: isError ? "#e11d48" : "#16a34a",
              backgroundColor: isError ? "#ffe4e6" : "#dcfce7",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "15px",
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* Bungkus inputan dengan tag form agar fungsi submit bekerja */}
        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ marginTop: "20px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: "100%", marginTop: "10px" }}
          >
            Login
          </button>
        </form>

        <p
          className="login-footer"
          style={{ marginTop: "20px", fontSize: "14px" }}
        >
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#4f46e5", cursor: "pointer", fontWeight: "600" }}
          >
            Registrasi
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
