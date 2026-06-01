import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";

export default function Pengaturan() {
  const [settings, setSettings] = useState({
    namaLengkap: "",
    email: "",
    usia: "",
    gender: "",
    nomorHP: "",
    pekerjaan: "",
    kota: "",
    profilePicture: null,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Ambil data profil
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;
      setSettings({
        namaLengkap: user.nama || "",
        email: user.email || "",
        usia: user.usia || "",
        gender: user.gender || "",
        nomorHP: user.nomor_hp || "",
        pekerjaan: user.pekerjaan || "",
        kota: user.kota || "",
        profilePicture: user.profile_picture || null,
      });
    } catch (error) {
      console.error(
        "Gagal mengambil data profil:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Simpan profil
  const handleSave = async () => {
    setSuccess("");
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/profile",
        {
          nama: settings.namaLengkap,
          nomor_hp: settings.nomorHP,
          pekerjaan: settings.pekerjaan,
          kota: settings.kota,
          usia: settings.usia,
          gender: settings.gender,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(true);
      setSuccess("✓ Perubahan berhasil disimpan!");
      setTimeout(() => {
        window.location.reload(); // ← tambah ini
      }, 1500);
    } catch (error) {
      console.error(
        "Gagal update profil:",
        error.response?.data || error.message
      );
      setSuccess("❌ Gagal menyimpan perubahan. Coba lagi.");
    }
  };

  // Upload foto profil
  const handlePhotoUpload = async (e) => {
    setSuccess("");
    try {
      const file = e.target.files[0];
      if (!file) return;

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.put(
        "http://localhost:5000/api/profile/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSettings((prev) => ({
        ...prev,
        profilePicture: response.data.profile_picture,
      }));

      setSuccess("✓ Foto profil berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      setSuccess("❌ Gagal upload foto. Pastikan ukuran file maksimal 2MB.");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h3>Memuat data profil...</h3>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="panel-header">
        <h2>👤 Profil Pengguna</h2>
        <p>Informasi dasar untuk personalisasi analisis tidur Anda</p>
      </div>

      <div className="settings-panel">
        {/* Notifikasi sukses / error */}
        {success && (
          <div
            className={`auth-success ${
              success.startsWith("❌") ? "auth-error" : ""
            }`}
          >
            {success}
          </div>
        )}

        {/* Avatar */}
        <div className="avatar-section">
          <input
            type="file"
            id="profilePhoto"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handlePhotoUpload}
          />
          <div className="avatar-circle">
            {settings.profilePicture ? (
              <img
                src={settings.profilePicture}
                alt="Profile"
                className="avatar-image"
              />
            ) : (
              <span>
                {settings.namaLengkap
                  ? settings.namaLengkap
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </span>
            )}
            <div className="avatar-badge">🌙</div>
          </div>

          <div>
            <button
              className="btn-outline"
              onClick={() => document.getElementById("profilePhoto").click()}
            >
              Ganti Foto
            </button>
            <p className="avatar-hint">JPG, PNG maksimal 2MB</p>
          </div>
        </div>

        {/* Form */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              className="form-input"
              value={settings.namaLengkap}
              placeholder="Masukkan nama lengkap"
              onChange={(e) => update("namaLengkap", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={settings.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Usia</label>
            <input
              className="form-input"
              type="number"
              min="1"
              max="120"
              value={settings.usia}
              onChange={(e) => update("usia", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Kelamin</label>
            <select
              className="form-select"
              value={settings.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nomor HP</label>
            <input
              className="form-input"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={settings.nomorHP}
              onChange={(e) => update("nomorHP", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pekerjaan</label>
            <select
              className="form-select"
              value={settings.pekerjaan}
              onChange={(e) => update("pekerjaan", e.target.value)}
            >
              <option value="">Pilih Pekerjaan</option>
              <option value="Accountant">Akuntan (Accountant)</option>
              <option value="Doctor">Dokter (Doctor)</option>
              <option value="Engineer">Insinyur (Engineer)</option>
              <option value="Lawyer">Pengacara (Lawyer)</option>
              <option value="Manager">Manajer (Manager)</option>
              <option value="Nurse">Perawat (Nurse)</option>
              <option value="Sales Representative">Sales Representative</option>
              <option value="Salesperson">Salesperson</option>
              <option value="Scientist">Ilmuwan (Scientist)</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Teacher">Guru/Dosen (Teacher)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Kota</label>
            <input
              className="form-input"
              placeholder="Masukkan kota"
              value={settings.kota}
              onChange={(e) => update("kota", e.target.value)}
            />
          </div>
        </div>

        {/* Tombol simpan — desktop */}
        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
        >
          {saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
        </button>

        {/* Tombol simpan — mobile */}
        <div className="mobile-save">
          <button
            className={`save-btn full ${saved ? "saved" : ""}`}
            onClick={handleSave}
          >
            {saved ? "✓ Perubahan Tersimpan!" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
