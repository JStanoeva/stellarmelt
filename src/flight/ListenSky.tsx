import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  MathUtils,
  PlaneGeometry,
  ShaderMaterial,
  Vector4,
  type Group,
} from "three";
import { palette } from "../art/palette";
import BigStars from "./BigStars";
import { fovFor, type Rig } from "./flightPlan";
import { farStarFragment } from "./flightShaders";
import { BULGE, bakeSky, EXTENT, richer } from "./listenSkyBake";
import {
  skyFragment,
  skyVertex,
  starVertex,
  washFragment,
  washVertex,
} from "./listenSkyShaders";
import { addLight, layOver } from "./streaks";

const SKY_DISTANCE = 1600;
// How far past the screen's centre the band's ridge runs, as a share of the screen's shorter half.
const OFFSET = 0.36;
// A touch flatter than the true corner-to-corner line, so more of the band stays on a wide screen.
const TILT = 0.86;
const GLIMMER_SECONDS = 6;
const EMPTY_FRONT = 99;

type Props = { rig: Rig };

// The galaxy the room flies under: it hangs at the edge of the sky and never comes closer, and it unfolds once a song is on.
export default function ListenSky({ rig }: Props) {
  const gl = useThree((state) => state.gl);
  const locked = useRef<Group>(null);
  const frame = useRef<Group>(null);
  const [sky] = useState(() => {
    const baked = bakeSky(gl);
    const glimmer = {
      uFronts: {
        value: new Vector4(EMPTY_FRONT, EMPTY_FRONT, EMPTY_FRONT, EMPTY_FRONT),
      },
      uGlimmer: { value: 0 },
    };
    return {
      baked,
      plane: new PlaneGeometry(EXTENT.x * 2, EXTENT.y * 2),
      haze: new ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        uniforms: {
          ...glimmer,
          uField: { value: baked.field },
          uSpeck: { value: baked.speck },
          uOpacity: { value: 0 },
          uGain: { value: 0 },
          uWarm: { value: 0 },
          uTone: { value: 0 },
          uBulge: { value: BULGE },
          uExtent: { value: EXTENT },
          uPlum: { value: richer(palette.plum800, 3) },
          uPurple: { value: richer(palette.plum600, 2.4) },
          uMauve: { value: richer(palette.mauve500, 1.9) },
          uRose: { value: richer(palette.rose600, 1.4) },
          uPink: { value: richer(palette.rose400, 2.4) },
          uCream: { value: palette.starlight300 },
          uEmber: { value: richer(palette.rose400, 1.7) },
        },
        ...layOver,
      }),
      stars: new ShaderMaterial({
        vertexShader: starVertex,
        fragmentShader: farStarFragment,
        uniforms: {
          ...glimmer,
          uPixelRatio: { value: 1 },
          uOpacity: { value: 0 },
          uFill: { value: 1 },
          uTime: { value: 0 },
        },
        ...addLight,
      }),
      wash: new ShaderMaterial({
        vertexShader: washVertex,
        fragmentShader: washFragment,
        uniforms: { uOpacity: { value: 0 } },
        ...addLight,
      }),
    };
  });

  useEffect(
    () => () => {
      sky.baked.dispose();
      sky.plane.dispose();
      sky.haze.dispose();
      sky.stars.dispose();
      sky.wash.dispose();
    },
    [sky],
  );

  // The frame loop writes the uniforms outside React, so it reaches the sky through a ref.
  const skyRef = useRef(sky);
  const lastBar = useRef(-1);
  const launched = useRef([-99, -99, -99, -99]);

  useFrame((state) => {
    const { haze, stars, wash } = skyRef.current;
    const { song } = rig;
    locked.current?.position.copy(state.camera.position);

    // The composition: one diagonal, corner to corner on any screen, pushed off the flight's line.
    const aspect = state.size.width / state.size.height;
    const halfHeight = Math.tan(MathUtils.degToRad(fovFor(aspect)) / 2);
    const halfWidth = halfHeight * aspect;
    const slope = TILT * Math.atan2(halfHeight, halfWidth);
    const scale = MathUtils.lerp(0.74, 1, MathUtils.smoothstep(aspect, 0.6, 1.3));
    const offset = OFFSET * Math.min(halfHeight, halfWidth);
    const group = frame.current;
    if (group) {
      group.rotation.z = -slope;
      group.position.set(
        Math.sin(slope) * offset * SKY_DISTANCE,
        Math.cos(slope) * offset * SKY_DISTANCE,
        -SKY_DISTANCE,
      );
      group.scale.set(scale * SKY_DISTANCE, scale * SKY_DISTANCE, 1);
    }
    const reach = Math.hypot(halfWidth, halfHeight) / scale + 0.4;

    // Each bar sends a faint glimmer rolling along the band, in the flight's time so a pause stills it.
    if (song.bars !== lastBar.current) {
      // A free slot or none: overwriting a glimmer would pop it out of the sky halfway along.
      const free = launched.current.findIndex(
        (at) => rig.t - at >= GLIMMER_SECONDS,
      );
      if (lastBar.current >= 0 && song.arrival > 0.5 && free >= 0) {
        launched.current[free] = rig.t;
      }
      lastBar.current = song.bars;
    }
    const front = (index: number) => {
      const age = (rig.t - launched.current[index]) / GLIMMER_SECONDS;
      return age >= 1 ? EMPTY_FRONT : reach - 2 * reach * age;
    };
    const fronts: Vector4 = haze.uniforms.uFronts.value;
    fronts.set(front(0), front(1), front(2), front(3));

    const opacity = song.arrival * rig.bg;
    const light = (0.84 + 0.16 * song.skyEnergy) * (1 - 0.06 * song.breath);
    const glimmer = 0.5 + 0.5 * song.skyEnergy;
    wash.uniforms.uOpacity.value = opacity;
    haze.uniforms.uOpacity.value = opacity;
    haze.uniforms.uGain.value = 0.78 * light;
    haze.uniforms.uWarm.value = song.warm;
    haze.uniforms.uTone.value = song.tone;
    haze.uniforms.uGlimmer.value = glimmer;
    stars.uniforms.uPixelRatio.value = state.viewport.dpr;
    stars.uniforms.uOpacity.value = opacity * (0.9 + 0.1 * song.skyEnergy);
    stars.uniforms.uFill.value = song.fill;
    stars.uniforms.uTime.value = rig.t;
    stars.uniforms.uGlimmer.value = glimmer;
  });

  return (
    <group ref={locked}>
      <group ref={frame}>
        <mesh
          geometry={sky.baked.wash}
          material={sky.wash}
          renderOrder={1.4}
          frustumCulled={false}
        />
        <mesh
          geometry={sky.plane}
          material={sky.haze}
          renderOrder={1.5}
          frustumCulled={false}
        />
        <points
          geometry={sky.baked.stars}
          material={sky.stars}
          renderOrder={1.6}
          frustumCulled={false}
        />
      </group>
      <BigStars rig={rig} />
    </group>
  );
}
