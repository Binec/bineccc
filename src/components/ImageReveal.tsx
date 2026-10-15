import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { studioImage, studioImageFallback } from "../data";
import { useLang } from "../i18n";

export default function ImageReveal() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [src, setSrc] = useState(studioImage);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.86, 1]);

  return (
    <section ref={ref} className="relative px-5 py-24 md:px-10 md:py-36">
      <motion.div
        style={{ scale }}
        className="isolate mx-auto aspect-[2336/1465] max-w-[1400px] overflow-hidden rounded-[1.5rem] bg-surface md:rounded-[2.5rem]"
      >
        <img
          src={src}
          alt={t.studio.alt}
          onError={() => {
            if (src !== studioImageFallback) setSrc(studioImageFallback);
          }}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain object-center"
        />
      </motion.div>
      <div className="mx-auto mt-5 flex max-w-[1400px] justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
        <span>{t.studio.left}</span>
        <span>{t.studio.right}</span>
      </div>
    </section>
  );
}
