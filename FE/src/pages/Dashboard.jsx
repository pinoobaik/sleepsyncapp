import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

// Gunakan environment variable, fallback ke localhost untuk development
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const moonPhases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const tips = [
  { icon: "🌙", title: "Konsistensi Jadwal", desc: "Tidur dan bangun di waktu yang sama setiap hari untuk ritme sirkadian optimal." },
  { icon: "📱", title: "Batasi Layar", desc: "Hindari perangkat elektronik 1 jam sebelum tidur untuk produksi melatonin." },
  { icon: "🌡️", title: "Suhu Kamar", desc: "Suhu 18-22°C adalah kondisi ideal untuk tidur berkualitas." },
  { icon: "☕", title: "Kafein", desc: "Hindari kafein setelah pukul 14.00 untuk kualitas tidur malam yang baik." },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moonIndex, setMoonIndex] = useState(4);
  const [animateCards, setAnimateCards] = useState(false);
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setAnimateCards(true);

    const fetchSleepData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/sleep-analysis`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal memuat data");
        const raw = await res.json();

        // Ambil 7 data terbaru, balik urutan agar kronologis (lama → baru)
        const latest = raw.slice(0, 7).reverse();
        const mapped = latest.map((item) => {
          const d = new Date(item.created_at);
          return {
            day: HARI[d.getDay()],
            hours: parseFloat(item.sleep_duration) || 0,
            // quality_of_sleep API skala 1-10, tampilkan sebagai persentase (×10)
            quality: (parseFloat(item.quality_of_sleep) || 0) * 10,
          };
        });
        setSleepData(mapped);
      } catch (e) {
        console.error("Dashboard fetch error:", e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
    return () => clearInterval(timer);
  }, []);

  const hasData = sleepData.length > 0;
  const avgQuality = hasData
    ? Math.round(sleepData.reduce((a, b) => a + b.quality, 0) / sleepData.length)
    : 0;
  const avgHours = hasData
    ? (sleepData.reduce((a, b) => a + b.hours, 0) / sleepData.length).toFixed(1)
    : "—";
  const bestDay = hasData
    ? sleepData.reduce((a, b) => (a.quality > b.quality ? a : b))
    : null;

  const formatTime = (date) =>
    date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (date) =>
    date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const maxHours = hasData ? Math.max(...sleepData.map((d) => d.hours)) : 1;

  return (
    <div className="page-container">
      {/* Hero Clock Section */}
      <div className={`hero-clock ${animateCards ? "animate-in" : ""}`}>
        <div className="moon-display">
          <span className="moon-emoji">{moonPhases[moonIndex]}</span>
          <div className="moon-glow" />
        </div>
        <div className="time-block">
          <div className="live-time">{formatTime(currentTime)}</div>
          <div className="live-date">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="section-header">
          <h2 className="section-title">Pola Tidur Terbaru</h2>
          <div className="chart-legend">
            <span className="legend-dot mint" /> <span>Jam Tidur</span>
            <span className="legend-dot peach" /> <span>Kualitas</span>
          </div>
        </div>
        {loading ? (
          <div className="chart-empty">Memuat data...</div>
        ) : !hasData ? (
          <div className="chart-empty">
            Belum ada data tidur. Lakukan analisis pertama Anda di halaman <strong>Analisis</strong>.
          </div>
        ) : (
          <div className="bar-chart">
            {sleepData.map((d, i) => (
              <div key={i} className="bar-group">
                <div className="bar-labels-top">
                  <span className="bar-val">{d.hours}j</span>
                </div>
                <div className="bars">
                  <div
                    className="bar bar-hours"
                    style={{ height: `${(d.hours / maxHours) * 100}%`, animationDelay: `${i * 0.08}s` }}
                    title={`${d.hours} jam`}
                  >
                    <div className="bar-tooltip">{d.hours}j</div>
                  </div>
                  <div
                    className="bar bar-quality"
                    style={{ height: `${d.quality}%`, animationDelay: `${i * 0.08 + 0.04}s` }}
                    title={`${d.quality}%`}
                  >
                    <div className="bar-tooltip">{d.quality}%</div>
                  </div>
                </div>
                <div className="bar-day">{d.day}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ringkasan Analisis Terakhir + Insight AI */}
      <div className="two-col">
        <div className="stage-card">
          <h3 className="card-title">📋 Analisis Terakhir</h3>
          {!hasData ? (
            <p className="insight-text" style={{ color: "#9ca3af", marginTop: 12 }}>
              Belum ada data analisis. Mulai di halaman <strong>Analisis</strong>.
            </p>
          ) : (() => {
            const latest = sleepData[sleepData.length - 1];
            const items = [
              {
                name: "Durasi Tidur",
                value: `${latest.hours} jam`,
                color: "#7dd3fc",
                pct: Math.min((latest.hours / 10) * 100, 100),
              },
              {
                name: "Kualitas Tidur",
                value: `${latest.quality}%`,
                color: "#34d399",
                pct: latest.quality,
              },
            ];
            return (
              <div className="stages-list">
                {items.map((s, i) => (
                  <div key={i} className="stage-item">
                    <div className="stage-meta">
                      <span className="stage-name">{s.name}</span>
                      <span className="stage-hours">{s.value}</span>
                    </div>
                    <div className="stage-bar-bg">
                      <div
                        className="stage-bar-fill"
                        style={{ width: `${s.pct}%`, background: s.color }}
                      />
                    </div>
                    <span className="stage-pct">{Math.round(s.pct)}%</span>
                  </div>
                ))}
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 10 }}>
                  Data dari sesi terakhir ({sleepData[sleepData.length - 1].day})
                </p>
              </div>
            );
          })()}
        </div>

        <div className="ai-insight-card">
          <h3 className="card-title">💡 Insight AI</h3>
          <div className="insight-badge">Analisis Terkini</div>
          {!hasData ? (
            <p className="insight-text">
              Belum ada data untuk dianalisis. Mulai catat tidur Anda di halaman <strong>Analisis</strong>.
            </p>
          ) : (
            <>
              <p className="insight-text">
                Rata-rata kualitas tidur Anda adalah <strong>{avgQuality}%</strong> dari{" "}
                <strong>{sleepData.length} sesi</strong> terakhir.
                {avgQuality >= 80
                  ? " Kualitas tidur Anda sangat baik — pertahankan!"
                  : avgQuality >= 60
                  ? " Ada ruang untuk perbaikan. Coba tidur lebih konsisten."
                  : " Kualitas tidur Anda perlu perhatian. Konsultasikan ke halaman Analisis."}
              </p>
              <div className="insight-metrics">
                <div className="i-metric">
                  <span className="i-icon">⏱️</span>
                  <span>Rata-rata {avgHours} jam/malam</span>
                </div>
                <div className="i-metric">
                  <span className="i-icon">🎯</span>
                  <span>
                    {bestDay ? `Terbaik: ${bestDay.day} (${bestDay.quality}%)` : "—"}
                  </span>
                </div>
              </div>
            </>
          )}
          <button className="btn-primary" onClick={() => navigate("/analisis")}>Lihat Analisis Lengkap →</button>
        </div>
      </div>

      {/* Tips */}
      <div className="tips-section">
        <h2 className="section-title">Tips Tidur Berkualitas</h2>
        <div className="tips-grid">
          {tips.map((tip, i) => (
            <div key={i} className={`tip-card tip-${i}`}>
              <span className="tip-icon">{tip.icon}</span>
              <h4 className="tip-title">{tip.title}</h4>
              <p className="tip-desc">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}