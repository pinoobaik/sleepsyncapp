const features = [
  {
    icon: "🌙",
    iconBg: "#f3f0ff",
    title: "Pelacak Tidur",
    desc: "Pantau durasi dan fase tidur secara otomatis tanpa gangguan dengan sensor cerdas.",
    tag: "Otomatis",
    tagColor: "#7c5cfc",
  },
  {
    icon: "📊",
    iconBg: "#e6faf4",
    title: "Analisis Data",
    desc: "Laporan detail pola tidur, skor kualitas, dan tren mingguan yang mudah dipahami.",
    tag: "Real-time",
    tagColor: "#2dd4a0",
  },
  {
    icon: "⏰",
    iconBg: "#fff9e6",
    title: "Alarm Cerdas",
    desc: "Bangun di waktu paling optimal dalam fase tidur ringan agar merasa segar.",
    tag: "Smart",
    tagColor: "#f59e0b",
  },
  {
    icon: "🤖",
    iconBg: "#fff0f5",
    title: "Rekomendasi AI",
    desc: "AI mempelajari kebiasaan Anda dan memberikan saran personal untuk tidur lebih baik.",
    tag: "AI-Powered",
    tagColor: "#f43f5e",
  },
];

export default function Features() {
  return (
    <>
      <style>{`
        .features {
          padding: 100px 48px;
          background: linear-gradient(160deg, #f8fffe 0%, #f0fdf8 40%, #f5f0ff 100%);
          position: relative;
          overflow: hidden;
        }

        .features::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(45,212,160,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .features-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .features-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .features-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: #0f2d2a;
          margin-bottom: 16px;
          line-height: 1.15;
        }

        .features-desc {
          font-size: 1rem;
          color: #64748b;
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .feature-card {
          background: white;
          border-radius: 22px;
          padding: 32px;
          border: 1.5px solid rgba(45,212,160,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, transparent, rgba(45,212,160,0.3), transparent);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(45,212,160,0.12);
          border-color: rgba(45,212,160,0.2);
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon-wrap {
          width: 60px; height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          flex-shrink: 0;
          position: relative;
        }

        .feature-body {
          flex: 1;
        }

        .feature-tag {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
          background: rgba(45,212,160,0.08);
        }

        .feature-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #0f2d2a;
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .features {
            padding: 80px 20px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="features" id="feature">
        <div className="features-inner">
          <div className="features-header">
            <h2 className="features-title">Apa Saja Fiturnya?</h2>
            <p className="features-desc">
              Fitur pada aplikasi ini dirancang untuk membantu pengguna memahami dan meningkatkan kualitas tidur, mulai dari prediksi pola tidur hingga rekomendasi personal.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrap" style={{ background: f.iconBg }}>
                  {f.icon}
                </div>
                <div className="feature-body">
                  <span className="feature-tag" style={{ color: f.tagColor, background: f.tagColor + '15' }}>
                    {f.tag}
                  </span>
                  <div className="feature-name">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
