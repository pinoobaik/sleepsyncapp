import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import "./pages.css";

const navItems = [
  { path: "/dashboard", icon: "🏠", label: "Dashboard" },
  { path: "/analisis", icon: "📊", label: "Analisis" },
  { path: "/pengaturan", icon: "⚙️", label: "Pengaturan" },
];

const breadcrumbMap = {
  "/dashboard": "Dashboard",
  "/analisis": "Analisis Tidur",
  "/pengaturan": "Pengaturan",
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState({ nama: "", profile_picture: null });

  const location = useLocation();
  const navigate = useNavigate();

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error(
        "Gagal mengambil profil:",
        error.response?.data || error.message
      );
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getProfileImage = () => {
    if (!user?.profile_picture) return null;
    if (user.profile_picture.startsWith("http")) return user.profile_picture;
    return `http://localhost:5000/uploads/${user.profile_picture}`;
  };

  const handleKembaliKeBeranda = () => {
    setShowConfirm(true);
    closeSidebar();
  };

  const handleConfirmKembali = () => {
    setShowConfirm(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dl-root">
      {/* Modal Konfirmasi */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Kembali ke Beranda?"
        message="Anda akan meninggalkan halaman dashboard. Apakah Anda yakin ingin kembali ke beranda?"
        onConfirm={handleConfirmKembali}
        onCancel={() => setShowConfirm(false)}
      />

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`dl-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dl-logo">
          <span className="dl-logo-icon">🌙</span>
          <span className="dl-logo-text">SleepSync</span>
        </div>

        <nav className="dl-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `dl-nav-item ${isActive ? "active" : ""}`
              }
              onClick={closeSidebar}
            >
              <span className="dl-nav-icon">{item.icon}</span>
              <span className="dl-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dl-divider" />

        <button className="dl-nav-item danger" onClick={handleKembaliKeBeranda}>
          <span className="dl-nav-icon">🚪</span>
          <span className="dl-nav-label">Kembali ke Beranda</span>
        </button>
      </aside>

      {sidebarOpen && <div className="dl-overlay" onClick={closeSidebar} />}

      {/* ══════════ MAIN ══════════ */}
      <div className="dl-main">
        <header className="dl-topbar">
          <button
            className="dl-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Buka menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className="dl-topbar-logo">
            <span>🌙</span>
            <span>SleepSync</span>
          </div>

          <div className="dl-breadcrumb">
            <span>SleepSync</span>
            <span className="dl-breadcrumb-sep">›</span>
            <span className="dl-breadcrumb-current">
              {breadcrumbMap[location.pathname] ?? "Halaman"}
            </span>
          </div>

          <div className="dl-topbar-right">
            <div className="dl-topbar-score">
              <span>Halo, {user?.nama || "Pengguna"}</span>
            </div>
            <div className="dl-topbar-avatar">
              {user?.profile_picture ? (
                <img
                  src={getProfileImage()}
                  alt={user.nama}
                  className="dl-avatar-image"
                />
              ) : (
                getInitials(user?.nama)
              )}
            </div>
          </div>
        </header>

        <main className="dl-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
