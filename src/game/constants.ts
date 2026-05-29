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

export function getBoardSize(round: number): number {
  return Math.min(MAX_BOARD_SIZE, START_BOARD_SIZE + (round - 1) * BOARD_GROWTH_PER_ROUND);
}

export function getEnemyCount(round: number): number {
  const base = ROUND_1_ENEMIES + Math.floor((round - 1) * 0.75);
  return Math.max(1, Math.round(base));
}

export function getTurnsForRound(round: number, bonusTurns: number): number {
  const base = ROUND_1_TURNS + Math.floor((round - 1) / 4);
  return Math.max(3, Math.round(base) + bonusTurns);
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
