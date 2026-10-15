import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "./ui";
import { LangToggle, useLang } from "../i18n";
import { CONTACT_EMAIL } from "../data";
import BinecLogo from "./BinecLogo";

const mtyTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Monterrey",
  }).format(new Date());

export default function Header() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(mtyTime);

  const links = [
    { label: t.nav.work, href: "#work" },
    { label: t.nav.values, href: "#values" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const id = setInterval(() => setTime(mtyTime()), 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="relative mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10 md:py-7"
        >
          {/* spacer — the real logo lives in its own layer (below) so the blend mode doesn't invert its colours */}
          <span aria-hidden="true" className="block h-[84px] w-[84px] shrink-0 md:h-[108px] md:w-[108px]" />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 text-[13px] md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="group relative py-1">
                {l.label}
                <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <LangToggle />
            <span className="font-mono text-[11px] tracking-wider opacity-60">MTY {time}</span>
            <a href="#contact" className="group inline-flex items-center gap-1.5 text-[13px]">
              {t.nav.letsTalk}
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LangToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="text-[13px] font-medium"
            >
              {open ? t.nav.close : t.nav.menu}
            </button>
          </div>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[55]"
      >
        <div className="mx-auto flex max-w-[1400px] items-center px-5 py-5 md:px-10 md:py-7">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            aria-label="BINEC — Inicio"
            className="pointer-events-auto block rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <BinecLogo />
          </a>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-panel px-5 pb-10 pt-28 text-white md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {links.map((l, i) => (
                <div key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease }}
                    className="block font-display text-5xl font-semibold tracking-tight"
                  >
                    {l.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white">
                {CONTACT_EMAIL}
              </a>
              <span>MTY {time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
