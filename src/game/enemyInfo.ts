import type { EnemyType } from './types';
import { isNovaImmune, isProjectileImmune } from './enemyTraits';
import { hasUpgrade } from './upgrades';

function getEnemySpeed(type: EnemyType): number {
  switch (type) {
    case 'fast':
      return 2;
    default:
      return 1;
  }
}

export function getEnemyDamage(type: EnemyType): number {
  switch (type) {
    case 'boss':
      return 2;
    case 'elite':
      return 2;
    default:
      return 1;
  }
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
    case 'nullward':
      return 'Leerwächter';
    case 'bulwark':
      return 'Schildträger';
    case 'marksman':
      return 'Schütze';
    default:
      return 'Gegner';
  }
}

export function getEnemyTooltipLines(
  type: EnemyType,
  hp: number,
  maxHp: number,
  upgradeIds: string[],
): string[] {
  const speed = getEnemySpeed(type);
  const damage = getEnemyDamage(type);
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
  if (isNovaImmune(type)) {
    lines.push('Spezial: immun gegen Nova (Magie)');
  }
  if (isProjectileImmune(type)) {
    lines.push('Spezial: immun gegen Projektile (Spalt, Scharfschuss)');
  }
  if (type === 'marksman') {
    lines.push('Spezial: schießt jeden Gegnerzug auf dich (1 Schaden)');
  }

  return lines;
}

export function getEnemyTooltipTitle(
  type: EnemyType,
  hp: number,
  maxHp: number,
  upgradeIds: string[],
): string {
  return getEnemyTooltipLines(type, hp, maxHp, upgradeIds).join(' · ');
}
