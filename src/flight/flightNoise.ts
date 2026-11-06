// Value noise on the CPU, once at load, keeps the shaders tiny: a noisy shader can take ~120 ms to compile on some drivers.

function hash(x: number, y: number, z: number): number {
  let h =
    Math.imul(x, 374761393) ^
    Math.imul(y, 668265263) ^
    Math.imul(z, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Lattice coordinates wrap at `period` (0: no wrap), so a texture made from it tiles.
function noise(x: number, y: number, z: number, period: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const u = smooth(x - ix);
  const v = smooth(y - iy);
  const w = smooth(z - iz);
  const wrap = (n: number) =>
    period > 0 ? ((n % period) + period) % period : n;
  const corner = (dx: number, dy: number, dz: number) =>
    hash(wrap(ix + dx), wrap(iy + dy), iz + dz);
  return mix(
    mix(
      mix(corner(0, 0, 0), corner(1, 0, 0), u),
      mix(corner(0, 1, 0), corner(1, 1, 0), u),
      v,
    ),
    mix(
      mix(corner(0, 0, 1), corner(1, 0, 1), u),
      mix(corner(0, 1, 1), corner(1, 1, 1), u),
      v,
    ),
    w,
  );
}

export function fbm(
  x: number,
  y: number,
  z: number,
  octaves = 3,
  period = 0,
): number {
  let sum = 0;
  let amplitude = 0.5;
  let scale = 1;
  for (let octave = 0; octave < octaves; octave++) {
    sum += amplitude * noise(x * scale, y * scale, z * scale, period * scale);
    scale *= 2;
    amplitude *= 0.5;
  }
  return sum;
}
