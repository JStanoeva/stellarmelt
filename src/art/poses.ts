import type { HomeSectionId } from "../content/homeSections";
import type { Anchors } from "./anchors";

export type PoseName = HomeSectionId | "notFound";

// x/y: the centre as a viewport fraction (y > 1 is below the fold); radius: of min(width, height); orbits in planet radii.
export type Pose = {
  x: number;
  y: number;
  radius: number;
  orbit: number;
  outer: number;
  // 0 shows the orbit face-on as a circle, π/2 edge-on as a line.
  tilt: number;
  roll: number;
  moon: number;
  // The moon's distance in orbit radii: 1 rides the orbit, more flings it off (the 404).
  drift: number;
  glow: number;
  // 0 lights the planet from the front left, 1 from behind (a dark face under a glowing limb).
  light: number;
  // Radius of the halftone field around the planet, in planet radii.
  field: number;
  // Sideways pan of the star field, in world units, so each step feels like travel.
  pan: number;
};

export const poseKeys = [
  "x",
  "y",
  "radius",
  "orbit",
  "outer",
  "tilt",
  "roll",
  "moon",
  "drift",
  "glow",
  "light",
  "field",
  "pan",
] as const;

type PoseTable = Record<PoseName, Pose>;

// Where the moon starts (near side, left of the planet, so the still frame shows it) and its speed in rad/s.
export const MOON_START = -2.4;
export const MOON_SPEED = 0.2;
// While its orbit's radius changes faster than this (planet radii per second), the moon hides and waits.
export const MOON_HOLD_SWING = 2;

// Landscape screens: a poster composition per section. The hero's y and the timeline's orbit get pinned to the copy.
const wide: PoseTable = {
  hero: {
    x: 0.745,
    y: 0.52,
    radius: 0.33,
    orbit: 1.62,
    outer: 2.3,
    tilt: 1.3,
    roll: -0.24,
    moon: 0.05,
    drift: 1,
    glow: 1,
    light: 0,
    field: 2.7,
    pan: 0,
  },
  about: {
    x: 0.07,
    y: 0.52,
    radius: 0.5,
    orbit: 1.22,
    outer: 1.75,
    tilt: 1.36,
    roll: -0.56,
    moon: 0.035,
    drift: 1,
    glow: 0.9,
    light: 0,
    field: 2.1,
    pan: -1.6,
  },
  timeline: {
    x: 0.86,
    y: 0.2,
    radius: 0.1,
    orbit: 7.2,
    outer: 9.8,
    tilt: 0.62,
    roll: -0.52,
    moon: 0.07,
    drift: 1,
    glow: 0.85,
    light: 0.15,
    field: 6,
    pan: -3.2,
  },
  discography: {
    x: 0.5,
    y: 1.72,
    radius: 1.15,
    orbit: 1.24,
    outer: 1.5,
    tilt: 1.47,
    roll: 0,
    moon: 0.02,
    drift: 1,
    glow: 1.3,
    light: 1,
    field: 1.3,
    pan: -4.8,
  },
  contact: {
    x: 0.5,
    y: 1.45,
    radius: 0.66,
    orbit: 1.7,
    outer: 2.3,
    tilt: 1.38,
    roll: 0.06,
    moon: 0.03,
    drift: 1,
    glow: 1.6,
    light: 1,
    field: 1.65,
    pan: -6.4,
  },
  notFound: {
    x: 0.78,
    y: 0.47,
    radius: 0.2,
    orbit: 1.9,
    outer: 2.6,
    tilt: 1.2,
    roll: -0.3,
    moon: 0.07,
    drift: 1.7,
    glow: 0.8,
    light: 0.3,
    field: 3,
    pan: 1.6,
  },
};

// Phones and portrait screens: the same story, re-framed so the copy keeps the lower half.
const tall: PoseTable = {
  hero: {
    x: 0.72,
    y: 0.325,
    radius: 0.4,
    orbit: 1.55,
    outer: 2.1,
    tilt: 1.28,
    roll: -0.3,
    moon: 0.055,
    drift: 1,
    glow: 1,
    light: 0,
    field: 2.4,
    pan: 0,
  },
  about: {
    x: 0.12,
    y: 0.27,
    radius: 0.66,
    orbit: 1.4,
    outer: 1.9,
    tilt: 1.36,
    roll: 0.4,
    moon: 0.04,
    drift: 1,
    glow: 0.9,
    light: 0,
    field: 2,
    pan: -1,
  },
  timeline: {
    x: 0.8,
    y: 0.15,
    radius: 0.15,
    orbit: 5.6,
    outer: 7.6,
    tilt: 0.55,
    roll: -0.7,
    moon: 0.1,
    drift: 1,
    glow: 0.85,
    light: 0.15,
    field: 5,
    pan: -2,
  },
  discography: {
    x: 0.5,
    y: 1.33,
    radius: 1.35,
    orbit: 1.2,
    outer: 1.45,
    tilt: 1.47,
    roll: 0,
    moon: 0.02,
    drift: 1,
    glow: 1.3,
    light: 1,
    field: 1.3,
    pan: -3,
  },
  contact: {
    x: 0.5,
    y: 1.38,
    radius: 0.95,
    orbit: 1.6,
    outer: 2.1,
    tilt: 1.38,
    roll: 0.06,
    moon: 0.03,
    drift: 1,
    glow: 1.6,
    light: 1,
    field: 1.65,
    pan: -4,
  },
  notFound: {
    x: 0.7,
    y: 0.27,
    radius: 0.32,
    orbit: 1.8,
    outer: 2.5,
    tilt: 1.2,
    roll: -0.3,
    moon: 0.07,
    drift: 1.6,
    glow: 0.8,
    light: 0.3,
    field: 2.6,
    pan: 1,
  },
};

// The stage's two compositions, the same rule as the wide/narrow variants in styles.css.
export const WIDE_QUERY = "(min-width: 48rem) and (min-aspect-ratio: 4/5)";

export function isTall(width: number, height: number): boolean {
  return width < 768 || width / height < 0.8;
}

export function poseFor(name: PoseName, tallScreen: boolean): Pose {
  return (tallScreen ? tall : wide)[name];
}

// Runs every frame, so a plain loop (no closures).
export function writePose(pose: Pose, target: Float32Array) {
  for (let index = 0; index < poseKeys.length; index++)
    target[index] = pose[poseKeys[index]];
}

// The hero planet's top edge sits halfway up STELLAR's caps; x isn't pinned, so wide screens keep it on the right.
export function heroY(y: number, radius: number, anchors: Anchors): number {
  const { wordmarkMiddle, width, height } = anchors;
  if (wordmarkMiddle === undefined) return y;
  return (wordmarkMiddle + radius * Math.min(width, height)) / height;
}
