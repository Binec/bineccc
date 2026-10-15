import { motion } from "framer-motion";
import { WHATSAPP_URL_ES, WHATSAPP_URL_EN } from "../data";
import { useLang } from "../i18n";
import WhatsAppIcon from "./WhatsAppIcon";

export default function FloatingWhatsApp() {
  const { t, lang } = useLang();
  const whatsappUrl = lang === "es" ? WHATSAPP_URL_ES : WHATSAPP_URL_EN;

  return (
    <motion.aside
      aria-label={t.whatsapp.label}
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 right-5 z-[55] md:bottom-8 md:right-8"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t.whatsapp.directChat}: 55 3331 3935. ${t.behance.newTab}`}
        className="group inline-flex items-center gap-4 rounded-full bg-lime py-2 pl-6 pr-2 text-sm font-medium text-on-accent shadow-xl shadow-black/25 transition-all duration-300 hover:brightness-110 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
      >
        <span className="flex flex-col text-left leading-tight">
          <span>{t.whatsapp.chatPrompt}</span>
          <span className="font-mono text-[10px] leading-tight opacity-75">55 3331 3935</span>
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-panel text-lime transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
          <WhatsAppIcon className="h-5 w-5" />
        </span>
      </a>
    </motion.aside>
  );
}
