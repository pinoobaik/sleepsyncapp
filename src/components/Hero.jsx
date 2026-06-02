import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    avg_duration: 7.5,
    quality_score: 75,
    total_users: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/sleep-stats/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.avg_duration) setStats(data);
      })
      .catch(() => {}); // Gagal fetch → pakai nilai default
  }, []);

  // Format durasi: 7.5 → "7h 30m"
  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Label kualitas berdasarkan skor
  const qualityLabel = (score) => {
    if (score >= 80) return "Sangat Baik";
    if (score >= 60) return "Baik";
    if (score >= 40) return "Cukup";
    return "Kurang";
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .hero {
          min-height: 100vh;
          padding: 100px 48px 60px;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #f0fdf8 0%, #e6faf4 30%, #f5f0ff 70%, #fff0f5 100%);
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(45,212,160,0.12) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(167,240,214,0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border: 1.5px solid var(--mint-mid, #a7f0d6);
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--mint, #2dd4a0);
          background: rgba(45,212,160,0.06);
          margin-bottom: 24px;
          letter-spacing: 0.03em;
          animation: fadeSlideDown 0.6s ease both;
        }

        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--mint, #2dd4a0);
          box-shadow: 0 0 0 3px rgba(45,212,160,0.2);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(45,212,160,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(45,212,160,0.08); }
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          line-height: 1.1;
          color: #0f2d2a;
          margin-bottom: 8px;
          animation: fadeSlideDown 0.7s ease 0.1s both;
        }

        .hero-title-accent {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          background: linear-gradient(135deg, #2dd4a0, #1ab88a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          animation: fadeSlideDown 0.7s ease 0.15s both;
        }

        .hero-desc {
          font-size: 1rem;
          line-height: 1.75;
          color: #64748b;
          margin: 20px 0 36px;
          max-width: 440px;
          animation: fadeSlideDown 0.7s ease 0.25s both;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeSlideDown 0.7s ease 0.35s both;
        }

        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, #2dd4a0, #1ab88a);
          color: white;
          border: none;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(45,212,160,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(45,212,160,0.4);
        }

        .btn-secondary {
          padding: 14px 28px;
          background: transparent;
          color: #0f2d2a;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .btn-secondary:hover {
          border-color: #2dd4a0;
          color: #2dd4a0;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          position: relative;
          animation: fadeSlideUp 0.8s ease 0.2s both;
        }

        .hero-card-wrap {
          position: relative;
          width: 100%;
          max-width: 440px;
        }

        .hero-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 32px;
          border: 1.5px solid rgba(255,255,255,0.9);
          box-shadow: 0 20px 60px rgba(45,212,160,0.12), 0 4px 16px rgba(0,0,0,0.06);
        }

        .sleep-score-ring {
          width: 140px; height: 140px;
          margin: 0 auto 24px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ring-svg {
          position: absolute;
          inset: 0;
          transform: rotate(-90deg);
        }

        .ring-bg {
          fill: none;
          stroke: #e6faf4;
          stroke-width: 8;
        }

        .ring-progress {
          fill: none;
          stroke: url(#mintGrad);
          stroke-width: 8;
          stroke-linecap: round;
          stroke-dasharray: 377;
          stroke-dashoffset: 94;
          animation: ringFill 1.2s ease 0.6s both;
        }

        @keyframes ringFill {
          from { stroke-dashoffset: 377; }
          to { stroke-dashoffset: 94; }
        }

        .ring-label {
          text-align: center;
        }

        .ring-score {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          color: #0f2d2a;
          display: block;
          line-height: 1;
        }

        .ring-text {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sleep-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .stat-item {
          background: linear-gradient(135deg, #f0fdf8, #e6faf4);
          border-radius: 14px;
          padding: 14px 12px;
          text-align: center;
          border: 1px solid rgba(45,212,160,0.1);
        }

        .stat-emoji {
          font-size: 1.2rem;
          display: block;
          margin-bottom: 6px;
        }

        .stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          color: #0f2d2a;
          display: block;
        }

        .stat-label {
          font-size: 0.68rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 500;
        }

        .floating-badge {
          position: absolute;
          background: white;
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          border: 1px solid rgba(45,212,160,0.15);
          display: flex;
          align-items: center;
          gap: 10px;
          animation: float 3s ease-in-out infinite;
        }

        .floating-badge.top-right {
          top: -20px; right: -20px;
          animation-delay: 0.5s;
        }

        .floating-badge.bottom-left {
          bottom: -16px; left: -20px;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .fb-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .fb-icon.green { background: #e6faf4; }
        .fb-icon.purple { background: #f3f0ff; }

        .fb-text { font-size: 0.8rem; }
        .fb-title { font-weight: 600; color: #0f2d2a; display: block; }
        .fb-sub { color: #94a3b8; font-size: 0.72rem; }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .hero {
            padding: 100px 24px 60px;
          }

          .hero-visual {
            order: -1;
          }

          .floating-badge.top-right {
            right: 0;
          }

          .floating-badge.bottom-left {
            left: 0;
          }
        }
      `}</style>

      <section className="hero" id="home">
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">Sleep Hygiene</h1>
            <span className="hero-title-accent">Predict</span>
            <p className="hero-desc">
              Analisis Tidur Cerdas untuk Kesehatan Lebih Baik. Membantu Anda
              Memahami Pola Istirahat, Memprediksi Kualitas Tidur, dan
              Meningkatkan Produktivitas Setiap Hari.
            </p>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Mulai Analisis
            </button>
          </div>

          <div className="hero-visual">
            <div className="hero-card-wrap">
              <div className="hero-card">
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#94a3b8",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  📊 Rata-rata dari{" "}
                  {stats.total_users > 0 ? stats.total_users : "semua"} pengguna
                  SleepSync
                </p>
                <div className="sleep-score-ring">
                  <svg className="ring-svg" viewBox="0 0 140 140">
                    <defs>
                      <linearGradient
                        id="mintGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#2dd4a0" />
                        <stop offset="100%" stopColor="#1ab88a" />
                      </linearGradient>
                    </defs>
                    <circle className="ring-bg" cx="70" cy="70" r="60" />
                    <circle className="ring-progress" cx="70" cy="70" r="60" />
                  </svg>
                  <div className="ring-label">
                    <span className="ring-score">{stats.quality_score}</span>
                    <span className="ring-text">Skor Tidur</span>
                  </div>
                </div>

                <div className="sleep-stats">
                  <div className="stat-item">
                    <span className="stat-emoji">⏱️</span>
                    <span className="stat-value">
                      {formatDuration(stats.avg_duration)}
                    </span>
                    <span className="stat-label">Durasi</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-emoji">🌊</span>
                    <span className="stat-value">4x</span>
                    <span className="stat-label">Fase REM</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-emoji">💚</span>
                    <span className="stat-value">
                      {qualityLabel(stats.quality_score)}
                    </span>
                    <span className="stat-label">Kualitas</span>
                  </div>
                </div>
              </div>

              <div className="floating-badge top-right">
                <div className="fb-icon green">🌙</div>
                <div className="fb-text">
                  <span className="fb-title">Tidur Nyenyak</span>
                  <span className="fb-sub">Fase REM tercapai</span>
                </div>
              </div>

              <div className="floating-badge bottom-left">
                <div className="fb-icon purple">✨</div>
                <div className="fb-text">
                  <span className="fb-title">AI Insight</span>
                  <span className="fb-sub">Rekomendasi baru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
