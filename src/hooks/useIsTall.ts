import { useSyncExternalStore } from "react";
import { WIDE_QUERY } from "../art/poses";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// Phones, portrait tablets and narrow windows get the stacked composition and the planet's tall poses.
export function useIsTall(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(WIDE_QUERY).matches,
  );
}
