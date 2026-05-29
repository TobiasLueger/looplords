import type { Difficulty } from './types';

/** @deprecated Use CAMPAIGN_WIN_ROUND — kept for imports during migration */
export const MAX_ROUND = 25;
export const CAMPAIGN_WIN_ROUND = 25;
export const ENDLESS_ROUND_START = 26;
export const BOSS_ROUND_INTERVAL = 5;
export const STARTING_LIVES = 3;
export const STARTING_GOLD = 3;
export const HAND_SIZE = 5;
export const START_BOARD_SIZE = 12;
export const MAX_BOARD_SIZE = 32;
export const BOARD_GROWTH_PER_ROUND = 2;

export const ROUND_1_TURNS = 5;
export const ROUND_1_DISCARDS = 2;
export const ROUND_1_ENEMIES = 3;

export const START_DECK_COMPOSITION: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
};

export const DIFFICULTY_MODIFIERS: Record<
  Difficulty,
  { enemyMult: number; turnMult: number; damageMult: number }
> = {
  easy: { enemyMult: 0.85, turnMult: 1.2, damageMult: 0.75 },
  normal: { enemyMult: 1, turnMult: 1, damageMult: 1 },
  hard: { enemyMult: 1.25, turnMult: 0.85, damageMult: 1.35 },
};

export function getBoardSize(round: number): number {
  return Math.min(MAX_BOARD_SIZE, START_BOARD_SIZE + (round - 1) * BOARD_GROWTH_PER_ROUND);
}

export function getEnemyCount(round: number, difficulty: Difficulty): number {
  const base = ROUND_1_ENEMIES + Math.floor((round - 1) * 0.75);
  const mod = DIFFICULTY_MODIFIERS[difficulty].enemyMult;
  return Math.max(1, Math.round(base * mod));
}

export function getTurnsForRound(round: number, difficulty: Difficulty, bonusTurns: number): number {
  const base = ROUND_1_TURNS + Math.floor((round - 1) / 4);
  const mod = DIFFICULTY_MODIFIERS[difficulty].turnMult;
  return Math.max(3, Math.round(base * mod) + bonusTurns);
}

export function getDiscardsForRound(bonusDiscards: number): number {
  return ROUND_1_DISCARDS + bonusDiscards;
}

export function isBossRound(round: number): boolean {
  return round % BOSS_ROUND_INTERVAL === 0;
}

export const SHOP_OFFER_COUNT = 6;
export const SHOP_STANDARD_OFFER_COUNT = 3;
export const SHOP_ABILITY_OFFER_COUNT = 3;
export const SHOP_REROLL_BASE_COST = 2;
export const SHOP_TICKET_OFFER_COUNT = 4;
export const INSTANT_TICKET_PRICE = 4;
export const INSTANT_TICKET_SELL_PRICE = 2;
