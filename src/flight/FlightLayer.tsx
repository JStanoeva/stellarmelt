import { lazy, Suspense, use, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Site } from "../app/site";
import SceneBoundary from "../art/SceneBoundary";
import { useFlight } from "../hooks/useFlight";
import { usePlayer } from "../hooks/usePlayer";
import { isListenPath } from "../lib/tracks";
import { loadFlightScene } from "./loadFlight";
import StillSky from "./StillSky";

const FlightScene = lazy(loadFlightScene);

const FADE_OUT_MS = 500;
// Paused, the flight eases to a stop; once it has, the canvas stops drawing.
const REST_AFTER_MS = 3000;

// The fly-through sits below the navbar (z-30) during a dive, over the page, and under the room's controls in the room.
export default function FlightLayer() {
  const { id, dive, cruising, canFly, markReady, land } = useFlight();
  const { status } = usePlayer();
  const { reduced } = use(Site);
  const { pathname } = useLocation();
  const active = dive !== null || cruising;
  const [mounted, setMounted] = useState(active);
  if (active && !mounted) setMounted(true);
  const paused = cruising && status === "paused";
  const [resting, setResting] = useState(false);
  if (resting && !paused) setResting(false);

  // Leaving fades the layer out, then unmounts it, which disposes the flight's renderer.
  useEffect(() => {
    if (active || !mounted) return;
    const timer = window.setTimeout(
      () => setMounted(false),
      reduced ? 0 : FADE_OUT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, mounted, reduced]);

  useEffect(() => {
    if (!paused) return;
    const timer = window.setTimeout(() => setResting(true), REST_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [paused]);

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
              paused={resting}
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
