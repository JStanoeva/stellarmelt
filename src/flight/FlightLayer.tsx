import { lazy, Suspense, use, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Site } from "../app/site";
import SceneBoundary from "../art/SceneBoundary";
import { useFlight } from "../hooks/useFlight";
import { isListenPath } from "../lib/tracks";
import { loadFlightScene } from "./loadFlight";
import StillSky from "./StillSky";

const FlightScene = lazy(loadFlightScene);

const FADE_OUT_MS = 500;

// The fly-through sits below the navbar (z-30), so the visitor can always leave: over the page in a dive, under the room's copy in the room.
export default function FlightLayer() {
  const { id, dive, cruising, canFly, paused, markReady, land } = useFlight();
  const { reduced } = use(Site);
  const { pathname } = useLocation();
  const active = dive !== null || cruising;
  const [mounted, setMounted] = useState(active);
  if (active && !mounted) setMounted(true);

  // Leaving fades the layer out, then unmounts it, which disposes the flight's renderer.
  useEffect(() => {
    if (active || !mounted) return;
    const timer = window.setTimeout(
      () => setMounted(false),
      reduced ? 0 : FADE_OUT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, mounted, reduced]);

  if (!mounted) return null;
  const still = <StillSky />;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden ${isListenPath(pathname) ? "z-[5]" : "z-20"} ${active ? "opacity-100" : "opacity-0"} motion-ok:transition-opacity motion-ok:duration-500`}
    >
      {canFly ? (
        <SceneBoundary fallback={still}>
          <Suspense fallback={null}>
            <FlightScene
              key={id}
              dive={dive}
              reduced={reduced}
              paused={paused && cruising}
              onReady={markReady}
              onLand={land}
            />
          </Suspense>
        </SceneBoundary>
      ) : (
        still
      )}
    </div>
  );
}
