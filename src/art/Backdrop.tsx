import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  MathUtils,
  Vector2,
  Vector3,
  Vector4,
  type ShaderMaterial,
} from "three";
import { palette } from "./palette";
import { P, type Rig } from "./rig";
import { backdropFragment, backdropVertex } from "./shaders";

// How far the halftone field slides with the pointer, in CSS px (less than the planet: it sits behind it).
const FIELD_PARALLAX = 9;

// The night sky behind everything: one full-screen quad (nebula wisps, haze, halftone field).
export default function Backdrop({ rig }: { rig: Rig }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uResolution: { value: new Vector2(1, 1) },
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
      uPlanet: { value: new Vector3() },
      uField: { value: 1 },
      uPointer: { value: new Vector3() },
      uShift: { value: new Vector2() },
      uWake: { value: 0 },
      uHaze: { value: new Vector4() },
      uNight: { value: palette.night950 },
      uLift: { value: palette.night800 },
      uPlum: { value: palette.plum800 },
      uRose: { value: palette.rose600 },
      uDot: { value: palette.mauve400 },
    }),
    [],
  );

  useFrame((state) => {
    if (!material.current) return;
    // R3F copies each uniform entry into the material, so live values go through the material itself.
    const u = material.current.uniforms;
    const { width, height } = state.size;
    u.uResolution.value.set(width, height);
    u.uPixelRatio.value = state.viewport.dpr;
    u.uTime.value = rig.time;
    u.uPlanet.value.copy(rig.screen);
    u.uField.value = Math.max(
      rig.screen.z * rig.pose[P.field],
      Math.min(width, height) * 0.45,
    );
    u.uPointer.value.copy(rig.pointer);
    u.uShift.value.set(
      rig.parallax.x * FIELD_PARALLAX,
      rig.parallax.y * FIELD_PARALLAX,
    );
    u.uWake.value = rig.wake;

    // The haze swells as the entering copy starts to condense, then clears.
    const t = rig.dustT;
    const amount =
      t < 0
        ? 0
        : MathUtils.smoothstep(t, 0.2, 0.5) *
          (1 - MathUtils.smoothstep(t, 0.75, 1.5));
    u.uHaze.value.set(rig.haze.x, rig.haze.y, rig.haze.z, amount * rig.haze.w);
  });

  return (
    <mesh renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[2, 2, 72, 48]} />
      <shaderMaterial
        ref={material}
        vertexShader={backdropVertex}
        fragmentShader={backdropFragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
