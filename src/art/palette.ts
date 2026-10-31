import { Vector3 } from "three";

// The canvas is `flat` and the shaders write raw values, so colours go in as sRGB (like CSS), not via THREE.Color.
function srgb(hex: number): Vector3 {
  return new Vector3(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  );
}

export const palette = {
  night950: srgb(0x07041a),
  night900: srgb(0x0c0822),
  night800: srgb(0x140d2d),
  night700: srgb(0x1d1338),
  plum800: srgb(0x422751),
  plum600: srgb(0x643769),
  mauve500: srgb(0x9a4f80),
  mauve400: srgb(0xb16691),
  mauve300: srgb(0xc98fb2),
  mauve200: srgb(0xd9aec8),
  rose600: srgb(0xbc5080),
  rose400: srgb(0xf48fa6),
  rose300: srgb(0xfbb0b6),
  rose200: srgb(0xfdd0d3),
  starlight300: srgb(0xeed4bc),
  starlight200: srgb(0xf5e2c8),
  stardust50: srgb(0xfbf3f8),
} as const;

// View-space light: from the upper left (the poster's blush-to-plum shading), or from behind for a backlit limb.
export const frontLight = new Vector3(-0.8, 0.5, 0.26).normalize();
export const backLight = new Vector3(-0.04, 0.15, -0.99).normalize();
