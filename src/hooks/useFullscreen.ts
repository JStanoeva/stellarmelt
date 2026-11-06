import { useCallback, useEffect, useState } from "react";

// Full screen for the whole page where the browser allows it; leaving the view leaves full screen too.
export function useFullscreen() {
  const supported = document.fullscreenEnabled;
  const [active, setActive] = useState(() => document.fullscreenElement !== null);

  useEffect(() => {
    const onChange = () => setActive(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      if (document.fullscreenElement) void document.exitFullscreen();
    };
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    document.documentElement
      .requestFullscreen({ navigationUI: "hide" })
      .catch(() => {});
  }, []);

  return { supported, active, toggle };
}
