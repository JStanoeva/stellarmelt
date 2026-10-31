import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  type Group,
  type Mesh,
  type ShaderMaterial,
} from "three";
import Orbits from "./Orbits";
import { frontLight, palette } from "./palette";
import { P, type Rig } from "./rig";
import {
  glowFragment,
  glowVertex,
  planetFragment,
  planetVertex,
} from "./shaders";

// The halo ring reaches this far from the centre, in planet radii (it has faded out well before).
const GLOW_EXTENT = 1.9;
const GLOW_STRENGTH = 0.3;

export default function Planet({ rig }: { rig: Rig }) {
  const group = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  const surface = useRef<ShaderMaterial>(null);
  const halo = useRef<ShaderMaterial>(null);

  const surfaceUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLight: { value: frontLight.clone() },
      uDeep: { value: palette.night700 },
      uPlum: { value: palette.plum600 },
      uMauve: { value: palette.mauve400 },
      uRose: { value: palette.rose400 },
      uBlush: { value: palette.rose200 },
      uRim: { value: palette.rose300 },
      uBack: { value: palette.rose600 },
      uSheen: { value: palette.stardust50 },
    }),
    [],
  );
  const haloUniforms = useMemo(
    () => ({
      uInner: { value: palette.rose400 },
      uOuter: { value: palette.mauve500 },
      uStrength: { value: GLOW_STRENGTH },
      uExtent: { value: GLOW_EXTENT },
      uLight: { value: frontLight.clone() },
    }),
    [],
  );

  useFrame(() => {
    if (!group.current || !body.current || !surface.current || !halo.current)
      return;
    group.current.position.copy(rig.centre);
    group.current.scale.setScalar(rig.radius);
    body.current.rotation.y = rig.time * 0.045;
    surface.current.uniforms.uTime.value = rig.time;
    surface.current.uniforms.uLight.value.copy(rig.light);
    halo.current.uniforms.uStrength.value = GLOW_STRENGTH * rig.pose[P.glow];
    halo.current.uniforms.uLight.value.copy(rig.light);
  });

  return (
    <group ref={group}>
      {/* Axial tilt, so the belts run on a slant like the orbit. */}
      <group rotation={[0.3, 0, -0.26]}>
        <mesh ref={body}>
          <sphereGeometry args={[1, 96, 72]} />
          <shaderMaterial
            ref={surface}
            vertexShader={planetVertex}
            fragmentShader={planetFragment}
            uniforms={surfaceUniforms}
          />
        </mesh>
      </group>
      <mesh position={[0, 0, -0.02]} renderOrder={2}>
        <ringGeometry args={[0.9, GLOW_EXTENT, 160, 1]} />
        <shaderMaterial
          ref={halo}
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={haloUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <Orbits rig={rig} />
    </group>
  );
}
