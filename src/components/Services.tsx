import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionLabel, ease } from "./ui";
import { useLang } from "../i18n";
import FormCta from "./FormCta";

type Svc = { title: string; text: string; tags: string[] };

export function Services() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  const items = t.services.items as unknown as Svc[];

  return (
    <section id="services" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="03">{t.services.label}</SectionLabel>
        </div>

        <div className="md:col-span-9">
          <Reveal>
            <h2 className="font-display text-[44px] font-semibold leading-[1] tracking-tight md:text-7xl">
              {t.services.titleA}
              <br />
              <span className="text-ink/25">{t.services.titleB}</span>
            </h2>
          </Reveal>

          <div className="mt-16 border-t border-ink/15 md:mt-24">
            {items.map((s, i) => {
              const isOpen = open === i;
              return (
                <div key={s.title} className="border-b border-ink/15">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-6 py-7 text-left md:py-9"
                  >
                    <span className="w-8 font-mono text-xs text-smoke">0{i + 1}</span>
                    <span className="flex-1 font-display text-2xl font-semibold tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-4xl">
                      {s.title}
                    </span>
                    <span className="relative h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-full bg-ink" />
                      <motion.span
                        animate={{ rotate: isOpen ? 0 : 90 }}
                        transition={{ duration: 0.45, ease }}
                        className="absolute left-0 top-1/2 h-px w-full bg-ink"
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-9 pl-14 md:grid-cols-2">
                          <p className="max-w-md text-[15px] font-light leading-relaxed text-smoke">{s.text}</p>
                          <p className="font-mono text-[11px] uppercase leading-loose tracking-[0.15em] text-ink/70">
                            {(s.tags as unknown as string[]).join("  /  ")}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <FormCta
            text={t.ctas.servicesText}
            label={t.ctas.servicesLabel}
            className="mt-14 md:mt-16"
          />
        </div>
      </div>
    </section>
  );
}


