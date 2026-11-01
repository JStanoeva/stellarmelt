import { tracks } from "../../content/album";
import type { SideId, Track } from "../../content/types";
import { hash } from "./seed";

// Side A rises from the left horizon, Side B sets on the right: unit coordinates (y down), placed to clear the planet's limb.
const unitPoints: Record<number, Point> = {
  1: { x: 0.02, y: 0.9 },
  2: { x: 0.07, y: 0.64 },
  3: { x: 0.14, y: 0.72 },
  4: { x: 0.175, y: 0.44 },
  5: { x: 0.25, y: 0.38 },
  6: { x: 0.275, y: 0.18 },
  7: { x: 0.36, y: 0.07 },
  8: { x: 0.44, y: 0 },
  9: { x: 0.56, y: 0.02 },
  10: { x: 0.635, y: 0.12 },
  11: { x: 0.665, y: 0.31 },
  12: { x: 0.745, y: 0.25 },
  13: { x: 0.775, y: 0.5 },
  14: { x: 0.865, y: 0.42 },
  15: { x: 0.905, y: 0.7 },
  16: { x: 0.98, y: 0.9 },
};

export type Point = { x: number; y: number };
export type Frame = { width: number; height: number };

export function starPoint(track: Track, frame: Frame): Point {
  const unit = unitPoints[track.n];
  return { x: unit.x * frame.width, y: unit.y * frame.height };
}

// Lines join a side's songs in order; the song that ends an act joins the next one with a dotted line.
type Segment = { id: string; from: Track; to: Track; dotted: boolean };

export const segments: readonly Segment[] = tracks.slice(1).flatMap((to, index) => {
  const from = tracks[index];
  if (from.side !== to.side) return [];
  return [
    {
      id: `${from.slug}-${to.slug}`,
      from,
      to,
      dotted: from.endsAct !== undefined,
    },
  ];
});

// Like a star chart: the opening and closing songs are the brightest; the rest vary a little by slug.
export function magnitude(track: Track): number {
  if (track.n === 1 || track.n === tracks.length) return 1.55;
  return 0.85 + ((hash(track.slug) % 1000) / 1000) * 0.35;
}

// A segment shortened at both ends, so the line stops just short of each star like on a printed chart.
export function trimmed(
  a: Point,
  b: Point,
  gap: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  return {
    x1: a.x + ux * gap,
    y1: a.y + uy * gap,
    x2: b.x - ux * gap,
    y2: b.y - uy * gap,
  };
}

export function sideTracks(side: SideId): Track[] {
  return tracks.filter((track) => track.side === side);
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

// The logo's four-point sparkle, centred on the origin.
export const sparklePath =
  "M0 -6C0.6 -2.1 2.1 -0.6 6 0 2.1 0.6 0.6 2.1 0 6 -0.6 2.1 -2.1 0.6 -6 0 -2.1 -0.6 -0.6 -2.1 0 -6Z";
