export type Star = {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

// Mulberry32, a tiny seeded PRNG: the same seed draws the same sky on every load.
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(42);

export const stars: Star[] = Array.from({ length: 120 }, () => ({
  top: random() * 100,
  left: random() * 100,
  size: random() < 0.8 ? Math.floor(random() * 2) + 1 : Math.floor(random() * 3) + 2,
  delay: random() * 8,
  duration: 6 + random() * 8,
  opacity: 0.4 + random() * 0.6,
}));
