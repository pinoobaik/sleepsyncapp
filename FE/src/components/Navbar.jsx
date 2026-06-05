import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "About", "Feature", "Benefits", "Our Team"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --mint: #2dd4a0;
          --mint-light: #e6faf4;
          --mint-mid: #a7f0d6;
          --navy: #0f2d2a;
          --white: #ffffff;
          --gray: #64748b;
          --gray-light: #f8fafb;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 0 48px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid ${scrolled ? 'rgba(45,212,160,0.15)' : 'transparent'};
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: ${scrolled ? '0 4px 24px rgba(45,212,160,0.08)' : 'none'};
        }

        .logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: var(--mint);
          letter-spacing: -0.5px;
          text-decoration: none;
        }

        .logo span {
          color: var(--navy);
        }

        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }

        .nav-links a {
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray);
          position: relative;
          padding-bottom: 4px;
          transition: color 0.2s;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: var(--mint);
          border-radius: 2px;
          transition: width 0.25s ease;
        }

        .nav-links a:hover { color: var(--mint); }
        .nav-links a:hover::after { width: 100%; }
        .nav-links a.active { color: var(--mint); }
        .nav-links a.active::after { width: 100%; }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          border: none;
          background: none;
        }

        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--navy);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15,45,42,0.35);
          backdrop-filter: blur(2px);
          z-index: 998;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar-overlay.open {
          opacity: 1;
        }

        /* Sidebar */
        .sidebar {
          display: none;
          position: fixed;
          top: 0; right: 0;
          width: 280px;
          height: 100vh;
          background: var(--white);
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 80px 32px 40px;
          box-shadow: -8px 0 40px rgba(45,212,160,0.12);
          border-left: 1px solid var(--mint-light);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem;
          color: var(--mint);
          position: absolute;
          top: 28px; left: 32px;
        }

        .sidebar-close {
          position: absolute;
          top: 24px; right: 24px;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--mint-mid);
          background: var(--mint-light);
          color: var(--mint);
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .sidebar-close:hover {
          background: var(--mint-mid);
        }

        .sidebar-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-links li a {
          display: block;
          padding: 14px 16px;
          font-size: 1rem;
          font-weight: 500;
          color: var(--navy);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }

        .sidebar-links li a:hover,
        .sidebar-links li a.active {
          background: var(--mint-light);
          color: var(--mint);
          padding-left: 22px;
        }

        .sidebar-divider {
          height: 1px;
          background: linear-gradient(to right, var(--mint-mid), transparent);
          margin: 20px 0;
          border-radius: 1px;
        }

        .sidebar-cta {
          display: block;
          margin-top: 16px;
          padding: 14px 24px;
          background: linear-gradient(135deg, var(--mint), #1ab88a);
          color: white;
          text-align: center;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(45,212,160,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .sidebar-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(45,212,160,0.4);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 20px;
          }

          .nav-links {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .sidebar,
          .sidebar-overlay {
            display: block;
          }
        }
      `}</style>

      <nav className="navbar">
        <a href="#home" className="logo">Sleep<span>Sync</span></a>

        <ul className="nav-links">
          {navLinks.map((link, i) => (
            <li key={i}>
              <a href={`#${link.toLowerCase().replace(" ", "-")}`} className={i === 0 ? "active" : ""}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <span className="sidebar-logo">SleepSync</span>
        <button className="sidebar-close" onClick={() => setMenuOpen(false)}>✕</button>

        <ul className="sidebar-links">
          {navLinks.map((link, i) => (
            <li key={i}>
              <a
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className={i === 0 ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="sidebar-divider" />
        <a href="#home" className="sidebar-cta" onClick={() => setMenuOpen(false)}>
          Mulai Analisis →
        </a>
      </aside>
    </>
  );
}
