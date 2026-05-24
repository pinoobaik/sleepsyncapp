import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        nama,
        email,
        password,
        confPassword,
      });

      setIsError(false);
      setMessage(response.data.message);

      setNama("");
      setEmail("");
      setPassword("");
      setConfPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
        <button className="back-btn-top" onClick={() => navigate("/")}>
          ←
        </button>

        <h2>Register</h2>
        <p>Buat akun baru</p>

        {/* 🚨 TEMPAT MEMUNCULKAN MESSAGE BACKEND */}
        {message && (
          <div
            style={{
              color: isError ? "#e11d48" : "#16a34a",
              backgroundColor: isError ? "#ffe4e6" : "#dcfce7",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn">
            Register
          </button>
        </form>

        <p className="login-footer">
          Sudah punya akun?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
