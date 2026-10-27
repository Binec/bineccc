import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

const dict = {
  en: {
    nav: { work: "Work", values: "Values", services: "Services", contact: "Contact", letsTalk: "Let's talk", menu: "Menu", close: "Close" },
    hero: {
      eyebrow: "Digital studio — Design & UX first",
      l1: "We design",
      l2: "digital experiences",
      people: "people",
      words: ["feel.", "love.", "trust.", "remember."],
      desc: "BINEC is a digital studio where design and user experience aren't services — they're our values.",
      cta: "Start a project",
      cities: "Monterrey — Remote",
      stats: "120+ projects",
      scroll: "Scroll",
    },
    clients: { label: "Trusted by" },
    manifesto: {
      label: "Our values",
      statement:
        "We believe great design is invisible. It's the calm feeling of things just working. Design and user experience aren't services we sell — they're the values behind every decision we make.",
      items: [
        { title: "Design is respect", text: "Every pixel is a promise. Removing friction and clarifying choices is how we respect people's time, attention and intelligence." },
        { title: "Experience over decoration", text: "Pretty doesn't convert — clear does. We design journeys, not screens, and test them with real people until they feel invisible." },
        { title: "Less, but better", text: "We delete more than we add. One strong idea, executed with care, beats ten features nobody asked for." },
      ],
    },
    studio: { left: "Design is respect — 01", right: "BINEC", alt: "BINEC coaster illustration" },
    catalog: {
      badge: "New · 3D Catalog",
      titleA: "Your products,",
      titleB: "in 3D.",
      desc: "3D Catalog / E-commerce: 360° views, interactive details and product sheets so your customers can explore before they buy.",
      features: ["360° view", "Interactive details", "Product sheets"],
      cta: "View live demo",
      quote: "Quote yours",
      newTab: "Opens in a new tab",
      visual: "Interactive 3D cube illustrating the 3D catalog. Drag or use arrow keys to rotate it.",
      drag: "Drag to rotate",
    },
    ctas: {
      valuesText: "Share these values? Tell us about your project and let's build it together.",
      valuesLabel: "Contact us and get a quote",
      servicesText: "Not sure which service you need? Describe your challenge and we'll suggest the right approach.",
      servicesLabel: "Contact us and get a quote",
    },
    work: {
      label: "Selected work",
      titleA: "Work that",
      titleB: "worked.",
      desc: "Digital experiences, characters and ideas with another dimension.",
      open: "Open project",
      filters: { label: "Filter projects", all: "All", threeD: "3D", digital: "Web / UX" },
      projects: {
        catalogo3d: { category: "3D", services: "3D / E-commerce", description: "A 3D product catalog with 360° views, interactive details and product sheets. Try the live demo." },
        binec3d: { category: "3D", services: "3D / Visual identity", description: "BINEC's identity explored in three dimensions. View the original project and its full imagery on Behance." },
        modeling3d: { category: "3D", services: "Modeling / Animation", description: "A selection of BINEC's 3D modeling and animation work. Explore the complete project on Behance." },
        nobody3d: { category: "3D", services: "Character / 3D design", description: "Nobody, a character from BINEC's portfolio. Discover its shapes, details and personality in the original project." },
        uxui: { category: "Web / UX", services: "UX / UI design", description: "A UX and UI design project from BINEC's portfolio. See the complete case study and interface details on Behance." },
        uxai: { category: "Web / UX", services: "UX / Artificial intelligence", description: "An exploration of user experience design for AI-powered products. See the complete project on Behance." },
        rolando: { category: "Digital", services: "Digital design", description: "Rolando por el poniente, a project from BINEC's portfolio. Explore its images and full presentation on Behance." },
      },
      gallery: {
        title: "Project gallery",
        close: "Close gallery",
        prev: "Previous project",
        next: "Next project",
        swipe: "Swipe to explore",
        drag: "Scroll, drag or use ← →",
        view: "Start a project like this",
        viewDemo: "View live demo",
        of: "of",
      },
    },
    services: {
      label: "Services",
      titleA: "Everything you need.",
      titleB: "Nothing you don't.",
      items: [
        { title: "Brand Identity", text: "Identity systems — voice, type, colour and motion — that make you unmistakable in a feed full of sameness.", tags: ["Strategy", "Naming", "Visual identity", "Guidelines"] },
        { title: "Web Design", text: "Fast, accessible marketing sites that turn visitors into believers. Designed and built with obsessive care.", tags: ["UX & UI", "Development", "CMS", "SEO"] },
        { title: "Product UX/UI", text: "Complex products made effortless. Research, flows, prototypes and design systems your team will love.", tags: ["Research", "Prototyping", "Design systems", "Testing"] },
        { title: "Motion & Interaction", text: "The small moments that make a product feel alive — micro-interactions, transitions and scroll stories.", tags: ["Interaction", "Prototypes", "Lottie", "3D"] },
      ],
    },
    testimonials: {
      label: "Kind words",
      prev: "Previous testimonial",
      next: "Next testimonial",
      items: [
        { quote: "BINEC didn't just redesign our product — they changed how our users feel about money. Conversion up 142% in sixty days.", name: "Sarah Kim", role: "CPO, Lumina Finance" },
        { quote: "They push back in the best way. Every challenge made the product better — our rating went from 3.8 to 4.9.", name: "Marcus Webb", role: "Founder, Ora Health" },
        { quote: "Like adding a world-class design team overnight. Fast, honest, and obsessed with details we didn't know existed.", name: "Elena Rossi", role: "CMO, Vela Mode" },
      ],
    },
    behance: {
      label: "Behance Archive",
      titleA: "More work on",
      titleB: "Behance.",
      desc: "Four selected projects published on BINEC's Behance profile. Discover the complete work behind each cover.",
      urlText: "behance.net/binec",
      badge: "4 published projects",
      viewOnBehance: "View on Behance",
      ctaBadge: "Start your project",
      ctaHeadline: "Have a project in mind? Complete the brief and we'll reply within 24 hours.",
      fillForm: "Fill out the form",
      orWhatsapp: "or message on WhatsApp",
      newTab: "Opens in a new tab",
      previewUnavailable: "Preview unavailable. View the project on Behance.",
    },
    whatsapp: {
      label: "WhatsApp",
      chatPrompt: "Chat on WhatsApp",
      directChat: "Direct chat on WhatsApp",
      fastReply: "Direct reply",
    },
    contact: {
      label: "Contact",
      titleA: "Tell us about your project",
      subtitle: "Four quick fields. We reply within one business day — with honest thoughts, not a sales pitch.",
      name: "Your name",
      namePh: "Ada Lovelace",
      email: "Email",
      emailPh: "ada@company.com",
      interested: "I'm interested in",
      options: ["Website", "Product UX/UI", "Branding", "Something else"],
      message: "Tell us a little about it",
      messagePh: "What are you building, who is it for, and what does success look like?",
      noSpam: "No spam. Just a human reply.",
      send: "Send message",
      sending: "Sending…",
      errName: "Please add your name",
      errEmail: "Please add a valid email",
      errMsg: "A sentence or two helps us (10+ characters)",
      thanks: "Thank you",
      successA: "Your message is with our design leads. Expect a personal reply at",
      successB: "within one business day.",
      topic: "Topic",
      another: "Send another message",
    },
    footer: {
      desc: "A digital studio where design and user experience are the values — and the product.",
      studio: "Studio",
      social: "Social",
      offices: "Offices",
      rights: "© 2026 BINEC Studio",
      made: "Designed with care, not templates.",
      top: "Back to top ↑",
    },
  },
  es: {
    nav: { work: "Proyectos", values: "Valores", services: "Servicios", contact: "Contacto", letsTalk: "Hablemos", menu: "Menú", close: "Cerrar" },
    hero: {
      eyebrow: "Estudio digital — Diseño & UX primero",
      l1: "Diseñamos",
      l2: "experiencias digitales",
      people: "que la gente",
      words: ["siente.", "ama.", "recuerda.", "confía."],
      desc: "BINEC es un estudio digital donde el diseño y la experiencia de usuario no son servicios — son nuestros valores.",
      cta: "Empezar un proyecto",
      cities: "Monterrey — Remoto",
      stats: "+120 proyectos",
      scroll: "Desliza",
    },
    clients: { label: "Confían en nosotros" },
    manifesto: {
      label: "Nuestros valores",
      statement:
        "Creemos que el gran diseño es invisible. Es la calma de que las cosas simplemente funcionan. El diseño y la experiencia de usuario no son servicios que vendemos — son los valores detrás de cada decisión que tomamos.",
      items: [
        { title: "Diseñar es respetar", text: "Cada píxel es una promesa. Eliminar fricción y clarificar decisiones es como respetamos el tiempo, la atención y la inteligencia de las personas." },
        { title: "Experiencia antes que decoración", text: "Lo bonito no convierte — lo claro sí. Diseñamos recorridos, no pantallas, y los probamos con personas reales hasta que se sienten invisibles." },
        { title: "Menos, pero mejor", text: "Borramos más de lo que añadimos. Una gran idea, ejecutada con cuidado, supera a diez funciones que nadie pidió." },
      ],
    },
    studio: { left: "Diseñar es respetar — 01", right: "BINEC", alt: "Ilustración BINEC coaster" },
    catalog: {
      badge: "Nuevo · Catálogo 3D",
      titleA: "Tus productos,",
      titleB: "en 3D.",
      desc: "Catálogo 3D / E-commerce: vistas 360°, detalles interactivos y fichas de producto para que tus clientes exploren antes de comprar.",
      features: ["Vista 360°", "Detalles interactivos", "Fichas de producto"],
      cta: "Ver demo en vivo",
      quote: "Cotiza el tuyo",
      newTab: "Se abre en una nueva pestaña",
      visual: "Cubo 3D interactivo que ilustra el catálogo 3D. Arrástralo o usa las flechas para girarlo.",
      drag: "Arrastra para girar",
    },
    ctas: {
      valuesText: "¿Compartes estos valores? Cuéntanos tu proyecto y construyámoslo juntos.",
      valuesLabel: "Contáctanos y cotiza tu proyecto",
      servicesText: "¿No sabes qué servicio necesitas? Descríbenos tu reto y te proponemos el enfoque adecuado.",
      servicesLabel: "Contáctanos y cotiza tu proyecto",
    },
    work: {
      label: "Proyectos destacados",
      titleA: "Trabajo que",
      titleB: "funcionó.",
      desc: "Experiencias digitales, personajes e ideas con otra dimensión.",
      open: "Abrir proyecto",
      filters: { label: "Filtrar proyectos", all: "Todos", threeD: "3D", digital: "Web / UX" },
      projects: {
        catalogo3d: { category: "3D", services: "3D / E-commerce", description: "Un catálogo 3D de productos con vistas 360°, detalles interactivos y fichas de producto. Prueba la demo en vivo." },
        binec3d: { category: "3D", services: "3D / Identidad visual", description: "La identidad de BINEC explorada en tres dimensiones. Descubre las imágenes y el proyecto original completo en Behance." },
        modeling3d: { category: "3D", services: "Modelado / Animación", description: "Una selección del trabajo de modelado y animación 3D de BINEC. Explora el proyecto completo en Behance." },
        nobody3d: { category: "3D", services: "Personaje / Diseño 3D", description: "Nobody, un personaje del portafolio de BINEC. Conoce sus formas, detalles y personalidad en el proyecto original." },
        uxui: { category: "Web / UX", services: "Diseño UX / UI", description: "Un proyecto de diseño UX y UI del portafolio de BINEC. Consulta el caso completo y los detalles de la interfaz en Behance." },
        uxai: { category: "Web / UX", services: "UX / Inteligencia artificial", description: "Una exploración de diseño de experiencia de usuario para productos con inteligencia artificial. Consulta el proyecto completo en Behance." },
        rolando: { category: "Digital", services: "Diseño digital", description: "Rolando por el poniente, un proyecto del portafolio de BINEC. Explora sus imágenes y la presentación completa en Behance." },
      },
      gallery: {
        title: "Galería de proyectos",
        close: "Cerrar galería",
        prev: "Proyecto anterior",
        next: "Proyecto siguiente",
        swipe: "Desliza para explorar",
        drag: "Desplaza, arrastra o usa ← →",
        view: "Empezar un proyecto así",
        viewDemo: "Ver demo en vivo",
        of: "de",
      },
    },
    services: {
      label: "Servicios",
      titleA: "Todo lo que necesitas.",
      titleB: "Nada que no.",
      items: [
        { title: "Identidad de marca", text: "Sistemas de identidad — voz, tipografía, color y movimiento — que te hacen inconfundible en un feed lleno de clones.", tags: ["Estrategia", "Naming", "Identidad visual", "Guías"] },
        { title: "Diseño web", text: "Webs rápidas y accesibles que convierten visitas en creyentes. Diseñadas y construidas con cuidado obsesivo.", tags: ["UX & UI", "Desarrollo", "CMS", "SEO"] },
        { title: "Producto UX/UI", text: "Productos complejos hechos simples. Investigación, flujos, prototipos y sistemas de diseño que tu equipo amará.", tags: ["Investigación", "Prototipado", "Sistemas", "Testing"] },
        { title: "Movimiento e interacción", text: "Los pequeños momentos que hacen que un producto se sienta vivo — micro-interacciones, transiciones e historias.", tags: ["Interacción", "Prototipos", "Lottie", "3D"] },
      ],
    },
    testimonials: {
      label: "Lo que dicen",
      prev: "Testimonio anterior",
      next: "Testimonio siguiente",
      items: [
        { quote: "BINEC no solo rediseñó nuestro producto — cambió cómo nuestros usuarios se sienten con el dinero. Conversión +142% en sesenta días.", name: "Sarah Kim", role: "CPO, Lumina Finance" },
        { quote: "Te llevan la contraria de la mejor forma. Cada reto mejoró el producto — pasamos de 3.8 a 4.9 de valoración.", name: "Marcus Webb", role: "Fundador, Ora Health" },
        { quote: "Como sumar un equipo de diseño de clase mundial de la noche a la mañana. Rápidos, honestos y obsesivos con el detalle.", name: "Elena Rossi", role: "CMO, Vela Mode" },
      ],
    },
    behance: {
      label: "Archivo Behance",
      titleA: "Más proyectos en",
      titleB: "Behance.",
      desc: "Cuatro proyectos publicados en el perfil de BINEC. Descubre el trabajo completo detrás de cada portada.",
      urlText: "behance.net/binec",
      badge: "4 proyectos publicados",
      viewOnBehance: "Ver en Behance",
      ctaBadge: "Inicia tu proyecto",
      ctaHeadline: "¿Tienes un proyecto en mente? Llena el formulario y te respondemos en 24 horas.",
      fillForm: "Llenar formulario",
      orWhatsapp: "o escríbenos por WhatsApp",
      newTab: "Se abre en una nueva pestaña",
      previewUnavailable: "Vista previa no disponible. Consulta el proyecto en Behance.",
    },
    whatsapp: {
      label: "WhatsApp",
      chatPrompt: "Escribir por WhatsApp",
      directChat: "Chat directo por WhatsApp",
      fastReply: "Respuesta directa",
    },
    contact: {
      label: "Contacto",
      titleA: "Cuéntanos tu proyecto",
      subtitle: "Cuatro campos rápidos. Respondemos en un día laborable — con ideas honestas, no un discurso de ventas.",
      address: "Av. Constitución 1000, Monterrey",
      name: "Tu nombre",
      namePh: "Ada Lovelace",
      email: "Email",
      emailPh: "ada@empresa.com",
      interested: "Me interesa",
      options: ["Web", "Producto UX/UI", "Branding", "Otra cosa"],
      message: "Cuéntanos un poco más",
      messagePh: "¿Qué estás construyendo, para quién es y cómo se ve el éxito?",
      noSpam: "Sin spam. Solo una respuesta humana.",
      send: "Enviar mensaje",
      sending: "Enviando…",
      errName: "Añade tu nombre",
      errEmail: "Añade un email válido",
      errMsg: "Una frase o dos nos ayuda (10+ caracteres)",
      thanks: "Gracias",
      successA: "Tu mensaje ya está con el equipo de diseño. Espera una respuesta personal en",
      successB: "en un día laborable.",
      topic: "Tema",
      another: "Enviar otro mensaje",
    },
    footer: {
      desc: "Un estudio digital donde el diseño y la experiencia de usuario son los valores — y el producto.",
      studio: "Estudio",
      social: "Social",
      rights: "© 2026 BINEC Studio",
      made: "Diseñado con cuidado, sin plantillas.",
      top: "Volver arriba ↑",
    },
  },
} as const;

type Dict = (typeof dict)["en"];

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };

const Ctx = createContext<LangCtx>({ lang: "es", setLang: () => {}, t: dict.es as unknown as Dict });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "es"
        ? "BINEC® — Estudio digital | Diseño & UX primero"
        : "BINEC® — Digital Design Studio | Design & UX First";
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] as unknown as Dict }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const btn = (l: Lang) =>
    `rounded-full px-2.5 py-1 transition-all duration-300 ${
      lang === l ? "bg-white text-black" : "text-white/60 hover:text-white"
    }`;
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/25 p-0.5 font-mono text-[11px] ${className}`}
      role="group"
      aria-label="Language / Idioma"
    >
      <button onClick={() => setLang("es")} aria-pressed={lang === "es"} className={btn("es")}>
        ES
      </button>
      <button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={btn("en")}>
        EN
      </button>
    </div>
  );
}



