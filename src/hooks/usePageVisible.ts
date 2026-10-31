import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

// False while the tab is hidden, so the 3D loop can pause.
export function usePageVisible(): boolean {
  return useSyncExternalStore(subscribe, () => !document.hidden);
}
