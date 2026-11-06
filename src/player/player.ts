import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Track } from "../content/types";

export type PlayerStatus = "loading" | "playing" | "paused";

// "album" plays on to the next track when a song ends and stops after the last; "endless" goes round again (the Listening Room); "single" stops after it.
export type PlayMode = "album" | "endless" | "single";

export type PlayerValue = {
  current: Track | null;
  status: PlayerStatus | null;
  // The Listening Room says what happens when a song ends.
  setMode: Dispatch<SetStateAction<PlayMode>>;
  play: (track: Track, mode?: PlayMode) => void;
  pause: () => void;
  resume: () => void;
  toggle: (track: Track) => void;
  // The Listening Room's cue: the whole album without a track, one song with one.
  startFromCue: (track: Track | null) => void;
  registerView: () => () => void;
  // The time played, for useSongTime.
  subscribeTime: (onChange: () => void) => () => void;
  readTime: () => number;
};

export const Player = createContext<PlayerValue | null>(null);
