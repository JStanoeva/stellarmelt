import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Rig } from "./flightPlan";

// Frames that stay under about 40 fps for 3 s count as a slow GPU; the dive's own first seconds don't count.
const SLOW_FRAME = 1 / 40;
const SLOW_FOR = 3;
const SETTLED_T = 3;

type Props = { rig: Rig; onSlow: () => void };

// The room can run for a whole album, so on a slow GPU it trades pixels for smooth motion, one step at a time.
export default function FlightPacer({ rig, onSlow }: Props) {
  const average = useRef(1 / 60);
  const slowFor = useRef(0);

  useFrame((_, delta) => {
    if (rig.still || rig.t < SETTLED_T) return;
    // Capped, so a one-off hitch (a tab coming back) weighs little.
    const dt = Math.min(delta, 0.25);
    average.current += (dt - average.current) * 0.1;
    slowFor.current = average.current > SLOW_FRAME ? slowFor.current + dt : 0;
    if (slowFor.current < SLOW_FOR) return;
    slowFor.current = 0;
    average.current = 1 / 60;
    onSlow();
  });

  return null;
}
