import type { Track } from "../content/types";
import { usePlayer } from "./usePlayer";

type PlayState = {
  active: boolean;
  pausable: boolean;
  verb: "Play" | "Pause" | "Resume";
  toggle: () => void;
};

// What a play button says and does for its song.
export function usePlayState(track: Track): PlayState {
  const { current, status, toggle } = usePlayer();
  const active = current?.slug === track.slug;
  const pausable = active && status !== "paused";
  let verb: PlayState["verb"] = "Play";
  if (active) verb = pausable ? "Pause" : "Resume";
  return { active, pausable, verb, toggle: () => toggle(track) };
}
