import type { TimelineEvent } from "./types";

export const timeline = [
  {
    id: "stellarmelt-is-born",
    date: "2025-07-27",
    title: "Stellarmelt is born",
    summary: "Band founded—constellations rearranged in celebration.",
  },
  {
    id: "debut-single-melt",
    date: "2025-07-27",
    title: "Debut single “Melt”",
    summary: "First spark released into the void. Goosebumps at light-speed.",
  },
  {
    id: "live-celestial-dome",
    date: "2025-09-29",
    title: "Live: Celestial Dome, Earth Orbit",
    // TODO(Tora): the concert's status, if it should show one (Q-09)
    summary: "Immersive zero-G concert.",
  },
  {
    id: "title-song-snow-and-the-ai-mind",
    date: "2026-02-16",
    title: "Title song “Snow and the AI Mind”",
    // TODO(Tora): a summary, and your OK on this title, built from your words (Q-07)
  },
  {
    id: "album-snow-and-the-ai-mind",
    date: "2026-11-01",
    title: "Album: Snow and the AI Mind",
    // TODO(Tora): the unfinished album's summary, and its date: from the day after it, it counts as past (Q-08)
    summary: "A winter galaxy of memory and fire.",
  },
] as const satisfies readonly TimelineEvent[];
