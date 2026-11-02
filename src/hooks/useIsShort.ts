import { useSyncExternalStore } from "react";
import { SHORT_QUERY } from "../art/poses";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(SHORT_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// Landscape phones, where the planet keeps its lower contact and discography poses.
export function useIsShort(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(SHORT_QUERY).matches,
  );
}
