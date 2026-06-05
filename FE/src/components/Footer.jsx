export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          background: #0f2d2a;
          color: white;
          padding: 60px 48px 32px;
        }

        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-brand .footer-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #2dd4a0;
          margin-bottom: 16px;
          display: block;
        }

        .footer-brand p {
          font-size: 0.88rem;
          line-height: 1.75;
          color: #94a3b8;
          max-width: 240px;
        }

        .footer-socials {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .footer-social {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s;
        }

        .footer-social:hover {
          border-color: #2dd4a0;
          color: #2dd4a0;
          background: rgba(45,212,160,0.1);
        }

        .footer-col h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 20px;
        }

        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-col ul li a {
          font-size: 0.88rem;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-col ul li a:hover {
          color: #2dd4a0;
        }

        .footer-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin-bottom: 24px;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-copy {
          font-size: 0.82rem;
          color: #475569;
        }

        .footer-copy span {
          color: #2dd4a0;
        }

        .footer-mint-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #475569;
        }

        .footer-mint-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #2dd4a0;
          animation: pulse 2s ease-in-out infinite;
        }

        @media (max-width: 900px) {
          .footer {
            padding: 60px 24px 32px;
          }

          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 600px) {
          .footer-top {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-logo">SleepSync</span>
              <p>Platform analisis tidur cerdas berbasis AI untuk membantu Anda hidup lebih sehat dan produktif setiap hari.</p>
              <div className="footer-socials">
                {["🐙", "💼", "🐦", "📸"].map((icon, i) => (
                  <a key={i} href="#" className="footer-social">{icon}</a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4>Navigasi</h4>
              <ul>
                {["Home", "About", "Feature", "Benefits", "Our Team"].map((item, i) => (
                  <li key={i}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Fitur</h4>
              <ul>
                {["Pelacak Tidur", "Analisis Data", "Alarm Cerdas", "Rekomendasi AI"].map((item, i) => (
                  <li key={i}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Kontak</h4>
              <ul>
                {["Email Kami", "Dukungan", "FAQ", "Kebijakan Privasi"].map((item, i) => (
                  <li key={i}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-bottom">
            <span className="footer-copy">
              © 2025 <span>SleepSync</span>. All rights reserved.
            </span>
            <div className="footer-mint-badge">
              <div className="footer-mint-dot" />
              Sistem berjalan normal
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
