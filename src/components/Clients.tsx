import { useEffect, useRef } from "react";
import { Reveal } from "./ui";
import { useLang } from "../i18n";

import logoAi27 from "../assets/clients/ai27.png";
import logoCostco from "../assets/clients/costco.png";
import logoLpq from "../assets/clients/le-pain-quotidien.png";
import logoSonrics from "../assets/clients/sonrics.png";
import logoWeisser from "../assets/clients/weisser.png";
import logoUrickargo from "../assets/clients/urickargo.png";
import logoArbolitos from "../assets/clients/los-arbolitos.png";

// Orden en que aparecen. `h` = alto del logo en px (escritorio).
// PerfekBlue todavía no tiene logo: se muestra como texto (logo: undefined).
const clients: { id: string; name: string; logo?: string; h: number }[] = [
  { id: "ai27", name: "AI27", logo: logoAi27, h: 34 },
  { id: "costco", name: "Costco Wholesale", logo: logoCostco, h: 30 },
  { id: "lpq", name: "Le Pain Quotidien", logo: logoLpq, h: 50 },
  { id: "sonrics", name: "Sonric's", logo: logoSonrics, h: 46 },
  { id: "weisser", name: "Weisser TV", logo: logoWeisser, h: 20 },
  { id: "perfekblue", name: "PerfekBlue", h: 28 },
  { id: "urickargo", name: "UricKargo", logo: logoUrickargo, h: 44 },
  { id: "arbolitos", name: "Los Arbolitos de Cajeme", logo: logoArbolitos, h: 40 }, // borra esta línea si no va
];

// La banda se repite 3 veces para poder hacer un bucle infinito
// tanto al avanzar solo como cuando el usuario desliza en cualquier dirección.
const COPIES = 3;
const LOOP_SECONDS = 40; // lo que tarda en recorrer una copia completa
const RESUME_DELAY = 1500; // ms sin tocar antes de que vuelva a avanzar solo

export default function Clients() {
  const { t } = useLang();
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let pos = 0; // posición real (con decimales)
    let lastSet = 0; // último scrollLeft que puso el código
    let ready = false;
    let touching = false;
    let hovering = false;
    let pausedUntil = 0;

    const copyWidth = () => el.scrollWidth / COPIES;
    const idle = (now: number) => !touching && now >= pausedUntil;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const w = copyWidth();

      // Esperar a que carguen los logos: así el ancho de cada copia ya es el definitivo.
      if (!ready && !Array.from(el.querySelectorAll("img")).every((img) => img.complete)) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (w > 0) {
        if (!ready) {
          pos = w; // empieza en la copia del centro
          ready = true;
          el.scrollLeft = pos;
          lastSet = el.scrollLeft;
        }
        if (idle(now)) {
          if (!reduceMotion && !hovering) pos += ((w / LOOP_SECONDS) * dt) / 1000;
          // mantener la posición dentro de la copia del centro
          if (pos >= 2 * w) pos -= w;
          else if (pos < w) pos += w;
          el.scrollLeft = pos;
          lastSet = el.scrollLeft;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    // Cuando el usuario desliza (táctil, trackpad o rueda), tomamos su posición.
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - lastSet) > 1.5) {
        pos = el.scrollLeft;
        lastSet = el.scrollLeft;
        pausedUntil = performance.now() + RESUME_DELAY;
      }
    };
    const onTouchStart = () => {
      touching = true;
    };
    const onTouchEnd = () => {
      touching = false;
      pausedUntil = performance.now() + RESUME_DELAY;
    };
    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="px-5 py-14 md:px-10 md:py-20">
      <Reveal className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">{t.clients.label}</p>
        <div className="fade-x relative min-w-0 flex-1">
          <div
            ref={scroller}
            className="flex items-center overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {Array.from({ length: COPIES }, (_, k) => (
              <div key={k} aria-hidden={k !== 0} className="flex shrink-0 items-center">
                {clients.map((c) => (
                  <span key={c.id} className="flex shrink-0 items-center px-8 md:px-12">
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={k === 0 ? c.name : ""}
                        draggable={false}
                        style={{ height: c.h, width: "auto", maxWidth: "none" }}
                        className="block select-none opacity-70"
                      />
                    ) : (
                      <span className="whitespace-nowrap font-display text-xl font-semibold tracking-tight text-ink/35 md:text-2xl">
                        {c.name}
                      </span>
                    )}
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