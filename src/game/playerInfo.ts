import type { Difficulty, RunState } from './types';
import { UPGRADES } from './upgrades';

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Leicht',
  normal: 'Normal',
  hard: 'Schwer',
};

export function getPlayerTooltipLines(
  run: RunState,
  difficulty: Difficulty,
): string[] {
  const lines: string[] = [
    'Looplord',
    `Leben: ${run.lives}/${run.maxLives}`,
  ];

  if (run.shield > 0) {
    lines.push(`Schild: ${run.shield}`);
  }

  lines.push(
    'Bewegung: Summe gewählter Chips (Uhrzeigersinn)',
    'Landen auf Gegner: Elimination',
    'Nach Chipspiel: Hand aus Beutel auffüllen',
    'Gespielte Chips diese Runde kommen nicht zurück',
  );

  if (run.upgradeIds.length > 0) {
    const names = run.upgradeIds
      .map((id) => UPGRADES.find((u) => u.id === id)?.name)
      .filter(Boolean) as string[];
    const unique = [...new Set(names)];
    lines.push(`Upgrades: ${unique.join(', ')}`);
  } else {
    lines.push('Upgrades: keine');
  }

  lines.push(`Schwierigkeit: ${DIFFICULTY_LABEL[difficulty]}`);

  return lines;
}

export function getPlayerTooltipTitle(run: RunState, difficulty: Difficulty): string {
  return getPlayerTooltipLines(run, difficulty).join(' · ');
}
