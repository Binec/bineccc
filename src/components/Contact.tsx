import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { SectionLabel, ease } from "./ui";
import { useLang } from "../i18n";
import {
  BEHANCE_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL_ES,
  WHATSAPP_URL_EN,
} from "../data";
import WhatsAppIcon from "./WhatsAppIcon";

type FormState = { name: string; email: string; service: string; message: string };
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const MAX = 400;

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
  autoComplete,
  maxLength,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
  maxLength?: number;
}) {
  const box = `w-full rounded-2xl border bg-white/[0.04] px-5 py-4 text-[15px] font-light text-white placeholder:text-white/30 transition-all duration-300 ${
    error
      ? "border-flame/80 focus:border-flame"
      : "border-white/15 hover:border-white/30 focus:border-lime focus:bg-white/[0.06]"
  }`;

  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-[13px] font-medium text-white/75">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${box} min-h-[132px] resize-y leading-relaxed`}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={box}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 overflow-hidden pt-2 text-[13px] text-flame"
          >
            <CircleAlert className="h-3.5 w-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const { t, lang } = useLang();
  const [form, setForm] = useState<FormState>({ name: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  // keep default service in sync with language (first option)
  const options = t.contact.options as unknown as string[];
  const currentService = form.service || options[0];

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = t.contact.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = t.contact.errEmail;
    if (form.message.trim().length < 10) e.message = t.contact.errMsg;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
  };

  const reset = () => {
    setForm({ name: "", email: "", service: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  const firstName = form.name.trim().split(" ")[0];

  return (
    <section
      id="contact"
      className="relative rounded-t-[2rem] bg-panel px-5 pt-24 text-white md:rounded-t-[3rem] md:px-10 md:pt-36"
    >
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-5"
        >
          <SectionLabel index="06" className="text-white/45">
            {t.contact.label}
          </SectionLabel>
          <h2 className="mt-10 font-display text-[44px] font-semibold leading-[1] tracking-tight md:text-7xl">
            {t.contact.titleA}<span className="text-lime">.</span>
          </h2>
          <p className="mt-8 max-w-sm text-[15px] font-light leading-relaxed text-white/55">{t.contact.subtitle}</p>
          <div className="mt-12 space-y-3 text-sm">
            <div>
              <a href="mailto:hola@bineccc.com" className="group relative inline-block">
                hola@bineccc.com
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right bg-lime transition-transform duration-500 group-hover:scale-x-0" />
              </a>
            </div>
            <div>
              <a
                href={lang === "es" ? WHATSAPP_URL_ES : WHATSAPP_URL_EN}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                </span>
                <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
                <span className="text-xs text-smoke transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-6 lg:col-start-7">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className="flex min-h-[520px] flex-col justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-8 md:p-10"
              >
                <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden>
                  <motion.circle
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                    stroke="var(--color-lime)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease }}
                  />
                  <motion.path
                    d="M16 27 l7 7 l14 -15"
                    fill="none"
                    stroke="var(--color-lime)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7, ease }}
                  />
                </svg>
                <h3 className="mt-10 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                  {t.contact.thanks}, {firstName}.
                </h3>
                <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-white/55">
                  {t.contact.successA} <span className="text-white">{form.email}</span> {t.contact.successB}
                </p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                  {t.contact.topic} — {currentService}
                </p>
                <button
                  onClick={reset}
                  className="mt-12 w-fit rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition-colors hover:border-lime hover:text-white"
                >
                  {t.contact.another}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key={`form-${lang}`}
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease }}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8 md:p-10"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field
                    id="name"
                    label={t.contact.name}
                    placeholder={t.contact.namePh}
                    autoComplete="name"
                    value={form.name}
                    onChange={(v) => update("name", v)}
                    error={errors.name}
                  />
                  <Field
                    id="email"
                    type="email"
                    label={t.contact.email}
                    placeholder={t.contact.emailPh}
                    autoComplete="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    error={errors.email}
                  />
                </div>

                <div className="mt-7">
                  <p className="mb-3 text-[13px] font-medium text-white/75">{t.contact.interested}</p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((s) => {
                      const on = currentService === s;
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => update("service", s)}
                          aria-pressed={on}
                          className={`relative rounded-full border px-4 py-2.5 text-[13px] transition-colors duration-300 ${
                            on
                              ? "border-white bg-white text-panel"
                              : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                          }`}
                        >
                          {on && (
                            <motion.span
                              layoutId="service-pill"
                              className="absolute inset-0 rounded-full bg-white"
                              transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                          )}
                          <span className="relative">{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7">
                  <Field
                    id="message"
                    label={t.contact.message}
                    placeholder={t.contact.messagePh}
                    textarea
                    maxLength={MAX}
                    value={form.message}
                    onChange={(v) => update("message", v)}
                    error={errors.message}
                  />
                  <div className="mt-2 flex justify-end">
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        form.message.length >= 10 ? "text-lime/80" : "text-white/35"
                      }`}
                    >
                      {form.message.length}/{MAX}
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-light text-white/40">{t.contact.noSpam}</p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex w-full items-center justify-between gap-4 rounded-2xl bg-lime py-2 pl-6 pr-2 text-sm font-medium text-on-accent transition-colors duration-300 hover:brightness-110 disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:min-w-[220px]"
                  >
                    {status === "sending" ? t.contact.sending : t.contact.send}
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-panel text-lime">
                      {status === "sending" ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-lime border-t-transparent" />
                      ) : (
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45"
                          strokeWidth={1.75}
                        />
                      )}
                    </span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const { t, lang } = useLang();
  const studioLinks =
    lang === "es"
      ? [
          ["Proyectos", "#work"],
          ["Valores", "#values"],
          ["Servicios", "#services"],
          ["Contacto", "#contact"],
        ]
      : [
          ["Work", "#work"],
          ["Values", "#values"],
          ["Services", "#services"],
          ["Contact", "#contact"],
        ];

  const whatsappUrl = lang === "es" ? WHATSAPP_URL_ES : WHATSAPP_URL_EN;

  const cols = [
    { title: t.footer.studio, links: studioLinks },
    {
      title: t.footer.social,
      links: [
        ["WhatsApp ↗", whatsappUrl],
        ["Behance ↗", BEHANCE_URL],
        ["Instagram", "#top"],
        ["LinkedIn", "#top"],
      ],
    },
  ];

  return (
    <footer className="mx-auto mt-32 max-w-[1400px] md:mt-48">
      <div className="grid gap-12 border-t border-white/10 pt-10 text-sm sm:grid-cols-2 md:grid-cols-12">
        <p className="max-w-xs font-light leading-relaxed text-white/50 md:col-span-6">{t.footer.desc}</p>
        {cols.map((c) => (
          <div key={c.title} className="md:col-span-2">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">{c.title}</p>
            <ul className="space-y-2">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-white/70 transition-colors hover:text-lime"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20 overflow-hidden md:mt-28">
        <motion.p
          aria-hidden
          initial={{ y: "100%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease }}
          className="select-none pb-1 text-center font-display text-[length:min(22vw,330px)] font-semibold leading-[0.85] tracking-[-0.04em] text-white"
        >
          BINEC<span className="text-lime">.</span>
        </motion.p>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs font-light text-white/40 sm:flex-row sm:justify-between">
        <span>{t.footer.rights}</span>
        <span>{t.footer.made}</span>
        <a href="#top" className="transition-colors hover:text-white">
          {t.footer.top}
        </a>
      </div>
    </footer>
  );
}
