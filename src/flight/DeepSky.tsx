import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Group,
} from "three";
import { palette } from "../art/palette";
import { makeSky } from "./flightData";
import { fbm } from "./flightNoise";
import type { Rig } from "./flightPlan";
import {
  farStarFragment,
  farStarVertex,
  skyFragment,
  skyVertex,
} from "./flightShaders";
import { addLight, layOver } from "./streaks";

const SKY_RADIUS = 1800;
const FAR_STARS = 12000;
// The faint band of distant nebulae runs along this tilted great circle.
const BAND_AXIS = new Vector3(0.38, 0.84, 0.39).normalize();

// Night with the band's plum clouds, rose wisps and a few mauve patches, worked out once per vertex.
function skyColors(geometry: BufferGeometry): Float32Array {
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const direction = new Vector3();
  for (let index = 0; index < position.count; index++) {
    direction.fromBufferAttribute(position, index).normalize();
    const { x, y, z } = direction;
    const band = Math.exp(-((direction.dot(BAND_AXIS) / 0.34) ** 2));
    const cloud = fbm(x * 2.3, y * 2.3, z * 2.3);
    const wisps = fbm(x * 5.2 + 7, y * 5.2 + 7, z * 5.2 + 7);
    const plum = band * (0.25 + 0.75 * cloud) * 0.32;
    const rose = band * wisps ** 3 * 0.16;
    const mauve = MathUtils.smoothstep(cloud, 0.55, 0.85) * 0.035;
    const color = palette.night950
      .clone()
      .addScaledVector(palette.plum800, plum)
      .addScaledVector(palette.rose600, rose)
      .addScaledVector(palette.mauve500, mauve);
    colors.set([color.x, color.y, color.z], index * 3);
  }
  return colors;
}

type Props = { rig: Rig };

// The night sphere and the farthest stars travel with the camera, so they turn with it but never come closer.
export default function DeepSky({ rig }: Props) {
  const group = useRef<Group>(null);
  const [sky] = useState(() => {
    const geometry = new SphereGeometry(SKY_RADIUS, 72, 48);
    geometry.setAttribute(
      "aColor",
      new BufferAttribute(skyColors(geometry), 3),
    );
    const material = new ShaderMaterial({
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      uniforms: { uOpacity: { value: 0 } },
      side: BackSide,
      ...layOver,
    });
    return { geometry, material };
  });
  const [stars] = useState(() => {
    const data = makeSky("flight-far-sky", FAR_STARS, SKY_RADIUS * 0.9);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(data.positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(data.sizes, 1));
    geometry.setAttribute("aColor", new BufferAttribute(data.colors, 3));
    geometry.setAttribute("aPhase", new BufferAttribute(data.phases, 1));
    const material = new ShaderMaterial({
      vertexShader: farStarVertex,
      fragmentShader: farStarFragment,
      uniforms: {
        uPixelRatio: { value: 1 },
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      ...addLight,
    });
    return { geometry, material };
  });

  useEffect(
    () => () => {
      sky.geometry.dispose();
      sky.material.dispose();
      stars.geometry.dispose();
      stars.material.dispose();
    },
    [sky, stars],
  );

  // The frame loop writes the uniforms outside React, so it reaches the materials through a ref.
  const materials = useRef({ sky: sky.material, stars: stars.material });

  // Both fade in over the page at the start.
  useFrame((state) => {
    group.current?.position.copy(state.camera.position);
    materials.current.sky.uniforms.uOpacity.value = rig.bg;
    const uniforms = materials.current.stars.uniforms;
    uniforms.uPixelRatio.value = state.viewport.dpr;
    uniforms.uTime.value = rig.t;
    uniforms.uOpacity.value = rig.bg;
  });

  return (
    <group ref={group}>
      <mesh
        geometry={sky.geometry}
        material={sky.material}
        renderOrder={0}
        frustumCulled={false}
      />
      <points
        geometry={stars.geometry}
        material={stars.material}
        renderOrder={1}
        frustumCulled={false}
      />
    </group>
  );
}
