import { useSyncExternalStore } from "react";
import { usePlayer } from "./usePlayer";

// Seconds played of the current song; only the components that show the time re-render as it runs.
export function useSongTime(): number {
  const { subscribeTime, readTime } = usePlayer();
  return useSyncExternalStore(subscribeTime, readTime);
}
