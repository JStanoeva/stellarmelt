import { MathUtils, Quaternion, Vector2, Vector3 } from "three";
import type { DiveStart } from "./flight";

// The flight's timing and camera path, in seconds and world units; the camera flies along -z.

const CRUISE_SPEED = 9;
const PEAK_SPEED = 175;
// The camera crosses the galaxy's disc at PASS_T; the Listening Room opens at LAND_T, mid-flight.
export const PASS_T = 1;
export const LAND_T = 1.2;
const RISE = 0.34;
const SETTLE = 0.6;
// The deep sky fades in quickly for a dive, gently for a direct visit.
const BG_DIVE = 0.7;
const BG_CRUISE = 0.8;
// Longer frames are clamped, so a hitch (a shader compiling, a tab coming back) never jumps the flight ahead.
const MAX_STEP = 1 / 20;
// Motion blur: at most this long a trail in time and this far in space, so the fastest moment never smears.
const EXPOSURE = 0.05;
const MAX_TRAIL = 2.6;
// Every recycled field repeats a whole number of times in this depth, so the camera hops back by it unseen (no float drift).
export const LOOP_DEPTH = 1120;

// NebulaArt draws the nebula rotate(-22) scale(1 0.46): a disc tilted acos(0.46) away, its long axis rising 22° to the right.
const INCLINATION = Math.acos(0.46);
const ROLL = MathUtils.degToRad(22);
// The camera crosses the disc this far from the core (in galaxy radii): through the arms, never into the bright centre.
const PASS_OFFSET = 0.42;
// NebulaArt's hover turn: one turn in 9 s, clockwise on screen.
export const SPIN_RATE = -(Math.PI * 2) / 9;

function cruiseSpeed(t: number): number {
  return CRUISE_SPEED * (1 + 0.12 * Math.sin(t * 0.19 + 0.5));
}

// Held breath, then the rush: the speed peaks as the camera punches through the disc, then settles.
function diveSpeed(t: number): number {
  const rush =
    t < PASS_T
      ? Math.exp(-(((t - PASS_T) / RISE) ** 2))
      : Math.exp(-(t - PASS_T) / SETTLE);
  return (
    cruiseSpeed(t) * MathUtils.smoothstep(t, 0.25, 1.1) +
    (PEAK_SPEED - CRUISE_SPEED) * rush
  );
}

// The galaxy closes in on its own clock: an easing zoom (it fills the screen around 0.7 s), then a straight punch at PASS_T.
const GALAXY_DISTANCE = 60;
const ZOOM_END = 0.9;
const ease = (x: number) => x * x * (2 - x);
const easeSlope = (x: number) => 4 * x - 3 * x * x;
const ZOOM_LEFT = (1 - ease(ZOOM_END)) ** 2;
const PUNCH_SLOPE = 2 * (1 - ease(ZOOM_END)) * easeSlope(ZOOM_END);
const APPROACH_T = PASS_T / (ZOOM_END + ZOOM_LEFT / PUNCH_SLOPE);

// How much of the galaxy's starting distance is still ahead at t (below 0 once the camera is through).
export function approach(t: number): number {
  const x = t / APPROACH_T;
  if (x <= ZOOM_END) return (1 - ease(Math.max(x, 0))) ** 2;
  return ZOOM_LEFT - PUNCH_SLOPE * (x - ZOOM_END);
}

// World units per second at which the galaxy closes in (for its stars' motion blur).
export function approachSpeed(t: number): number {
  return (GALAXY_DISTANCE * (approach(t) - approach(t + 0.004))) / 0.004;
}

// Phones get a wider view, so the stars still rush past the sides of a tall screen.
export function fovFor(aspect: number): number {
  return MathUtils.lerp(72, 60, MathUtils.smoothstep(aspect, 0.6, 1.2));
}

// The live state of the flight, written by FlightCamera each frame and read by every layer.
export type Rig = {
  t: number;
  z: number;
  speed: number;
  velocity: Vector3;
  exposure: number;
  // The deep sky's opacity: 0 shows the page under the canvas, 1 is all space.
  bg: number;
  still: boolean;
  diving: boolean;
  landed: boolean;
};

export function createRig(diving: boolean, still: boolean): Rig {
  return {
    t: 0,
    z: 0,
    speed: 0,
    velocity: new Vector3(),
    exposure: 0,
    bg: still ? 1 : 0,
    still,
    diving,
    landed: false,
  };
}

// One frame of travel: speed, position along -z, motion blur and the sky's fade.
export function advance(rig: Rig, delta: number) {
  if (rig.still) return;
  const step = Math.min(delta, MAX_STEP);
  rig.t += step;
  const { t } = rig;
  // A direct visit eases up to speed as the sky fades in.
  rig.speed = rig.diving
    ? diveSpeed(t)
    : cruiseSpeed(t) * MathUtils.lerp(0.5, 1, MathUtils.smoothstep(t, 0, 1.6));
  rig.z -= rig.speed * step;
  if (rig.z < -2 * LOOP_DEPTH) rig.z += LOOP_DEPTH;
  rig.velocity.set(0, 0, -rig.speed);
  rig.exposure = Math.min(EXPOSURE, MAX_TRAIL / Math.max(rig.speed, 1));
  rig.bg = MathUtils.smoothstep(t, 0, rig.diving ? BG_DIVE : BG_CRUISE);
}

export type Drift = {
  x: number;
  y: number;
  yaw: number;
  pitch: number;
  roll: number;
};

// The cruise's slow wandering: a little yaw and pitch, banking into each turn, a gentle sway.
export function drift(t: number, out: Drift): Drift {
  out.yaw = 0.075 * Math.sin(t * 0.083) + 0.03 * Math.sin(t * 0.21 + 1.3);
  out.pitch =
    0.045 * Math.sin(t * 0.067 + 0.6) + 0.02 * Math.sin(t * 0.19 + 2.1);
  const turning =
    0.075 * 0.083 * Math.cos(t * 0.083) +
    0.03 * 0.21 * Math.cos(t * 0.21 + 1.3);
  out.roll = turning * 9 + 0.035 * Math.sin(t * 0.05 + 0.4);
  out.x = 1.3 * Math.sin(t * 0.11 + 0.3);
  out.y = 0.9 * Math.sin(t * 0.087 + 1.7);
  return out;
}

// After a dive the wandering fades in once the camera is through the galaxy.
export function driftShare(rig: Rig): number {
  return rig.diving ? MathUtils.smoothstep(rig.t, 1.3, 4.5) : 1;
}

// How far the camera has turned from the pressed nebula towards the flight path.
export function turnShare(rig: Rig): number {
  return MathUtils.smootherstep(rig.t, 0.05, 0.95);
}

export type DivePlan = {
  // The galaxy's centre at the press, with the camera at the origin; it then closes in by approach().
  center: Vector3;
  distance: number;
  radius: number;
  // The galaxy's orientation, and the camera's at the press (looking at the galaxy where the nebula was).
  orient: Quaternion;
  look: Quaternion;
  spin: number;
  // The nebula's radius on screen at the press, in CSS px.
  startPx: number;
};

const X_AXIS = new Vector3(1, 0, 0);
const Z_AXIS = new Vector3(0, 0, 1);
const TILT = new Quaternion()
  .setFromAxisAngle(Z_AXIS, ROLL)
  .multiply(new Quaternion().setFromAxisAngle(X_AXIS, -INCLINATION));

// Lines the galaxy up with the pressed nebula (place, size, tilt), its disc across the path and its core off to the nebula's side.
export function planDive(
  start: DiveStart,
  width: number,
  height: number,
  fov: number,
): DivePlan {
  const tanHalf = Math.tan(MathUtils.degToRad(fov) / 2);
  const ndc = new Vector2(
    (start.x / width) * 2 - 1,
    1 - (start.y / height) * 2,
  );
  const seen = new Vector3(
    ndc.x * tanHalf * (width / height),
    ndc.y * tanHalf,
    -1,
  ).normalize();

  // The in-plane direction from the crossing point to the core that shows up on screen as `away`.
  const away =
    ndc.length() > 0.08 ? ndc.clone().normalize() : new Vector2(-0.45, 0.89);
  const e1 = X_AXIS.clone().applyQuaternion(TILT);
  const e2 = new Vector3(0, 1, 0).applyQuaternion(TILT);
  const det = e1.x * e2.y - e2.x * e1.y;
  const side = new Vector3(
    (away.x * e2.y - e2.x * away.y) / det,
    (e1.x * away.y - away.x * e1.y) / det,
    0,
  ).normalize();

  const pass = new Vector3(0, 0, -GALAXY_DISTANCE);
  const center = pass.clone();
  const look = new Quaternion();
  const orient = new Quaternion();
  let radius = 1;
  // Size, place and view depend on each other a little; a few rounds settle them.
  for (let round = 0; round < 4; round++) {
    orient.copy(look).multiply(TILT);
    radius = (start.size / height) * center.length() * tanHalf;
    center
      .copy(side)
      .applyQuaternion(orient)
      .multiplyScalar(PASS_OFFSET * radius)
      .add(pass);
    look.setFromUnitVectors(seen, center.clone().normalize());
  }
  return {
    center,
    distance: GALAXY_DISTANCE,
    radius,
    orient,
    look,
    spin: -start.spin,
    startPx: start.size / 2,
  };
}
