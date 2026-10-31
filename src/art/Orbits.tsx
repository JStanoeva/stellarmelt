import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MathUtils, type Group, type Mesh, type ShaderMaterial } from "three";
import { frontLight, palette } from "./palette";
import { MOON_HOLD_SWING, MOON_SPEED, MOON_START } from "./poses";
import { P, type Rig } from "./rig";
import {
  dotFragment,
  moonFragment,
  orbitVertex,
  sphereVertex,
} from "./shaders";

const INNER_DOTS = 840;
const OUTER_DOTS = 160;
// Above this radius (px) an orbit shows all its dots; smaller ones show every other dot.
const FINE_FROM = 700;
const FINE_TO = 1100;

// One dot per entry: position.x holds its angle, position.y marks every other dot when `alternate`.
function orbitAngles(count: number, alternate: boolean): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index++) {
    positions[index * 3] = (index / count) * Math.PI * 2;
    positions[index * 3 + 1] = alternate ? index % 2 : 0;
  }
  return positions;
}

function dotUniforms(
  size: number,
  opacity: number,
  color: (typeof palette)[keyof typeof palette],
) {
  return {
    uRadius: { value: 1.6 },
    uSpin: { value: 0 },
    uSize: { value: size },
    uPixelRatio: { value: 1 },
    uOpacity: { value: opacity },
    uColor: { value: color },
    uGlint: { value: palette.stardust50 },
    uMoon: { value: MOON_START },
    uTrail: { value: 0 },
    uFine: { value: 1 },
    uAhead: { value: 0 },
  };
}

// The dotted orbits and the moon in planet space (radius 1); the depth buffer hides their far half behind the planet.
export default function Orbits({ rig }: { rig: Rig }) {
  const tilt = useRef<Group>(null);
  const moon = useRef<Mesh>(null);
  const innerMaterial = useRef<ShaderMaterial>(null);
  const outerMaterial = useRef<ShaderMaterial>(null);
  const inner = useMemo(() => orbitAngles(INNER_DOTS, true), []);
  const outer = useMemo(() => orbitAngles(OUTER_DOTS, false), []);
  const innerUniforms = useMemo(
    () => dotUniforms(1.9, 0.85, palette.rose200),
    [],
  );
  const outerUniforms = useMemo(
    () => dotUniforms(2.4, 0.4, palette.starlight300),
    [],
  );
  const moonMaterial = useRef<ShaderMaterial>(null);
  const moonUniforms = useMemo(
    () => ({
      uLight: { value: frontLight.clone() },
      uLit: { value: palette.rose300 },
      uShade: { value: palette.plum600 },
      uRim: { value: palette.rose200 },
    }),
    [],
  );

  useFrame((state) => {
    if (
      !tilt.current ||
      !moon.current ||
      !innerMaterial.current ||
      !outerMaterial.current ||
      !moonMaterial.current
    )
      return;
    const p = rig.pose;
    // Tilt first (around x), then roll the ellipse on screen (around z); the near half dips below the planet.
    tilt.current.rotation.set(-p[P.tilt], 0, p[P.roll], "ZXY");

    const innerDots = innerMaterial.current.uniforms;
    innerDots.uRadius.value = p[P.orbit];
    innerDots.uSpin.value = rig.time * 0.035;
    innerDots.uPixelRatio.value = state.viewport.dpr;
    innerDots.uMoon.value = rig.moon;
    // The trail glows while the moon orbits or rests in the timeline's ring, not once it leaves its orbit (the 404).
    const moving = Math.min(1, Math.abs(rig.moonSpeed) / MOON_SPEED);
    innerDots.uTrail.value =
      Math.max(0, Math.min(1, 2 - p[P.drift])) *
      Math.max(moving, rig.park * 0.75);
    innerDots.uAhead.value = rig.park;
    const orbitPx = rig.screen.z * p[P.orbit];
    innerDots.uFine.value = Math.min(
      1,
      Math.max(0, (orbitPx - FINE_FROM) / (FINE_TO - FINE_FROM)),
    );
    const outerDots = outerMaterial.current.uniforms;
    outerDots.uRadius.value = p[P.outer];
    outerDots.uOpacity.value = 0.4 * (1 - rig.park);
    outerDots.uSpin.value = -rig.time * 0.02;
    outerDots.uPixelRatio.value = state.viewport.dpr;

    const distance = p[P.orbit] * p[P.drift];
    moon.current.position.set(
      Math.cos(rig.moon) * distance,
      Math.sin(rig.moon) * distance,
      0,
    );
    // Hidden while its orbit swings wide open or shut (to and from the timeline), so it never streaks across the copy.
    const swing = Math.abs(rig.velocity[P.orbit]);
    moon.current.scale.setScalar(
      p[P.moon] *
        (1 -
          MathUtils.smoothstep(swing, MOON_HOLD_SWING, MOON_HOLD_SWING * 2.5)),
    );
    moonMaterial.current.uniforms.uLight.value.copy(rig.light);
  });

  return (
    <group ref={tilt}>
      <points frustumCulled={false} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[inner, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={innerMaterial}
          vertexShader={orbitVertex}
          fragmentShader={dotFragment}
          uniforms={innerUniforms}
          transparent
          depthWrite={false}
        />
      </points>
      {/* The faint outer orbit leans a little off the inner one. */}
      <group rotation={[0.16, 0, -0.1]}>
        <points frustumCulled={false} renderOrder={1}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[outer, 3]} />
          </bufferGeometry>
          <shaderMaterial
            ref={outerMaterial}
            vertexShader={orbitVertex}
            fragmentShader={dotFragment}
            uniforms={outerUniforms}
            transparent
            depthWrite={false}
          />
        </points>
      </group>
      <mesh ref={moon}>
        <sphereGeometry args={[1, 32, 24]} />
        <shaderMaterial
          ref={moonMaterial}
          vertexShader={sphereVertex}
          fragmentShader={moonFragment}
          uniforms={moonUniforms}
        />
      </mesh>
    </group>
  );
}
