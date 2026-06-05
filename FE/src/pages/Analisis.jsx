import { useState, useEffect } from "react";
import "./Pages.css";
import "./predict-additions.css";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/**
 * Menghitung faktor pengaruh tidur berdasarkan data form aktual.
 * Jika form kosong (belum ada prediksi), kembalikan estimasi umum.
 */
function buildFactors(form) {
  const hasData = form && parseFloat(form.sleep_duration) > 0;

  if (!hasData) {
    // Estimasi umum sebelum user mengisi form
    return [
      {
        name: "Olahraga",
        impact: 82,
        icon: "🏃",
        positive: true,
        note: "estimasi umum",
      },
      {
        name: "Stres",
        impact: 65,
        icon: "😰",
        positive: false,
        note: "estimasi umum",
      },
      {
        name: "Kafein",
        impact: 71,
        icon: "☕",
        positive: false,
        note: "estimasi umum",
      },
      {
        name: "Meditasi",
        impact: 88,
        icon: "🧘",
        positive: true,
        note: "estimasi umum",
      },
      {
        name: "Layar HP",
        impact: 58,
        icon: "📱",
        positive: false,
        note: "estimasi umum",
      },
      {
        name: "Diet Sehat",
        impact: 79,
        icon: "🥗",
        positive: true,
        note: "estimasi umum",
      },
    ];
  }

  const stress = parseInt(form.stress_level) || 5; // 1–10
  const activity = parseFloat(form.physical_activity) || 0; // menit/hari
  const steps = parseInt(form.daily_steps) || 0;
  const quality = parseInt(form.quality_of_sleep) || 5; // 1–10
  const duration = parseFloat(form.sleep_duration) || 0;
  const bmi = (form.bmi_category || "").toLowerCase();

  // Aktivitas fisik: 0 mnt → 10%, 60+ mnt → 95%
  const activityImpact = Math.min(10 + Math.round((activity / 60) * 85), 95);
  const activityPositive = activity >= 20;

  // Stres: skala 1–10, makin tinggi makin besar dampak negatifnya
  const stressImpact = Math.round((stress / 10) * 95);

  // Langkah harian: 0 → 5%, 10.000+ → 90%
  const stepsImpact = Math.min(5 + Math.round((steps / 10000) * 85), 90);
  const stepsPositive = steps >= 7000;

  // Kualitas tidur subjektif: 1–10, cerminkan sebagai dampak positif/negatif
  const qualityImpact = Math.round((quality / 10) * 95);
  const qualityPositive = quality >= 6;

  // Durasi tidur: 7–9 jam = optimal (positif), di luar itu = negatif
  const durationDiff = Math.abs(duration - 8); // ideal ~8 jam
  const durationImpact = Math.min(100 - Math.round(durationDiff * 12), 95);
  const durationPositive = duration >= 6 && duration <= 9;

  // BMI: Normal/Underweight → dampak rendah; Overweight/Obese → dampak negatif tinggi
  let bmiImpact = 30;
  let bmiPositive = true;
  if (bmi === "obese" || bmi === "obesitas") {
    bmiImpact = 85;
    bmiPositive = false;
  } else if (bmi === "overweight") {
    bmiImpact = 60;
    bmiPositive = false;
  } else if (bmi === "normal") {
    bmiImpact = 20;
    bmiPositive = true;
  } else if (bmi === "underweight") {
    bmiImpact = 35;
    bmiPositive = false;
  }

  return [
    {
      name: "Aktivitas Fisik",
      impact: activityImpact,
      icon: "🏃",
      positive: activityPositive,
      note: `${activity} menit/hari`,
    },
    {
      name: "Tingkat Stres",
      impact: stressImpact,
      icon: "😰",
      positive: false,
      note: `level ${stress}/10`,
    },
    {
      name: "Langkah Harian",
      impact: stepsImpact,
      icon: "👟",
      positive: stepsPositive,
      note: `${steps.toLocaleString()} langkah`,
    },
    {
      name: "Kualitas Tidur",
      impact: qualityImpact,
      icon: "⭐",
      positive: qualityPositive,
      note: `${quality}/10`,
    },
    {
      name: "Durasi Tidur",
      impact: Math.max(durationImpact, 10),
      icon: "🛏️",
      positive: durationPositive,
      note: `${duration} jam`,
    },
    {
      name: "Kategori BMI",
      impact: bmiImpact,
      icon: "⚖️",
      positive: bmiPositive,
      note: form.bmi_category || "—",
    },
  ];
}

const initialForm = {
  gender: "",
  age: "",
  occupation: "",
  sleep_duration: "",
  quality_of_sleep: "5",
  physical_activity: "",
  stress_level: "5",
  bmi_category: "",
  blood_pressure: "",
  heart_rate: "",
  daily_steps: "",
  sleep_disorder: "",
};

/**
 * Menghasilkan rekomendasi dan risiko yang dipersonalisasi
 * berdasarkan data form dan hasil prediksi model ML.
 */
function buildRekomendasi(form, prediction) {
  const rekom = [];

  const duration = parseFloat(form.sleep_duration) || 0;
  const stress = parseInt(form.stress_level) || 5;
  const activity = parseFloat(form.physical_activity) || 0;
  const steps = parseInt(form.daily_steps) || 0;
  const quality = parseInt(form.quality_of_sleep) || 5;
  const bmi = (form.bmi_category || "").toLowerCase();
  const heartRate = parseInt(form.heart_rate) || 0;

  // ── Durasi tidur ──────────────────────────────────────────────
  if (duration < 6) {
    rekom.push(
      "⏰ Durasi tidur Anda hanya " +
        duration +
        " jam — tambah minimal hingga 7–9 jam per malam."
    );
  } else if (duration > 9) {
    rekom.push(
      "😴 Tidur lebih dari 9 jam bisa jadi tanda kelelahan kronis — pertimbangkan konsultasi dokter."
    );
  } else {
    rekom.push(
      "✅ Durasi tidur " +
        duration +
        " jam sudah dalam rentang ideal. Pertahankan konsistensinya."
    );
  }

  // ── Stres ─────────────────────────────────────────────────────
  if (stress >= 8) {
    rekom.push(
      "🧘 Tingkat stres Anda sangat tinggi (" +
        stress +
        "/10). Coba teknik relaksasi seperti meditasi atau pernapasan dalam sebelum tidur."
    );
  } else if (stress >= 6) {
    rekom.push(
      "😰 Stres pada level " +
        stress +
        "/10 dapat mengganggu kualitas tidur — kurangi screen time dan coba journaling malam hari."
    );
  }

  // ── Aktivitas fisik ───────────────────────────────────────────
  if (activity < 20) {
    rekom.push(
      "🏃 Aktivitas fisik Anda hanya " +
        activity +
        " menit/hari — targetkan minimal 30 menit olahraga ringan untuk meningkatkan kualitas tidur."
    );
  } else if (activity >= 20 && activity < 30) {
    rekom.push(
      "💪 Tingkatkan aktivitas fisik dari " +
        activity +
        " ke 30+ menit/hari untuk mendapatkan manfaat tidur yang optimal."
    );
  } else {
    rekom.push(
      "✅ Aktivitas fisik " +
        activity +
        " menit/hari sudah baik — lanjutkan rutinitas ini."
    );
  }

  // ── Langkah harian ────────────────────────────────────────────
  if (steps > 0 && steps < 5000) {
    rekom.push(
      "👟 Langkah harian Anda (" +
        steps.toLocaleString() +
        ") masih rendah — targetkan 7.000–10.000 langkah per hari."
    );
  }

  // ── Kualitas tidur subjektif ──────────────────────────────────
  if (quality <= 4) {
    rekom.push(
      "🛏️ Kualitas tidur subjektif Anda rendah (" +
        quality +
        "/10). Perhatikan kebersihan tidur: hindari kafein setelah pukul 14.00 dan matikan layar 1 jam sebelum tidur."
    );
  }

  // ── BMI ───────────────────────────────────────────────────────
  if (bmi === "obese" || bmi === "obesitas") {
    rekom.push(
      "⚖️ Berat badan berlebih (Obesitas) berkorelasi dengan risiko Sleep Apnea — pertimbangkan program diet sehat dan olahraga rutin."
    );
  } else if (bmi === "overweight" || bmi === "gemuk (overweight)") {
    rekom.push(
      "⚖️ BMI Overweight dapat mempengaruhi kualitas tidur — aktivitas fisik rutin dan pola makan seimbang sangat dianjurkan."
    );
  }

  // ── Detak jantung ─────────────────────────────────────────────
  if (heartRate > 100) {
    rekom.push(
      "❤️ Detak jantung istirahat " +
        heartRate +
        " bpm tergolong tinggi (takikardia) — konsultasikan ke dokter, karena dapat mempengaruhi kualitas tidur."
    );
  } else if (heartRate > 0 && heartRate < 50) {
    rekom.push(
      "❤️ Detak jantung " +
        heartRate +
        " bpm tergolong sangat rendah (bradikardia) — sebaiknya dikonsultasikan ke dokter."
    );
  }

  // ── Rekomendasi spesifik gangguan ─────────────────────────────
  if (prediction === "Insomnia") {
    rekom.push(
      "🌙 Untuk mengatasi Insomnia: terapkan waktu tidur & bangun yang sama setiap hari, hindari tidur siang lebih dari 20 menit."
    );
    rekom.push(
      "🩺 Pertimbangkan Cognitive Behavioral Therapy for Insomnia (CBT-I) — terbukti lebih efektif dari obat tidur jangka panjang."
    );
  } else if (prediction === "Sleep Apnea") {
    rekom.push(
      "😮‍💨 Sleep Apnea membutuhkan evaluasi medis — konsultasikan ke dokter untuk kemungkinan terapi CPAP."
    );
    rekom.push(
      "🛌 Tidur miring (bukan telentang) dapat mengurangi episode henti napas pada Sleep Apnea ringan-sedang."
    );
  } else {
    rekom.push(
      "🌟 Pola tidur Anda terdeteksi normal. Pertahankan rutinitas tidur sehat untuk menjaga kondisi ini."
    );
  }

  // Batasi maksimal 5 rekomendasi agar tidak overwhelming
  return rekom.slice(0, 5);
}

function buildRisiko(form, prediction) {
  const duration = parseFloat(form.sleep_duration) || 0;
  const stress = parseInt(form.stress_level) || 5;
  const bmi = (form.bmi_category || "").toLowerCase();

  if (prediction === "Sleep Apnea") {
    return "⚠️ Sleep Apnea meningkatkan risiko hipertensi, penyakit jantung, dan stroke. Penanganan segera sangat dianjurkan.";
  }
  if (prediction === "Insomnia") {
    return "⚠️ Insomnia kronis berisiko menyebabkan gangguan kecemasan, depresi, dan penurunan fungsi kognitif jangka panjang.";
  }

  // Pola Normal tapi ada faktor risiko
  const risks = [];
  if (duration < 6) risks.push("kurang tidur kronis");
  if (stress >= 8) risks.push("stres tinggi");
  if (bmi === "obese" || bmi === "obesitas") risks.push("obesitas");

  if (risks.length > 0) {
    return (
      "🟡 Pola tidur normal, namun faktor " +
      risks.join(", ") +
      " dapat meningkatkan risiko gangguan tidur di kemudian hari jika tidak ditangani."
    );
  }
  return "✅ Risiko rendah. Pertahankan pola hidup dan tidur sehat Anda.";
}

export default function Analisis() {
  const [activeTab, setActiveTab] = useState("minggu");
  const [form, setForm] = useState(initialForm);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [allData, setAllData] = useState([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  // Fetch profil user untuk pre-fill gender, usia, pekerjaan
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal memuat profil");
        const profile = await res.json();

        const normalizeGender = (val) => {
          if (!val) return "";
          const v = val.toLowerCase();
          if (v === "male" || v === "laki-laki") return "Laki-laki";
          if (v === "female" || v === "perempuan") return "Perempuan";
          return val;
        };

        const genderNorm = normalizeGender(profile.gender);
        const ageNorm = profile.usia ? String(profile.usia) : "";
        const occupNorm = profile.pekerjaan || "";

        // Tandai kalau ada field profil yang masih kosong
        if (!genderNorm || !ageNorm || !occupNorm) {
          setProfileIncomplete(true);
        }

        setForm((prev) => ({
          ...prev,
          gender: genderNorm || prev.gender,
          age: ageNorm || prev.age,
          occupation: occupNorm || prev.occupation,
        }));
      } catch (e) {
        console.error("Profile fetch error:", e.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch riwayat analisis dari API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/sleep-analysis", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal memuat riwayat");
        const raw = await res.json();

        // Simpan semua data mentah (sudah urut DESC dari API)
        const mapped = raw.map((item) => {
          const d = new Date(item.created_at);
          return {
            day: HARI[d.getDay()],
            date: d,
            hours: parseFloat(item.sleep_duration) || 0,
            quality: (parseFloat(item.quality_of_sleep) || 0) * 10,
            deep: 0,
            rem: 0,
            light: 0,
          };
        });
        setAllData(mapped);
      } catch (e) {
        console.error("Analisis fetch error:", e.message);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [result]); // re-fetch setiap kali ada prediksi baru tersimpan

  // Filter data berdasarkan tab aktif, lalu balik agar kronologis (lama → baru)
  const historyData = (() => {
    const limit = activeTab === "bulan" ? 30 : 7;
    return allData.slice(0, limit).reverse();
  })();

  const hasHistory = historyData.length > 0;

  const avg = hasHistory
    ? {
        quality: Math.round(
          historyData.reduce((a, b) => a + b.quality, 0) / historyData.length
        ),
        hours: (
          historyData.reduce((a, b) => a + b.hours, 0) / historyData.length
        ).toFixed(1),
        deep: "—",
        rem: "—",
      }
    : { quality: 0, hours: "—", deep: "—", rem: "—" };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    const required = Object.keys(initialForm).filter(
      (k) => k !== "sleep_disorder"
    );
    const missing = required.filter((k) => !form[k]);
    if (missing.length > 0) {
      setError("Harap lengkapi semua field sebelum memprediksi.");
      return;
    }

    setPredicting(true);
    setResult(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Prediksi gagal, coba lagi.");
        return;
      }

      // Map hasil ML model ke format tampilan
      const labelMap = {
        None: { label: "Tidur Normal", emoji: "😴", score: 8 },
        Insomnia: { label: "Insomnia", emoji: "😟", score: 4 },
        "Sleep Apnea": { label: "Sleep Apnea", emoji: "😰", score: 3 },
      };

      const info = labelMap[data.prediction] || {
        label: data.prediction,
        emoji: "🔮",
        score: 5,
      };

      setResult({
        score: info.score,
        label: info.label,
        emoji: info.emoji,
        confidence: data.confidence,
        ringkasan: `Model memprediksi ${
          info.label
        } dengan tingkat kepercayaan ${data.confidence.toFixed(1)}%.`,
        rekomendasi: buildRekomendasi(form, data.prediction),
        risiko: buildRisiko(form, data.prediction),
      });

      // Simpan hasil analisis ke database
      try {
        await fetch("http://localhost:5000/api/sleep-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sleep_duration: form.sleep_duration,
            quality_of_sleep: form.quality_of_sleep,
            physical_activity: form.physical_activity,
            stress_level: form.stress_level,
            bmi_category: form.bmi_category,
            blood_pressure: form.blood_pressure,
            heart_rate: form.heart_rate,
            daily_steps: form.daily_steps,
            sleep_disorder: data.prediction,
          }),
        });
      } catch (saveErr) {
        // Gagal simpan tidak mengganggu tampilan hasil prediksi
        console.warn("Gagal menyimpan riwayat analisis:", saveErr.message);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Tidak dapat terhubung ke server. Pastikan backend dan ML server berjalan."
      );
    } finally {
      setPredicting(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 8) return "#22c55e";
    if (score >= 6) return "#84cc16";
    if (score >= 4) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-hero analisis-hero">
        <div className="hero-text">
          <h1 className="hero-title">Analisis Tidur</h1>
          <p className="hero-sub">
            Wawasan mendalam tentang pola dan kualitas tidur Anda
          </p>
        </div>
        <div className="tab-switcher">
          {["minggu", "bulan"].map((t) => {
            const count =
              t === "bulan"
                ? allData.slice(0, 30).length
                : allData.slice(0, 7).length;
            return (
              <button
                key={t}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)} Ini
                {allData.length > 0 && (
                  <span className="tab-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RINGKASAN STATISTIK ── */}
      <div className="stats-summary-row">
        {historyLoading ? (
          <div className="chart-empty">Memuat riwayat...</div>
        ) : !hasHistory ? (
          <div className="chart-empty">
            Belum ada riwayat analisis. Lakukan prediksi pertama Anda di bawah
            ini.
          </div>
        ) : (
          <>
            <div className="stat-pill">
              <span className="stat-pill-icon">🛏️</span>
              <div>
                <div className="stat-pill-val">{avg.hours} jam</div>
                <div className="stat-pill-label">Rata-rata Durasi</div>
              </div>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-icon">⭐</span>
              <div>
                <div className="stat-pill-val">{avg.quality}%</div>
                <div className="stat-pill-label">Rata-rata Kualitas</div>
              </div>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-icon">📊</span>
              <div>
                <div className="stat-pill-val">{historyData.length} sesi</div>
                <div className="stat-pill-label">
                  {activeTab === "bulan" ? "Bulan Ini" : "Minggu Ini"}
                </div>
              </div>
            </div>
            <div className="stat-bar-chart">
              {historyData.map((d, i) => (
                <div key={i} className="stat-bar-col">
                  <div
                    className="stat-bar-fill"
                    style={{ height: `${d.quality}%` }}
                    title={`${d.day}: ${d.hours}j, kualitas ${d.quality}%`}
                  />
                  <div className="stat-bar-day">{d.day}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── PREDIKSI KUALITAS TIDUR ── */}
      <div className="predict-section">
        <div className="predict-header">
          <span className="predict-badge">✨ AI Powered</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            Prediksi Kualitas Tidur
          </h2>
          <p className="section-sub">
            Masukkan data kesehatan Anda untuk mendapatkan prediksi kualitas
            tidur secara personal
          </p>
        </div>

        <div className="predict-form-card">
          {/* Banner profil belum lengkap */}
          {!profileLoading && profileIncomplete && (
            <div className="profile-incomplete-banner">
              <span>⚠️</span>
              <span>
                Beberapa data profil belum diisi.{" "}
                <a href="/pengaturan" className="profile-incomplete-link">
                  Lengkapi profil
                </a>{" "}
                agar Jenis Kelamin, Usia, dan Pekerjaan terisi otomatis.
              </span>
            </div>
          )}

          {/* Disclaimer rentang usia */}
          <div className="info-box">
            ℹ️ Model dioptimalkan untuk rentang usia 27–59 tahun. Hasil untuk
            usia di luar rentang ini mungkin kurang akurat.
          </div>
          
          <div className="predict-form-grid">
            {/* Jenis Kelamin */}
            <div className="form-group">
              <label className="form-label">
                Jenis Kelamin
                {!profileLoading && form.gender && (
                  <span className="field-from-profile">dari profil</span>
                )}
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Usia */}
            <div className="form-group">
              <label className="form-label">
                Usia
                {!profileLoading && form.age && (
                  <span className="field-from-profile">dari profil</span>
                )}
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 28"
                min="1"
                max="120"
              />
            </div>

            {/* Pekerjaan */}
            <div className="form-group">
              <label className="form-label">
                Pekerjaan
                {!profileLoading && form.occupation && (
                  <span className="field-from-profile">dari profil</span>
                )}
              </label>
              <select
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Pilih pekerjaan</option>
                <option value="Accountant">Akuntan (Accountant)</option>
                <option value="Doctor">Dokter (Doctor)</option>
                <option value="Engineer">Insinyur (Engineer)</option>
                <option value="Lawyer">Pengacara (Lawyer)</option>
                <option value="Manager">Manajer (Manager)</option>
                <option value="Nurse">Perawat (Nurse)</option>
                <option value="Sales Representative">
                  Sales Representative
                </option>
                <option value="Salesperson">Salesperson</option>
                <option value="Scientist">Ilmuwan (Scientist)</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Teacher">Guru/Dosen (Teacher)</option>
              </select>
            </div>

            {/* Durasi Tidur */}
            <div className="form-group">
              <label className="form-label">Durasi Tidur (jam/malam)</label>
              <input
                type="number"
                name="sleep_duration"
                value={form.sleep_duration}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 7.5"
                step="0.1"
                min="0"
                max="24"
              />
            </div>

            {/* Aktivitas Fisik */}
            <div className="form-group">
              <label className="form-label">Aktivitas Fisik (menit/hari)</label>
              <input
                type="number"
                name="physical_activity"
                value={form.physical_activity}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 45"
                min="0"
                max="180"
              />
            </div>

            {/* Kategori BMI */}
            <div className="form-group">
              <label className="form-label">Kategori BMI</label>
              <select
                name="bmi_category"
                value={form.bmi_category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Pilih kategori</option>
                {/* <option value="Underweight">Kurus (Underweight)</option> */}
                <option value="Normal">Normal</option>
                <option value="Overweight">Gemuk (Overweight)</option>
                <option value="Obese">Obesitas</option>
              </select>
            </div>

            {/* Tekanan Darah */}
            <div className="form-group">
              <label className="form-label">Tekanan Darah</label>
              <input
                type="text"
                name="blood_pressure"
                value={form.blood_pressure}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 120/80"
              />
            </div>

            {/* Detak Jantung */}
            <div className="form-group">
              <label className="form-label">Detak Jantung (bpm)</label>
              <input
                type="number"
                name="heart_rate"
                value={form.heart_rate}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 72"
                min="30"
                max="220"
              />
            </div>

            {/* Langkah Harian */}
            <div className="form-group">
              <label className="form-label">Langkah Harian</label>
              <input
                type="number"
                name="daily_steps"
                value={form.daily_steps}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 8000"
                min="0"
              />
            </div>

            {/* Riwayat Keluhan Tidur */}
            <div className="form-group">
              <label className="form-label">
                Riwayat Keluhan Tidur
                <span className="form-hint"> (opsional, untuk konteks)</span>
              </label>
              <select
                name="sleep_disorder"
                value={form.sleep_disorder}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Pilih keluhan (jika ada)</option>
                <option value="None">Tidak Ada Keluhan</option>
                <option value="Insomnia">Sering sulit tidur (Insomnia)</option>
                <option value="Sleep Apnea">
                  Sering mendengkur/henti napas
                </option>
                <option value="Restless Leg Syndrome">
                  Kaki gelisah saat tidur
                </option>
              </select>
            </div>

            {/* Kualitas Tidur */}
            <div className="form-group">
              <label className="form-label">
                Kualitas Tidur (1–10)
                {form.quality_of_sleep && (
                  <span className="form-label-val">
                    {form.quality_of_sleep}
                  </span>
                )}
              </label>
              <input
                type="range"
                name="quality_of_sleep"
                value={form.quality_of_sleep}
                onChange={handleChange}
                className="form-range"
                min="1"
                max="10"
                step="1"
              />
              <div className="range-labels">
                <span>Buruk (1)</span>
                <span>Sangat Baik (10)</span>
              </div>
            </div>

            {/* Tingkat Stres */}
            <div className="form-group">
              <label className="form-label">
                Tingkat Stres (1–10)
                {form.stress_level && (
                  <span className="form-label-val">{form.stress_level}</span>
                )}
              </label>
              <input
                type="range"
                name="stress_level"
                value={form.stress_level}
                onChange={handleChange}
                className="form-range"
                min="1"
                max="10"
                step="1"
              />
              <div className="range-labels">
                <span>Rendah</span>
                <span>Tinggi</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <div className="predict-error">⚠️ {error}</div>}

          {/* Predict Button */}
          <button
            className={`predict-btn ${predicting ? "predicting" : ""}`}
            onClick={handlePredict}
            disabled={predicting}
          >
            {predicting ? (
              <>
                <span className="spinner" />
                Menganalisis data Anda...
              </>
            ) : (
              <>🔮 Prediksi Kualitas Tidur</>
            )}
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="predict-result-card">
            <div className="result-top">
              <div className="result-emoji">{result.emoji}</div>
              <div className="result-info">
                <div className="result-label">{result.label}</div>
                <div className="result-ringkasan">{result.ringkasan}</div>
              </div>
              <div className="result-score-wrap">
                <svg className="score-ring" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={scoreColor(result.score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 10) * 213.6} 213.6`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="score-text">
                  <span
                    className="score-num"
                    style={{ color: scoreColor(result.score) }}
                  >
                    {result.score}
                  </span>
                  <span className="score-den">/10</span>
                </div>
              </div>
            </div>

            <div className="result-body">
              <div className="result-rekom">
                <h4>💡 Rekomendasi</h4>
                <ul>
                  {result.rekomendasi.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="result-risiko">
                <h4>⚠️ Risiko</h4>
                <p>{result.risiko}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Faktor Pengaruh Tidur */}
      <div className="factors-section">
        <h2 className="section-title">Faktor Pengaruh Tidur</h2>
        <p className="section-sub">
          {result
            ? "Dampak setiap faktor dihitung berdasarkan data yang Anda masukkan"
            : "Lakukan prediksi di atas agar faktor dihitung dari data Anda — saat ini menampilkan estimasi umum"}
        </p>
        <div className="factors-grid">
          {buildFactors(form).map((f, i) => (
            <div
              key={i}
              className={`factor-card ${f.positive ? "positive" : "negative"}`}
            >
              <div className="factor-top">
                <span className="factor-icon">{f.icon}</span>
                <span
                  className={`factor-tag ${f.positive ? "tag-pos" : "tag-neg"}`}
                >
                  {f.positive ? "Positif" : "Negatif"}
                </span>
              </div>
              <div className="factor-name">{f.name}</div>
              {f.note && <div className="factor-note">{f.note}</div>}
              <div className="factor-bar-bg">
                <div
                  className={`factor-bar-fill ${
                    f.positive ? "fill-pos" : "fill-neg"
                  }`}
                  style={{ width: `${f.impact}%` }}
                />
              </div>
              <div className="factor-impact">{f.impact}% dampak</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="ai-rec-card">
        <div className="ai-rec-icon">🤖</div>
        <div className="ai-rec-content">
          <h3>Rekomendasi Personalisasi AI</h3>
          {result ? (
            <ul className="ai-rec-list">
              {result.rekomendasi.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <p className="ai-rec-empty">
              Rekomendasi akan muncul setelah Anda melakukan prediksi di atas.
              Isi data kesehatan Anda dan klik{" "}
              <strong>🔮 Prediksi Kualitas Tidur</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
