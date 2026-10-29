export type TimelineEvent = {
  date: string;
  title: string;
  detail: string;
  image: string;
};

export const timeline: TimelineEvent[] = [
  {
    date: "July 27, 2025",
    title: "Stellarmelt is born",
    detail: "Band founded—constellations rearranged in celebration.",
    image: "/timeline-born.png",
  },
  {
    date: "July 27, 2025",
    title: "Debut single “Melt”",
    detail: "First spark released into the void. Goosebumps at light-speed.",
    image: "/timeline-debut.png",
  },
  {
    date: "September 29, 2025",
    title: "Live: Celestial Dome, Earth Orbit",
    // TODO(Tora): the concert's status instead of "(upcoming)" (Q-09)
    detail: "Immersive zero-G concert (upcoming).",
    image: "/timeline-concert.png",
  },
  {
    date: "October 14, 2025",
    title: "Album: Snow and the AI Mind",
    // TODO(Tora): the album's date label instead of "(upcoming)" (Q-08)
    detail: "A winter galaxy of memory and fire (upcoming).",
    image: "/timeline-album.png",
  },
];
