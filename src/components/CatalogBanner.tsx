import { ArrowUpRight } from "lucide-react";
import { CATALOG_3D_URL } from "../data";
import { useLang } from "../i18n";
import { Reveal } from "./ui";

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;

export default function CatalogBanner() {
  const { t } = useLang();
  const c = t.catalog;

  return (
    <section aria-label={c.badge} className="relative px-5 pb-24 md:px-10 md:pb-32">
      <Reveal className="mx-auto max-w-[1400px]">
        <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-white/10 bg-panel md:rounded-[2.5rem]">
          {/* ambient wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-70"
            style={{
              background:
                "radial-gradient(70% 90% at 85% 50%, color-mix(in srgb, var(--color-accent-alt) 26%, transparent), transparent 70%), radial-gradient(60% 70% at 0% 100%, color-mix(in srgb, var(--color-lime) 18%, transparent), transparent 70%)",
            }}
          />

          <div className="grid items-center gap-10 p-7 sm:p-10 md:grid-cols-12 md:gap-6 md:p-16">
            <div className="md:col-span-7">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
                {c.badge}
              </p>

              <h2 className="mt-6 font-display text-[40px] font-semibold leading-[1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {c.titleA}
                <br />
                <span className="text-flame">{c.titleB}</span>
              </h2>

              <p className="mt-6 max-w-lg text-[15px] font-light leading-relaxed text-smoke md:text-base">{c.desc}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {(c.features as readonly string[]).map((f) => (
                  <li key={f} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-smoke">
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href={CATALOG_3D_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${c.cta}. ${c.newTab}`}
                  className="group inline-flex w-fit items-center gap-4 rounded-full bg-lime py-2 pl-6 pr-2 text-sm font-medium text-on-accent transition-colors duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  <span>{c.cta}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-panel text-lime transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </a>
                <a
                  href="#contact"
                  className="group relative w-fit py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  {c.quote}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-lime transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </div>
            </div>

            {/* rotating 3D cube */}
            <div className="md:col-span-5">
              <div role="img" aria-label={c.visual} className="catalog-scene mx-auto">
                <div className="catalog-cube">
                  {FACES.map((f) => (
                    <span key={f} className={`catalog-face catalog-face--${f}`} />
                  ))}
                </div>
                <span aria-hidden className="catalog-shadow" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
