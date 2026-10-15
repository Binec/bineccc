import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { projects } from "../data";
import { Reveal, SectionLabel, ease } from "./ui";
import { useLang } from "../i18n";
import Gallery from "./Gallery";

type WorkFilter = "all" | "3d" | "digital";

export default function Work() {
  const { t } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const visibleProjects = useMemo(
    () => filter === "all" ? projects : projects.filter((project) => project.kind === filter),
    [filter],
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  const onMove = (e: MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  const onEnter = (e: MouseEvent) => {
    x.jump(e.clientX);
    y.jump(e.clientY);
    sx.jump(e.clientX);
    sy.jump(e.clientY);
  };

  const openAt = (i: number) => {
    setActive(null);
    setSelectedIndex(i);
    setLightboxOpen(true);
  };
  const closeGallery = useCallback(() => setLightboxOpen(false), []);
  const filters: { id: WorkFilter; label: string }[] = [
    { id: "all", label: t.work.filters.all },
    { id: "3d", label: t.work.filters.threeD },
    { id: "digital", label: t.work.filters.digital },
  ];

  return (
    <section id="work" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 grid gap-10 md:mb-16 md:grid-cols-12">
          <div className="md:col-span-3">
            <SectionLabel index="02">{t.work.label}</SectionLabel>
          </div>
          <Reveal className="flex flex-col gap-6 md:col-span-9 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[44px] font-semibold leading-[1] tracking-tight md:text-7xl">
              {t.work.titleA}
              <br />
              {t.work.titleB}
            </h2>
            <p className="max-w-xs text-[15px] font-light leading-relaxed text-smoke">{t.work.desc}</p>
          </Reveal>
        </div>

        <div role="group" aria-label={t.work.filters.label} className="mb-7 flex items-center gap-7">
          {filters.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={filter === option.id}
              aria-controls="featured-project-list"
              onClick={() => {
                setFilter(option.id);
                setActive(null);
                setSelectedIndex(0);
              }}
              className={`relative min-h-11 px-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${filter === option.id ? "text-ink" : "text-smoke hover:text-ink"}`}
            >
              {option.label}
              {filter === option.id && <motion.span layoutId="work-filter" className="absolute inset-x-0 bottom-0 h-0.5 bg-lime" transition={{ duration: reducedMotion ? 0 : 0.25 }} />}
            </button>
          ))}
        </div>

        <ul
          id="featured-project-list"
          onMouseEnter={onEnter}
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          className="border-t border-ink/15"
        >
          {visibleProjects.map((p, i) => {
            const dimmed = active !== null && active !== i;
            const copy = t.work.projects[p.id];
            return (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.05, ease }}
                onMouseEnter={() => { if (!lightboxOpen) setActive(i); }}
                className="border-b border-ink/15"
              >
                <button
                  type="button"
                  onClick={() => openAt(i)}
                  aria-label={`${t.work.open}: ${p.title}`}
                  aria-haspopup="dialog"
                  className="group grid w-full grid-cols-12 items-center gap-3 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:gap-4 md:py-9"
                >
                  <span className="col-span-1 font-mono text-xs text-smoke">{String(i + 1).padStart(2, "0")}</span>

                  <span
                    className={`col-span-7 flex min-w-0 items-center gap-6 transition-all duration-500 ease-out group-hover:translate-x-2 md:col-span-6 ${
                      dimmed ? "md:opacity-25" : ""
                    }`}
                  >
                    {p.url && (
                      <span className="hidden w-24 shrink-0 overflow-hidden rounded-lg lg:block">
                        <img src={p.img} alt="" loading="lazy" width={96} height={76} className="aspect-[404/316] w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transform-none" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-[42px]">
                        {p.title}
                      </span>
                      <span className="mt-2 block text-xs text-smoke md:hidden">{copy.services}</span>
                    </span>
                  </span>

                  <span
                    className={`hidden text-sm font-light text-smoke transition-opacity duration-500 md:col-span-3 md:block ${
                      dimmed ? "opacity-25" : ""
                    }`}
                  >
                    {copy.services}
                  </span>

                  <span className="col-span-4 flex items-center justify-end gap-4 md:col-span-2">
                    <span className={`hidden font-mono text-xs sm:inline ${p.url ? "text-flame" : "text-smoke"}`}>{p.year ?? (p.kind === "3d" ? "3D" : "UX")}</span>

                    {/* mobile: tappable thumbnail */}
                    <span className="relative block overflow-hidden rounded-md md:hidden">
                      <img
                        src={p.img}
                        alt=""
                        loading="lazy"
                        className="h-14 w-18 object-cover transition-transform duration-700 ease-out group-active:scale-110"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-panel/55 opacity-100 transition-opacity duration-300 md:opacity-0">
                        <Maximize2 className="h-4 w-4 text-white" strokeWidth={1.5} />
                      </span>
                    </span>

                    <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:border-panel group-hover:bg-panel group-hover:text-lime md:grid">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* cursor-following preview (desktop) */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      >
        <motion.div
          style={{ x: "-50%", y: "-50%" }}
          initial={false}
          animate={{ scale: active !== null && !lightboxOpen ? 1 : 0.96, opacity: active !== null && !lightboxOpen ? 1 : 0 }}
          transition={{ duration: 0.45, ease }}
          className="relative h-[250px] w-[340px] overflow-hidden rounded-2xl bg-panel"
        >
          {visibleProjects.map((p, i) => (
            <img
              key={p.id}
              src={p.img}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            />
          ))}
        </motion.div>
      </motion.div>

      <Gallery
        projects={visibleProjects}
        open={lightboxOpen}
        index={selectedIndex}
        onIndex={setSelectedIndex}
        onClose={closeGallery}
      />
    </section>
  );
}
