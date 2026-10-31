export type MoonLook = {
  // The body's gradient, from the lit upper left to the shadowed limb, like the planet's.
  body: readonly [string, string, string, string, string];
  glow: string;
  // Tora and Orion are the bright pair; the four younger members are smaller moons.
  parent: boolean;
};

// Written out in full: Tailwind only emits the theme variables it finds in the source.
export const moonLooks: Record<string, MoonLook> = {
  tora: {
    body: [
      "var(--color-rose-200)",
      "var(--color-rose-400)",
      "var(--color-mauve-400)",
      "var(--color-plum-600)",
      "var(--color-night-700)",
    ],
    glow: "var(--color-rose-400)",
    parent: true,
  },
  orion: {
    body: [
      "var(--color-starlight-100)",
      "var(--color-starlight-300)",
      "var(--color-mauve-300)",
      "var(--color-plum-600)",
      "var(--color-night-700)",
    ],
    glow: "var(--color-starlight-200)",
    parent: true,
  },
  cosmo: {
    body: [
      "var(--color-mauve-100)",
      "var(--color-mauve-300)",
      "var(--color-mauve-500)",
      "var(--color-plum-600)",
      "var(--color-night-700)",
    ],
    glow: "var(--color-mauve-400)",
    parent: false,
  },
  nebula: {
    body: [
      "var(--color-rose-200)",
      "var(--color-mauve-200)",
      "var(--color-mauve-400)",
      "var(--color-plum-600)",
      "var(--color-night-700)",
    ],
    glow: "var(--color-mauve-300)",
    parent: false,
  },
  quark: {
    body: [
      "var(--color-rose-200)",
      "var(--color-rose-400)",
      "var(--color-rose-600)",
      "var(--color-plum-600)",
      "var(--color-night-700)",
    ],
    glow: "var(--color-rose-500)",
    parent: false,
  },
  "stardust-jr": {
    body: [
      "var(--color-starlight-200)",
      "var(--color-rose-300)",
      "var(--color-mauve-400)",
      "var(--color-plum-600)",
      "var(--color-night-700)",
    ],
    glow: "var(--color-starlight-300)",
    parent: false,
  },
};
