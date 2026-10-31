import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

// The orbit is drawn in CSS px round the planet, so it follows the window's size.
export function useViewportSize(): { width: number; height: number } {
  const width = useSyncExternalStore(subscribe, () => window.innerWidth);
  const height = useSyncExternalStore(subscribe, () => window.innerHeight);
  return { width, height };
}
