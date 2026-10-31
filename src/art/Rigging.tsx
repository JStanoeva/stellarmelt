import { useFrame, useThree, type RootState } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { Vector3 } from "three";
import type { Anchors } from "./anchors";
import { DUST_RECTS, type DustBurst } from "./dust";
import { backLight, frontLight } from "./palette";
import {
  heroY,
  isTall,
  MOON_HOLD_SWING,
  MOON_SPEED,
  MOON_START,
  poseFor,
  writePose,
  type PoseName,
} from "./poses";
import { P, type Rig } from "./rig";

// A critically damped spring: the planet glides into its next pose in about 0.8 s, mostly before the new copy condenses.
const STIFFNESS = 50;
const DAMPING = 2 * Math.sqrt(STIFFNESS);
const SPRING_STEP = 1 / 120;
// After a step the planet holds its pose this long (ms), so the words dissolve before the sky moves.
const HOLD_MS = 120;
// How far the near layer (planet) slides with the pointer, as a share of the viewport.
const PLANET_PARALLAX = 0.018;
// Share of its size the planet gives up at full travel speed.
const TRAVEL_RECEDE = 0.3;
// The moon glides into the timeline's ring from this far back up its arc (radians).
const MOON_STIFFNESS = 25;
const MOON_APPROACH = 0.3;
const TAU = Math.PI * 2;
const CAMERA_Z = 24;

type Props = {
  rig: Rig;
  pose: PoseName;
  anchors: Anchors;
  reduced: boolean;
  dust?: RefObject<DustBurst | null>;
  onReady: () => void;
};

const ray = new Vector3();
const orbitNormal = new Vector3();
const parked = { radius: 0, angle: 0 };

// Where the camera ray through a screen point meets the orbit's plane: that point's orbit radius and angle, into `parked`.
function orbitThrough(
  x: number,
  y: number,
  state: RootState,
  centreX: number,
  centreY: number,
  radius: number,
  tilt: number,
  roll: number,
) {
  const { size, viewport } = state;
  const st = Math.sin(tilt);
  const ct = Math.cos(tilt);
  const sr = Math.sin(roll);
  const cr = Math.cos(roll);
  ray.set(
    (x / size.width - 0.5) * viewport.width,
    (0.5 - y / size.height) * viewport.height,
    -CAMERA_Z,
  );
  orbitNormal.set(-st * sr, st * cr, ct);
  const facing = ray.dot(orbitNormal);
  if (Math.abs(facing) < 1e-4) return false;
  const s =
    (centreX * orbitNormal.x +
      centreY * orbitNormal.y -
      CAMERA_Z * orbitNormal.z) /
    facing;
  const dx = ray.x * s - centreX;
  const dy = ray.y * s - centreY;
  const dz = CAMERA_Z + ray.z * s;
  const lx = dx * cr + dy * sr;
  const ly = (dy * cr - dx * sr) * ct - dz * st;
  parked.radius = Math.hypot(lx, ly) / radius;
  parked.angle = Math.atan2(ly, lx);
  return true;
}

// Drives the rig before the layers draw (priority -1): pose springs, pins to the copy, pointer smoothing, stardust timing.
export default function Rigging({
  rig: sharedRig,
  pose,
  anchors,
  reduced,
  dust,
  onReady,
}: Props) {
  // The frame loop writes the shared rig outside React, so it reaches it through a ref.
  const rigRef = useRef(sharedRig);
  const invalidate = useThree((state) => state.invalidate);
  const pointer = useRef({ x: 0, y: 0, px: 0, py: 0, present: 0 });
  const held = useRef({ name: pose, next: pose, since: 0 });
  const frames = useRef(0);
  const lastBurst = useRef(-Infinity);
  const readyCallback = useRef(onReady);

  useEffect(() => {
    readyCallback.current = onReady;
  }, [onReady]);

  // Under reduced motion the canvas renders on demand: one still frame per pose.
  useEffect(() => {
    invalidate();
  }, [pose, anchors, reduced, invalidate]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const state = pointer.current;
      state.x = (event.clientX / window.innerWidth) * 2 - 1;
      state.y = 1 - (event.clientY / window.innerHeight) * 2;
      state.px = event.clientX;
      state.py = window.innerHeight - event.clientY;
      state.present = 1;
    };
    const onLeave = () => {
      pointer.current.present = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    // Up to 0.5 s per frame, so a paced canvas keeps real time; small spring steps keep that stable.
    const dt = Math.min(delta, 0.5);
    const { size, viewport } = state;
    const now = performance.now();
    const tallScreen = isTall(size.width, size.height);

    const hold = held.current;
    if (pose !== hold.next) {
      hold.next = pose;
      hold.since = now;
    }
    if (
      hold.name !== hold.next &&
      (reduced || !rig.ready || now - hold.since >= HOLD_MS)
    )
      hold.name = hold.next;
    const shown = hold.name;

    const follow = reduced ? 1 : 1 - Math.exp(-dt * 3.2);
    const input = pointer.current;
    rig.parallax.x += ((reduced ? 0 : input.x) - rig.parallax.x) * follow;
    rig.parallax.y += ((reduced ? 0 : input.y) - rig.parallax.y) * follow;
    rig.pointer.x = input.px;
    rig.pointer.y = input.py;
    rig.pointer.z += ((reduced ? 0 : input.present) - rig.pointer.z) * follow;
    const slide = PLANET_PARALLAX * viewport.width;

    const target = rig.target;
    writePose(poseFor(shown, tallScreen), target);
    if (shown === "hero" && !tallScreen)
      target[P.y] = heroY(target[P.y], target[P.radius], anchors);
    let parkAt: number | null = null;
    if (shown === "timeline" && anchors.ring) {
      const centreX =
        (target[P.x] - 0.5) * viewport.width - rig.parallax.x * slide;
      const centreY =
        (0.5 - target[P.y]) * viewport.height - rig.parallax.y * slide;
      const radius =
        target[P.radius] * Math.min(viewport.width, viewport.height);
      if (
        orbitThrough(
          anchors.ring.x,
          anchors.ring.y,
          state,
          centreX,
          centreY,
          radius,
          target[P.tilt],
          target[P.roll],
        )
      ) {
        target[P.outer] *= parked.radius / target[P.orbit];
        target[P.orbit] = parked.radius;
        parkAt = parked.angle;
      }
    }

    const parkGoal = parkAt === null ? 0 : 1;
    if (reduced || !rig.ready) {
      rig.pose.set(target);
      rig.velocity.fill(0);
      rig.moon = parkAt ?? MOON_START;
      rig.moonSpeed = parkAt === null ? MOON_SPEED : 0;
      rig.park = parkGoal;
    } else {
      rig.park += (parkGoal - rig.park) * (1 - Math.exp(-dt * 3));
      const steps = Math.ceil(dt / SPRING_STEP);
      const h = dt / steps;
      for (let step = 0; step < steps; step++) {
        for (let index = 0; index < rig.pose.length; index++) {
          const force =
            (target[index] - rig.pose[index]) * STIFFNESS -
            rig.velocity[index] * DAMPING;
          rig.velocity[index] += force * h;
          rig.pose[index] += rig.velocity[index] * h;
        }
      }
      if (parkAt === null) {
        rig.moonSpeed +=
          (MOON_SPEED - rig.moonSpeed) * (1 - Math.exp(-dt * 1.5));
        rig.moon += rig.moonSpeed * dt;
      } else if (Math.abs(rig.velocity[P.orbit]) > MOON_HOLD_SWING) {
        // While the orbit swings open the moon is hidden (see Orbits) and waits up the arc, behind the ring.
        rig.moon = parkAt - MOON_APPROACH;
        rig.moonSpeed = 0;
      } else {
        // Then it glides down the arc into the nearest turn of the ring's angle.
        const goal = parkAt + Math.round((rig.moon - parkAt) / TAU) * TAU;
        for (let step = 0; step < steps; step++) {
          rig.moonSpeed +=
            ((goal - rig.moon) * MOON_STIFFNESS -
              rig.moonSpeed * 2 * Math.sqrt(MOON_STIFFNESS)) *
            h;
          rig.moon += rig.moonSpeed * h;
        }
      }
      rig.time += dt;
    }

    const p = rig.pose;
    const speed = Math.hypot(
      rig.velocity[P.x] * size.width,
      rig.velocity[P.y] * size.height,
    );
    rig.wake = Math.min(speed / 1400, 1);
    // While it travels the planet recedes a little, so a flight across the page never floods it with light.
    const depth = 1 - TRAVEL_RECEDE * rig.wake;

    rig.radius =
      p[P.radius] * Math.min(viewport.width, viewport.height) * depth;
    rig.centre.set(
      (p[P.x] - 0.5) * viewport.width - rig.parallax.x * slide,
      (0.5 - p[P.y]) * viewport.height - rig.parallax.y * slide,
      0,
    );
    const slidePx = PLANET_PARALLAX * size.width;
    rig.screen.set(
      p[P.x] * size.width - rig.parallax.x * slidePx,
      (1 - p[P.y]) * size.height - rig.parallax.y * slidePx,
      p[P.radius] * Math.min(size.width, size.height) * depth,
    );
    rig.light.copy(frontLight).lerp(backLight, p[P.light]).normalize();

    const burst = dust?.current;
    if (burst && burst.startedAt !== lastBurst.current) {
      lastBurst.current = burst.startedAt;
      measureHaze(burst, rig, size.height);
    }
    rig.dustT = burst && !reduced ? (now - burst.startedAt) / 1000 : -1;

    if (!rig.ready) rig.ready = true;
    frames.current += 1;
    // Fade the canvas in once its first frame is on screen.
    if (frames.current === 2) readyCallback.current();
    else if (frames.current === 1) invalidate();
  }, -1);

  return null;
}

// The haze sits on the entering copy: the centre and size of its lines' bounding box.
function measureHaze(burst: DustBurst, rig: Rig, height: number) {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (let index = 0; index < DUST_RECTS; index++) {
    const offset = index * 4;
    if (burst.enter[offset + 2] - burst.enter[offset] <= 0) continue;
    left = Math.min(left, burst.enter[offset]);
    top = Math.min(top, burst.enter[offset + 1]);
    right = Math.max(right, burst.enter[offset + 2]);
    bottom = Math.max(bottom, burst.enter[offset + 3]);
  }
  if (left > right) {
    rig.haze.set(0, 0, 1, 0);
    return;
  }
  rig.haze.set(
    (left + right) / 2,
    height - (top + bottom) / 2,
    Math.max(right - left, bottom - top) * 0.6,
    1,
  );
}
