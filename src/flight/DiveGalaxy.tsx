import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  DoubleSide,
  MathUtils,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
  type Group,
} from "three";
import { palette } from "../art/palette";
import { makeGalaxy, smoochlightLook } from "./flightData";
import {
  approach,
  approachSpeed,
  PASS_T,
  SPIN_RATE,
  type DivePlan,
  type Rig,
} from "./flightPlan";
import { discFragment, discVertex } from "./flightShaders";
import {
  createStreakGeometry,
  createStreakMaterial,
  layOver,
  syncStreaks,
} from "./streaks";

// Per-star light at the press, tuned so the galaxy reads like NebulaArt's dotted SVG at the same size.
const STAR_LIGHT = 0.075;
// Stars brighten as the galaxy grows and spreads them out, capped so the crowded centre never turns white.
const MAX_BOOST = 7;

// NebulaArt's SVG gradients as a disc in the galaxy's plane: three stops of colour and opacity.
function gradient(
  [c0, c1, c2]: [Vector3, Vector3, Vector3],
  alphas: [number, number, number],
  middle: number,
): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: discVertex,
    fragmentShader: discFragment,
    uniforms: {
      uColor0: { value: c0 },
      uColor1: { value: c1 },
      uColor2: { value: c2 },
      uAlphas: { value: new Vector3(...alphas) },
      uMiddle: { value: middle },
      uOpacity: { value: 1 },
    },
    side: DoubleSide,
    ...layOver,
  });
}

type Props = { rig: Rig; plan: DivePlan };

// The pressed nebula as fifty thousand stars where the SVG was; its glow dims as it grows (no white-out) and fades before the camera crosses.
export default function DiveGalaxy({ rig, plan }: Props) {
  const root = useRef<Group>(null);
  const arms = useRef<Group>(null);
  const [galaxy] = useState(() => ({
    geometry: createStreakGeometry(makeGalaxy("smoochlight", smoochlightLook)),
    material: createStreakMaterial({
      near: [plan.radius * 0.03, plan.radius * 0.25],
      far: [1e5, 2e5],
      boost: [plan.radius * 0.3, 2.2],
    }),
    disc: new PlaneGeometry(1, 1),
    cloud: gradient(
      [palette.rose400, palette.mauve500, palette.plum600],
      [0.6, 0.28, 0],
      0.45,
    ),
    // Like the SVG's core, but never at full strength.
    core: gradient(
      [palette.stardust50, palette.rose200, palette.rose400],
      [0.8, 0.7, 0],
      0.35,
    ),
  }));

  useEffect(
    () => () => {
      galaxy.geometry.dispose();
      galaxy.material.dispose();
      galaxy.disc.dispose();
      galaxy.cloud.dispose();
      galaxy.core.dispose();
    },
    [galaxy],
  );

  // The frame loop writes the uniforms outside React, so it reaches the galaxy through a ref.
  const galaxyRef = useRef(galaxy);

  useFrame((state) => {
    const { material, cloud, core } = galaxyRef.current;
    if (!root.current || !arms.current) return;
    if (rig.t > PASS_T + 0.8) {
      root.current.visible = false;
      return;
    }
    const camera = state.camera;
    const { center } = plan;
    root.current.position.set(
      center.x,
      center.y,
      camera.position.z + center.z + plan.distance * (1 - approach(rig.t)),
    );
    const fov = "fov" in camera ? camera.fov : 60;
    const tanHalf = Math.tan(MathUtils.degToRad(fov) / 2);
    const distance = Math.max(
      camera.position.distanceTo(root.current.position),
      1e-3,
    );
    const growth = Math.max(
      ((plan.radius / (distance * tanHalf)) * (state.size.height / 2)) /
        plan.startPx,
      1,
    );
    arms.current.rotation.z = plan.spin + SPIN_RATE * rig.t;
    // Through the disc, the stars still ahead fade out before the galaxy is put away.
    const through = 1 - MathUtils.smoothstep(rig.t, PASS_T + 0.1, PASS_T + 0.7);
    syncStreaks(
      material,
      state,
      rig,
      STAR_LIGHT * Math.min(growth, MAX_BOOST) ** 0.85 * through,
    );
    material.uniforms.uVelocity.value.set(0, 0, -approachSpeed(rig.t));
    // The glow's share of the screen's light stays small; it's gone before the disc turns edge-on.
    const leave = 1 - MathUtils.smoothstep(rig.t, 0.55, 0.85);
    cloud.uniforms.uOpacity.value = Math.min(1, growth ** -1.4) * leave;
    core.uniforms.uOpacity.value = Math.min(1, growth ** -1.7) * leave;
  });

  return (
    <group ref={root} quaternion={plan.orient} scale={plan.radius}>
      <mesh
        geometry={galaxy.disc}
        material={galaxy.cloud}
        scale={2}
        renderOrder={5}
        frustumCulled={false}
      />
      <group ref={arms}>
        <mesh
          geometry={galaxy.geometry}
          material={galaxy.material}
          renderOrder={6}
          frustumCulled={false}
        />
      </group>
      <mesh
        geometry={galaxy.disc}
        material={galaxy.core}
        scale={0.44}
        renderOrder={7}
        frustumCulled={false}
      />
    </group>
  );
}
