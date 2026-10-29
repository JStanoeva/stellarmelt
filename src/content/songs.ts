import type { Song } from "./types";

export const songs = [
  {
    slug: "melt",
    title: "Melt",
    trackNo: 1,
    durationSec: 273,
    sunoShareUrl: "https://suno.com/s/uvOrtcUUJwLZ64Nq",
    blurb: "A slow-burn vow that erupts into a supernova of devotion.",
  },
  {
    slug: "my-smoochlight",
    title: "My Smoochlight",
    trackNo: 2,
    durationSec: 227,
    sunoShareUrl: "https://suno.com/s/HXQWjh33a8dVeQNg",
    blurb:
      "An ode to the one who turns fear into warmth and night into glow.",
  },
  {
    slug: "endless-as-the-stars",
    title: "Endless as the Stars",
    trackNo: 3,
    durationSec: 236,
    sunoShareUrl: "https://suno.com/s/r0uBraKCzBvvsjCY",
    blurb: "An expansive ballad about love that outlives constellations.",
  },
  {
    slug: "because-i-loved-you",
    title: "Because I Loved You",
    trackNo: 4,
    durationSec: 300,
    sunoShareUrl: "https://suno.com/s/0rkeKRTZRYGY2PWW",
    blurb: "A quiet confession about choosing love even when it hurts.",
  },
] as const satisfies readonly Song[];
