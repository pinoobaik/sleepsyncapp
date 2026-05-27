import { useState } from "react";
import "./Pages.css";
import "./Predict-additions.css";

const weeklyData = [
  { day: "Sen", hours: 7.5, quality: 85, deep: 2.1, rem: 1.8, light: 3.6 },
  { day: "Sel", hours: 6.2, quality: 68, deep: 1.5, rem: 1.3, light: 3.4 },
  { day: "Rab", hours: 8.1, quality: 92, deep: 2.5, rem: 2.1, light: 3.5 },
  { day: "Kam", hours: 5.8, quality: 60, deep: 1.2, rem: 1.0, light: 3.6 },
  { day: "Jum", hours: 7.9, quality: 88, deep: 2.3, rem: 1.9, light: 3.7 },
  { day: "Sab", hours: 8.5, quality: 95, deep: 2.8, rem: 2.3, light: 3.4 },
  { day: "Min", hours: 7.2, quality: 80, deep: 2.0, rem: 1.7, light: 3.5 },
];

const factors = [
  { name: "Olahraga", impact: 82, icon: "🏃", positive: true },
  { name: "Stres", impact: 65, icon: "😰", positive: false },
  { name: "Kafein", impact: 71, icon: "☕", positive: false },
  { name: "Meditasi", impact: 88, icon: "🧘", positive: true },
  { name: "Layar HP", impact: 58, icon: "📱", positive: false },
  { name: "Diet Sehat", impact: 79, icon: "🥗", positive: true },
];

const initialForm = {
  gender: "",
  age: "",
  occupation: "",
  sleep_duration: "",
  physical_activity: "",
  stress_level: "",
  bmi_category: "",
  blood_pressure: "",
  heart_rate: "",
  daily_steps: "",
  sleep_disorder: "",
};

export default function Analisis() {
  const [activeTab, setActiveTab] = useState("minggu");
  const [form, setForm] = useState(initialForm);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const data = weeklyData;

  const avg = {
    quality: Math.round(data.reduce((a, b) => a + b.quality, 0) / data.length),
    hours: (data.reduce((a, b) => a + b.hours, 0) / data.length).toFixed(1),
    deep: (data.reduce((a, b) => a + b.deep, 0) / data.length).toFixed(1),
    rem: (data.reduce((a, b) => a + b.rem, 0) / data.length).toFixed(1),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    // Basic validation
    const required = Object.keys(initialForm);
    const missing = required.filter((k) => !form[k]);
    if (missing.length > 0) {
      setError("Harap lengkapi semua field sebelum memprediksi.");
      return;
    }

    setPredicting(true);
    setResult(null);
    setError(null);

    try {
      const prompt = `Kamu adalah sistem prediksi kualitas tidur berbasis data kesehatan. 
Berdasarkan data berikut, prediksi dan analisis kualitas tidur pengguna.

Data pengguna:
- Jenis kelamin: ${form.gender}
- Usia: ${form.age} tahun
- Pekerjaan: ${form.occupation}
- Durasi tidur: ${form.sleep_duration} jam/malam
- Aktivitas fisik: ${form.physical_activity} menit/hari
- Tingkat stres: ${form.stress_level}/10
- Kategori BMI: ${form.bmi_category}
- Tekanan darah: ${form.blood_pressure}
- Detak jantung: ${form.heart_rate} bpm
- Langkah harian: ${form.daily_steps} langkah
- Gangguan tidur: ${form.sleep_disorder}

Berikan respons HANYA dalam format JSON berikut (tanpa teks lain, tanpa markdown):
{
  "score": <angka 1-10>,
  "label": "<Buruk|Cukup|Baik|Sangat Baik>",
  "emoji": "<emoji sesuai label>",
  "ringkasan": "<1 kalimat ringkasan kondisi tidur>",
  "rekomendasi": ["<rekomendasi 1>", "<rekomendasi 2>", "<rekomendasi 3>"],
  "risiko": "<risiko kesehatan utama jika pola ini berlanjut, 1 kalimat>"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content.map((i) => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Terjadi kesalahan saat memproses prediksi. Silakan coba lagi.");
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
          {["minggu", "bulan"].map((t) => (
            <button
              key={t}
              className={`tab-btn ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)} Ini
            </button>
          ))}
        </div>
      </div>

      {/* ── PREDIKSI KUALITAS TIDUR ── */}
      <div className="predict-section">
        <div className="predict-header">
          <span className="predict-badge">✨ AI Powered</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>Prediksi Kualitas Tidur</h2>
          <p className="section-sub">
            Masukkan data kesehatan Anda untuk mendapatkan prediksi kualitas tidur secara personal
          </p>
        </div>

        <div className="predict-form-card">
          <div className="predict-form-grid">

            {/* Jenis Kelamin */}
            <div className="form-group">
              <label className="form-label">Jenis Kelamin</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="form-input">
                <option value="">Pilih jenis kelamin</option>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </div>

            {/* Usia */}
            <div className="form-group">
              <label className="form-label">Usia</label>
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
              <label className="form-label">Pekerjaan</label>
              <input
                type="text"
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: Software Engineer"
              />
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
              />
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
                value={form.stress_level || 5}
                onChange={handleChange}
                className="form-range"
                min="1"
                max="10"
                step="1"
              />
              <div className="range-labels">
                <span>Rendah</span><span>Tinggi</span>
              </div>
            </div>

            {/* Kategori BMI */}
            <div className="form-group">
              <label className="form-label">Kategori BMI</label>
              <select name="bmi_category" value={form.bmi_category} onChange={handleChange} className="form-input">
                <option value="">Pilih kategori</option>
                <option value="Underweight">Kurus (Underweight)</option>
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

            {/* Gangguan Tidur */}
            <div className="form-group form-group-full">
              <label className="form-label">Gangguan Tidur</label>
              <select name="sleep_disorder" value={form.sleep_disorder} onChange={handleChange} className="form-input">
                <option value="">Pilih gangguan tidur</option>
                <option value="None">Tidak Ada</option>
                <option value="Insomnia">Insomnia</option>
                <option value="Sleep Apnea">Sleep Apnea</option>
                <option value="Restless Leg Syndrome">Restless Leg Syndrome</option>
              </select>
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="predict-error">
              ⚠️ {error}
            </div>
          )}

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
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke={scoreColor(result.score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 10) * 213.6} 213.6`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="score-text">
                  <span className="score-num" style={{ color: scoreColor(result.score) }}>
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
          Faktor-faktor yang mempengaruhi kualitas tidur Anda berdasarkan data
        </p>
        <div className="factors-grid">
          {factors.map((f, i) => (
            <div key={i} className={`factor-card ${f.positive ? "positive" : "negative"}`}>
              <div className="factor-top">
                <span className="factor-icon">{f.icon}</span>
                <span className={`factor-tag ${f.positive ? "tag-pos" : "tag-neg"}`}>
                  {f.positive ? "Positif" : "Negatif"}
                </span>
              </div>
              <div className="factor-name">{f.name}</div>
              <div className="factor-bar-bg">
                <div
                  className={`factor-bar-fill ${f.positive ? "fill-pos" : "fill-neg"}`}
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
          <ul className="ai-rec-list">
            <li>✅ Pertahankan waktu tidur pukul 22:00–22:30 yang konsisten</li>
            <li>⚠️ Kurangi konsumsi kafein setelah pukul 14:00 — berdampak negatif 29%</li>
            <li>💪 Lanjutkan rutinitas olahraga pagi — meningkatkan deep sleep 18%</li>
            <li>📵 Batasi penggunaan layar 1 jam sebelum tidur</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

