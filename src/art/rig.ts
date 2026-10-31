import { Vector2, Vector3, Vector4 } from "three";
import { MOON_START, poseKeys } from "./poses";

// Shared, mutable per-frame state of the scene: the rig writes it once per frame, the layers only read it.
export type Rig = {
  pose: Float32Array;
  velocity: Float32Array;
  target: Float32Array;
  // Animation clock in seconds; it stands still under reduced motion and while the tab is hidden.
  time: number;
  // Planet centre in world units (parallax included) and its radius.
  centre: Vector3;
  radius: number;
  // The current light direction (view space), blended per pose.
  light: Vector3;
  // Planet centre in CSS px from the bottom-left corner; z is its radius in px.
  screen: Vector3;
  // Smoothed pointer, -1..1 on both axes.
  parallax: Vector2;
  // Pointer in CSS px from the bottom-left corner; z is how present it is (0..1).
  pointer: Vector3;
  // The moon's angle on its orbit (radians) and its angular speed.
  moon: number;
  moonSpeed: number;
  // 0..1: how far the moon has settled into the timeline's ring.
  park: number;
  // 0..1: how fast the planet is travelling between poses.
  wake: number;
  // Seconds since the current step's stardust burst started; negative when idle.
  dustT: number;
  // The nebula haze the entering copy condenses from: centre (CSS px from the bottom-left), radius, on/off.
  haze: Vector4;
  ready: boolean;
};

export const P = Object.fromEntries(
  poseKeys.map((key, index) => [key, index]),
) as Record<(typeof poseKeys)[number], number>;

export function createRig(): Rig {
  return {
    pose: new Float32Array(poseKeys.length),
    velocity: new Float32Array(poseKeys.length),
    target: new Float32Array(poseKeys.length),
    time: 0,
    centre: new Vector3(),
    radius: 1,
    light: new Vector3(0, 0, 1),
    screen: new Vector3(),
    parallax: new Vector2(),
    pointer: new Vector3(),
    moon: MOON_START,
    moonSpeed: 0,
    park: 0,
    wake: 0,
    dustT: -1,
    haze: new Vector4(),
    ready: false,
  };
}
