import type { Difficulty, RunState } from './types';
import { UPGRADES } from './upgrades';

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Leicht',
  normal: 'Normal',
  hard: 'Schwer',
};

export const PLAYER_TOOLTIP_HEADING = 'Looplord';

export function getPlayerTooltipLines(
  run: RunState,
  difficulty: Difficulty,
): string[] {
  const upgradeLine =
    run.upgradeIds.length > 0
      ? `Upgrades: ${[...new Set(
          run.upgradeIds
            .map((id) => UPGRADES.find((u) => u.id === id)?.name)
            .filter(Boolean) as string[],
        )].join(', ')}`
      : 'Upgrades: keine';

  return [
    `Leben: ${run.lives}/${run.maxLives}`,
    upgradeLine,
    `Schwierigkeit: ${DIFFICULTY_LABEL[difficulty]}`,
  ];
}

export function getPlayerTooltipTitle(run: RunState, difficulty: Difficulty): string {
  return [PLAYER_TOOLTIP_HEADING, ...getPlayerTooltipLines(run, difficulty)].join(' · ');
}
