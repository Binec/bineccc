import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { LanguageProvider } from "./i18n";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Manifesto from "./components/Manifesto";
import ImageReveal from "./components/ImageReveal";
import CatalogBanner from "./components/CatalogBanner";
import Work from "./components/Work";
import { Services } from "./components/Services";
import Testimonials from "./components/Testimonials";
import BehanceGallery from "./components/BehanceGallery";
import Contact from "./components/Contact";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

export default function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-bone text-ink">
          <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-white mix-blend-difference"
          />
          <Header />
          <main>
            <Hero />
            <Clients />
            <Manifesto />
            <ImageReveal />
            <CatalogBanner />
            <Work />
            <Services />
            <Testimonials />
            <BehanceGallery />
          </main>
          <Contact />
          <FloatingWhatsApp />
        </div>
      </MotionConfig>
    </LanguageProvider>
  );
}
