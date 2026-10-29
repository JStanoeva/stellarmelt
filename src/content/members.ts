import type { Member } from "./types";

export const members = [
  {
    slug: "tora",
    name: "Tora",
    role: "Lead Vocals",
    blurb: "A soaring siren—crystalline highs, velvet lows.",
  },
  {
    slug: "orion",
    name: "Orion",
    role: "Guitar / Lyrics",
    blurb: "Meteoric riffs, poetry etched in stardust.",
  },
  {
    slug: "cosmo",
    name: "Cosmo",
    role: "Cello",
    blurb: "Gravity-well tone: warm, dark, cinematic.",
  },
  {
    slug: "nebula",
    name: "Nebula",
    role: "Bass",
    blurb: "Silky grooves that bend spacetime.",
  },
  {
    slug: "quark",
    name: "Quark",
    role: "Drums",
    blurb: "Quantum-tight beats; big-bang impact.",
  },
  {
    slug: "stardust-jr",
    name: "Stardust Jr.",
    role: "Guest DJ / Producer",
    blurb: "Galactic textures, aurora-wide drops.",
  },
] as const satisfies readonly Member[];
