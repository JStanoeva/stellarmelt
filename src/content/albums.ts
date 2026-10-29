import type { Album } from "./types";

export const album = {
  title: "Snow and the AI Mind",
  cover: "/album-cover.png",
  coverAlt: "Stellarmelt — Snow and the AI Mind album cover",
  // TODO(Tora): the album blurb (Q-08)
  blurb:
    "Four tracks of glacial glow and burning memory—strings, starlight, and heart.",
} as const satisfies Album;
