import type { EnemyType } from '../game/types';

import chipImg from '../../assets/chip.png';
import ticketImg from '../../assets/ticket.png';
import playerImg from '../../assets/characters/player-valkyrie-idle.png';
import enemyNormalImg from '../../assets/characters/enemy-goblin-idle.png';
import enemyFastImg from '../../assets/characters/enemy-assassin-idle.png';
import enemyTankImg from '../../assets/characters/enemy-minotaur-idle.png';
import enemyEliteImg from '../../assets/characters/enemy-dark-oracle-idle.png';
import enemyBossImg from '../../assets/characters/enemy-boss-caveman-idle.png';

export const SPRITES = {
  chip: chipImg,
  ticket: ticketImg,
  player: playerImg,
  enemyNormal: enemyNormalImg,
  enemyFast: enemyFastImg,
  enemyTank: enemyTankImg,
  enemyElite: enemyEliteImg,
  enemyBoss: enemyBossImg,
} as const;

export function getEnemySprite(type: EnemyType): string | null {
  switch (type) {
    case 'boss':
      return SPRITES.enemyBoss;
    case 'elite':
      return SPRITES.enemyElite;
    case 'fast':
      return SPRITES.enemyFast;
    case 'tank':
      return SPRITES.enemyTank;
    default:
      return SPRITES.enemyNormal;
  }
}

export function getPlayerSprite(): string | null {
  return SPRITES.player;
}

export function getChipSprite(): string {
  return SPRITES.chip;
}

export function getTicketSprite(): string {
  return SPRITES.ticket;
}

export const ENEMY_FALLBACK_COLORS: Record<EnemyType, string> = {
  normal: 'bg-red-600',
  fast: 'bg-orange-500',
  tank: 'bg-stone-500',
  elite: 'bg-purple-600',
  boss: 'bg-amber-700',
};
