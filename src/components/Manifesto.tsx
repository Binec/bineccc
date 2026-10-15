import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Line, Reveal, SectionLabel } from "./ui";
import { useLang } from "../i18n";
import FormCta from "./FormCta";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

export default function Manifesto() {
  const { t } = useLang();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = (t.manifesto.statement as string).split(" ");

  return (
    <section id="values" className="relative px-5 pt-20 md:px-10 md:pt-32">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="01">{t.manifesto.label}</SectionLabel>
        </div>
        <p
          ref={ref}
          className="font-display text-[30px] font-medium leading-[1.18] tracking-tight md:col-span-9 md:text-5xl lg:text-[56px]"
        >
          {words.map((w, i) => {
            const start = i / words.length;
            return (
              <Word key={`${t.manifesto.label}-${i}`} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
                {w}
              </Word>
            );
          })}
        </p>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1400px] gap-14 md:mt-36 md:grid-cols-3 md:gap-8">
        {(t.manifesto.items as unknown as { title: string; text: string }[]).map((v, i) => (
          <Reveal key={v.title} delay={i * 0.1} className="group">
            <div className="relative">
              <Line delay={i * 0.1} />
              <span className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-out group-hover:scale-x-100" />
            </div>
            <span className="mt-5 block font-mono text-xs text-smoke">0{i + 1}</span>
            <h3 className="mt-10 font-display text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1 md:text-[28px]">
              {v.title}
            </h3>
            <p className="mt-4 max-w-sm text-[15px] font-light leading-relaxed text-smoke">{v.text}</p>
          </Reveal>
        ))}
      </div>

      <FormCta
        text={t.ctas.valuesText}
        label={t.ctas.valuesLabel}
        className="mx-auto mt-20 max-w-[1400px] md:mt-28"
      />
    </section>
  );
}
