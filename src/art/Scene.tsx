import { Canvas } from "@react-three/fiber";
import { useState, type RefObject } from "react";
import { usePageVisible } from "../hooks/usePageVisible";
import type { Anchors } from "./anchors";
import Backdrop from "./Backdrop";
import type { DustBurst } from "./dust";
import FramePacer from "./FramePacer";
import Planet from "./Planet";
import type { PoseName } from "./poses";
import { createRig } from "./rig";
import Rigging from "./Rigging";
import Stardust from "./Stardust";
import Starfield from "./Starfield";

type Props = {
  pose: PoseName;
  anchors: Anchors;
  reduced: boolean;
  dust?: RefObject<DustBurst | null>;
  onReady: () => void;
};

// The one persistent canvas: it never remounts on a step, draws one still per pose when reduced and pauses on hidden tabs.
export default function Scene({
  pose,
  anchors,
  reduced,
  dust,
  onReady,
}: Props) {
  const visible = usePageVisible();
  const [rig] = useState(createRig);
  const [paced, setPaced] = useState(false);

  let frameloop: "always" | "demand" | "never" = "always";
  if (!visible) frameloop = "never";
  else if (reduced || paced) frameloop = "demand";

  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      camera={{ fov: 18, near: 1, far: 120, position: [0, 0, 24] }}
      frameloop={frameloop}
      style={{ pointerEvents: "none" }}
    >
      <Rigging
        rig={rig}
        pose={pose}
        anchors={anchors}
        reduced={reduced}
        dust={dust}
        onReady={onReady}
      />
      <FramePacer
        rig={rig}
        pose={pose}
        paced={paced && visible}
        reduced={reduced}
        onPacedChange={setPaced}
      />
      <Backdrop rig={rig} />
      <Starfield rig={rig} />
      <Planet rig={rig} />
      <Stardust rig={rig} dust={dust} />
    </Canvas>
  );
}
