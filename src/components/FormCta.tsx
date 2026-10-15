import { ArrowDown } from "lucide-react";
import { Reveal } from "./ui";

type FormCtaProps = {
  /** Short supporting line shown next to the button. */
  text: string;
  /** Button label. */
  label: string;
  className?: string;
};

/**
 * Inline call-to-action that scrolls to the contact form.
 * Reuses the landing's primary pill button pattern.
 */
export default function FormCta({ text, label, className = "" }: FormCtaProps) {
  return (
    <Reveal delay={0.1} className={className}>
      <div className="flex flex-col gap-5 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-[15px] font-light leading-relaxed text-smoke">{text}</p>
        <a
          href="#contact"
          className="group inline-flex w-fit shrink-0 items-center gap-4 rounded-full bg-lime py-2 pl-6 pr-2 text-sm font-medium text-on-accent transition-colors duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
        >
          <span>{label}</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-panel text-lime transition-transform duration-500 group-hover:translate-y-0.5">
            <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </a>
      </div>
    </Reveal>
  );
}
