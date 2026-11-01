import { useThree } from "@react-three/fiber";
import { useState } from "react";
import DeepSky from "./DeepSky";
import DiveGalaxy from "./DiveGalaxy";
import type { DiveStart } from "./flight";
import FlightCamera from "./FlightCamera";
import { createRig, fovFor, planDive } from "./flightPlan";
import StarStream from "./StarStream";
import Wanderers from "./Wanderers";

type Props = {
  dive: DiveStart | null;
  still: boolean;
  onReady: () => void;
  onLand: () => void;
};

// Everything in the flight, back to front. A dive is planned once, from the press and the canvas at that moment.
export default function FlightWorld({ dive, still, onReady, onLand }: Props) {
  const size = useThree((state) => state.size);
  const [rig] = useState(() => createRig(dive !== null, still));
  const [plan] = useState(
    () =>
      dive &&
      planDive(dive, size.width, size.height, fovFor(size.width / size.height)),
  );

  return (
    <>
      <FlightCamera rig={rig} plan={plan} onReady={onReady} onLand={onLand} />
      <DeepSky rig={rig} />
      <Wanderers rig={rig} />
      <StarStream rig={rig} layer="deep" />
      <StarStream rig={rig} layer="near" />
      {plan && <DiveGalaxy rig={rig} plan={plan} />}
    </>
  );
}
