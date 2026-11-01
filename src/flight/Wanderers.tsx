import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  MathUtils,
  PlaneGeometry,
  Quaternion,
  ShaderMaterial,
  Vector2,
  Vector3,
  type Object3D,
} from "three";
import { palette } from "../art/palette";
import { seeded } from "../sections/discography/seed";
import { makeGalaxy, smoochlightLook, type GalaxyLook } from "./flightData";
import { makeCloudTexture } from "./flightNoise";
import { LOOP_DEPTH, type Rig } from "./flightPlan";
import { cloudFragment, cloudVertex } from "./flightShaders";
import {
  createStreakGeometry,
  createStreakMaterial,
  layOver,
  syncStreaks,
} from "./streaks";

type Sight = {
  kind: "galaxy" | "cloud";
  // Where it sits at the start; the first galaxy is already in view on arrival.
  z: number;
  x: number;
  y: number;
  size: number;
  seed: string;
};

// Off the flight path and clear of the room's copy (bottom left); each repeats every LOOP_DEPTH units, about two minutes.
const sights: readonly Sight[] = [
  { kind: "galaxy", z: -250, x: 40, y: 30, size: 24, seed: "wanderer-a" },
  { kind: "cloud", z: -470, x: -85, y: 45, size: 320, seed: "cloud-a" },
  { kind: "galaxy", z: -690, x: 60, y: -10, size: 26, seed: "wanderer-b" },
  { kind: "cloud", z: -910, x: 100, y: -30, size: 360, seed: "cloud-b" },
  { kind: "galaxy", z: -1070, x: -35, y: 48, size: 20, seed: "wanderer-c" },
];

const looks: readonly GalaxyLook[] = [
  {
    ...smoochlightLook,
    perArm: 3200,
    dust: 2600,
    bulge: 1400,
    sweep: 2.4,
    size: 0.9,
  },
  {
    ...smoochlightLook,
    arms: 3,
    perArm: 2200,
    dust: 2400,
    bulge: 1600,
    sweep: 1.8,
    armTints: [
      palette.starlight200,
      palette.starlight300,
      palette.stardust50,
      palette.mauve200,
    ],
    size: 0.9,
  },
  {
    ...smoochlightLook,
    perArm: 2600,
    dust: 2000,
    bulge: 1200,
    sweep: 3.1,
    armTints: [palette.mauve200, palette.mauve300, palette.rose300],
    size: 0.85,
  },
];

const cloudColors: readonly [Vector3, Vector3][] = [
  [palette.plum600, palette.rose600],
  [palette.plum800, palette.mauve500],
];

// They fade in far away and out before they fill the screen; after a dive they wait until the camera is through its galaxy.
function visibility(depth: number, kind: Sight["kind"], rig: Rig): number {
  const after = rig.diving ? MathUtils.smoothstep(rig.t, 1.6, 3.2) : 1;
  if (kind === "galaxy") {
    return (
      after *
      (1 - MathUtils.smoothstep(depth, 380, 460)) *
      MathUtils.smoothstep(depth, 22, 80)
    );
  }
  return (
    after *
    (1 - MathUtils.smoothstep(depth, 420, 520)) *
    MathUtils.smoothstep(depth, 60, 190)
  );
}

type Props = { rig: Rig };

// Every so often a distant galaxy or a nebula cloud drifts past and slides out past the edge of the screen.
export default function Wanderers({ rig }: Props) {
  const nodes = useRef<(Object3D | null)[]>([]);
  const [cloudNoise] = useState(() => makeCloudTexture(128));
  const [parts] = useState(() => {
    let galaxyIndex = 0;
    let cloudIndex = 0;
    return sights.map((sight, index) => {
      if (sight.kind === "galaxy") {
        const look = looks[galaxyIndex++ % looks.length];
        // Tipped 40–65° around a random axis in the picture plane: never edge-on, where its stars would pile into a line.
        const random = seeded(sight.seed);
        const axis = random() * Math.PI * 2;
        const tilt = new Quaternion().setFromAxisAngle(
          new Vector3(Math.cos(axis), Math.sin(axis), 0),
          0.7 + random() * 0.45,
        );
        return {
          sight,
          tilt,
          geometry: createStreakGeometry(makeGalaxy(sight.seed, look)),
          material: createStreakMaterial({ near: [4, 12], far: [1e5, 2e5] }),
        };
      }
      const [colorA, colorB] = cloudColors[cloudIndex++ % cloudColors.length];
      return {
        sight,
        tilt: new Quaternion(),
        geometry: new PlaneGeometry(1, 1),
        material: new ShaderMaterial({
          vertexShader: cloudVertex,
          fragmentShader: cloudFragment,
          uniforms: {
            uNoise: { value: cloudNoise },
            uColorA: { value: colorA },
            uColorB: { value: colorB },
            uPatch: { value: new Vector2(index * 0.37, index * 0.61) },
            uTime: { value: 0 },
            uSize: { value: sight.size },
            uOpacity: { value: 0 },
          },
          ...layOver,
        }),
      };
    });
  });

  useEffect(
    () => () => {
      for (const part of parts) {
        part.geometry.dispose();
        part.material.dispose();
      }
      cloudNoise.dispose();
    },
    [parts, cloudNoise],
  );

  useFrame((state) => {
    const camera = state.camera;
    // Tall screens see less to the sides, so the sights come in closer to the flight line there.
    const sideways = MathUtils.clamp(
      state.size.width / state.size.height / 1.6,
      0.4,
      1,
    );
    parts.forEach((part, index) => {
      const node = nodes.current[index];
      if (!node) return;
      const { sight } = part;
      const z =
        camera.position.z -
        MathUtils.euclideanModulo(camera.position.z - sight.z, LOOP_DEPTH);
      const depth = camera.position.z - z;
      node.position.set(sight.x * sideways, sight.y, z);
      const shown = visibility(depth, sight.kind, rig) * rig.bg;
      node.visible = shown > 0.002;
      if (sight.kind === "galaxy") {
        // Its fixed-size stars spread out as it nears, so they brighten a little to stay a galaxy, not a haze.
        const near = MathUtils.clamp(300 / depth, 1, 4);
        syncStreaks(part.material, state, rig, 0.055 * near * shown);
      } else {
        part.material.uniforms.uTime.value = rig.t;
        part.material.uniforms.uOpacity.value = 0.55 * shown;
      }
    });
  });

  return (
    <>
      {parts.map((part, index) => (
        <mesh
          key={part.sight.seed}
          ref={(node) => {
            nodes.current[index] = node;
          }}
          geometry={part.geometry}
          material={part.material}
          quaternion={part.tilt}
          scale={part.sight.kind === "galaxy" ? part.sight.size : 1}
          renderOrder={part.sight.kind === "galaxy" ? 3 : 2}
          frustumCulled={false}
        />
      ))}
    </>
  );
}
