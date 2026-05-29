import { DIFFICULTY_MODIFIERS } from './constants';
import type { Difficulty, EnemyType } from './types';
import { hasUpgrade } from './upgrades';

function getEnemySpeed(type: EnemyType): number {
  switch (type) {
    case 'fast':
      return 2;
    case 'boss':
      return 1;
    default:
      return 1;
  }
}

export function getEnemyDamage(type: EnemyType, difficulty: Difficulty): number {
  const base = type === 'boss' ? 2 : type === 'elite' ? 2 : 1;
  const mult = DIFFICULTY_MODIFIERS[difficulty].damageMult;
  return Math.max(1, Math.round(base * mult));
}

export function getEnemyDisplayName(type: EnemyType): string {
  switch (type) {
    case 'boss':
      return 'Boss';
    case 'elite':
      return 'Elite';
    case 'fast':
      return 'Schneller Gegner';
    case 'tank':
      return 'Tank';
    default:
      return 'Gegner';
  }
}

export function getEnemyTooltipLines(
  type: EnemyType,
  difficulty: Difficulty,
  hp: number,
  maxHp: number,
  upgradeIds: string[],
): string[] {
  const speed = getEnemySpeed(type);
  const damage = getEnemyDamage(type, difficulty);
  const lines: string[] = [
    getEnemyDisplayName(type),
    `Bewegung: ${speed} Feld${speed > 1 ? 'er' : ''} pro Gegnerzug`,
  ];

  if (maxHp > 1) {
    const hits =
      type === 'tank' && hasUpgrade(upgradeIds, 'tank_bane')
        ? '1 Treffer (Panzerbrecher aktiv)'
        : `${maxHp} Treffer nötig`;
    lines.push(`Leben: ${hp}/${maxHp} (${hits})`);
  }

  lines.push(`Schaden bei Treffer: ${damage}`);
  if (type === 'boss') {
    lines.push('Spezial: zusätzlicher Treffer bei Kontakt');
  }

  return lines;
}

export function getEnemyTooltipTitle(
  type: EnemyType,
  difficulty: Difficulty,
  hp: number,
  maxHp: number,
  upgradeIds: string[],
): string {
  return getEnemyTooltipLines(type, difficulty, hp, maxHp, upgradeIds).join(' · ');
}
