import { Navigate, Outlet } from "react-router-dom";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    // Base64url → Base64 standar
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Tidak ada token sama sekali
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Cek apakah token sudah expired
  try {
    const decoded = decodeJwt(token);
    const now = Date.now() / 1000; // dalam detik

    if (decoded.exp && decoded.exp < now) {
      // Token kedaluwarsa — bersihkan storage lalu redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Token malformed / tidak bisa di-decode
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Token valid — render konten
  return children ? children : <Outlet />;
}