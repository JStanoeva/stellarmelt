import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";

// The OS setting, mirrored on <html data-motion> for the motion-ok:/motion-off: variants.
export function useMotionPreference(): boolean {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduce" : "full";
  }, [reduced]);

  return reduced;
}
