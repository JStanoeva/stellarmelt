import { DUST_RECTS } from "./dust";

// GLSL for the orbit poster. Colours arrive as raw sRGB uniforms (see palette.ts); the canvas is `flat`.

const hash = /* glsl */ `
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
`;

const noise2 = /* glsl */ `
  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm2(vec2 p) {
    float sum = 0.0;
    float amplitude = 0.55;
    for (int i = 0; i < 3; i++) {
      sum += amplitude * noise2(p);
      p = mat2(1.6, 1.2, -1.2, 1.6) * p;
      amplitude *= 0.5;
    }
    return sum;
  }
`;

const noise3 = /* glsl */ `
  float hash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float a = hash13(i);
    float b = hash13(i + vec3(1.0, 0.0, 0.0));
    float c = hash13(i + vec3(0.0, 1.0, 0.0));
    float d = hash13(i + vec3(1.0, 1.0, 0.0));
    float e = hash13(i + vec3(0.0, 0.0, 1.0));
    float g = hash13(i + vec3(1.0, 0.0, 1.0));
    float h = hash13(i + vec3(0.0, 1.0, 1.0));
    float k = hash13(i + vec3(1.0, 1.0, 1.0));
    return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y), mix(mix(e, g, u.x), mix(h, k, u.x), u.y), u.z);
  }
  float fbm3(vec3 p) {
    float sum = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      sum += amplitude * noise3(p);
      p = p * 2.02 + vec3(1.7, 9.2, 3.1);
      amplitude *= 0.5;
    }
    return sum;
  }
`;

export const sphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vObject;
  void main() {
    vObject = position;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

// The swirl noise is soft and low-frequency, so it is computed per vertex (~7k) instead of per pixel.
export const planetVertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vObject;
  varying float vSwirl;
  ${noise3}
  void main() {
    vObject = position;
    vSwirl = fbm3(normalize(position) * 1.4 + vec3(0.0, uTime * 0.02, uTime * 0.012));
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

// A glazed pink-to-plum planet: tone ramp from the light, wide soft belts, a deep terminator, bead gloss and lit limbs.
export const planetFragment = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uDeep;
  uniform vec3 uPlum;
  uniform vec3 uMauve;
  uniform vec3 uRose;
  uniform vec3 uBlush;
  uniform vec3 uRim;
  uniform vec3 uBack;
  uniform vec3 uSheen;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vObject;
  varying float vSwirl;
  ${hash}
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    vec3 l = normalize(uLight);
    float ndl = dot(n, l);

    float latitude = normalize(vObject).y + (vSwirl - 0.5) * 0.1;
    float bands = smoothstep(-0.3, 0.9, sin(latitude * 7.0 + vSwirl * 1.5));

    float tone = clamp(ndl * 0.5 + 0.5, 0.0, 1.0) + (bands - 0.5) * 0.05;
    vec3 color = uDeep;
    color = mix(color, uPlum, smoothstep(0.2, 0.48, tone));
    color = mix(color, uMauve, smoothstep(0.42, 0.68, tone));
    color = mix(color, uRose, smoothstep(0.64, 0.88, tone));
    color = mix(color, uBlush, smoothstep(0.88, 1.0, tone) * 0.85);
    color = mix(color, uDeep, (1.0 - smoothstep(0.06, 0.36, tone)) * 0.85);
    color += uRose * exp(-pow((ndl + 0.02) / 0.14, 2.0)) * 0.07;

    // Bead gloss: a painted window and a sparkle where the light reflects toward the viewer (gone when backlit).
    vec3 h = normalize(l + v);
    float reach = length(h.xy);
    vec2 outward = reach > 0.001 ? h.xy / reach : vec2(0.0, 1.0);
    vec2 offset = n.xy - h.xy;
    vec2 local = vec2(dot(offset, vec2(-outward.y, outward.x)), dot(offset, outward));
    float window = 1.0 - smoothstep(0.72, 1.0, length(local / vec2(0.32, 0.18)));
    float gloss = smoothstep(0.35, 0.75, h.z);
    color = mix(color, uSheen, window * mix(0.06, 0.4, smoothstep(-0.18, 0.18, local.y)) * gloss);
    float sparkle = 1.0 - smoothstep(0.02, 0.035, length(n.xy - h.xy * 1.28));
    color = mix(color, uSheen, sparkle * 0.8 * gloss);

    float facing = max(dot(n, v), 0.0);
    float fresnel = pow(1.0 - facing, 2.6);
    float day = smoothstep(-0.3, 0.4, ndl);
    color = mix(color, uRim, fresnel * day * 0.65);
    color += uRim * smoothstep(0.82, 1.0, 1.0 - facing) * day * 0.35;
    color += uBack * pow(fresnel, 1.6) * (1.0 - day) * 0.6;

    color += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const moonFragment = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uLit;
  uniform vec3 uShade;
  uniform vec3 uRim;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec3 n = normalize(vNormal);
    float ndl = dot(n, normalize(uLight));
    vec3 color = mix(uShade, uLit, smoothstep(-0.3, 0.7, ndl));
    color = mix(color, uRim, pow(1.0 - max(dot(n, normalize(vView)), 0.0), 3.0) * 0.45);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const glowVertex = /* glsl */ `
  varying vec2 vLocal;
  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// The one large glow per view, drawn on a ring just outside the rim (planet radius = 1) so it costs few fragments.
export const glowFragment = /* glsl */ `
  uniform vec3 uInner;
  uniform vec3 uOuter;
  uniform float uStrength;
  uniform float uExtent;
  uniform vec3 uLight;
  varying vec2 vLocal;
  void main() {
    vec2 p = vLocal;
    float d = length(p);
    float outside = max(d - 1.0, 0.0);
    float halo = exp(-outside * 4.2) * smoothstep(0.92, 1.0, d) * (1.0 - smoothstep(uExtent * 0.75, uExtent, d));
    // Brighter toward the light, and all the way round (a corona) once the light is behind the planet.
    float toward = 0.55 + 0.45 * dot(p / max(d, 0.001), normalize(uLight.xy + vec2(0.0, 0.0001)));
    float facing = mix(toward, 1.0, smoothstep(0.0, 0.8, -uLight.z));
    vec3 color = mix(uOuter, uInner, exp(-outside * 10.0));
    gl_FragColor = vec4(color * halo * facing * uStrength, 1.0);
  }
`;

// Orbit dots (position.x = angle): nearer ones are bigger and brighter, and those just behind the moon light up as a trail.
export const orbitVertex = /* glsl */ `
  uniform float uRadius;
  uniform float uSpin;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uMoon;
  uniform float uTrail;
  uniform float uFine;
  uniform float uAhead;
  varying float vAlpha;
  varying float vTrail;
  void main() {
    float angle = position.x + uSpin;
    vec4 viewPosition = modelViewMatrix * vec4(cos(angle) * uRadius, sin(angle) * uRadius, 0.0, 1.0);
    vec4 centre = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float reach = uRadius * length(modelViewMatrix[0].xyz);
    float near = clamp((viewPosition.z - centre.z) / max(reach, 0.0001) * 0.5 + 0.5, 0.0, 1.0);
    float behind = mod(uMoon - angle, 6.2831853);
    vTrail = exp(-behind * 2.4) * uTrail;
    // position.y marks every other dot, shown on big orbits only; a parked moon ends the orbit (nothing ahead of it).
    float shown = (position.y > 0.5 ? uFine : 1.0) * (1.0 - uAhead * smoothstep(2.64, 3.64, behind));
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * uPixelRatio * mix(0.7, 1.35, near) * (1.0 + vTrail * 1.1);
    vAlpha = min(uOpacity * mix(0.32, 1.0, near) + vTrail * 0.7, 1.0) * shown;
  }
`;

export const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGlint;
  varying float vAlpha;
  varying float vTrail;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = (1.0 - smoothstep(0.15, 0.5, d)) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, uGlint, vTrail), alpha);
  }
`;

export const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * uPixelRatio;
    float speed = 0.35 + fract(aPhase * 7.13) * 0.9;
    vAlpha = 0.62 + 0.38 * sin(uTime * speed + aPhase * 6.2831);
    vColor = aColor;
  }
`;

export const starFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = ((1.0 - smoothstep(0.0, 0.5, d)) * 0.55 + (1.0 - smoothstep(0.0, 0.2, d)) * 0.45) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// The sky's soft parts (gradient, glow around the planet, nebula, haze) run per vertex on a ~3.5k grid; only the halftone is per pixel.
export const backdropVertex = /* glsl */ `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uPlanet;
  uniform vec4 uHaze;
  varying float vSky;
  varying float vAround;
  varying float vNebula;
  varying float vHaze;
  ${hash}
  ${noise2}
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    vec2 frag = uv * uResolution;
    vSky = smoothstep(0.0, 1.0, uv.y) * 0.45;
    vAround = (1.0 - smoothstep(uPlanet.z, uPlanet.z * 3.2, length(frag - uPlanet.xy))) * 0.6;
    vec2 q = frag / max(uResolution.x, uResolution.y) * 2.6;
    q += 0.35 * vec2(sin(q.y * 2.3 + uTime * 0.03), cos(q.x * 1.9 - uTime * 0.025));
    vNebula = fbm2(q + vec2(uTime * 0.008, -uTime * 0.005));
    vHaze = exp(-pow(length(frag - uHaze.xy) / max(uHaze.z, 1.0), 2.0) * 1.4) * uHaze.w;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// The night sky: nebula, the haze copy condenses from, and the halftone that swells under the pointer and the planet's wake.
export const backdropFragment = /* glsl */ `
  uniform float uPixelRatio;
  uniform vec3 uPlanet;
  uniform float uField;
  uniform vec3 uPointer;
  uniform vec2 uShift;
  uniform float uWake;
  uniform vec3 uNight;
  uniform vec3 uLift;
  uniform vec3 uPlum;
  uniform vec3 uRose;
  uniform vec3 uDot;
  varying float vSky;
  varying float vAround;
  varying float vNebula;
  varying float vHaze;
  ${hash}
  void main() {
    vec2 frag = gl_FragCoord.xy / uPixelRatio;

    vec3 color = mix(uNight, uLift, vSky);
    color = mix(color, uLift, vAround);
    float n = vNebula;
    color += uPlum * smoothstep(0.38, 0.8, n) * 0.16 + uRose * smoothstep(0.66, 0.9, n) * 0.025;
    color += mix(uPlum, uRose, n) * vHaze * (0.5 + 0.5 * n) * 0.3;

    float pitch = 13.0;
    vec2 grid = (frag + uShift) / pitch;
    vec2 cellCentre = (floor(grid) + 0.5) * pitch - uShift;
    float toDot = length(fract(grid) - 0.5) * pitch;
    float field = 1.0 - smoothstep(uPlanet.z * 0.85, uField, length(cellCentre - uPlanet.xy));
    float pointer = exp(-pow(length(cellCentre - uPointer.xy) / 150.0, 2.0)) * uPointer.z;
    float radius = field * (1.45 + uWake * 0.7) + pointer * 1.6;
    float dotMask = (1.0 - smoothstep(radius - 0.7, radius + 0.7, toDot)) * step(0.25, radius);
    color = mix(color, uDot, dotMask * (0.22 + 0.3 * field + 0.25 * pointer));

    color += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Stardust in screen px: position = (rect pick, u, v), aSeed = (role, size, phase); it hides behind the planet.
export const dustVertex = /* glsl */ `
  attribute vec3 aSeed;
  uniform float uT;
  uniform float uDirection;
  uniform vec2 uResolution;
  uniform float uPixelRatio;
  uniform vec3 uPlanet;
  uniform vec4 uExit[${DUST_RECTS}];
  uniform float uExitShare[${DUST_RECTS}];
  uniform vec4 uEnter[${DUST_RECTS}];
  uniform float uEnterShare[${DUST_RECTS}];
  uniform float uHasExit;
  uniform float uHasEnter;
  varying float vAlpha;
  varying float vTint;
  void main() {
    if (uT < 0.0) {
      // Idle: no burst, so park every point outside the clip volume.
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      vTint = 0.0;
      return;
    }
    bool entering = aSeed.x >= 0.5;
    vec4 rect = vec4(0.0);
    for (int i = ${DUST_RECTS - 1}; i >= 0; i--) {
      if (entering && position.x < uEnterShare[i]) rect = uEnter[i];
      if (!entering && position.x < uExitShare[i]) rect = uExit[i];
    }
    vec2 origin = vec2(mix(rect.x, rect.z, position.y), mix(rect.y, rect.w, position.z));
    // CSS px with y pointing down, so a forward step (direction 1) sends dust up the screen.
    float up = -uDirection;
    float spin = aSeed.z * 6.2831 + origin.x * 0.011 + origin.y * 0.017;
    vec2 p;
    float alpha;
    if (entering) {
      float t = clamp((uT - 0.28) / 0.82, 0.0, 1.0);
      float settle = 1.0 - pow(1.0 - t, 3.0);
      vec2 scatter = vec2((aSeed.y - 0.5) * 260.0, (aSeed.z - 0.5) * 160.0 - up * 90.0);
      vec2 curl = vec2(sin(spin + t * 2.6), cos(spin * 1.3 - t * 2.2)) * 24.0;
      p = origin + (scatter + curl) * (1.0 - settle);
      alpha = smoothstep(0.0, 0.3, t) * (1.0 - smoothstep(0.62, 1.0, t)) * uHasEnter;
    } else {
      float t = clamp(uT / 1.05, 0.0, 1.0);
      float drift = 1.0 - pow(1.0 - t, 2.2);
      vec2 away = vec2((aSeed.y - 0.5) * 120.0, up * (50.0 + aSeed.z * 150.0));
      vec2 curl = vec2(sin(spin + t * 3.4), cos(spin * 1.3 + t * 2.7)) * (16.0 + aSeed.y * 26.0);
      p = origin + (away + curl) * drift;
      alpha = smoothstep(0.0, 0.06, uT) * (1.0 - smoothstep(0.25, 1.0, t)) * uHasExit;
    }
    vec2 planet = vec2(uPlanet.x, uResolution.y - uPlanet.y);
    alpha *= smoothstep(uPlanet.z * 0.92, uPlanet.z * 1.08, length(p - planet));
    alpha *= 0.7 + 0.3 * sin(uT * (2.0 + aSeed.z * 3.0) + aSeed.y * 40.0);
    gl_Position = vec4(p.x / uResolution.x * 2.0 - 1.0, 1.0 - p.y / uResolution.y * 2.0, 0.0, 1.0);
    gl_PointSize = (3.0 + aSeed.y * 5.0) * uPixelRatio;
    vAlpha = alpha * (0.5 + 0.5 * fract(aSeed.z * 13.7));
    vTint = fract(aSeed.y * 5.3);
  }
`;

// Each mote is a bright core in a soft halo.
export const dustFragment = /* glsl */ `
  uniform vec3 uCream;
  uniform vec3 uRose;
  varying float vAlpha;
  varying float vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = exp(-d * d * 20.0) + exp(-d * d * 5.0) * 0.35;
    float alpha = glow * (1.0 - smoothstep(0.36, 0.5, d)) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uCream, uRose, vTint), alpha);
  }
`;
