import { describe, expect, it } from "vitest";
import { seededRandom } from "./random";

function firstNumbers(random: () => number, count = 20): number[] {
  return Array.from({ length: count }, () => random());
}

describe("seededRandom", () => {
  it("gives the same numbers for the same seed", () => {
    expect(firstNumbers(seededRandom(7))).toEqual(
      firstNumbers(seededRandom(7)),
    );
  });

  it("gives different numbers for different seeds", () => {
    expect(firstNumbers(seededRandom(7))).not.toEqual(
      firstNumbers(seededRandom(11)),
    );
  });

  it("stays from 0 up to, but never reaching, 1", () => {
    for (const value of firstNumbers(seededRandom(7), 1000)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
