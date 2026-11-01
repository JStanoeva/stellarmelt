import type { RootState } from "@react-three/fiber";
import {
  AddEquation,
  BufferAttribute,
  CustomBlending,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  NormalBlending,
  OneFactor,
  ShaderMaterial,
  Vector2,
  Vector3,
  type ShaderMaterialParameters,
} from "three";
import type { StarData } from "./flightData";
import type { Rig } from "./flightPlan";
import { streakFragment, streakVertex } from "./flightShaders";

// Stars as motion-blurred streaks: the geometry, the material and the per-frame sync every star layer shares.

// Light adds up (premultiplied, so it also covers the page while the sky fades in).
export const addLight = {
  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: CustomBlending,
  blendEquation: AddEquation,
  blendSrc: OneFactor,
  blendDst: OneFactor,
} satisfies ShaderMaterialParameters;

// Soft layers (sky, clouds, the galaxy's glow) lie over what's behind them.
export const layOver = {
  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: NormalBlending,
  premultipliedAlpha: true,
} satisfies ShaderMaterialParameters;

// One quad per star: x runs across the streak (-1 to 1), y from the star (0) to the end of its trail (1).
export function createStreakGeometry(stars: StarData): InstancedBufferGeometry {
  const geometry = new InstancedBufferGeometry();
  const corners = new Float32Array([-1, 0, 0, 1, 0, 0, -1, 1, 0, 1, 1, 0]);
  geometry.setAttribute("position", new BufferAttribute(corners, 3));
  geometry.setIndex([0, 2, 1, 2, 3, 1]);
  geometry.setAttribute(
    "aStar",
    new InstancedBufferAttribute(stars.positions, 3),
  );
  geometry.setAttribute("aSize", new InstancedBufferAttribute(stars.sizes, 1));
  geometry.setAttribute(
    "aColor",
    new InstancedBufferAttribute(stars.colors, 3),
  );
  geometry.setAttribute(
    "aPhase",
    new InstancedBufferAttribute(stars.phases, 1),
  );
  geometry.instanceCount = stars.count;
  return geometry;
}

type StreakOptions = {
  // Depth of a recycled field (0: stars stay put).
  wrap?: number;
  // Depths (world units) where stars fade in from nothing, and fade out again far away.
  near: [number, number];
  far: [number, number];
  // Stars nearer than boost[0] grow, up to boost[1] times their size.
  boost?: [number, number];
  twinkle?: number;
};

export function createStreakMaterial({
  wrap = 0,
  near,
  far,
  boost = [0, 1],
  twinkle = 0,
}: StreakOptions): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: streakVertex,
    fragmentShader: streakFragment,
    uniforms: {
      uResolution: { value: new Vector2(1, 1) },
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
      uTwinkle: { value: twinkle },
      uVelocity: { value: new Vector3() },
      uExposure: { value: 0 },
      uCamera: { value: new Vector3() },
      uWrap: { value: wrap },
      uNear: { value: new Vector2(...near) },
      uFar: { value: new Vector2(...far) },
      uBoost: { value: new Vector2(...boost) },
      uIntensity: { value: 1 },
    },
    ...addLight,
  });
}

// Per frame: the canvas size, the camera's motion and the clock.
export function syncStreaks(
  material: ShaderMaterial,
  state: RootState,
  rig: Rig,
  intensity: number,
) {
  const uniforms = material.uniforms;
  state.gl.getDrawingBufferSize(uniforms.uResolution.value);
  uniforms.uPixelRatio.value = state.viewport.dpr;
  uniforms.uTime.value = rig.t;
  uniforms.uVelocity.value.copy(rig.velocity);
  uniforms.uExposure.value = rig.exposure;
  uniforms.uCamera.value.copy(state.camera.position);
  uniforms.uIntensity.value = intensity;
}
