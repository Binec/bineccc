import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { ArrowUpRight, MoveLeft, MoveRight, X } from "lucide-react";
import { type Project } from "../data";
import { useLang } from "../i18n";
import { ease } from "./ui";

const SPRING = { type: "spring", stiffness: 300, damping: 34, mass: 0.8 } as const;

function Slide({
  project: p,
  index: i,
  x,
  width,
  desc,
  services,
  current,
}: {
  project: Project;
  index: number;
  x: MotionValue<number>;
  width: number;
  desc: string;
  services: string;
  current: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const step = width || 1;
  const range: [number, number, number] = [-(i + 1) * step, -i * step, -(i - 1) * step];

  const scale = useTransform(x, range, [0.9, 1, 0.9]);
  const imgX = useTransform(x, range, [step * 0.07, 0, -step * 0.07]);
  const shade = useTransform(x, range, [0.55, 0, 0.55]);
  const captionOpacity = useTransform(x, range, [0.15, 1, 0.15]);

  return (
    <div aria-hidden={!current} className="flex h-full w-full shrink-0 flex-col px-5 md:px-10">
      <motion.div
        style={{ scale: reducedMotion ? 1 : scale }}
        className="group relative min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-white/5 md:rounded-[1.75rem]"
      >
        <motion.img
          style={{ x: reducedMotion || p.url ? 0 : imgX }}
          src={p.imgLg}
          alt={p.title}
          draggable={false}
          loading={current ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 h-full w-full ${p.url ? "object-contain p-3 md:p-6" : "scale-110 object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.16] motion-reduce:transform-none"}`}
        />
        {/* neighbours dim out as they leave the centre */}
        <motion.div aria-hidden style={{ opacity: shade }} className="absolute inset-0 bg-panel" />
      </motion.div>

      <motion.div style={{ opacity: captionOpacity }} className="mt-5 shrink-0 md:mt-7">
        <div className="flex items-end justify-between gap-6 border-t border-white/15 pt-4 md:pt-5">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {p.title}
            </h3>
            <p className="mt-2.5 max-w-md text-[13px] font-light leading-relaxed text-white/50 md:mt-4 md:text-[15px]">
              {desc}
            </p>
          </div>
          <div className="hidden shrink-0 text-right md:block">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{services}</p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-flame">{p.year ?? (p.kind === "3d" ? "BINEC / 3D" : "BINEC / UX")}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Gallery({
  projects,
  open,
  index,
  onIndex,
  onClose,
}: {
  projects: readonly Project[];
  open: boolean;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const g = t.work.gallery;
  const reducedMotion = useReducedMotion();

  const viewportRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hint, setHint] = useState(true);
  const x = useMotionValue(0);
  const indexRef = useRef(index);
  const wheelLock = useRef(false);
  indexRef.current = index;

  const total = projects.length;
  const active = projects[Math.min(index, total - 1)];
  const activeCopy = t.work.projects[active.id];
  const linkLabel = active.id === "catalogo3d" ? g.viewDemo : t.behance.viewOnBehance;
  const progress = useTransform(x, (v) => {
    const span = width * (total - 1);
    return span ? Math.min(Math.max(-v / span, 0), 1) : 0;
  });

  // lock scroll + reset hint each time the gallery opens
  useEffect(() => {
    if (!open) return;
    setHint(true);
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  // measure before paint so the first frame is already on the right slide
  useLayoutEffect(() => {
    if (!open) return;
    const el = viewportRef.current;
    if (!el) return;
    const w = el.clientWidth;
    setWidth(w);
    x.jump(-index * w);
  }, [open, x]);

  // keep position when the viewport resizes or the index changes from controls
  useEffect(() => {
    if (!open || !width) return;
    const controls = animate(x, -index * width, reducedMotion ? { duration: 0 } : SPRING);
    return () => controls.stop();
  }, [open, index, width, x, reducedMotion]);

  useEffect(() => {
    if (!open) return;
    const rail = thumbsRef.current;
    const thumb = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !thumb) return;
    rail.scrollTo({
      left: thumb.offsetLeft - rail.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [open, index, reducedMotion]);

  useEffect(() => {
    if (!open) return;
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const direction = e.key === "ArrowRight" ? 1 : -1;
        const next = Math.max(0, Math.min(indexRef.current + direction, total - 1));
        indexRef.current = next;
        onIndex(next);
      }
      if (e.key === "Tab") {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total, onClose, onIndex]);

  // desktop only: wheel / trackpad advances one project at a time
  useEffect(() => {
    if (!open) return;
    wheelLock.current = false;
    const desktop = window.matchMedia("(min-width: 768px)");
    let unlock: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (!desktop.matches || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      if (wheelLock.current) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const delta = absX > absY ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8) return;

      const next = Math.min(Math.max(indexRef.current + (delta > 0 ? 1 : -1), 0), total - 1);
      if (next === indexRef.current) return;

      wheelLock.current = true;
      indexRef.current = next;
      onIndex(next);
      unlock = setTimeout(() => {
        wheelLock.current = false;
      }, 720);
    };

    const dialog = dialogRef.current;
    dialog?.addEventListener("wheel", onWheel, { passive: false });
    return () => { dialog?.removeEventListener("wheel", onWheel); clearTimeout(unlock); };
  }, [open, total, onIndex]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setHint(false);
    if (!width) return;
    const moved = -x.get() / width;
    const flick = info.velocity.x / width;
    let target = Math.round(moved - flick * 0.22);
    target = Math.min(Math.max(target, 0), total - 1);
    onIndex(target);
    animate(x, -target * width, reducedMotion ? { duration: 0 } : SPRING);
  };

  const go = (next: number) => {
    const target = Math.min(Math.max(next, 0), total - 1);
    onIndex(target);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={g.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-0 z-[80] flex h-[100dvh] flex-col overscroll-contain bg-panel text-white"
        >
          {/* ambient wash so the overlay isn't flat black */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--color-lime) 12%, transparent), transparent 60%), radial-gradient(90% 60% at 110% 110%, color-mix(in srgb, var(--color-accent-alt) 12%, transparent), transparent 55%)",
            }}
          />

          {/* top bar */}
          <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-5 pb-4 pt-6 md:px-10 md:pb-6 md:pt-8">
            <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
              <span aria-live="polite" aria-atomic="true" className="text-flame">{pad(index + 1)}</span>
              <span className="text-white/30">
                {g.of} {pad(total)}
              </span>
              <span className="hidden text-white/45 sm:inline">
                / {activeCopy.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 md:flex">
                <button
                  onClick={() => go(index - 1)}
                  disabled={index === 0}
                  aria-label={g.prev}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-all hover:border-white hover:bg-white hover:text-panel disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  <MoveLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => go(index + 1)}
                  disabled={index === total - 1}
                  aria-label={g.next}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-all hover:border-white hover:bg-white hover:text-panel disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  <MoveRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label={g.close}
                className="group grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-all hover:border-lime hover:bg-lime hover:text-on-accent"
              >
                <X className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
              </button>
            </div>
          </header>

          {/* progress hairline */}
          <div className="relative z-10 mx-5 h-px shrink-0 bg-white/10 md:mx-10">
            <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-lime" />
          </div>

          {/* swipeable track */}
          <div ref={viewportRef} className="relative z-10 min-h-0 flex-1 overflow-hidden py-5 md:py-8">
            <motion.div
              drag="x"
              dragConstraints={width ? { left: -(total - 1) * width, right: 0 } : undefined}
              dragElastic={0.12}
              dragMomentum={false}
              dragTransition={{ power: 0.15, timeConstant: 180 }}
              onDragStart={() => setHint(false)}
              onDragEnd={onDragEnd}
              style={{ x }}
              className="flex h-full cursor-grab touch-pan-y active:cursor-grabbing"
            >
              {projects.map((p, i) => (
                <Slide
                  key={p.id}
                  project={p}
                  index={i}
                  x={x}
                  width={width}
                  desc={t.work.projects[p.id].description}
                  services={t.work.projects[p.id].services}
                  current={i === index}
                />
              ))}
            </motion.div>
          </div>

          {/* bottom bar */}
          <footer className="relative z-10 shrink-0 px-5 pb-6 md:px-10 md:pb-8">
            <div className="flex items-center justify-between gap-6">
              {/* mobile: swipe hint (until first swipe) · desktop: keyboard hint */}
              <div className="flex min-w-0 flex-1 items-center font-mono text-[11px] uppercase tracking-[0.18em] md:hidden xl:flex xl:max-w-48 xl:flex-none">
                <AnimatePresence>
                  {hint && (
                    <motion.p
                      key="swipe"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease }}
                      className="flex items-center gap-2.5 text-white/55 md:hidden"
                    >
                      <motion.span
                        animate={{ x: reducedMotion ? 0 : [0, 7, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                      >
                        ⇆
                      </motion.span>
                      {g.swipe}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="hidden text-white/35 md:block">{g.drag}</p>
              </div>

              {/* thumbnail rail */}
              <div ref={thumbsRef} className="relative hidden min-w-0 flex-1 gap-2 overflow-x-auto p-1 md:flex">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => go(i)}
                    aria-label={p.title}
                    aria-current={i === index}
                    className={`relative h-11 w-14 shrink-0 overflow-hidden rounded-md transition-all duration-500 lg:w-16 ${
                      i === index
                        ? "opacity-100 ring-1 ring-lime"
                        : "opacity-35 hover:opacity-75"
                    }`}
                  >
                    <img src={p.img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>

              <a
                href={active.url ?? "#contact"}
                target={active.url ? "_blank" : undefined}
                rel={active.url ? "noopener noreferrer" : undefined}
                aria-label={active.url ? `${linkLabel}: ${active.title}. ${t.behance.newTab}` : g.view}
                onClick={onClose}
                className="group ml-auto inline-flex shrink-0 items-center gap-2 text-[13px] md:ml-0"
              >
                <span className="relative hidden lg:inline">
                  {active.url ? linkLabel : g.view}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-lime transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-on-accent transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </a>
            </div>

            {/* mobile dots */}
            <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => go(i)}
                  aria-label={p.title}
                  aria-current={i === index}
                  className="grid h-8 min-w-6 place-items-center"
                >
                  <span className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-lime" : "w-1.5 bg-white/25"}`} />
                </button>
              ))}
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
