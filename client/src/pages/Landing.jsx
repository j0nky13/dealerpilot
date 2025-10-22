import NavBar from "../components/NavBar.jsx";
import Hero from "../components/Hero.jsx";
import ProductVision from "../components/ProductVision.jsx";
import VideoTeaser from "../components/VideoTeaser.jsx";
import CTA from "../components/CTA.jsx";
import Footer from "../components/Footer.jsx";
import DifferentStrip from "../components/DifferentStrip.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import UsageModes from "../components/UsageModes.jsx";
import Viewport from "../components/Viewport.jsx";

export default function Landing() {
  return (
    <Viewport>
      <div className="min-h-screen">
        <NavBar />
        <main>
          <Hero />
          <DifferentStrip />
          <ProductVision />
          <HowItWorks />
          <UsageModes />
          <VideoTeaser />
          <CTA />
        </main>
        <Footer />
      </div>
    </Viewport>
  );
}