import type { CSSProperties } from "react";

const RING = Array.from("BINEC • BINEC • BINEC • ");
const STEP = 360 / RING.length;

/**
 * Sphere logo with a ring of repeated "BINEC" orbiting around it.
 * Pure CSS 3D: glyphs behind the sphere are hidden by real depth sorting,
 * and a dimmed inward-facing copy keeps the back of the ring legible.
 */
export default function BinecLogo({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`binec-logo ${className}`}>
      <span className="binec-logo__tilt">
        <span className="binec-logo__sphere">
          <span className="binec-logo__shine" />
        </span>
        <span className="binec-logo__ring">
          {RING.map((char, i) => (
            <span key={`f-${i}`} className="binec-logo__glyph" style={{ "--a": `${i * STEP}deg` } as CSSProperties}>
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
          {RING.map((char, i) => (
            <span
              key={`b-${i}`}
              className="binec-logo__glyph binec-logo__glyph--back"
              style={{ "--a": `${i * STEP}deg` } as CSSProperties}
            >
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
