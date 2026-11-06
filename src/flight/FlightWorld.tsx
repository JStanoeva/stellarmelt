import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import DeepSky from "./DeepSky";
import DiveGalaxy from "./DiveGalaxy";
import type { DiveStart } from "./flight";
import FlightCamera from "./FlightCamera";
import FlightPacer from "./FlightPacer";
import { createRig, fovFor, planDive } from "./flightPlan";
import ListenSky from "./ListenSky";
import SongFollower from "./SongFollower";
import StarStream from "./StarStream";

type Props = {
  dive: DiveStart | null;
  still: boolean;
  onSlow: () => void;
  onReady: () => void;
  onLand: () => void;
};

// Everything in the flight, back to front. A dive is planned once, from the press and the canvas at that moment.
export default function FlightWorld({
  dive,
  still,
  onSlow,
  onReady,
  onLand,
}: Props) {
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const [skyId, setSkyId] = useState(0);
  const [rig] = useState(() => createRig(dive !== null, still));
  const [plan] = useState(
    () =>
      dive &&
      planDive(dive, size.width, size.height, fovFor(size.width / size.height)),
  );

  // A restored WebGL context comes back without the sky's baked field.
  useEffect(() => {
    const canvas = gl.domElement;
    const onRestored = () => {
      setSkyId((id) => id + 1);
      invalidate();
    };
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => canvas.removeEventListener("webglcontextrestored", onRestored);
  }, [gl, invalidate]);

  return (
    <>
      <SongFollower rig={rig} />
      <FlightCamera rig={rig} plan={plan} onReady={onReady} onLand={onLand} />
      <FlightPacer rig={rig} onSlow={onSlow} />
      <DeepSky rig={rig} />
      <ListenSky key={skyId} rig={rig} />
      <StarStream rig={rig} layer="deep" />
      <StarStream rig={rig} layer="near" />
      {plan && <DiveGalaxy rig={rig} plan={plan} />}
    </>
  );
}
