import { useState, useRef } from "react";
import antPhoto from "../assets/ant.jpeg";
import donnzPhoto from "../assets/donnz.jpg";
import adinaPhoto from "../assets/adinaconie.jpeg";
import ariellaPhoto from "../assets/ariella.jpeg";
import naswaPhoto from "../assets/naswa.jpeg";
import samsiPhoto from "../assets/samsi.jpeg";

const team = [
  {
    name: "Ananta Ramadhan Putra F",
    role: "Web Developer",
    university: "Politeknik Negeri Jember",
    faculty: "Teknologi Informasi",
    photo: antPhoto,
    initials: "AR",
    bg: "linear-gradient(135deg, #e6faf4, #a7f0d6)",
    avatarBg: "linear-gradient(135deg, #2dd4a0, #1ab88a)",
    border: "#2dd4a0",
    tagBg: "#e6faf4",
    tagColor: "#0d9f6e",
    github: "https://github.com/anantaramadhan",
    linkedin: "https://www.linkedin.com/in/ananta-ramadhan-827141362/",
    email: "mailto:anantaramadhan00@gmail.com",
  },
  {
    name: "Doni Hermawan",
    role: "Web Developer",
    university: "Politeknik Negeri Jember",
    faculty: "Teknologi Informasi",
    photo: donnzPhoto,
    initials: "DH",
    bg: "linear-gradient(135deg, #e6faf4, #a7f0d6)",
    avatarBg: "linear-gradient(135deg, #2dd4a0, #1ab88a)",
    border: "#2dd4a0",
    tagBg: "#e6faf4",
    tagColor: "#0d9f6e",
    github: "https://github.com/Donnz9",
    linkedin: "https://www.linkedin.com/in/doni-hermawan-225b66325/",
    email: "mailto:donihermawwan@gmail.com",
  },
  {
    name: "Adina Connie",
    role: "Data Scientist",
    university: "Universitas Tarumanagara",
    faculty: "Sistem Informasi",
    photo: adinaPhoto,
    initials: "AC",
    bg: "linear-gradient(135deg, #eff6ff, #bfdbfe)",
    avatarBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    border: "#3b82f6",
    tagBg: "#eff6ff",
    tagColor: "#1d4ed8",
    github: "https://github.com/adsplendid88",
    linkedin: "www.linkedin.com/in/adina-connie-559566390",
    email: "mailto:adina.825230062@stu.untar.ac.id",
  },
  {
    name: "Nasywa Putri Palensia W",
    role: "Data Scientist",
    university: "Universitas Airlangga",
    faculty: "Matematika",
    photo: naswaPhoto,
    initials: "NPP",
    bg: "linear-gradient(135deg, #eff6ff, #bfdbfe)",
    avatarBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    border: "#3b82f6",
    tagBg: "#eff6ff",
    tagColor: "#1d4ed8",
    github: "#",
    linkedin: "https://www.linkedin.com/in/nasywa-putri-palensia-winarta-355b1b287?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "mailto:palensia.2005@gmail.com",
  },
  {
    name: "Syamsi Alpiansyah",
    role: "AI Engineer",
    university: "Universitas Teknologi Bandung",
    faculty: "Teknik Informatika",
    photo: samsiPhoto,
    initials: "SA",
    bg: "linear-gradient(135deg, #fff7ed, #fed7aa)",
    avatarBg: "linear-gradient(135deg, #f97316, #c2410c)",
    border: "#f97316",
    tagBg: "#fff7ed",
    tagColor: "#c2410c",
    github: "https://github.com/syamsithirdteen",
    linkedin: "https://www.linkedin.com/in/syamsi-alpiansyah-4ba3a4411",
    email: "mailto:syamsi.study@gmail.com",
  },
  {
    name: "Ariella Asti Cahyani",
    role: "AI Engineer",
    university: "Universitas Bina Nusantara",
    faculty: "School of Computer Science",
    photo: ariellaPhoto,
    initials: "AAC",
    bg: "linear-gradient(135deg, #fff7ed, #fed7aa)",
    avatarBg: "linear-gradient(135deg, #f97316, #c2410c)",
    border: "#f97316",
    tagBg: "#fff7ed",
    tagColor: "#c2410c",
    github: "https://github.com/ariellaacahyani",
    linkedin: "https://www.linkedin.com/in/ariella-asti-cahyani/",
    email: "mailto:ariellacahyani@gmail.com",
  },
];

const VISIBLE = 4;

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const UniversityIcon = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

export default function Team() {
  const [liked, setLiked] = useState({});
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragDelta = useRef(0);

  const maxIndex = team.length - VISIBLE; // 6 - 4 = 2
  const dots = Array.from({ length: maxIndex + 1 });

  const goTo = (idx) => setCurrent(Math.max(0, Math.min(idx, maxIndex)));
  const toggleLike = (i) => setLiked((prev) => ({ ...prev, [i]: !prev[i] }));

  // ── Mouse drag ──────────────────────────────────────────────
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    dragDelta.current = 0;
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    dragDelta.current = e.clientX - startX.current;
    setDragOffset(dragDelta.current);
  };
  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragDelta.current < -80) goTo(current + 1);
    else if (dragDelta.current > 80) goTo(current - 1);
    setDragOffset(0);
    dragDelta.current = 0;
  };

  // ── Touch drag ──────────────────────────────────────────────
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    dragDelta.current = 0;
  };
  const onTouchMove = (e) => {
    dragDelta.current = e.touches[0].clientX - startX.current;
    setDragOffset(dragDelta.current);
  };
  const onTouchEnd = () => {
    if (dragDelta.current < -60) goTo(current + 1);
    else if (dragDelta.current > 60) goTo(current - 1);
    setDragOffset(0);
    dragDelta.current = 0;
  };

  // translateX = posisi snap + offset drag sementara
  const snapX = current === 0 ? 0 : current; // pakai calc di style
  const isSnapping = dragOffset === 0;

  return (
    <>
      <style>{`
        .team {
          padding: 100px 48px;
          background: linear-gradient(160deg, #fff9f5 0%, #fff5f0 50%, #f5fff9 100%);
          position: relative;
          overflow: hidden;
        }
        .team::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(45,212,160,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .team-inner { max-width: 1160px; margin: 0 auto; position: relative; }
        .team-header { text-align: center; margin-bottom: 64px; }
        .team-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: #0f2d2a;
          margin-bottom: 14px;
        }
        .team-subtitle {
          font-size: 1rem; color: #64748b;
          max-width: 480px; margin: 0 auto; line-height: 1.75;
        }

        /* ── Carousel ── */
        .team-carousel { position: relative; }
        .team-track-outer {
          overflow: hidden;
          border-radius: 12px;
          cursor: grab;
          user-select: none;
        }
        .team-track-outer:active { cursor: grabbing; }
        .team-track {
          display: flex;
          gap: 24px;
          will-change: transform;
        }
        .team-track.snapping {
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .team-card {
          flex: 0 0 calc((100% - 72px) / 4);
          background: white;
          border-radius: 24px;
          overflow: hidden;
          border: 1.5px solid;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          pointer-events: none; /* evita conflicto con drag */
        }
        .team-track-outer:not(:active) .team-card {
          pointer-events: auto;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
        }
        .team-track-outer:not(:active) .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 24px 56px rgba(0,0,0,0.10);
        }

        /* ── Dots only ── */
        .team-nav {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }
        .team-dots { display: flex; gap: 8px; align-items: center; }
        .dot {
          height: 8px; border-radius: 4px;
          background: #e2e8f0;
          transition: all 0.3s;
          cursor: pointer;
          width: 8px;
          border: none; padding: 0;
        }
        .dot.active { background: #2dd4a0; width: 28px; }
        .dot:hover:not(.active) { background: #a7f0d6; }

        /* ── Card internals ── */
        .team-card-top { padding: 14px 14px 0; display: flex; justify-content: space-between; align-items: flex-start; }
        .team-role-tag { font-size: 0.7rem; font-weight: 700; padding: 5px 13px; border-radius: 50px; letter-spacing: 0.05em; }
        .team-like-btn {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; cursor: pointer; transition: all 0.25s;
          background: white; color: #94a3b8; line-height: 1;
          pointer-events: auto;
        }
        .team-like-btn.liked { border-color: #f43f5e; color: #f43f5e; background: #fff0f5; }
        .team-like-btn:hover { border-color: #f43f5e; color: #f43f5e; background: #fff0f5; }
        .team-photo-wrap {
          margin: 14px; border-radius: 18px; height: 190px;
          overflow: hidden; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .team-photo { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        .team-avatar-fallback { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
        .avatar-circle {
          width: 80px; height: 80px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-family: 'DM Serif Display', serif;
          font-size: 1.8rem; letter-spacing: 1px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15); position: relative; z-index: 1;
        }
        .avatar-ring {
          position: absolute; width: 96px; height: 96px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          animation: ring-pulse 2.5s ease-in-out infinite;
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        .team-info { padding: 18px 18px 20px; flex: 1; display: flex; flex-direction: column; }
        .team-name { font-family: 'DM Serif Display', serif; font-size: 1.05rem; color: #0f2d2a; margin-bottom: 3px; line-height: 1.25; }
        .team-role-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; margin-bottom: 10px; }
        .team-university {
          display: flex; align-items: flex-start; gap: 7px;
          background: #f8fafb; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 8px 10px; margin-bottom: 14px;
        }
        .univ-icon { color: #2dd4a0; flex-shrink: 0; margin-top: 1px; }
        .univ-name { font-size: 0.78rem; font-weight: 600; color: #334155; display: block; line-height: 1.3; }
        .univ-faculty { font-size: 0.7rem; color: #94a3b8; display: block; margin-top: 1px; }
        .team-divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin-bottom: 12px; }
        .team-socials { display: flex; gap: 8px; margin-top: auto; }
        .social-btn {
          width: 32px; height: 32px; border-radius: 9px;
          border: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; text-decoration: none;
          transition: all 0.2s; background: white;
          pointer-events: auto;
        }
        .social-btn:hover { border-color: #2dd4a0; color: #2dd4a0; background: #e6faf4; transform: translateY(-2px); }

        /* ── Responsive ── */
        @media (max-width: 1000px) {
          .team-card { flex: 0 0 calc((100% - 24px) / 2); }
        }
        @media (max-width: 600px) {
          .team { padding: 80px 20px; }
          .team-card { flex: 0 0 calc((100% - 14px) / 2); }
          .team-photo-wrap { height: 150px; }
        }
        @media (max-width: 420px) {
          .team-card { flex: 0 0 100%; }
        }
      `}</style>

      <section className="team" id="our-team">
        <div className="team-inner">
          <div className="team-header">
            <h2 className="team-title">Our Teams</h2>
            <p className="team-subtitle">
              Tim kami terdiri dari para profesional berdedikasi yang
              bersemangat menghadirkan inovasi terbaik untuk kesehatan tidur
              Anda.
            </p>
          </div>

          <div className="team-carousel">
            <div
              className="team-track-outer"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className={`team-track${isSnapping ? " snapping" : ""}`}
                style={{
                  transform: `translateX(calc(${snapX} * -1 * ((100% - 72px) / 4 + 24px) + ${dragOffset}px))`,
                }}
              >
                {team.map((member, i) => (
                  <div
                    key={i}
                    className="team-card"
                    style={{ borderColor: member.border + "30" }}
                  >
                    <div className="team-card-top">
                      <span className="team-role-tag" style={{ background: member.tagBg, color: member.tagColor }}>
                        {member.role}
                      </span>
                    </div>

                    <div className="team-photo-wrap" style={{ background: member.bg }}>
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="team-photo" />
                      ) : (
                        <div className="team-avatar-fallback">
                          <div className="avatar-ring" style={{ borderColor: member.border + "60" }} />
                          <div className="avatar-circle" style={{ background: member.avatarBg }}>
                            {member.initials}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="team-info">
                      <div className="team-name">{member.name}</div>
                      <div className="team-role-label">{member.role}</div>
                      <div className="team-university">
                        <span className="univ-icon"><UniversityIcon /></span>
                        <div>
                          <span className="univ-name">{member.university}</span>
                          <span className="univ-faculty">{member.faculty}</span>
                        </div>
                      </div>
                      <div className="team-divider" />
                      <div className="team-socials">
                        <a href={member.github} className="social-btn" title="GitHub" target="_blank" rel="noreferrer"><GithubIcon /></a>
                        <a href={member.linkedin} className="social-btn" title="LinkedIn" target="_blank" rel="noreferrer"><LinkedinIcon /></a>
                        <a href={member.email} className="social-btn" title="Email" rel="noreferrer"><MailIcon /></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots only */}
            <div className="team-nav">
              <div className="team-dots">
                {dots.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${current === idx ? "active" : ""}`}
                    onClick={() => goTo(idx)}
                    aria-label={`Ke posisi ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}