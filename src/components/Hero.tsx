import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ease } from "./ui";
import { useLang } from "../i18n";

// Amigos latinos compartiendo contenido en el celular — Ali Alcántara (MX), Pexels
const HERO_VIDEO_HD =
  "https://videos.pexels.com/video-files/17811918/17811918-hd_1920_1080_24fps.mp4";
const HERO_VIDEO_UHD =
  "https://videos.pexels.com/video-files/17811918/17811918-uhd_3840_2160_24fps.mp4";
const HERO_POSTER =
  "https://images.pexels.com/videos/17811918/amigos-celular-iphone-scrolling-17811918.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920";

function MaskLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [src, setSrc] = useState(HERO_VIDEO_HD);
  const [reduceMotion, setReduceMotion] = useState(false);
  const words = t.hero.words as unknown as string[];

  useEffect(() => {
    const id = setInterval(() => setIndex((v) => (v + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    setIndex(0);
  }, [t]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden rounded-b-[2rem] bg-panel px-5 pb-8 pt-32 text-white md:rounded-b-[3rem] md:px-10 md:pt-44"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {reduceMotion ? (
          <img src={HERO_POSTER} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            key={src}
            className="hero-video absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER}
            preload="auto"
            onError={() => {
              if (src !== HERO_VIDEO_UHD) setSrc(HERO_VIDEO_UHD);
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-panel/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-panel/70 via-panel/20 to-panel/75" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 md:mb-12"
        >
          {t.hero.eyebrow}
        </motion.p>

        <h1 className="font-display text-[11vw] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[7vw] 2xl:text-[104px]">
          <MaskLine delay={0.15}>{t.hero.l1}</MaskLine>
          <MaskLine delay={0.25}>{t.hero.l2}</MaskLine>
          <MaskLine delay={0.35}>
            <span className="flex flex-wrap gap-x-[0.25em]">
              <span>{t.hero.people}</span>
              <span className="relative inline-grid overflow-hidden text-lime">
                {words.map((w) => (
                  <span key={w} aria-hidden className="invisible col-start-1 row-start-1">
                    {w}
                  </span>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={words[index]}
                    className="col-start-1 row-start-1"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.55, ease }}
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </MaskLine>
        </h1>
      </div>

      <div className="relative z-10 mx-auto mt-16 w-full max-w-[1400px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease }}
            className="max-w-md text-base font-light leading-relaxed text-white/60 md:col-span-6 md:text-lg"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease }}
            className="flex md:col-span-6 md:justify-end"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-4 rounded-full bg-lime py-2 pl-6 pr-2 text-sm font-medium text-on-accent transition-colors duration-300 hover:brightness-110"
            >
              {t.hero.cta}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-panel text-lime transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 flex items-center justify-between gap-4 border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/45"
        >
          <span className="hidden sm:block">{t.hero.cities}</span>
          <span className="hidden lg:block">{t.hero.stats}</span>
          <a href="#values" className="flex items-center gap-2 transition-colors hover:text-white">
            {t.hero.scroll}
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
