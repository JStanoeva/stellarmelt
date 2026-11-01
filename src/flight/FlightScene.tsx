import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { usePageVisible } from "../hooks/usePageVisible";
import type { DiveStart } from "./flight";
import FlightWorld from "./FlightWorld";
import ShaderWarmup from "./ShaderWarmup";

type Props = {
  dive: DiveStart | null;
  reduced: boolean;
  paused: boolean;
  onReady: () => void;
  onLand: () => void;
};

// The flight's own canvas: it waits for its shaders, draws one still frame when reduced or paused and stops on hidden tabs.
export default function FlightScene({
  dive,
  reduced,
  paused,
  onReady,
  onLand,
}: Props) {
  const visible = usePageVisible();
  const [warm, setWarm] = useState(false);
  // "demand" keeps the last frame and redraws only on a resize.
  let frameloop: "always" | "demand" | "never" =
    reduced || paused ? "demand" : "always";
  if (!visible || !warm) frameloop = "never";

  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 60, near: 0.05, far: 4000, position: [0, 0, 0] }}
      frameloop={frameloop}
      style={{ pointerEvents: "none" }}
    >
      <FlightWorld
        dive={reduced ? null : dive}
        still={reduced}
        onReady={onReady}
        onLand={onLand}
      />
      <ShaderWarmup warm={warm} onWarm={() => setWarm(true)} />
    </Canvas>
  );
}
