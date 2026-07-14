export type CooldownMap = Record<string, number>;

/** Frequency modes scale every cooldown so "bavarde" talks more, "discrète" less. */
export type FrequencyMode = 'discrete' | 'balanced' | 'talkative';

export const FREQUENCY_MULTIPLIERS: Record<FrequencyMode, number> = {
  discrete: 2.5,
  balanced: 1,
  talkative: 0.5,
};

export function canFire(cooldowns: CooldownMap, key: string, cooldownMs: number, now: number, mode: FrequencyMode = 'balanced'): boolean {
  const lastFired = cooldowns[key];
  if (lastFired === undefined) return true;
  return now - lastFired >= cooldownMs * FREQUENCY_MULTIPLIERS[mode];
}

export function recordFire(cooldowns: CooldownMap, key: string, now: number): CooldownMap {
  return { ...cooldowns, [key]: now };
}
