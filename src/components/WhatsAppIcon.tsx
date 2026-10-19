import { FaWhatsapp } from "react-icons/fa6";

interface WhatsAppIconProps {
  className?: string;
}

export default function WhatsAppIcon({ className = "h-4 w-4" }: WhatsAppIconProps) {
  return <FaWhatsapp className={className} aria-hidden="true" focusable="false" />;
}