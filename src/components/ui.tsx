import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Fade + rise when scrolled into view */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Hairline that draws itself from left to right */
export function Line({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, delay, ease }}
      className={cn("h-px w-full origin-left bg-ink/15", className)}
    />
  );
}

/** Small mono label: (01) Values */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-mono text-[11px] uppercase tracking-[0.2em] text-smoke", className)}>
      <span className="opacity-50">({index})</span>&nbsp;&nbsp;{children}
    </p>
  );
}
