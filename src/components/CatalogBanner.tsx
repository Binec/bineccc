import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Move3d } from "lucide-react";
import { CATALOG_3D_URL } from "../data";
import { useLang } from "../i18n";
import { Reveal } from "./ui";

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;
const REST_PITCH = -24;
const AUTO_SPEED = 22; // deg / second

/** Cube that auto-rotates and can be spun with mouse or finger (inertia included). */
function DraggableCube({ label, hint }: { label: string; hint: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const scene = sceneRef.current;
    const cube = cubeRef.current;
    if (!scene || !cube) return;

    let yaw = -32;
    let pitch = REST_PITCH;
    let vYaw = reduced ? 0 : AUTO_SPEED;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let raf = 0;
    let prev = performance.now();
    let visible = true;

    const apply = () => {
      cube.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      if (!dragging) {
        const target = reduced ? 0 : AUTO_SPEED;
        vYaw += (target - vYaw) * Math.min(dt * 2.2, 1); // inertia decays to idle spin
        yaw += vYaw * dt;
        pitch += (REST_PITCH - pitch) * Math.min(dt * 2.5, 1);
      }
      apply();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      scene.setPointerCapture(e.pointerId);
      hintRef.current?.classList.add("opacity-0");
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(e.timeStamp - lastT, 1) / 1000;
      yaw += dx * 0.6;
      pitch = Math.max(-80, Math.min(80, pitch - dy * 0.5));
      vYaw = Math.max(-600, Math.min(600, (dx * 0.6) / dt));
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      if (scene.hasPointerCapture(e.pointerId)) scene.releasePointerCapture(e.pointerId);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { yaw -= 20; e.preventDefault(); }
      if (e.key === "ArrowRight") { yaw += 20; e.preventDefault(); }
      if (e.key === "ArrowUp") { pitch = Math.min(80, pitch + 12); e.preventDefault(); }
      if (e.key === "ArrowDown") { pitch = Math.max(-80, pitch - 12); e.preventDefault(); }
    };

    // pause the loop when the banner is off-screen
    const io = new IntersectionObserver(([entry]) => {
      const now = entry.isIntersecting;
      if (now && !visible) { prev = performance.now(); raf = requestAnimationFrame(tick); }
      visible = now;
    });
    io.observe(scene);

    scene.addEventListener("pointerdown", down);
    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerup", up);
    scene.addEventListener("pointercancel", up);
    scene.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      scene.removeEventListener("pointerdown", down);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerup", up);
      scene.removeEventListener("pointercancel", up);
      scene.removeEventListener("keydown", onKey);
    };
  }, [reduced]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={sceneRef}
        role="img"
        aria-label={label}
        tabIndex={0}
        className="catalog-scene mx-auto cursor-grab touch-pan-y select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      >
        <div ref={cubeRef} className="catalog-cube">
          {FACES.map((f) => (
            <span key={f} className={`catalog-face catalog-face--${f}`} />
          ))}
        </div>
        <span aria-hidden className="catalog-shadow" />
      </div>
      <span
        ref={hintRef}
        aria-hidden
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke transition-opacity duration-500"
      >
        <Move3d className="h-3.5 w-3.5" strokeWidth={1.5} />
        {hint}
      </span>
    </div>
  );
}

export default function CatalogBanner() {
  const { t } = useLang();
  const c = t.catalog;

  return (
    <section aria-label={c.badge} className="relative px-4 pb-16 sm:px-5 md:px-10 md:pb-32">
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

          <div className="grid items-center gap-6 px-5 pb-8 pt-8 sm:gap-8 sm:px-8 sm:pb-10 sm:pt-10 md:grid-cols-12 md:gap-6 md:p-16">
            <div className="flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
                {c.badge}
              </p>

              <h2 className="mt-5 font-display text-[36px] font-semibold leading-[1] tracking-tight sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl">
                {c.titleA}
                <br />
                <span className="text-flame">{c.titleB}</span>
              </h2>

              <p className="mt-4 max-w-lg text-[15px] font-light leading-relaxed text-smoke md:text-base">{c.desc}</p>

              <ul className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6 md:justify-start">
                {(c.features as readonly string[]).map((f) => (
                  <li key={f} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-smoke">
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-6 md:mt-9 md:items-center">
                <a
                  href={CATALOG_3D_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${c.cta}. ${c.newTab}`}
                  className="group inline-flex w-full items-center justify-between gap-4 rounded-full bg-lime py-2 pl-6 pr-2 sm:w-fit sm:justify-start text-sm font-medium text-on-accent transition-colors duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  <span>{c.cta}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-panel text-lime transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </a>
                <a
                  href="#contact"
                  className="group relative w-fit py-2.5 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  {c.quote}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-lime transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </div>
            </div>

            {/* draggable 3D cube — first on mobile */}
            <div className="order-first md:order-none md:col-span-5">
              <DraggableCube label={c.visual} hint={c.drag} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
