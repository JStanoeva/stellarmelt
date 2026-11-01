import { useEffect } from "react";
import { usePlayer } from "./usePlayer";

// Every view with play controls calls this; once none is left, the song fades out and pauses, so it never plays unseen.
export function usePlayerView() {
  const { registerView } = usePlayer();
  useEffect(() => registerView(), [registerView]);
}
