import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  MathUtils,
  ShaderMaterial,
  Vector2,
} from "three";
import { palette } from "../art/palette";
import { seeded } from "../sections/discography/seed";
import { gaussian } from "./flightData";
import { fovFor, type Rig } from "./flightPlan";
import { LILAC, VIOLET } from "./listenSkyBake";
import { bigStarFragment, bigStarVertex } from "./listenSkyShaders";
import { addLight } from "./streaks";

// Far enough that the flight's own motion never reaches them; only the camera's slow turn moves them.
const STAR_DISTANCE = 1500;

// Places are shares of the screen's half width and half height, so every screen gets the same composition around the band.
// The few really large ones are set by hand: in the dark sky on both sides of the band, one out on the band itself.
const GIANTS: readonly (readonly [u: number, v: number, size: number])[] = [
  [-0.74, 0.5, 1],
  [-0.52, -0.34, 0.72],
  [-0.9, -0.42, 0.62],
  [0.66, 0.66, 0.8],
  [0.34, -0.6, 0.84],
  [-0.2, 0.74, 0.6],
  [0.91, 0.14, 0.58],
  [0.72, -0.5, 0.56],
];
// A phone only keeps this many of them, so they don't crowd it.
const GIANTS_ON_PHONES = 6;
// Loose gatherings of smaller stars; everything else stands alone.
const GROUPS: readonly (readonly [
  u: number,
  v: number,
  spread: number,
  stars: number,
])[] = [
  [-0.6, 0.16, 0.1, 7],
  [-0.82, -0.68, 0.09, 6],
  [0.86, 0.66, 0.08, 6],
  [0.46, 0.34, 0.07, 5],
  [0.7, -0.78, 0.08, 4],
  [-0.3, -0.6, 0.06, 4],
  [-0.92, 0.82, 0.07, 3],
];
const LONERS = 18;
// The share of the stars a phone keeps: it has about a third of a laptop's sky.
const KEEP_ON_PHONES = 0.5;

// The flight's vanishing point, the controls and the two corners, with room for the camera's wander at laptop and phone sizes.
function inTheWay(u: number, v: number): boolean {
  return (
    Math.hypot(u / 0.5, v / 0.5) < 1 ||
    (Math.abs(u) < 0.8 && v < -0.64) ||
    (u < -0.42 && v > 0.78) ||
    (u > 0.68 && v > 0.78)
  );
}

const halos = [
  palette.rose400,
  palette.rose400,
  palette.rose300,
  palette.mauve300,
  palette.mauve400,
  VIOLET,
  LILAC,
  palette.starlight300,
] as const;

function makeStars(): InstancedBufferGeometry {
  const random = seeded("long-light-big-stars");
  const stars: { u: number; v: number; size: number; rank: number }[] = [];
  const hasRoom = (u: number, v: number, gap: number) =>
    !inTheWay(u, v) &&
    stars.every((star) => Math.hypot(star.u - u, star.v - v) > gap);

  GIANTS.forEach(([u, v, size], index) =>
    stars.push({
      u,
      v,
      size,
      rank: index < GIANTS_ON_PHONES ? 0 : KEEP_ON_PHONES + 0.1,
    }),
  );
  for (const [cu, cv, spread, count] of GROUPS) {
    for (let index = 0; index < count; index++) {
      for (let tries = 0; tries < 30; tries++) {
        const u = cu + gaussian(random) * spread;
        const v = cv + gaussian(random) * spread * 1.2;
        if (!hasRoom(u, v, 0.05)) continue;
        // Most are small, a few medium.
        stars.push({ u, v, size: 0.03 + 0.3 * random() ** 3, rank: random() });
        break;
      }
    }
  }
  for (let index = 0; index < LONERS; index++) {
    for (let tries = 0; tries < 30; tries++) {
      const u = (random() * 2 - 1) * 1.08;
      const v = (random() * 2 - 1) * 1.08;
      if (!hasRoom(u, v, 0.14)) continue;
      stars.push({ u, v, size: 0.03 + 0.36 * random() ** 3, rank: random() });
      break;
    }
  }

  const count = stars.length;
  const places = new Float32Array(count * 3);
  const tints = new Float32Array(count * 3);
  const shapes = new Float32Array(count * 4);
  const ranks = new Float32Array(count);
  stars.forEach(({ u, v, size, rank }, index) => {
    // The small ones are dimmer as well as smaller, so the sky has a real range of brightness.
    const dim = MathUtils.lerp(0.42, 1, MathUtils.smoothstep(size, 0.03, 0.3));
    places.set([u, v, dim], index * 3);
    const tint = halos[Math.floor(random() * halos.length)];
    tints.set([tint.x, tint.y, tint.z], index * 3);
    // Halo radius and flare length in CSS px at laptop size (the flares grow much faster), seconds per twinkle, and where in it the star starts.
    shapes.set(
      [1.8 + 14 * size, 5 + 112 * size ** 1.3, 2.8 + random() * 4, random()],
      index * 4,
    );
    ranks[index] = rank;
  });

  const geometry = new InstancedBufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(
      new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
      3,
    ),
  );
  geometry.setIndex([0, 1, 2, 2, 1, 3]);
  geometry.setAttribute("aPlace", new InstancedBufferAttribute(places, 3));
  geometry.setAttribute("aTint", new InstancedBufferAttribute(tints, 3));
  geometry.setAttribute("aShape", new InstancedBufferAttribute(shapes, 4));
  geometry.setAttribute("aRank", new InstancedBufferAttribute(ranks, 1));
  geometry.instanceCount = count;
  return geometry;
}

type Props = { rig: Rig };

// Bright flared stars at the edge of the sky. They only drift with the camera's slow turn, and each twinkles on its own clock.
export default function BigStars({ rig }: Props) {
  const [stars] = useState(() => ({
    geometry: makeStars(),
    material: new ShaderMaterial({
      vertexShader: bigStarVertex,
      fragmentShader: bigStarFragment,
      uniforms: {
        uResolution: { value: new Vector2(1, 1) },
        uHalf: { value: new Vector2(1, 1) },
        uDistance: { value: STAR_DISTANCE },
        uPixels: { value: 1 },
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uFull: { value: 1 },
        uKeep: { value: 1 },
      },
      ...addLight,
    }),
  }));

  useEffect(
    () => () => {
      stars.geometry.dispose();
      stars.material.dispose();
    },
    [stars],
  );

  // The frame loop writes the uniforms outside React, so it reaches the material through a ref.
  const material = useRef(stars.material);

  useFrame((state) => {
    const { width, height } = state.size;
    const aspect = width / height;
    const halfHeight = Math.tan(MathUtils.degToRad(fovFor(aspect)) / 2);
    const uniforms = material.current.uniforms;
    state.gl.getDrawingBufferSize(uniforms.uResolution.value);
    uniforms.uHalf.value.set(halfHeight * aspect, halfHeight);
    // Gently smaller on a narrow phone, gently larger on a big monitor.
    uniforms.uPixels.value =
      state.viewport.dpr *
      MathUtils.clamp((Math.min(width, height) / 697) ** 0.7, 0.6, 1.35);
    uniforms.uKeep.value = MathUtils.lerp(
      KEEP_ON_PHONES,
      1,
      MathUtils.smoothstep(width * height, 340000, 900000),
    );
    uniforms.uTime.value = rig.t;
    uniforms.uOpacity.value = rig.song.arrival * rig.bg;
    uniforms.uFull.value = 0.92 + 0.16 * rig.song.skyEnergy;
  });

  return (
    <mesh
      geometry={stars.geometry}
      material={stars.material}
      renderOrder={1.7}
      frustumCulled={false}
    />
  );
}
