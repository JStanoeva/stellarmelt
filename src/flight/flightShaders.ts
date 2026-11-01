// GLSL for the flight: raw sRGB on a `flat` canvas like the planet, premultiplied so the canvas can sit over the page.

// One quad per star from where it is to where it was a moment ago; its light spreads along the trail, so speed never brightens the screen.
export const streakVertex = /* glsl */ `
  attribute vec3 aStar;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform vec2 uResolution;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uTwinkle;
  uniform vec3 uVelocity;
  uniform float uExposure;
  uniform vec3 uCamera;
  uniform float uWrap;
  uniform vec2 uNear;
  uniform vec2 uFar;
  uniform vec2 uBoost;
  uniform float uIntensity;
  varying vec3 vColor;
  varying vec2 vLocal;
  varying float vLength;
  varying float vRadius;

  void main() {
    vec3 world = (modelMatrix * vec4(aStar, 1.0)).xyz;
    // Recycled: a star that passes the camera reappears at the far end of the field.
    if (uWrap > 0.0) world.z = uCamera.z - mod(uCamera.z - world.z, uWrap);
    vec4 headView = viewMatrix * vec4(world, 1.0);
    vec4 tailView = viewMatrix * vec4(world + uVelocity * uExposure, 1.0);
    float depth = -headView.z;
    float fade = smoothstep(uNear.x, uNear.y, depth) * (1.0 - smoothstep(uFar.x, uFar.y, depth));
    if (fade < 0.002 || -tailView.z < 0.01) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }
    vec2 halfSize = 0.5 * uResolution;
    vec4 headClip = projectionMatrix * headView;
    vec4 tailClip = projectionMatrix * tailView;
    vec2 head = headClip.xy / headClip.w * halfSize;
    vec2 tail = tailClip.xy / tailClip.w * halfSize;
    vec2 trail = tail - head;
    float trailLength = length(trail);
    vec2 along = trailLength > 0.001 ? trail / trailLength : vec2(1.0, 0.0);
    trailLength = min(trailLength, 0.2 * uResolution.y);

    float radius = aSize * uPixelRatio * clamp(uBoost.x / depth, 1.0, uBoost.y);
    float spread = (2.0 * radius) / (2.0 * radius + trailLength);
    float twinkle = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * (0.5 + aPhase * 1.3) + aPhase * 40.0));
    vColor = aColor * (uIntensity * fade * twinkle * mix(spread, 1.0, 0.12));

    float reach = radius + 1.0;
    vec2 across = vec2(-along.y, along.x);
    float distanceAlong = mix(-reach, trailLength + reach, position.y);
    vec2 corner = head + along * distanceAlong + across * position.x * reach;
    vLocal = vec2(distanceAlong, position.x * reach);
    vLength = trailLength;
    vRadius = radius;
    gl_Position = vec4(corner / halfSize, 0.0, 1.0);
  }
`;

export const streakFragment = /* glsl */ `
  varying vec3 vColor;
  varying vec2 vLocal;
  varying float vLength;
  varying float vRadius;
  void main() {
    float along = clamp(vLocal.x, 0.0, vLength);
    float away = length(vec2(vLocal.x - along, vLocal.y));
    float glow = exp(-2.0 * away * away / (vRadius * vRadius));
    // Brightest at the star itself, fading towards the end of its trail.
    float tail = 1.0 - 0.8 * along / max(vLength, 1.0);
    vec3 light = vColor * glow * tail;
    float alpha = max(light.r, max(light.g, light.b));
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(light, min(alpha, 1.0));
  }
`;

// The sky sphere: DeepSky's per-vertex colours interpolate, and the fragment only adds a grain against banding.
export const skyVertex = /* glsl */ `
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const skyFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  float grain(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  void main() {
    vec3 color = vColor + (grain(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(color * uOpacity, uOpacity);
  }
`;

// The farthest stars, fixed to the sky sphere: they turn with the camera but never come closer.
export const farStarVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * 2.0;
    float twinkle = 0.88 + 0.12 * sin(uTime * (0.4 + aPhase) + aPhase * 30.0);
    vColor = aColor * twinkle * uOpacity;
  }
`;

export const farStarFragment = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float glow = exp(-18.0 * dot(p, p));
    vec3 light = vColor * glow;
    float alpha = max(light.r, max(light.g, light.b));
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(light, alpha);
  }
`;

// A flat radial gradient in the galaxy's plane (its rose cloud and its core): three stops of colour and opacity.
export const discVertex = /* glsl */ `
  varying vec2 vPlane;
  void main() {
    vPlane = position.xy * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const discFragment = /* glsl */ `
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uAlphas;
  uniform float uMiddle;
  uniform float uOpacity;
  varying vec2 vPlane;
  void main() {
    float r = length(vPlane);
    if (r >= 1.0) discard;
    float inner = clamp(r / uMiddle, 0.0, 1.0);
    float outer = clamp((r - uMiddle) / (1.0 - uMiddle), 0.0, 1.0);
    vec3 color = r < uMiddle ? mix(uColor0, uColor1, inner) : mix(uColor1, uColor2, outer);
    float alpha = (r < uMiddle ? mix(uAlphas.x, uAlphas.y, inner) : mix(uAlphas.y, uAlphas.z, outer)) * uOpacity;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

// A nebula cloud drifting past: a billboard that always faces the camera.
export const cloudVertex = /* glsl */ `
  uniform float uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 center = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    center.xy += position.xy * uSize;
    gl_Position = projectionMatrix * center;
  }
`;

// Shaped by flightNoise's tiling texture; each cloud reads its own patch of it and drifts slowly through it.
export const cloudFragment = /* glsl */ `
  uniform sampler2D uNoise;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uPatch;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    vec2 q = vUv * 0.55 + uPatch;
    float shape = texture2D(uNoise, q + vec2(uTime * 0.0015, 0.0)).r;
    float detail = texture2D(uNoise, q * 1.7 + shape * 0.25 - vec2(0.0, uTime * 0.002)).g;
    float body = smoothstep(1.0, 0.1, length(p) + (shape - 0.5) * 0.9);
    float density = body * smoothstep(0.25, 0.75, detail);
    vec3 color = mix(uColorA, uColorB, smoothstep(0.35, 0.8, detail));
    float alpha = density * uOpacity;
    gl_FragColor = vec4(color * alpha, alpha * 0.6);
  }
`;
