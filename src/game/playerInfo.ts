import type { RunState } from './types';
import { UPGRADES } from './upgrades';

export const PLAYER_TOOLTIP_HEADING = 'Looplord';

export function getPlayerTooltipLines(run: RunState): string[] {
  const upgradeLine =
    run.upgradeIds.length > 0
      ? `Upgrades: ${[...new Set(
          run.upgradeIds
            .map((id) => UPGRADES.find((u) => u.id === id)?.name)
            .filter(Boolean) as string[],
        )].join(', ')}`
      : 'Upgrades: keine';

  return [`Leben: ${run.lives}/${run.maxLives}`, upgradeLine];
}

export function getPlayerTooltipTitle(run: RunState): string {
  return [PLAYER_TOOLTIP_HEADING, ...getPlayerTooltipLines(run)].join(' · ');
}
