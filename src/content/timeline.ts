import type { TimelineEvent } from "./types";

export const timeline = [
  {
    id: "stellarmelt-is-born",
    date: "2025-07-27",
    title: "Stellarmelt is born",
    summary: "Band founded—constellations rearranged in celebration.",
    image: "/timeline-born.png",
  },
  {
    id: "debut-single-melt",
    date: "2025-07-27",
    title: "Debut single “Melt”",
    summary: "First spark released into the void. Goosebumps at light-speed.",
    image: "/timeline-debut.png",
  },
  {
    id: "live-celestial-dome",
    date: "2025-09-29",
    title: "Live: Celestial Dome, Earth Orbit",
    // TODO(Tora): the concert's status instead of "(upcoming)" (Q-09)
    summary: "Immersive zero-G concert (upcoming).",
    image: "/timeline-concert.png",
  },
  {
    id: "album-snow-and-the-ai-mind",
    date: "2025-10-14",
    title: "Album: Snow and the AI Mind",
    // TODO(Tora): the album's date label instead of "(upcoming)" (Q-08)
    summary: "A winter galaxy of memory and fire (upcoming).",
    image: "/timeline-album.png",
  },
] as const satisfies readonly TimelineEvent[];
