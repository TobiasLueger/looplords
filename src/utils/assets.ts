import type { EnemyType } from '../game/types';

import chipImg from '../../assets/chip.png';
import playerImg from '../../assets/craftpix-net-469596-free-chibi-valkyrie-character-sprites/Valkyrie_1/PNG/PNG Sequences/Idle/0_Valkyrie_Idle_000.png';
import enemyNormalImg from '../../assets/craftpix-net-228980-free-top-down-goblin-character-sprite/Male Goblin/PNG/PNG Sequences/Front - Idle/Front - Idle_000.png';
import enemyFastImg from '../../assets/craftpix-net-218811-free-medieval-bandit-4-direction-character-pack/Assassin/PNG/PNG Sequences/Front - Idle/Front - Idle_000.png';
import enemyTankImg from '../../assets/craftpix-net-534656-free-minotaur-chibi-character-sprites/Minotaur_1/PNG/PNG Sequences/Idle/0_Minotaur_Idle_000.png';
import enemyEliteImg from '../../assets/craftpix-net-919731-free-chibi-dark-oracle-character-sprites/Dark_Oracle_1/PNG/PNG Sequences/Idle/0_Dark_Oracle_Idle_000.png';
import enemyBossImg from '../../assets/craftpix-net-907874-free-top-down-boss-character-4-direction-pack/Caveman Boss/PNG/PNG Sequences/Front - Idle/Front - Idle_000.png';

export const SPRITES = {
  chip: chipImg,
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

export const ENEMY_FALLBACK_COLORS: Record<EnemyType, string> = {
  normal: 'bg-red-600',
  fast: 'bg-orange-500',
  tank: 'bg-stone-500',
  elite: 'bg-purple-600',
  boss: 'bg-amber-700',
};
