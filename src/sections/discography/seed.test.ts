import { describe, expect, it } from "vitest";
import { hash, seeded } from "./seed";

function firstNumbers(random: () => number, count = 20): number[] {
  return Array.from({ length: count }, () => random());
}

describe("hash", () => {
  it("matches FNV-1a's published value for a text", () => {
    expect(hash("a")).toBe(0xe40c292c);
  });

  it("tells different texts apart", () => {
    expect(hash("melt")).not.toBe(hash("smoochlight"));
  });
});

describe("seeded", () => {
  it("gives the same numbers for the same seed", () => {
    expect(firstNumbers(seeded("melt"))).toEqual(
      firstNumbers(seeded("melt")),
    );
  });

  it("gives different numbers for different seeds", () => {
    expect(firstNumbers(seeded("melt"))).not.toEqual(
      firstNumbers(seeded("smoochlight")),
    );
  });

  it("treats a text seed like its hash", () => {
    expect(firstNumbers(seeded("melt"))).toEqual(
      firstNumbers(seeded(hash("melt"))),
    );
  });

  it("stays from 0 up to, but never reaching, 1", () => {
    for (const value of firstNumbers(seeded("melt"), 1000)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
