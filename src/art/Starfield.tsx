import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points, ShaderMaterial } from "three";
import { palette } from "./palette";
import { seededRandom } from "./random";
import { P, type Rig } from "./rig";
import { starFragment, starVertex } from "./shaders";

const STAR_COUNT = 900;
const tints = [
  palette.stardust50,
  palette.stardust50,
  palette.starlight200,
  palette.rose200,
  palette.mauve200,
];

function makeStars() {
  const random = seededRandom(7);
  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const phases = new Float32Array(STAR_COUNT);
  const colors = new Float32Array(STAR_COUNT * 3);
  for (let index = 0; index < STAR_COUNT; index++) {
    // Wide enough for the pan across all five sections, deep enough to sit far behind the planet.
    positions.set(
      [(random() * 2 - 1) * 27, (random() * 2 - 1) * 12, -15 - random() * 30],
      index * 3,
    );
    sizes[index] =
      random() < 0.06 ? 2.6 + random() * 1.2 : 1.2 + random() * 1.1;
    phases[index] = random();
    const tint = tints[Math.floor(random() * tints.length)];
    colors.set([tint.x, tint.y, tint.z], index * 3);
  }
  return { positions, sizes, phases, colors };
}

// Far stars that twinkle slowly; the field pans a little per section and drifts against the pointer.
export default function Starfield({ rig }: { rig: Rig }) {
  const points = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);
  const stars = useMemo(() => makeStars(), []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }),
    [],
  );

  useFrame((state) => {
    if (!points.current || !material.current) return;
    points.current.position.set(
      rig.pose[P.pan] - rig.parallax.x * 0.3,
      -rig.parallax.y * 0.18,
      0,
    );
    material.current.uniforms.uTime.value = rig.time;
    material.current.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[stars.positions, 3]}
        />
        <bufferAttribute attach="attributes-aSize" args={[stars.sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[stars.phases, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[stars.colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
