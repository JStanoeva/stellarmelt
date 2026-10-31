import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { PoseName } from "./poses";
import type { Rig } from "./rig";

// A slow GPU: idle frames under about 20 fps for 3 s, or four in a row under 8 fps (software rendering).
const SLOW_FRAME = 1 / 20;
const SLOW_FOR = 3;
const CRAWL_FRAME = 1 / 8;
const CRAWL_STREAK = 4;
// Paced renders come at most every PACED_INTERVAL ms; QUICK_FOR_MS of quick renders end the pacing.
const PACED_INTERVAL = 110;
const QUICK_RENDER_MS = 25;
const QUICK_FOR_MS = 3000;
// While a wheel or touch gesture runs, a paced canvas holds still (the stage's gesture window is 200 ms).
const GESTURE_QUIET_MS = 260;

type Props = {
  rig: Rig;
  pose: PoseName;
  paced: boolean;
  reduced: boolean;
  onPacedChange: (paced: boolean) => void;
};

// On a slow GPU continuous rendering delays input: idle frames that stay slow drop to 1× pixels, then to a few per second.
export default function FramePacer({
  rig,
  pose,
  paced,
  reduced,
  onPacedChange,
}: Props) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const setDpr = useThree((state) => state.setDpr);
  const average = useRef(1 / 60);
  const slowFor = useRef(0);
  const crawl = useRef(0);
  const renderNow = useRef(() => {});

  useFrame((state, delta) => {
    if (paced || reduced) return;
    // A step's own frames never count: blur-heavy transitions are slow on many laptops.
    if (rig.wake > 0.02 || (rig.dustT >= 0 && rig.dustT < 1.4)) return;
    // Capped, so a one-off hitch (shaders compiling, a tab coming back) weighs little.
    const dt = Math.min(delta, 0.25);
    average.current += (dt - average.current) * 0.1;
    slowFor.current = average.current > SLOW_FRAME ? slowFor.current + dt : 0;
    crawl.current = delta > CRAWL_FRAME ? crawl.current + 1 : 0;
    if (slowFor.current < SLOW_FOR && crawl.current < CRAWL_STREAK) return;
    slowFor.current = 0;
    crawl.current = 0;
    average.current = 1 / 60;
    if (state.viewport.dpr > 1) setDpr(1);
    else onPacedChange(true);
  });

  // Paced: render, time it on the GPU (fence), rest; steps render back to back, gestures wait, quick renders end it.
  useEffect(() => {
    if (!paced || reduced) return;
    const context = gl.getContext();
    if (!(context instanceof WebGL2RenderingContext)) {
      const timer = window.setInterval(invalidate, PACED_INTERVAL);
      return () => window.clearInterval(timer);
    }
    let fence: WebGLSync | null = null;
    let busy = false;
    let fencedAt = 0;
    let quickFor = 0;
    let gestureAt = -Infinity;
    let frame = 0;
    let timer = 0;
    const onGesture = () => {
      gestureAt = performance.now();
    };
    const poll = () => {
      if (!fence) return;
      if (
        context.getSyncParameter(fence, context.SYNC_STATUS) !==
        context.SIGNALED
      ) {
        frame = requestAnimationFrame(poll);
        return;
      }
      context.deleteSync(fence);
      fence = null;
      busy = false;
      const took = performance.now() - fencedAt;
      quickFor = took < QUICK_RENDER_MS ? quickFor + PACED_INTERVAL : 0;
      if (quickFor >= QUICK_FOR_MS) {
        onPacedChange(false);
        return;
      }
      // Idle, the GPU rests at least 60% of the time so the page's own frames keep flowing.
      const stepping = rig.wake > 0.02 || (rig.dustT >= 0 && rig.dustT < 1.4);
      timer = window.setTimeout(
        render,
        stepping ? 0 : Math.max(PACED_INTERVAL - took, took * 1.5),
      );
    };
    const render = () => {
      const quiet = performance.now() - gestureAt;
      if (quiet < GESTURE_QUIET_MS) {
        timer = window.setTimeout(render, GESTURE_QUIET_MS - quiet);
        return;
      }
      busy = true;
      invalidate();
      // Queued after the canvas's own frame callback, so the fence lands right behind this render.
      frame = requestAnimationFrame(() => {
        fence = context.fenceSync(context.SYNC_GPU_COMMANDS_COMPLETE, 0);
        fencedAt = performance.now();
        frame = requestAnimationFrame(poll);
      });
    };
    renderNow.current = () => {
      if (busy) return;
      window.clearTimeout(timer);
      render();
    };
    window.addEventListener("wheel", onGesture, { passive: true });
    window.addEventListener("touchmove", onGesture, { passive: true });
    render();
    return () => {
      renderNow.current = () => {};
      window.removeEventListener("wheel", onGesture);
      window.removeEventListener("touchmove", onGesture);
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      if (fence) context.deleteSync(fence);
    };
  }, [paced, reduced, gl, invalidate, onPacedChange, rig]);

  // A new pose starts a step: render it right away instead of after the idle rest.
  useEffect(() => {
    renderNow.current();
  }, [pose]);

  return null;
}
