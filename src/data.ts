import studioShot from "./assets/rollercoaster.jpg";

/** Cover images published on BINEC's Behance profile (404px thumb, 808px large). */
const bh = (file: string, size: 404 | 808 = 404) =>
  `https://mir-s3-cdn-cf.behance.net/projects/${size}/${file}`;

export type ProjectId = "binec3d" | "modeling3d" | "nobody3d" | "uxui" | "uxai" | "rolando";

export type Project = {
  id: ProjectId;
  title: string;
  kind: "digital" | "3d";
  year?: string;
  img: string;
  imgLg: string;
  url?: string;
};

export const projects: Project[] = [
  {
    id: "binec3d",
    title: "BINEC 3D",
    kind: "3d",
    img: bh("00489651974341.Y3JvcCw0MDUsMzE3LDIxNywyNg.png"),
    imgLg: bh("00489651974341.Y3JvcCw0MDUsMzE3LDIxNywyNg.png"),
    url: "https://www.behance.net/gallery/51974341/BINEC-3D",
  },
  {
    id: "modeling3d",
    title: "Modelado y animación 3D",
    kind: "3d",
    img: bh("b7c80670147769.Y3JvcCwxMzgwLDEwODAsMjAxLDA.jpg"),
    imgLg: bh("b7c80670147769.Y3JvcCwxMzgwLDEwODAsMjAxLDA.jpg", 808),
    url: "https://www.behance.net/gallery/70147769/Modelado-y-animacion-3D",
  },
  {
    id: "nobody3d",
    title: "Personaje Nobody",
    kind: "3d",
    img: bh("c21c5e69320395.Y3JvcCw4NjIsNjc1LDI5Miww.jpg"),
    imgLg: bh("c21c5e69320395.Y3JvcCw4NjIsNjc1LDI5Miww.jpg", 808),
    url: "https://www.behance.net/gallery/69320395/Personaje-Nobody",
  },
  {
    id: "uxui",
    title: "UX - UI",
    kind: "digital",
    img: bh("30d82d127795965.Y3JvcCw4NzksNjg3LDAsMzc1Mw.jpg"),
    imgLg: bh("30d82d127795965.Y3JvcCw4NzksNjg3LDAsMzc1Mw.jpg", 808),
    url: "https://www.behance.net/gallery/127795965/UX-UI",
  },
  {
    id: "uxai",
    title: "ux ai",
    kind: "digital",
    img: bh("f84b89243632817.Y3JvcCwxODkwLDE0NzgsMCwyMTU.png"),
    imgLg: bh("f84b89243632817.Y3JvcCwxODkwLDE0NzgsMCwyMTU.png", 808),
    url: "https://www.behance.net/gallery/243632817/ux-ai",
  },
  {
    id: "rolando",
    title: "Rolando por el poniente",
    kind: "digital",
    img: bh("8d70c1153620301.Y3JvcCw5ODksNzczLDAsMTEy.jpg"),
    imgLg: bh("8d70c1153620301.Y3JvcCw5ODksNzczLDAsMTEy.jpg", 808),
    url: "https://www.behance.net/gallery/153620301/Rolando-por-el-poniente",
  },
];

// Image supplied by the client (GitHub raw). Falls back to a bundled local copy if it fails to load.
export const studioImage =
  "https://github.com/Binec/landing-clientes/blob/main/public/assets/bineccoaster.png?raw=true";
export const studioImageFallback = studioShot;

export const clients = ["Lumina", "Atlas°", "Vela Mode", "Ora Health", "Nook", "Field & Co", "Novapay", "Kinfolk"];

export const values = [
  {
    n: "01",
    title: "Design is respect",
    text: "Every pixel is a promise. Removing friction and clarifying choices is how we respect people's time, attention and intelligence.",
  },
  {
    n: "02",
    title: "Experience over decoration",
    text: "Pretty doesn't convert — clear does. We design journeys, not screens, and test them with real people until they feel invisible.",
  },
  {
    n: "03",
    title: "Less, but better",
    text: "We delete more than we add. One strong idea, executed with care, beats ten features nobody asked for.",
  },
];

export const services = [
  {
    title: "Brand Identity",
    text: "Identity systems — voice, type, colour and motion — that make you unmistakable in a feed full of sameness.",
    items: ["Strategy", "Naming", "Visual identity", "Guidelines"],
  },
  {
    title: "Web Design",
    text: "Fast, accessible marketing sites that turn visitors into believers. Designed and built with obsessive care.",
    items: ["UX & UI", "Development", "CMS", "SEO"],
  },
  {
    title: "Product UX/UI",
    text: "Complex products made effortless. Research, flows, prototypes and design systems your team will love.",
    items: ["Research", "Prototyping", "Design systems", "Testing"],
  },
  {
    title: "Motion & Interaction",
    text: "The small moments that make a product feel alive — micro-interactions, transitions and scroll stories.",
    items: ["Interaction", "Prototypes", "Lottie", "3D"],
  },
];

export const testimonials = [
  {
    quote: "BINEC didn't just redesign our product — they changed how our users feel about money. Conversion up 142% in sixty days.",
    name: "Sarah Kim",
    role: "CPO, Lumina Finance",
  },
  {
    quote: "They push back in the best way. Every challenge made the product better — our rating went from 3.8 to 4.9.",
    name: "Marcus Webb",
    role: "Founder, Ora Health",
  },
  {
    quote: "Like adding a world-class design team overnight. Fast, honest, and obsessed with details we didn't know existed.",
    name: "Elena Rossi",
    role: "CMO, Vela Mode",
  },
];

export type BehanceProject = {
  id: string;
  title: string;
  img: string;
  url: string;
};

export const BEHANCE_URL = "https://www.behance.net/binec";
export const BEHANCE_HANDLE = "behance.net/binec";

/** Single contact email used across the landing page. */
export const CONTACT_EMAIL = "hola@bineccc.com";

export const WHATSAPP_PHONE = "5533313935";
export const WHATSAPP_PHONE_INTL = "5215533313935";
export const WHATSAPP_DISPLAY = "55 3331 3935";
export const WHATSAPP_DEFAULT_MSG_ES = "Hola BINEC, quiero cotizar un proyecto de diseño / UX.";
export const WHATSAPP_DEFAULT_MSG_EN = "Hi BINEC, I'd like to quote a design / UX project.";
export const WHATSAPP_URL_ES = `https://wa.me/${WHATSAPP_PHONE_INTL}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MSG_ES)}`;
export const WHATSAPP_URL_EN = `https://wa.me/${WHATSAPP_PHONE_INTL}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MSG_EN)}`;

// Curated from BINEC's public profile, using the published titles, covers and links.
export const behanceProjects: BehanceProject[] = [
  {
    id: "73853391",
    title: "Empaque Weisser",
    img: "https://mir-s3-cdn-cf.behance.net/projects/404/6bdf8373853391.Y3JvcCw4ODgsNjk1LDAsMjYx.jpg",
    url: "https://www.behance.net/gallery/73853391/Empaque-Weisser",
  },
  {
    id: "68937361",
    title: "Callan los vecinos",
    img: "https://mir-s3-cdn-cf.behance.net/projects/404/96ba5c68937361.5b6e9a3d1fc3b.png",
    url: "https://www.behance.net/gallery/68937361/Callan-los-vecinos",
  },
  {
    id: "68929695",
    title: "Demo Stand Sonrics Halloween",
    img: "https://mir-s3-cdn-cf.behance.net/projects/404/dd379268929695.5b7e68e933568.png",
    url: "https://www.behance.net/gallery/68929695/Demo-Stand-Sonrics-Halloween",
  },
  {
    id: "70147769",
    title: "Modelado y animación 3D",
    img: "https://mir-s3-cdn-cf.behance.net/projects/404/b7c80670147769.Y3JvcCwxMzgwLDEwODAsMjAxLDA.jpg",
    url: "https://www.behance.net/gallery/70147769/Modelado-y-animacion-3D",
  },
];
