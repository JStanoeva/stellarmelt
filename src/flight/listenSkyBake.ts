import type { WebGLRenderer } from "three";
import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  Mesh,
  NoBlending,
  PlaneGeometry,
  RedFormat,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Texture,
} from "three";
import { palette } from "../art/palette";
import { seeded } from "../sections/discography/seed";
import { gaussian } from "./flightData";
import { fbm } from "./flightNoise";
import { bakeFragment, bakeVertex, HAZE_STORED } from "./listenSkyShaders";

// The sky's half size, along the band and across it, in units of the distance to the sky. The widest screens see about 1.8 of it.
export const EXTENT = new Vector2(2.1, 1.05);
// Where the band swells: far along it, never near the middle of the screen.
export const BULGE = new Vector2(0.7, -0.03);

const FIELD_WIDTH = 2048;
const FIELD_HEIGHT = 1024;
const NOISE_SIZE = 256;
const NOISE_CELLS = 8;
const SPECK_SIZE = 512;
const STARS = 145000;
const CLUSTERS = 16;
const CLUSTER_STARS = 36;
const KNOTS = 22;
const KNOT_SPRITES = 5;
const ROSE_KNOTS = 70;
const ROSE_KNOT_SPRITES = 5;
const MAX_BAND_TRIES = 100000;
// The wash's half size, in the same units as EXTENT: past every screen's corners.
const WASH = new Vector2(3.4, 2.4);

// A palette colour pushed away from its own grey: faint light always looks greyer than its value suggests.
export function richer(color: Vector3, amount: number): Vector3 {
  const grey = 0.3 * color.x + 0.55 * color.y + 0.15 * color.z;
  return color
    .clone()
    .subScalar(grey)
    .multiplyScalar(amount)
    .addScalar(grey)
    .clampScalar(0, 1);
}

// The slow CPU work is kept for the next visit to the room, so only the first dive pays for it.
let noiseData: Uint8Array<ArrayBuffer> | null = null;
let starData: StarArrays | null = null;

// Four independent layers of tiling noise, with the contrast fbm tends to lose stretched back out.
function makeNoiseData(): Uint8Array<ArrayBuffer> {
  const data = new Uint8Array(NOISE_SIZE * NOISE_SIZE * 4);
  for (let y = 0; y < NOISE_SIZE; y++) {
    for (let x = 0; x < NOISE_SIZE; x++) {
      const u = (x / NOISE_SIZE) * NOISE_CELLS;
      const v = (y / NOISE_SIZE) * NOISE_CELLS;
      for (let layer = 0; layer < 4; layer++) {
        const value =
          (fbm(u, v, layer * 2.7 + 0.5, 4, NOISE_CELLS) - 0.18) / 0.58;
        data[(y * NOISE_SIZE + x) * 4 + layer] = Math.round(
          Math.min(Math.max(value, 0), 1) * 255,
        );
      }
    }
  }
  return data;
}

function tiling(texture: DataTexture): DataTexture {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

// A tile of pure star dust: mostly dark, a few sparks. Filtered linearly, so it glides with the sky instead of shimmering.
function makeSpeck(): DataTexture {
  const random = seeded("long-light-speck");
  const data = new Uint8Array(SPECK_SIZE * SPECK_SIZE);
  for (let index = 0; index < data.length; index++) {
    data[index] = Math.round(random() ** 5 * 255);
  }
  return tiling(new DataTexture(data, SPECK_SIZE, SPECK_SIZE, RedFormat));
}

// Rendered once per scene, so the many noise reads never run again and can't stall a frame. The stars read it back only the first time.
function bakeField(gl: WebGLRenderer) {
  noiseData ??= makeNoiseData();
  const noise = tiling(
    new DataTexture(noiseData, NOISE_SIZE, NOISE_SIZE, RGBAFormat),
  );
  const target = new WebGLRenderTarget(FIELD_WIDTH, FIELD_HEIGHT, {
    format: RGBAFormat,
    magFilter: LinearFilter,
    minFilter: LinearFilter,
    depthBuffer: false,
  });
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({
    vertexShader: bakeVertex,
    fragmentShader: bakeFragment,
    uniforms: {
      uNoise: { value: noise },
      uExtent: { value: EXTENT },
      uBulge: { value: BULGE },
    },
    blending: NoBlending,
    depthTest: false,
    depthWrite: false,
  });
  const scene = new Scene();
  const quad = new Mesh(geometry, material);
  quad.frustumCulled = false;
  scene.add(quad);
  const previous = gl.getRenderTarget();
  gl.setRenderTarget(target);
  gl.render(scene, new Camera());
  if (!starData) {
    const pixels = new Uint8Array(FIELD_WIDTH * FIELD_HEIGHT * 4);
    gl.readRenderTargetPixels(target, 0, 0, FIELD_WIDTH, FIELD_HEIGHT, pixels);
    starData = placeStars(pixels);
  }
  gl.setRenderTarget(previous);
  geometry.dispose();
  material.dispose();
  noise.dispose();
  return target;
}

// Lilac and rose through the band, rose and hot pink in the swelling: the star dust carries the colour too.
export const LILAC = new Vector3(0.72, 0.5, 1);
export const VIOLET = new Vector3(0.6, 0.38, 1);
const HOT = new Vector3(1, 0.42, 0.68);
const coolTints = [LILAC, VIOLET, palette.mauve300, palette.rose400, HOT] as const;
const warmTints = [palette.rose400, HOT, HOT, palette.rose600] as const;

type StarArrays = {
  positions: Float32Array<ArrayBuffer>;
  sizes: Float32Array<ArrayBuffer>;
  colors: Float32Array<ArrayBuffer>;
  ranks: Float32Array<ArrayBuffer>;
  phases: Float32Array<ArrayBuffer>;
};

// Countless faint stars, placed where the field has starlight and no dust: they're what the band is made of.
function placeStars(pixels: Uint8Array): StarArrays {
  const random = seeded("long-light");
  const grainEnd = STARS + CLUSTERS * CLUSTER_STARS + KNOTS * KNOT_SPRITES;
  const total = grainEnd + ROSE_KNOTS * ROSE_KNOT_SPRITES;
  const positions = new Float32Array(total * 3);
  const sizes = new Float32Array(total);
  const colors = new Float32Array(total * 3);
  const ranks = new Float32Array(total);
  const phases = new Float32Array(total);
  let placed = 0;
  const put = (
    x: number,
    y: number,
    size: number,
    tint: Vector3,
    brightness: number,
    rank: number,
  ) => {
    positions.set([x, y, 0], placed * 3);
    sizes[placed] = size;
    // Only the brightest burn white; the dust keeps its colour.
    const white = Math.min(Math.max((brightness - 0.14) / 0.3, 0), 1) ** 2;
    colors.set(
      [
        (tint.x + (1 - tint.x) * white) * brightness,
        (tint.y + (1 - tint.y) * white) * brightness,
        (tint.z + (1 - tint.z) * white) * brightness,
      ],
      placed * 3,
    );
    ranks[placed] = rank;
    phases[placed] = random();
    placed += 1;
  };
  const toBand = (fx: number, fy: number): [number, number] => [
    (fx / FIELD_WIDTH) * 2 * EXTENT.x - EXTENT.x,
    (fy / FIELD_HEIGHT) * 2 * EXTENT.y - EXTENT.y,
  ];
  // Somewhere on the band where the light is thick enough and the dust is not too dense, for the rare things.
  const onBand = (): [number, number] => {
    for (let tries = 0; tries < MAX_BAND_TRIES; tries++) {
      const fx = random() * FIELD_WIDTH;
      const fy = random() * FIELD_HEIGHT;
      const at = (Math.floor(fy) * FIELD_WIDTH + Math.floor(fx)) * 4;
      if (pixels[at] > 60 * HAZE_STORED && pixels[at + 1] < 150) {
        return toBand(fx, fy);
      }
    }
    // An empty field means the bake failed; SceneBoundary then shows the still sky.
    throw new Error("The Listening Room's sky came back empty");
  };

  for (let cluster = 0; cluster < CLUSTERS; cluster++) {
    const [cx, cy] = onBand();
    const spread = 0.004 + random() * 0.007;
    for (let star = 0; star < CLUSTER_STARS; star++) {
      put(
        cx + gaussian(random) * spread,
        cy + gaussian(random) * spread,
        0.6 + random() * 0.2,
        coolTints[Math.floor(random() * 3)],
        0.14 + random() * 0.2,
        random() * 0.5,
      );
    }
  }
  for (let knot = 0; knot < KNOTS; knot++) {
    const [cx, cy] = onBand();
    const spread = 0.004 + random() * 0.006;
    const tint = random() < 0.75 ? palette.rose600 : palette.mauve400;
    const glow = 0.06 + random() * 0.06;
    for (let sprite = 0; sprite < KNOT_SPRITES; sprite++) {
      put(
        cx + gaussian(random) * spread,
        cy + gaussian(random) * spread,
        2.6 + random() * 4,
        tint,
        glow,
        0,
      );
    }
  }

  while (placed < grainEnd) {
    const fx = random() * FIELD_WIDTH;
    const fy = random() * FIELD_HEIGHT;
    const at = (Math.floor(fy) * FIELD_WIDTH + Math.floor(fx)) * 4;
    const haze = Math.min(pixels[at] / 255 / HAZE_STORED, 1);
    const clear = 1 - pixels[at + 1] / 255;
    if (random() > 0.012 + haze ** 1.05 * clear ** 2.5 * 1.3) continue;
    const mag = random();
    const brightness =
      0.03 + 0.09 * mag ** 3 + 0.36 * mag ** 16 + (random() < 0.002 ? 0.4 : 0);
    const [x, y] = toBand(fx, fy);
    // Older, warmer stars gather in the swelling.
    const warmth = Math.exp(
      -(((x - BULGE.x) / 0.95) ** 2) - ((y - BULGE.y) / 0.42) ** 2,
    );
    const tints = random() < warmth * 0.85 ? warmTints : coolTints;
    const tint = tints[Math.floor(random() * tints.length)];
    // The faintest come out last, like eyes adjusting to the dark.
    put(
      x,
      y,
      0.62 + 0.34 * mag ** 4 + 0.8 * mag ** 24,
      tint,
      brightness,
      (1 - mag) * 0.72 + random() * 0.28,
    );
  }

  // Small rose knots scattered along the band: always out, so they carry the colour through quiet passages too.
  for (let knot = 0; knot < ROSE_KNOTS; knot++) {
    const [cx, cy] = onBand();
    const spread = 0.003 + random() * 0.008;
    const glow = 0.12 + random() ** 2 * 0.2;
    for (let sprite = 0; sprite < ROSE_KNOT_SPRITES; sprite++) {
      put(
        cx + gaussian(random) * spread,
        cy + gaussian(random) * spread * 0.7,
        1.3 + random() ** 2 * 2.8,
        sprite === 0 ? HOT : palette.rose600,
        glow,
        0,
      );
    }
  }
  return { positions, sizes, colors, ranks, phases };
}

function starGeometry(data: StarArrays): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(data.positions, 3));
  geometry.setAttribute("aSize", new BufferAttribute(data.sizes, 1));
  geometry.setAttribute("aColor", new BufferAttribute(data.colors, 3));
  geometry.setAttribute("aRank", new BufferAttribute(data.ranks, 1));
  geometry.setAttribute("aPhase", new BufferAttribute(data.phases, 1));
  return geometry;
}

// The band's far glow over the whole sky: slow plum and purple clouds, worked out once per vertex like the deep sky.
function makeWash(): BufferGeometry {
  const geometry = new PlaneGeometry(WASH.x * 2, WASH.y * 2, 96, 64);
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const plum = richer(palette.plum800, 3);
  const purple = richer(palette.plum600, 2.4);
  const color = new Vector3();
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index);
    const y = position.getY(index);
    const near = Math.exp(-((y / 1.15) ** 2));
    const clouds = MathUtils.smoothstep(
      fbm(x * 0.7 + 4.1, y * 1.1 + 2.3, 1.7, 4),
      0.34,
      0.62,
    );
    const wisps = MathUtils.smoothstep(
      fbm(x * 1.6 + 9.2, y * 2.4 + 5.7, 6.1, 4),
      0.42,
      0.72,
    );
    color.copy(plum).multiplyScalar(0.03 + 0.13 * clouds * (0.35 + 0.65 * near));
    color.addScaledVector(purple, 0.09 * clouds * wisps * near);
    colors.set([color.x, color.y, color.z], index * 3);
  }
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  return geometry;
}

type BakedSky = {
  field: Texture;
  speck: Texture;
  stars: BufferGeometry;
  wash: BufferGeometry;
  dispose: () => void;
};

export function bakeSky(gl: WebGLRenderer): BakedSky {
  const target = bakeField(gl);
  if (!starData) throw new Error("The Listening Room's stars were not placed");
  const stars = starGeometry(starData);
  const speck = makeSpeck();
  const wash = makeWash();
  return {
    field: target.texture,
    speck,
    stars,
    wash,
    dispose: () => {
      target.dispose();
      speck.dispose();
      stars.dispose();
      wash.dispose();
    },
  };
}
