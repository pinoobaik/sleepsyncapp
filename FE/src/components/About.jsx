export default function About() {
  return (
    <>
      <style>{`
        .about {
          padding: 100px 48px;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .about::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(45,212,160,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .about-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .about-visual {
          position: relative;
        }

        .about-img-wrap {
          border-radius: 28px;
          background: linear-gradient(135deg, #fff9ed, #ffecd2, #ffe5d0);
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(255,165,0,0.1);
        }

        .about-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,200,100,0.08) 0%, rgba(255,100,100,0.05) 100%);
        }

        .about-img-placeholder {
          width: 100px; height: 100px;
          background: rgba(255,255,255,0.4);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          position: relative;
          z-index: 1;
        }

        .about-float-card {
          position: absolute;
          background: white;
          border-radius: 18px;
          padding: 16px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          border: 1px solid rgba(45,212,160,0.1);
          animation: float 3.5s ease-in-out infinite;
        }

        .about-float-card.card1 {
          bottom: 28px; right: -20px;
          min-width: 160px;
        }

        .about-float-card.card2 {
          top: 28px; left: -20px;
          animation-delay: 1s;
        }

        .float-card-label {
          font-size: 0.72rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 500;
        }

        .float-card-value {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #0f2d2a;
          margin: 4px 0 2px;
        }

        .float-card-sub {
          font-size: 0.78rem;
          color: #2dd4a0;
          font-weight: 600;
        }

        .float-card-icon {
          font-size: 1.4rem;
          margin-bottom: 6px;
          display: block;
        }

        .about-text {
          
        }

        .section-tag {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .tag-line {
          width: 40px;
          height: 3px;
          background: linear-gradient(to right, #2dd4a0, #ff7c5c);
          border-radius: 3px;
        }

        .tag-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #2dd4a0;
          font-weight: 600;
        }

        .about-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          color: #0f2d2a;
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .about-desc {
          font-size: 1rem;
          line-height: 1.8;
          color: #64748b;
          margin-bottom: 32px;
        }

        .about-points {
          list-style: none;
          margin-bottom: 36px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .about-point {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.92rem;
          color: #475569;
        }

        .point-icon {
          width: 22px; height: 22px;
          border-radius: 6px;
          background: linear-gradient(135deg, #2dd4a0, #1ab88a);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .point-icon svg {
          width: 12px; height: 12px;
          stroke: white;
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .btn-dark {
          padding: 15px 32px;
          background: #0f2d2a;
          color: white;
          border: none;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          letter-spacing: 0.01em;
        }

        .btn-dark:hover {
          background: #1a4540;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .about {
            padding: 80px 24px;
          }

          .about-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .about-float-card.card1 {
            right: 0;
          }

          .about-float-card.card2 {
            left: 0;
          }
        }
      `}</style>

      <section className="about" id="about">
        <div className="about-inner">
          <div className="about-visual">
            <div className="about-float-card card2">
              <span className="float-card-icon">😴</span>
              <span className="float-card-label">Pengguna Aktif</span>
              <div className="float-card-value">12K+</div>
              <div className="float-card-sub">↑ 28% bulan ini</div>
            </div>

            <div className="about-img-wrap">
              <div className="about-img-placeholder">🌙</div>
            </div>

            <div className="about-float-card card1">
              <span className="float-card-label">Rata-rata Skor</span>
              <div className="float-card-value">82</div>
              <div className="float-card-sub">Kualitas tidur sangat baik</div>
            </div>
          </div>

          <div className="about-text">
            <h2 className="about-title">About</h2>
            <p className="about-desc">
              Menjaga pola tidur sangat penting karena berpengaruh langsung pada kesehatan dan kualitas hidup. Tidur yang cukup dan teratur membantu tubuh memulihkan energi, memperbaiki sel, serta menjaga fungsi otak agar tetap optimal. Selain itu, pola tidur yang baik dapat meningkatkan konsentrasi, produktivitas, dan suasana hati, serta mengurangi risiko berbagai masalah kesehatan seperti stres, kelelahan, dan gangguan tidur.
            </p>

            <ul className="about-points">
              {[
                "Analisis tidur berbasis AI yang akurat dan personal",
                "Laporan harian & mingguan yang mudah dipahami",
                "Rekomendasi gaya hidup untuk tidur lebih berkualitas",
              ].map((point, i) => (
                <li key={i} className="about-point">
                  <span className="point-icon">
                    <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
