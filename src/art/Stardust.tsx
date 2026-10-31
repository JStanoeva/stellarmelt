import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { AdditiveBlending, Vector2, Vector3, type ShaderMaterial } from "three";
import { DUST_RECTS, type DustBurst } from "./dust";
import { palette } from "./palette";
import { seededRandom } from "./random";
import type { Rig } from "./rig";
import { dustFragment, dustVertex } from "./shaders";

const DUST_COUNT = 1200;
// A burst is over after this many seconds (the step itself takes 1.18 s).
const DUST_LIFETIME = 1.4;

function makeSeeds() {
  const random = seededRandom(11);
  const positions = new Float32Array(DUST_COUNT * 3);
  const seeds = new Float32Array(DUST_COUNT * 3);
  for (let index = 0; index < DUST_COUNT * 3; index++) {
    positions[index] = random();
    seeds[index] = random();
  }
  return { positions, seeds };
}

// The ethereal fade's particles: the leaving lines shed drifting dust, the entering lines gather it back.
export default function Stardust({
  rig,
  dust,
}: {
  rig: Rig;
  dust?: RefObject<DustBurst | null>;
}) {
  const material = useRef<ShaderMaterial>(null);
  const seeds = useMemo(() => makeSeeds(), []);
  const uniforms = useMemo(
    () => ({
      uT: { value: -1 },
      uDirection: { value: 1 },
      uResolution: { value: new Vector2(1, 1) },
      uPixelRatio: { value: 1 },
      uPlanet: { value: new Vector3() },
      uExit: { value: new Float32Array(DUST_RECTS * 4) },
      uExitShare: { value: new Float32Array(DUST_RECTS) },
      uEnter: { value: new Float32Array(DUST_RECTS * 4) },
      uEnterShare: { value: new Float32Array(DUST_RECTS) },
      uHasExit: { value: 0 },
      uHasEnter: { value: 0 },
      uCream: { value: palette.starlight200 },
      uRose: { value: palette.rose300 },
    }),
    [],
  );

  // The points always draw (idle, the vertex shader collapses them), so the shader compiles before the first step.
  useFrame((state) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    const burst = dust?.current;
    const active = burst != null && rig.dustT >= 0 && rig.dustT < DUST_LIFETIME;
    u.uT.value = active ? rig.dustT : -1;
    if (!burst || !active) return;
    u.uDirection.value = burst.direction;
    u.uResolution.value.set(state.size.width, state.size.height);
    u.uPixelRatio.value = state.viewport.dpr;
    u.uPlanet.value.copy(rig.screen);
    u.uExit.value = burst.exit;
    u.uExitShare.value = burst.exitShare;
    u.uEnter.value = burst.enter;
    u.uEnterShare.value = burst.enterShare;
    u.uHasExit.value = burst.hasExit ? 1 : 0;
    u.uHasEnter.value = burst.hasEnter ? 1 : 0;
  });

  return (
    <points frustumCulled={false} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[seeds.positions, 3]}
        />
        <bufferAttribute attach="attributes-aSeed" args={[seeds.seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
