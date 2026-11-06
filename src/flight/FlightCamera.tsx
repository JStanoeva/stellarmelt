import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Euler, PerspectiveCamera, Quaternion } from "three";
import {
  advance,
  drift,
  driftShare,
  fovFor,
  LAND_T,
  turnShare,
  type DivePlan,
  type Drift,
  type Rig,
} from "./flightPlan";

type Props = {
  rig: Rig;
  plan: DivePlan | null;
  onReady: () => void;
  onLand: () => void;
};

// The dive's turn from the pressed nebula onto the flight path, then the endless cruise; it runs right after SongFollower, so every layer reads this frame's rig.
export default function FlightCamera({
  rig: sharedRig,
  plan,
  onReady,
  onLand,
}: Props) {
  // The frame loop writes the shared rig outside React, so it reaches it through a ref.
  const rigRef = useRef(sharedRig);
  const [scratch] = useState(() => ({
    drift: { x: 0, y: 0, yaw: 0, pitch: 0, roll: 0 } satisfies Drift,
    euler: new Euler(0, 0, 0, "YXZ"),
    turn: new Quaternion(),
  }));
  const ready = useRef(false);
  const calls = useRef({ onReady, onLand });
  useEffect(() => {
    calls.current = { onReady, onLand };
  });

  useFrame((state, delta) => {
    const rig = rigRef.current;
    const { camera, size } = state;
    const fov = fovFor(size.width / size.height);
    if (camera instanceof PerspectiveCamera && camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    advance(rig, delta, rig.song.pace);
    const share = driftShare(rig);
    const { x, y, yaw, pitch, roll } = drift(rig.t, scratch.drift);
    camera.position.set(x * share, y * share, rig.z);
    scratch.turn.setFromEuler(
      scratch.euler.set(pitch * share, yaw * share, roll * share),
    );
    if (plan) {
      camera.quaternion.slerpQuaternions(plan.look, scratch.turn, turnShare(rig));
    } else {
      camera.quaternion.copy(scratch.turn);
    }

    if (!ready.current) {
      ready.current = true;
      calls.current.onReady();
    }
    if (plan && !rig.landed && rig.t >= LAND_T) {
      rig.landed = true;
      calls.current.onLand();
    }
  });

  return null;
}
