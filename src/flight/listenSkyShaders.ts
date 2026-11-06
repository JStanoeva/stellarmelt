import { grainChunk } from "./flightShaders";

// GLSL for the band. Raw sRGB on a flat canvas, like the rest of the flight. Everything heavy is worked out once in `bakeFragment`
// from a tiling noise texture, so a frame of the sky costs a few texture reads per pixel.

// The haze runs past 1 in the swelling, so it's stored scaled down to keep its shape inside an 8-bit target.
export const HAZE_STORED = 0.7;

export const bakeVertex = /* glsl */ `
  uniform vec2 uExtent;
  varying vec2 vBand;
  void main() {
    vBand = position.xy * uExtent;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// vBand: where on the sky, along the band (x) and across it (y), in units of the distance to the sky.
// R: the unresolved starlight. G: how much the dust absorbs. B: how far the colour leans from violet to rose. A: the band's soft star clouds.
export const bakeFragment = /* glsl */ `
  uniform sampler2D uNoise;
  uniform vec2 uBulge;
  varying vec2 vBand;

  vec4 N(vec2 p) { return texture2D(uNoise, p); }
  mat2 turn(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
  // About ten octaves from three reads of the tile, each turned so its lattice never shows.
  float fractal(vec2 p, vec2 at) {
    return N(turn(0.37) * p + at).r * 0.52
      + N(turn(1.31) * p * 2.13 + at.yx).g * 0.31
      + N(turn(2.23) * p * 4.57 + at + 0.31).b * 0.17;
  }

  // One step of a cascade: about 1 on average, thinning towards 0.3 and piling up towards 1.7, raised to its weight.
  float layer(float n, float weight) { return pow(mix(0.3, 1.7, n), weight); }

  void main() {
    vec2 p = vBand;

    // Slow meanders, so nothing is ruler straight.
    vec2 slow = vec2(fractal(p * 0.16, vec2(0.13, 0.57)), fractal(p * 0.16, vec2(0.71, 0.29))) - 0.5;
    vec2 middle = vec2(fractal(p * 0.5, vec2(0.41, 0.19)), fractal(p * 0.5, vec2(0.87, 0.66))) - 0.5;
    vec2 small = vec2(fractal(p * 1.6, vec2(0.17, 0.93)), fractal(p * 1.6, vec2(0.61, 0.47))) - 0.5;
    vec2 q = p + slow * vec2(0.5, 0.2) + middle * 0.07;

    float mid = 0.04 * sin(p.x * 0.9 + 0.6) + slow.y * 0.1;
    float v = p.y + middle.y * 0.16 + small.y * 0.035 - mid;
    float fromBulge = (p.x - uBulge.x) / 0.85;
    float thick = (0.82 + 0.4 * N(vec2(p.x * 0.11, 0.77)).g) * (1.0 + 0.8 * exp(-fromBulge * fromBulge));

    float wide = exp(-pow(v / (0.52 * thick), 2.0));
    float body = exp(-pow(abs(v) / (0.22 * thick), 1.6));
    float core = exp(-pow(abs(v) / (0.09 * thick), 1.4));

    // Star clouds: a multiplying cascade of scales, which is what makes light patchy at every size instead of smoky.
    float clouds = layer(N(turn(0.4) * vec2(q.x * 0.16, q.y * 0.4) + vec2(0.21, 0.63)).r, 1.0)
      * layer(N(turn(1.2) * vec2(q.x * 0.45, q.y * 0.9) + vec2(0.56, 0.08)).g, 0.9)
      * layer(N(turn(2.1) * q * 1.4 + vec2(0.33, 0.77)).b, 0.6)
      * layer(N(turn(0.8) * q * 3.7 + vec2(0.13, 0.29)).a, 0.45);
    float along = 0.5 + 0.9 * fractal(vec2(p.x * 0.14, 0.13), vec2(0.3, 0.9));
    vec2 toBulge = (p - uBulge) / vec2(0.78, 0.25 + 0.14 * slow.x);
    float bulge = exp(-pow(dot(toBulge, toBulge), 0.85));
    float haze = 0.1 * wide + body * (0.12 + 0.13 * clouds) * along + core * (0.1 + 0.26 * clouds) * along + bulge * (0.46 + 0.14 * clouds);

    // Dust. Where it may be: the plane, and a long rift down the band that forks near the swelling.
    vec2 r = p + middle * 0.14 + (vec2(fractal(p * 1.3, vec2(0.11, 0.73)), fractal(p * 1.3, vec2(0.59, 0.37))) - 0.5) * 0.04;
    float line = mid + 0.03 * sin(r.x * 1.7 + 1.1);
    float width = 0.02 + 0.042 * smoothstep(0.3, 0.7, fractal(vec2(p.x * 0.3, 0.11), vec2(0.27, 0.51)));
    float rift = exp(-pow((r.y - line) / width, 2.0));
    float fork = smoothstep(uBulge.x - 0.75, uBulge.x + 0.2, r.x);
    float branch = exp(-pow((r.y - line + fork * 0.2 * thick) / (width * 0.8), 2.0)) * fork;
    float plane = exp(-pow(abs(v + 0.01) / (0.26 * thick), 2.0));
    float amount = 0.6 + 0.75 * fractal(vec2(p.x * 0.21, 0.61), vec2(0.17, 0.44));

    // How much it holds: another cascade, so lanes break into clouds, clouds into wisps, and only the hearts go truly dark.
    float cascade = layer(N(turn(0.3) * vec2(q.x * 0.13, q.y * 0.52) + vec2(0.05, 0.41)).a, 0.95)
      * layer(N(turn(1.1) * vec2(q.x * 0.38, q.y * 1.15) + vec2(0.63, 0.12)).r, 1.2)
      * layer(N(turn(2.0) * vec2(q.x * 0.9, q.y * 1.6) + vec2(0.33, 0.82)).g, 1.5)
      * layer(N(turn(0.7) * q * 2.9 + vec2(0.9, 0.2)).b, 1.2)
      * layer(N(turn(1.7) * q * 6.7 + vec2(0.47, 0.6)).a, 0.9);
    float tau = (0.2 * plane + 0.9 * max(rift, branch * 0.8)) * amount * cascade;
    float dust = (1.0 - exp(-tau)) * 0.88;

    // Long stretches of the band lean violet or rose, and each star cloud leans its own way inside them.
    float tint = smoothstep(0.3, 0.7, 0.62 * fractal(p * 0.23, vec2(0.52, 0.08)) + 0.38 * fractal(q * 1.05, vec2(0.08, 0.36)));
    float knotSpot = fractal(q * 1.1 + small * 0.1, vec2(0.37, 0.71));
    float knots = pow(smoothstep(0.62, 0.92, knotSpot), 1.6) * body * (1.0 - dust);

    gl_FragColor = vec4(haze * ${HAZE_STORED.toFixed(2)}, dust, tint, knots);
  }
`;

export const skyVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vBand;
  void main() {
    vUv = uv;
    vBand = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, 0.0, 1.0);
  }
`;

const glimmer = /* glsl */ `
  uniform vec4 uFronts;
  // The crest bows, leading along the ridge and trailing at the edges, and it belongs to the band, not to the empty sky around it.
  float glimmerAt(vec2 at) {
    vec4 d = (at.x - 0.4 * abs(at.y) - uFronts) / 0.22;
    vec4 g = exp(-d * d);
    return (g.x + g.y + g.z + g.w) * exp(-at.y * at.y / 0.2);
  }
`;

export const skyFragment = /* glsl */ `
  uniform sampler2D uField;
  uniform sampler2D uSpeck;
  uniform float uOpacity;
  uniform float uGain;
  uniform float uGlimmer;
  uniform float uWarm;
  uniform float uTone;
  uniform vec2 uBulge;
  uniform vec2 uExtent;
  uniform vec3 uPlum;
  uniform vec3 uPurple;
  uniform vec3 uMauve;
  uniform vec3 uRose;
  uniform vec3 uPink;
  uniform vec3 uCream;
  uniform vec3 uEmber;
  varying vec2 vUv;
  varying vec2 vBand;
  ${glimmer}
  ${grainChunk}
  void main() {
    vec4 field = texture2D(uField, vUv);
    float clear = 1.0 - field.g;
    // The ends of the map fade away, for very wide screens.
    vec2 edge = abs(vBand) / uExtent;
    float keep = (1.0 - smoothstep(0.8, 1.0, edge.x)) * (1.0 - smoothstep(0.8, 1.0, edge.y));

    // Countless stars too faint to see one by one: the haze is grain, not smoke.
    float grainy = texture2D(uSpeck, vBand * 1.17).r * 0.62 + texture2D(uSpeck, vBand * 2.63 + 0.37).r * 0.38;
    float thick = field.r / ${HAZE_STORED.toFixed(2)};
    float haze = thick * (1.0 + uGlimmer * glimmerAt(vBand) * 0.08);
    vec2 toBulge = (vBand - uBulge) / vec2(0.95, 0.42);

    // Colour with depth: plum in the faint outer haze, mauve-purple through the band, rose along the star clouds, pink deep in the swelling.
    // It follows the still density, not the glimmer's passing light, so the colour itself never moves with the song.
    float heat = thick + (field.b - 0.5) * 0.32;
    vec3 color = mix(uPlum, uPurple, smoothstep(0.03, 0.2, heat));
    color = mix(color, uMauve, smoothstep(0.3, 0.6, heat));
    color = mix(color, uRose, smoothstep(0.55, 0.85, heat));
    color = mix(color, uPink, smoothstep(0.85, 1.2, heat));
    // One sky, with a gentle lean: rose on Tora's songs, starlight on Orion's.
    color = mix(color, mix(uCream, uRose, uTone), 0.09);

    // Faint light is lifted, or its colour would never reach the eye; the thickest is held back.
    float glow = pow(haze, 0.86) / (1.0 + 0.2 * haze);
    // Light that gets through dust reddens, and on a lift those edges warm further, as if lit from behind.
    float rim = smoothstep(0.08, 0.3, field.g) * (1.0 - smoothstep(0.3, 0.62, field.g));
    vec3 reddened = mix(color, mix(uMauve, uEmber, smoothstep(0.4, 0.85, haze)), rim * (0.5 + 0.3 * uWarm));
    vec3 light = reddened * glow * clear * uGain * (0.82 + 1.1 * grainy);
    // Only the thinnest dust catches rose light, so the hearts of the rifts stay soft.
    light += uEmber * smoothstep(0.02, 0.12, field.g) * (1.0 - smoothstep(0.12, 0.42, field.g)) * glow * (0.1 + 0.1 * uWarm) * uGain;
    light += uEmber * field.g * clear * 4.0 * uWarm * 0.03 * smoothstep(0.02, 0.2, haze);
    // A little starlight cream only at the very heart of the swelling, added so the pink burns pale instead of turning grey. A touch more on Orion's songs.
    light += uCream * exp(-dot(toBulge, toBulge) * 16.0) * clear * (0.2 + 0.06 * (1.0 - uTone)) * uGain;
    // The dust's hearts stay plum, not black, and the swelling's light blooms softly past its own edges.
    light += uPlum * field.g * 0.06;
    light += uRose * exp(-dot(toBulge, toBulge) * 1.3) * (0.4 + 0.6 * clear) * 0.05 * uGain;
    // The band's soft star clouds, rose or mauve as the colour drifts.
    light += mix(uMauve, uRose, field.b) * field.a * clear * 0.2 * uGain;
    light += (grain(gl_FragCoord.xy + 37.0) - 0.5) * (1.4 / 255.0) * (0.6 + 3.0 * haze);

    float show = uOpacity * keep;
    // Thick light hides the plum of the deep sky behind it, so the band keeps its own colour.
    gl_FragColor = vec4(max(light, 0.0) * show, max(field.g * 0.72, min(field.r, 0.5)) * show);
  }
`;

export const starVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aRank;
  attribute float aPhase;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uFill;
  uniform float uTime;
  uniform float uGlimmer;
  varying vec3 vColor;
  ${glimmer}
  void main() {
    float shown = 1.0 - smoothstep(uFill - 0.14, uFill + 0.14, aRank);
    if (shown < 0.002 || uOpacity < 0.002) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vColor = vec3(0.0);
      return;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, 0.0, 1.0);
    gl_PointSize = aSize * uPixelRatio * 2.0;
    float breath = 0.9 + 0.1 * sin(uTime * (0.25 + aPhase * 0.6) + aPhase * 40.0);
    vColor = aColor * shown * uOpacity * breath * (1.0 + uGlimmer * 0.7 * glimmerAt(position.xy));
  }
`;

// The sky behind the band: per-vertex colours, like the deep sky, and a grain so its faint gradients never band.
export const washVertex = /* glsl */ `
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const washFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  ${grainChunk}
  void main() {
    gl_FragColor = vec4(max(vColor + (grain(gl_FragCoord.xy + 91.0) - 0.5) * (1.0 / 255.0), 0.0) * uOpacity, 0.0);
  }
`;

// The far big stars: one camera-facing quad each, sized in pixels, so a large one can't be clipped by a device's point-size limit.
// aShape: halo radius and flare length in CSS px, seconds per breath, and where in the breath it starts.
export const bigStarVertex = /* glsl */ `
  attribute vec3 aPlace;
  attribute vec3 aTint;
  attribute vec4 aShape;
  attribute float aRank;
  uniform vec2 uResolution;
  uniform vec2 uHalf;
  uniform float uDistance;
  uniform float uPixels;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uFull;
  uniform float uKeep;
  varying vec2 vLocal;
  varying vec3 vTint;
  varying vec4 vStar;
  varying float vCore;
  varying float vShow;
  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(aPlace.xy * uHalf * uDistance, -uDistance, 1.0);
    if (aRank > uKeep || uOpacity < 0.002 || clip.w <= 0.0) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }
    // Two detuned breaths, so no star repeats itself exactly; the curve lets each one rest at its dim and bright ends, so the change reads as a twinkle.
    float at = uTime * 6.2832 / aShape.z + aShape.w * 6.2832;
    float breath = mix(0.5 + 0.5 * sin(at), 0.5 + 0.5 * sin(at * 0.381 + aShape.w * 19.0), 0.4);
    float glow = smoothstep(0.2, 0.8, breath);
    float haloSize = aShape.x * (0.8 + 0.34 * glow);
    float flare = aShape.y * (0.62 + 0.6 * glow) * uFull;
    float reach = max(flare, haloSize * 5.0);
    vLocal = position.xy * reach;
    vTint = aTint;
    vStar = vec4(haloSize, flare, (0.2 + 0.74 * glow) * uFull, (0.18 + 0.87 * glow) * uFull);
    vCore = 0.28 + 0.97 * glow;
    vShow = uOpacity * aPlace.z;
    gl_Position = vec4(clip.xy / clip.w + position.xy * reach * uPixels * 2.0 / uResolution, 0.0, 1.0);
  }
`;

export const bigStarFragment = /* glsl */ `
  varying vec2 vLocal;
  varying vec3 vTint;
  varying vec4 vStar;
  varying float vCore;
  varying float vShow;
  void main() {
    float r2 = dot(vLocal, vLocal);
    float halo2 = vStar.x * vStar.x;
    float core = exp(-r2 / (halo2 * 0.14));
    float reach = max(vStar.y, vStar.x * 5.0);
    float halo = (1.0 - smoothstep(0.5, 1.0, sqrt(r2) / reach)) / pow(1.0 + r2 / halo2, 2.0);
    // Thin lines that narrow as they fade to nothing.
    vec2 left = clamp(1.0 - abs(vLocal) / vStar.y, 0.0, 1.0);
    vec2 fade = left * left * left;
    vec2 thin = 0.42 + 0.34 * left + 0.03 * vStar.x * left;
    vec2 flares = fade * exp(-(vLocal.yx * vLocal.yx) / (thin * thin));
    vec3 lines = mix(vTint, vec3(1.0), 0.55 * (fade.x + fade.y)) * (flares.x + flares.y);
    vec3 light = (vec3(1.0) * core * vCore + vTint * halo * vStar.z + lines * vStar.w) * vShow;
    float alpha = max(light.r, max(light.g, light.b));
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(light, min(alpha, 1.0));
  }
`;
