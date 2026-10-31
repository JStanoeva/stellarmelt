import { useEffect, useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// The OS setting, mirrored on <html data-motion> for the motion-ok:/motion-off: variants.
export function useMotionPreference(): boolean {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduce" : "full";
  }, [reduced]);

  return reduced;
}
