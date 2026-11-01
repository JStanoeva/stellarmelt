import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";

// If the GPU never reports back, start anyway.
const GIVE_UP_MS = 1500;

type Props = { warm: boolean; onWarm: () => void };

// Compiles every layer's shaders before the first frame, so neither the dive's start nor a later cloud stalls; rendered last.
export default function ShaderWarmup({ warm, onWarm }: Props) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const done = useRef(onWarm);
  useEffect(() => {
    done.current = onWarm;
  });

  useLayoutEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) done.current();
    };
    const timer = window.setTimeout(finish, GIVE_UP_MS);
    void gl.compileAsync(scene, camera).then(finish, finish);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [gl, scene, camera]);

  // A still or paused canvas renders on demand, so ask for its first frame.
  useEffect(() => {
    if (warm) invalidate();
  }, [warm, invalidate]);

  return null;
}
