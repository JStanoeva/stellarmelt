import type { Vector3 } from "three";
import { palette } from "../art/palette";
import { seeded } from "../sections/discography/seed";

// Seeded star catalogues for the flight, so every visit flies through the same sky and render stays pure.

export type StarData = {
  count: number;
  positions: Float32Array;
  // Radius in CSS px.
  sizes: Float32Array;
  // sRGB colour with the star's brightness folded in.
  colors: Float32Array;
  phases: Float32Array;
};

type Random = () => number;

function allocate(count: number): StarData {
  return {
    count,
    positions: new Float32Array(count * 3),
    sizes: new Float32Array(count),
    colors: new Float32Array(count * 3),
    phases: new Float32Array(count),
  };
}

function put(
  stars: StarData,
  index: number,
  position: [number, number, number],
  size: number,
  tint: Vector3,
  brightness: number,
  phase: number,
) {
  stars.positions.set(position, index * 3);
  stars.sizes[index] = size;
  stars.colors.set(
    [tint.x * brightness, tint.y * brightness, tint.z * brightness],
    index * 3,
  );
  stars.phases[index] = phase;
}

function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function gaussian(random: Random): number {
  return (
    Math.sqrt(-2 * Math.log(Math.max(random(), 1e-7))) *
    Math.cos(Math.PI * 2 * random())
  );
}

const starTints = [
  palette.stardust50,
  palette.stardust50,
  palette.stardust50,
  palette.starlight200,
  palette.starlight200,
  palette.starlight300,
  palette.rose200,
  palette.rose300,
  palette.mauve200,
] as const;

// "box": evenly through a wide box. "lane": evenly round the flight line out to 26 units, never nearer than 1.6 (the lens).
export type StreamShape = "box" | "lane";

// A field the camera cruises through, `depth` deep along -z.
export function makeStream(
  seed: string,
  count: number,
  depth: number,
  shape: StreamShape,
): StarData {
  const random = seeded(seed);
  const stars = allocate(count);
  for (let index = 0; index < count; index++) {
    let x: number;
    let y: number;
    if (shape === "lane") {
      const radius = Math.sqrt(1.6 ** 2 + random() * (26 ** 2 - 1.6 ** 2));
      const angle = random() * Math.PI * 2;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else {
      x = (random() * 2 - 1) * 190;
      y = (random() * 2 - 1) * 125;
    }
    const bright = random() < 0.07;
    const size = bright ? 1.05 + random() * 0.85 : 0.5 + random() * 0.45;
    const brightness = bright ? 0.75 + random() * 0.25 : 0.3 + random() * 0.6;
    put(
      stars,
      index,
      [x, y, -random() * depth],
      size,
      pick(random, starTints),
      brightness,
      random(),
    );
  }
  return stars;
}

// The farthest stars, scattered over a sphere of `radius` around the camera.
export function makeSky(seed: string, count: number, radius: number): StarData {
  const random = seeded(seed);
  const stars = allocate(count);
  for (let index = 0; index < count; index++) {
    const z = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    const size = random() < 0.05 ? 1.1 + random() * 0.6 : 0.55 + random() * 0.45;
    const brightness = 0.25 + random() * 0.55;
    put(
      stars,
      index,
      [
        Math.cos(angle) * ring * radius,
        z * radius,
        Math.sin(angle) * ring * radius,
      ],
      size,
      pick(random, starTints),
      brightness,
      random(),
    );
  }
  return stars;
}

export type GalaxyLook = {
  arms: number;
  perArm: number;
  dust: number;
  bulge: number;
  // How many half-turns each arm sweeps (NebulaArt's arms sweep 2.7).
  sweep: number;
  armTints: readonly Vector3[];
  dustTints: readonly Vector3[];
  coreTints: readonly Vector3[];
  size: number;
};

// NebulaArt's look: two dotted arms of rose and starlight, loose mauve dust, a warm core.
export const smoochlightLook: GalaxyLook = {
  arms: 2,
  perArm: 15000,
  dust: 14000,
  bulge: 6000,
  sweep: 2.7,
  armTints: [
    palette.starlight200,
    palette.rose200,
    palette.rose300,
    palette.mauve200,
  ],
  dustTints: [
    palette.mauve200,
    palette.mauve300,
    palette.rose300,
    palette.mauve400,
  ],
  coreTints: [palette.stardust50, palette.rose200, palette.starlight200],
  size: 1,
};

// A spiral galaxy of unit radius in its own xy plane, with NebulaArt's arms turned the same way, a thin disc and a soft bulge.
export function makeGalaxy(seed: string, look: GalaxyLook): StarData {
  const random = seeded(seed);
  const stars = allocate(look.arms * look.perArm + look.dust + look.bulge);
  let index = 0;
  for (let arm = 0; arm < look.arms; arm++) {
    for (let star = 0; star < look.perArm; star++) {
      const t = random();
      const angle =
        (arm * Math.PI * 2) / look.arms +
        t * look.sweep * Math.PI +
        gaussian(random) * 0.09;
      const radius =
        (5 + 39 * t ** 0.85) / 50 + gaussian(random) * (0.012 + 0.03 * t);
      const size = (0.5 + (1 - t) * 0.45 + random() * 0.35) * look.size;
      // The arms' inner ends are crowded, so each star there stays dimmer than its count would suggest.
      const brightness =
        (0.55 + 0.4 * Math.min(t * 4, 1) - 0.45 * t) * (0.6 + 0.4 * random());
      const position: [number, number, number] = [
        Math.cos(angle) * radius,
        -Math.sin(angle) * radius,
        gaussian(random) * 0.02 * (1 - 0.6 * t),
      ];
      put(
        stars,
        index++,
        position,
        size,
        pick(random, look.armTints),
        brightness,
        random(),
      );
    }
  }
  for (let star = 0; star < look.dust; star++) {
    const angle = random() * Math.PI * 2;
    const radius = 0.1 + 0.85 * random() ** 0.8;
    const position: [number, number, number] = [
      Math.cos(angle) * radius,
      -Math.sin(angle) * radius,
      gaussian(random) * 0.03,
    ];
    put(
      stars,
      index++,
      position,
      (0.42 + random() * 0.35) * look.size,
      pick(random, look.dustTints),
      0.22 + random() * 0.3,
      random(),
    );
  }
  for (let star = 0; star < look.bulge; star++) {
    const position: [number, number, number] = [
      gaussian(random) * 0.075,
      gaussian(random) * 0.075,
      gaussian(random) * 0.045,
    ];
    put(
      stars,
      index++,
      position,
      (0.45 + random() * 0.4) * look.size,
      pick(random, look.coreTints),
      0.35 + random() * 0.3,
      random(),
    );
  }
  return stars;
}
