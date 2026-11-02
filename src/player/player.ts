import { createContext } from "react";
import type { Track } from "../content/types";

export type PlayerStatus = "loading" | "playing" | "paused";

// "album" plays on to the next track when a song ends; "single" stops after it.
export type PlayMode = "album" | "single";

export type PlayerValue = {
  current: Track | null;
  status: PlayerStatus | null;
  mode: PlayMode;
  play: (track: Track, mode?: PlayMode) => void;
  pause: () => void;
  resume: () => void;
  toggle: (track: Track, mode?: PlayMode) => void;
  // The Listening Room's cue: the whole album without a track, one song with one.
  startFromCue: (track: Track | null) => void;
  registerView: () => () => void;
  // The time played, for useSongTime.
  subscribeTime: (onChange: () => void) => () => void;
  readTime: () => number;
};

export const Player = createContext<PlayerValue | null>(null);
