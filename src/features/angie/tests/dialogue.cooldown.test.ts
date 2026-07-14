import { describe, expect, it } from 'vitest';
import { canFire, recordFire } from '../dialogue/dialogue.cooldown';
import type { CooldownMap } from '../dialogue/dialogue.cooldown';

describe('dialogue cooldown', () => {
  it('allows firing a key that has never fired before', () => {
    expect(canFire({}, 'idle.shortIdle', 60_000, 1_000)).toBe(true);
  });

  it('blocks firing again before the cooldown elapses', () => {
    const cooldowns: CooldownMap = recordFire({}, 'idle.shortIdle', 1_000);
    expect(canFire(cooldowns, 'idle.shortIdle', 60_000, 30_000)).toBe(false);
  });

  it('allows firing again once the cooldown has elapsed', () => {
    const cooldowns: CooldownMap = recordFire({}, 'idle.shortIdle', 1_000);
    expect(canFire(cooldowns, 'idle.shortIdle', 60_000, 62_000)).toBe(true);
  });

  it('scales the effective cooldown by frequency mode', () => {
    const cooldowns: CooldownMap = recordFire({}, 'navigation.table', 0);
    // 60s base cooldown: discrete (x2.5) still blocks at 100s, talkative (x0.5) already allows it.
    expect(canFire(cooldowns, 'navigation.table', 60_000, 100_000, 'discrete')).toBe(false);
    expect(canFire(cooldowns, 'navigation.table', 60_000, 100_000, 'talkative')).toBe(true);
  });

  it('tracks cooldowns independently per key', () => {
    const cooldowns: CooldownMap = recordFire({}, 'fusion.success', 1_000);
    expect(canFire(cooldowns, 'fusion.unstable', 60_000, 1_500)).toBe(true);
  });
});
