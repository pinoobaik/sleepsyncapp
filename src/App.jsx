import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Features from "./sections/Features";
import Benefits from "./sections/Benefits";
import Team from "./sections/Team";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Analisis from "./pages/Analisis";
import Pengaturan from "./pages/Pengaturan";

import DashboardLayout from "./pages/DashboardLayout";

function App() {
  return (
    <Routes>

      {/* ── LANDING PAGE ── */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Hero />
            <About />
            <Features />
            <Benefits />
            <Team />
            <Footer />
          </>
        }
      />

      {/* ── AUTH ── */}
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── DASHBOARD (pakai sidebar layout) ── */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/analisis"   element={<Analisis />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
      </Route>

    </Routes>
  );
}

export default App;
