// src/pages/Landing.jsx
import Viewport from "../components/Viewport.jsx";
import NavBar from "../components/NavBar.jsx";
import Hero from "../components/Hero.jsx";
import Mission from "../components/Mission.jsx";
import Features from "../components/Features.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import PlatformOverview from "../components/PlatformOverview.jsx";
// import VideoPreview from "../components/VideoPreview.jsx";
import CTA from "../components/CTA.jsx";
import Footer from "../components/Footer.jsx";

export default function Landing() {
  return (
    <Viewport>
      <div className="min-h-screen bg-[#0B0F14] text-white">
        <NavBar />
        <main>
          <Hero />
          <Mission />
          <Features />
          <HowItWorks />
          <PlatformOverview />
          {/* <VideoPreview /> */}
          <CTA />
        </main>
        <Footer />
      </div>
    </Viewport>
  );
}