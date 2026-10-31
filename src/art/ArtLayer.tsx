import { lazy, Suspense, useEffect, useState, type RefObject } from "react";
import SceneBoundary from "./SceneBoundary";
import { canUseWebGL2 } from "./webgl";
import { noAnchors, type Anchors } from "./anchors";
import type { DustBurst } from "./dust";
import FallbackArt from "./FallbackArt";
import type { PoseName } from "./poses";

// three.js loads after the first paint; until then (and without WebGL) the still planet holds the pose.
const Scene = lazy(() => import("./Scene"));

type Props = {
  pose: PoseName;
  anchors?: Anchors;
  glide?: boolean;
  reduced: boolean;
  dust?: RefObject<DustBurst | null>;
};

// The art layer behind every view: fixed, decorative, and never part of the stage's keyed sections.
export default function ArtLayer({
  pose,
  anchors = noAnchors,
  glide = false,
  reduced,
  dust,
}: Props) {
  const [webgl] = useState(canUseWebGL2);
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);

  // Keep the still under the canvas until the canvas has faded in over it.
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setSettled(true), reduced ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [ready, reduced]);

  const still = <FallbackArt pose={pose} anchors={anchors} glide={glide} />;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden bg-night-950"
    >
      {(!webgl || !settled) && still}
      {webgl && (
        <SceneBoundary fallback={still}>
          <Suspense fallback={null}>
            <div
              className={`absolute inset-0 motion-ok:transition-opacity motion-ok:duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            >
              <Scene
                pose={pose}
                anchors={anchors}
                reduced={reduced}
                dust={dust}
                onReady={() => setReady(true)}
              />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
