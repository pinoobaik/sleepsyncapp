import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Analisis from "./pages/Analisis";
import Pengaturan from "./pages/Pengaturan";
import DashboardLayout from "./pages/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

function App() {
  return (
    <Routes>
      {/* LANDING PAGE */}
      <Route path="/" element={<LandingPage />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* DASHBOARD — hanya bisa diakses jika sudah login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;