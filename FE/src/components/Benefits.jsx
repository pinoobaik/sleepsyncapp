const benefits = [
  {
    gradient: "linear-gradient(135deg, #a7f0d6 0%, #2dd4a0 100%)",
    border: "#2dd4a0",
    icon: "💪",
    title: "Kesehatan Fisik",
    desc: "Tidur yang cukup membantu pemulihan otot, meningkatkan imunitas, dan menjaga metabolisme tubuh tetap optimal.",
  },
  {
    gradient: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)",
    border: "#8b5cf6",
    icon: "🧠",
    title: "Kesehatan Mental",
    desc: "Istirahat berkualitas meningkatkan konsentrasi, kreativitas, dan menjaga keseimbangan emosi setiap harinya.",
  },
  {
    gradient: "linear-gradient(135deg, #fda4af 0%, #f43f5e 100%)",
    border: "#f43f5e",
    icon: "⚡",
    title: "Produktivitas",
    desc: "Bangun dengan segar, fokus lebih tajam, dan raih performa terbaik dalam setiap aktivitas harian Anda.",
  },
];

export default function Benefits() {
  return (
    <>
      <style>{`
        .benefits {
          padding: 100px 48px;
          background: #ffffff;
        }

        .benefits-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .benefits-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .benefits-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: #0f2d2a;
          margin-bottom: 16px;
        }

        .benefits-subtitle {
          font-size: 1rem;
          color: #64748b;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .benefit-card {
          border-radius: 24px;
          overflow: hidden;
          border: 1.5px solid;
          background: white;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
        }

        .benefit-card:hover {
          transform: translateY(-10px) scale(1.01);
          box-shadow: 0 24px 60px rgba(0,0,0,0.1);
        }

        .benefit-img {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          position: relative;
          overflow: hidden;
        }

        .benefit-img::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40px;
          background: linear-gradient(to top, white, transparent);
        }

        .benefit-body {
          padding: 24px 28px 28px;
        }

        .benefit-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #0f2d2a;
          margin-bottom: 12px;
        }

        .benefit-desc {
          font-size: 0.9rem;
          line-height: 1.72;
          color: #64748b;
          margin-bottom: 24px;
        }

        .benefit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border: 1.5px solid #2dd4a0;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2dd4a0;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }

        .benefit-btn:hover {
          background: #2dd4a0;
          color: white;
        }

        @media (max-width: 900px) {
          .benefits {
            padding: 80px 20px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="benefits" id="benefits">
        <div className="benefits-inner">
          <div className="benefits-header">
            <h2 className="benefits-title">Benefits</h2>
            <p className="benefits-subtitle">
              Berikut ini adalah manfaat yang akan anda dapatkan jika anda menjaga pola tidur untuk kesehatan bagi tubuh anda
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="benefit-card" style={{ borderColor: b.border + '40' }}>
                <div className="benefit-img" style={{ background: b.gradient }}>
                  {b.icon}
                </div>
                <div className="benefit-body">
                  <div className="benefit-name">{b.title}</div>
                  <p className="benefit-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
