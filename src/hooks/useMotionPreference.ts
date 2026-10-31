import { useEffect, useState } from "react";

const query = "(prefers-reduced-motion: reduce)";

type MotionPreference = { reduced: boolean; toggle: () => void };

// The OS setting until the visitor uses the toggle; <html data-motion> drives the motion-ok:/motion-off: variants.
export function useMotionPreference(): MotionPreference {
  const [reduced, setReduced] = useState(
    () => window.matchMedia(query).matches,
  );
  const [overridden, setOverridden] = useState(false);

  useEffect(() => {
    if (overridden) return;
    const media = window.matchMedia(query);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [overridden]);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduce" : "full";
  }, [reduced]);

  const toggle = () => {
    setOverridden(true);
    setReduced((current) => !current);
  };

  return { reduced, toggle };
}
