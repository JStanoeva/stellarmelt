import { album } from "./albums";
import { timeline } from "./timeline";

export const homeSections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "timeline", label: "Timeline" },
  { id: "discography", label: "Discography" },
  { id: "contact", label: "Contact" },
] as const;

export type HomeSectionId = (typeof homeSections)[number]["id"];

export const homeSectionIds: readonly HomeSectionId[] = homeSections.map(
  (section) => section.id,
);

export const hero = {
  eyebrow: "Cosmic Rock • Love • Stardust",
  title: "Stellarmelt",
  tagline:
    "A celestial fusion of powerful vocals, poetic rock, and star-swept ambience. Music for hearts that glow in the dark.",
  ctas: [
    { label: "Meet the Band", href: "#about" },
    { label: "Listen Now", href: "#discography" },
  ],
} as const;

// The band name in katakana, approved by Tora.
export const kana = "ステラメルト";

export const about = {
  heading: "About Stellarmelt",
  line: "Stellarmelt blends glassy minimalism with cosmic drama—crisp guitars, orchestral shadows, and vocals that gleam like constellations.",
} as const;

export const firstEvent = timeline[0];

export const discography = {
  heading: "Discography",
  albumLabel: "Album:",
  albumTitle: album.title,
  line: album.blurb,
} as const;

export const contact = {
  heading: "Contact",
  line: "Follow Stellarmelt across the cosmos.",
} as const;
