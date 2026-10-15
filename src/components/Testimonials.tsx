import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionLabel, ease } from "./ui";
import { useLang } from "../i18n";

const DURATION = 7;

export default function Testimonials() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const items = t.testimonials.items as unknown as { quote: string; name: string; role: string }[];
  const total = items.length;
  const current = items[i % total];

  useEffect(() => {
    const id = setTimeout(() => setI((v) => (v + 1) % total), DURATION * 1000);
    return () => clearTimeout(id);
  }, [i, total]);

  useEffect(() => {
    setI(0);
  }, [t]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative border-t border-ink/10 bg-panel px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="04">{t.testimonials.label}</SectionLabel>
        </div>

        <div className="md:col-span-9">
          <div className="min-h-[340px] sm:min-h-[280px] md:min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease }}
              >
                <blockquote className="font-display text-[28px] font-medium leading-[1.2] tracking-tight md:text-[44px]">
                  “{current.quote}”
                </blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-4 text-sm">
                  <span className="font-medium">{current.name}</span>
                  <span className="h-px w-8 bg-ink/20" />
                  <span className="font-light text-smoke">{current.role}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-6 font-mono text-xs">
            <button
              onClick={() => setI((v) => (v - 1 + total) % total)}
              aria-label={t.testimonials.prev}
              className="text-smoke transition-colors hover:text-ink"
            >
              ←
            </button>
            <span className="tabular-nums">
              {pad(i + 1)} <span className="text-smoke">/ {pad(total)}</span>
            </span>
            <button
              onClick={() => setI((v) => (v + 1) % total)}
              aria-label={t.testimonials.next}
              className="text-smoke transition-colors hover:text-ink"
            >
              →
            </button>
            <div className="relative h-px flex-1 overflow-hidden bg-ink/10">
              <motion.div
                key={`${i}-${t.testimonials.label}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DURATION, ease: "linear" }}
                className="absolute inset-0 origin-left bg-ink"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
