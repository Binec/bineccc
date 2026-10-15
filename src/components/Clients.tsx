import { clients } from "../data";
import { Reveal } from "./ui";
import { useLang } from "../i18n";

export default function Clients() {
  const { t } = useLang();
  return (
    <section className="px-5 py-14 md:px-10 md:py-20">
      <Reveal className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">{t.clients.label}</p>
        <div className="fade-x relative flex-1 overflow-hidden">
          <div className="animate-marquee flex w-max">
            {[0, 1].map((k) => (
              <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
                {clients.map((c) => (
                  <span
                    key={c}
                    className="px-8 font-display text-xl font-semibold tracking-tight text-ink/35 md:px-12 md:text-2xl"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
