import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { makeStream, type StreamShape } from "./flightData";
import { LOOP_DEPTH, type Rig } from "./flightPlan";
import {
  createStreakGeometry,
  createStreakMaterial,
  syncSongStars,
  syncStreaks,
} from "./streaks";

// Two recycled fields: the deep one fills the view, the near one hugs the flight line; their depths divide LOOP_DEPTH.
const layers = {
  deep: {
    stars: 52000,
    depth: LOOP_DEPTH / 4,
    shape: "box",
    fadeFrom: 0.6,
    boost: [7, 1.7],
  },
  near: {
    stars: 6000,
    depth: LOOP_DEPTH / 16,
    shape: "lane",
    fadeFrom: 0.5,
    boost: [5, 1.6],
  },
} as const satisfies Record<
  string,
  {
    stars: number;
    depth: number;
    shape: StreamShape;
    fadeFrom: number;
    boost: [number, number];
  }
>;

type Props = { rig: Rig; layer: keyof typeof layers };

export default function StarStream({ rig, layer }: Props) {
  const [field] = useState(() => {
    const { stars, depth, shape, fadeFrom, boost } = layers[layer];
    return {
      geometry: createStreakGeometry(
        makeStream(`flight-${layer}`, stars, depth, shape),
      ),
      material: createStreakMaterial({
        wrap: depth,
        near: [0.35, 2.6],
        far: [depth * fadeFrom, depth * 0.97],
        boost: [...boost],
        twinkle: 0.14,
      }),
    };
  });

  useEffect(
    () => () => {
      field.geometry.dispose();
      field.material.dispose();
    },
    [field],
  );

  // The stars come out with the deep sky, a beat behind it.
  useFrame((state) => {
    syncStreaks(field.material, state, rig, rig.bg * rig.bg);
    syncSongStars(field.material, rig);
  });

  return (
    <mesh
      geometry={field.geometry}
      material={field.material}
      renderOrder={4}
      frustumCulled={false}
    />
  );
}
