// The ruler's own timing in seconds, inside the stage's 1.18 s step (src/sections/stageMotion.ts).

// The axis rules out of the moon's ring, fast at first and settling at the far end.
export const RULE_DELAY = 0.28;
export const RULE_DURATION = 0.6;
const RULE_POWER = 1.7;
export const ruleEase = (t: number) => 1 - (1 - t) ** RULE_POWER;

// On the way out it retracts into the ring, picking up speed.
export const UNRULE_DURATION = 0.34;
export const unruleEase = (t: number) => t * t;

export const IGNITE_DURATION = 0.3;

// When the ruling edge passes a point `share` of the way along, so a stop ignites just as it's reached.
export function igniteDelay(share: number): number {
  return RULE_DELAY + RULE_DURATION * (1 - (1 - share) ** (1 / RULE_POWER)) + 0.02;
}

// When the retracting edge passes it again, so it goes out right then.
export function outDelay(share: number): number {
  return UNRULE_DURATION * Math.sqrt(1 - share);
}
