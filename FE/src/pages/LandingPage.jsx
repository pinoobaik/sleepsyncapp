import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Benefits from "../components/Benefits";
import Team from "../components/Team";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --mint: #2dd4a0;
          --mint-light: #e6faf4;
          --mint-mid: #a7f0d6;
          --navy: #0f2d2a;
          --white: #ffffff;
          --gray: #64748b;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          background: white;
        }
      `}</style>

      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Benefits />
        <Team />
      </main>
      <Footer />
    </>
  );
}
