export type Track = {
  no: number;
  title: string;
  link: string;
  length: string;
  about: string;
};

export const tracks: Track[] = [
  {
    no: 1,
    title: "Melt",
    link: "https://suno.com/s/uvOrtcUUJwLZ64Nq",
    length: "4:33",
    about: "A slow-burn vow that erupts into a supernova of devotion.",
  },
  {
    no: 2,
    title: "My Smoochlight",
    link: "https://suno.com/s/HXQWjh33a8dVeQNg",
    length: "3:47",
    about:
      "An ode to the one who turns fear into warmth and night into glow.",
  },
  {
    no: 3,
    title: "Endless as the Stars",
    link: "https://suno.com/s/r0uBraKCzBvvsjCY",
    length: "3:56",
    about: "An expansive ballad about love that outlives constellations.",
  },
  {
    no: 4,
    title: "Because I Loved You",
    link: "https://suno.com/s/0rkeKRTZRYGY2PWW",
    length: "5:00",
    about: "A quiet confession about choosing love even when it hurts.",
  },
];
