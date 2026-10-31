import { poseFor } from "../../art/poses";
import { members } from "../../content/members";

// The band's orbit: a circle round the About pose's planet, in CSS px from the viewport's top left.
export type Orbit = {
  cx: number;
  cy: number;
  radius: number;
  // The front slot's angle and the gap between slots, in degrees counter-clockwise from 3 o'clock.
  front: number;
  step: number;
  // -1: the next member sits clockwise of the front (down the limb on wide screens); 1: counter-clockwise (phones).
  turn: 1 | -1;
  // Moons shown before the front one: the slots run from -before to count - 1 - before.
  before: number;
};

type Point = { x: number; y: number };

const count = members.length;
const degree = Math.PI / 180;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// nameY: where the selected member's name sits on wide screens, so the front moon can line up with it.
export function orbitFor(width: number, height: number, tall: boolean, nameY?: number): Orbit {
  const pose = poseFor("about", tall);
  const cx = pose.x * width;
  const cy = pose.y * height;
  const planet = pose.radius * Math.min(width, height);

  if (tall) {
    // Phones: the front moon rests under the planet and the last one stays clear of the dots.
    const radius = planet * 1.12;
    const front = -90;
    const last = -Math.acos(clamp((width - 92 - cx) / radius, -1, 1)) / degree;
    const step = Math.min((last - front) / (count - 1), 14);
    return { cx, cy, radius, front, step, turn: 1, before: 0 };
  }

  // Wide screens: two moons above the front and three below, kept clear of the navbar and the bottom edge.
  const radius = planet * 1.16;
  const front =
    nameY === undefined ? 0 : clamp(Math.asin(clamp((cy - nameY) / radius, -1, 1)) / degree, -20, 20);
  const before = 2;
  const after = count - 1 - before;
  const top = Math.asin(clamp((cy - 120) / radius, -1, 1)) / degree;
  const bottom = Math.asin(clamp((height - 64 - cy) / radius, -1, 1)) / degree;
  // At least a 48 px arc between moons (their targets are 44 px); on short screens the outer ones run off the edge.
  const step = Math.max(
    Math.min(16, (top - front) / before, (bottom + front) / after),
    48 / radius / degree,
  );
  return { cx, cy, radius, front, step, turn: -1, before };
}

export function slotPoint(orbit: Orbit, offset: number): Point {
  const angle = (orbit.front + orbit.turn * offset * orbit.step) * degree;
  return {
    x: orbit.cx + orbit.radius * Math.cos(angle),
    y: orbit.cy - orbit.radius * Math.sin(angle),
  };
}

// Folds a moon's distance from the front into the run of slots, plus half a slot at each end where it wraps round.
export function wrapOffset(orbit: Orbit, offset: number): number {
  const low = -orbit.before - 0.5;
  return ((((offset - low) % count) + count) % count) + low;
}

// 1 on the slots, 0 half a slot past either end, so a wrapping moon slips behind the planet unseen.
export function endFade(orbit: Orbit, offset: number): number {
  const first = -orbit.before;
  const last = count - 1 - orbit.before;
  return clamp(Math.min(offset - first, last - offset) * 2 + 1, 0, 1);
}

// The front moon is full size and the others shrink with distance; the parents stay a little larger.
export function moonScale(offset: number, parent: boolean): number {
  const near = clamp(1 - Math.abs(offset), 0, 1);
  const eased = near * near * (3 - 2 * near);
  const rest = parent ? 0.5 : 0.4;
  const full = parent ? 1 : 0.86;
  return rest + (full - rest) * eased;
}

// Where the moons rise from as the section arrives: past the lower end on wide screens, behind the planet on phones.
export function entryOffset(orbit: Orbit): number {
  return orbit.turn < 0 ? count - 0.5 - orbit.before : -orbit.before - 0.5;
}

// As the section leaves, the moons drift on along the arc, the way they rose.
export function exitDrift(orbit: Orbit): number {
  return orbit.turn < 0 ? -1 : 1;
}

export function arcPath(orbit: Orbit, from: number, to: number): string {
  const start = slotPoint(orbit, from);
  const end = slotPoint(orbit, to);
  const sweep = orbit.turn < 0 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${orbit.radius} ${orbit.radius} 0 0 ${sweep} ${end.x} ${end.y}`;
}

// Half the length of the lit stretch of orbit at the front, in px.
export function frontGlowLength(orbit: Orbit): number {
  return orbit.radius * orbit.step * degree * 0.75;
}

// Phones start the copy below the front moon and its name.
export function orbitBottom(orbit: Orbit): number {
  return slotPoint(orbit, 0).y + 56;
}
