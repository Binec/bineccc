import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  behanceProjects,
  BEHANCE_URL,
  BEHANCE_HANDLE,
  WHATSAPP_URL_ES,
  WHATSAPP_URL_EN,
  type BehanceProject,
} from "../data";
import { useLang } from "../i18n";
import { Reveal, SectionLabel, ease } from "./ui";
import WhatsAppIcon from "./WhatsAppIcon";

function BehanceIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.74 10.15c.67-.28 1.1-.88 1.1-1.74 0-1.42-1.04-2.26-2.8-2.26H2v11.7h4.35c1.9 0 3.03-.9 3.03-2.54 0-1.02-.6-1.78-1.64-2.06zm-3.6-2.5h1.75c.92 0 1.48.37 1.48 1.13 0 .8-.56 1.16-1.48 1.16H4.14V7.65zm1.9 6.8H4.14v-2.67h1.9c1.07 0 1.66.42 1.66 1.34 0 .9-.6 1.33-1.66 1.33zm11.23-2.5c-.17-1.3-.98-2.07-2.3-2.07-1.44 0-2.3 1-2.4 2.07h4.7zm-4.7 1.25c.1 1.2.98 1.98 2.45 1.98 1.07 0 1.83-.45 2.14-1.28h2.02c-.44 1.8-1.95 2.76-4.16 2.76-2.73 0-4.52-1.78-4.52-4.52 0-2.67 1.8-4.52 4.45-4.52 2.74 0 4.4 1.77 4.4 4.52v1.06h-6.78zM14 6.7h4.15v1.2H14V6.7z" />
    </svg>
  );
}

function BehanceCover({ project }: { project: BehanceProject }) {
  const [failed, setFailed] = useState(false);
  const { t } = useLang();

  return (
    <span className="relative block aspect-[404/316] w-full overflow-hidden rounded-2xl bg-surface">
      {failed ? (
        <span className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-smoke">
          <BehanceIcon className="h-8 w-8" />
          <span className="max-w-[220px] text-xs leading-relaxed">{t.behance.previewUnavailable}</span>
        </span>
      ) : (
        <img
          src={project.img}
          alt={project.title}
          width={404}
          height={316}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute bottom-4 right-4 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-lime text-on-accent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
      </span>
    </span>
  );
}

export default function BehanceGallery() {
  const { t, lang } = useLang();
  const b = t.behance;
  const whatsappUrl = lang === "es" ? WHATSAPP_URL_ES : WHATSAPP_URL_EN;

  return (
    <section id="behance" className="relative border-t border-ink/10 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-14 grid gap-10 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-3">
            <SectionLabel index="05">{b.label}</SectionLabel>
          </div>

          <div className="flex flex-col gap-6 md:col-span-9 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <h2 className="font-display text-[44px] font-semibold leading-[1] tracking-tight md:text-7xl">
                {b.titleA}
                <br />
                <span className="text-ink">
                  {b.titleB}
                </span>
              </h2>
              <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-smoke">
                {b.desc}
              </p>
            </Reveal>

            {/* Direct Behance Profile Pill */}
            <Reveal delay={0.15}>
              <a
                href={BEHANCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-ink/15 bg-surface py-2.5 pl-4 pr-3 text-sm font-medium transition-all duration-300 hover:border-ink hover:shadow-lg hover:shadow-ink/5"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-panel text-white transition-colors duration-300 group-hover:bg-lime group-hover:text-on-accent">
                  <BehanceIcon className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-xs tracking-wider">{BEHANCE_HANDLE}</span>
                <span className="sr-only">{b.newTab}</span>
                <ArrowUpRight
                  className="h-4 w-4 text-smoke transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  strokeWidth={1.75}
                />
              </a>
            </Reveal>
          </div>
        </div>

        {/* Desktop: 4 projects (2nd Behance row). Mobile: first 3 only. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {behanceProjects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }}
              className={`relative min-w-0 ${i >= 3 ? "hidden sm:block" : ""}`}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title}: ${b.viewOnBehance}. ${b.newTab}.`}
                className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <BehanceCover project={project} />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink decoration-lime decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-smoke transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="mt-2 text-xs text-smoke">{b.viewOnBehance}</p>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Bottom Banner with Form CTA & WhatsApp alternative */}
        <Reveal delay={0.2} className="mt-16 md:mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-surface p-6 sm:p-8 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
                  <span>{b.ctaBadge}</span>
                </div>
                <h4 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {b.ctaHeadline}
                </h4>
                <div className="mt-3 flex items-center gap-2 text-xs text-smoke">
                  <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-smoke/40 decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-lime"
                  >
                    {b.orWhatsapp} (+52 55 3331 3935)
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-4 rounded-full bg-lime py-2 pl-6 pr-2 text-sm font-medium text-on-accent transition-colors duration-300 hover:brightness-110"
                >
                  <span>{b.fillForm}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-panel text-lime transition-transform duration-500 group-hover:translate-y-0.5">
                    <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
