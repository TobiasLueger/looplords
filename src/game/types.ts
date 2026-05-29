export type Screen =
  | 'title'
  | 'runSetup'
  | 'game'
  | 'shop'
  | 'settings'
  | 'howToPlay'
  | 'gameOver'
  | 'victory'
  | 'endlessChoice'
  | 'runEnd'
  | 'achievements';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type EnemyType = 'normal' | 'fast' | 'tank' | 'elite' | 'boss';

export type ChipSpecial =
  | 'teleport'
  | 'shield'
  | 'overcharge'
  | 'echo'
  | 'heal'
  | 'coin'
  | 'scout'
  | 'smite'
  | 'rally'
  | 'nova'
  | 'retreat';

export type InstantTicketType = 'heal' | 'gold' | 'sniper' | 'surge' | 'ward';

export interface InstantTickets {
  heal: number;
  gold: number;
  sniper: number;
  surge: number;
  ward: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  position: number;
  hp: number;
  maxHp: number;
}

export interface Chip {
  id: string;
  value: number;
  special?: ChipSpecial;
}

export interface ShopChipOffer {
  offerId: string;
  templateId: string;
  name: string;
  description: string;
  price: number;
  category: 'standard' | 'ability';
}

export interface GameSettings {
  music: boolean;
  sound: boolean;
  animations: boolean;
  difficulty: Difficulty;
}

export interface RunMilestones {
  usedInstantTicket: boolean;
  shopPurchases: number;
  campaignCompleted: boolean;
  choseEndless: boolean;
}

export const EMPTY_RUN_MILESTONES: RunMilestones = {
  usedInstantTicket: false,
  shopPurchases: 0,
  campaignCompleted: false,
  choseEndless: false,
};

export interface RunState {
  round: number;
  boardSize: number;
  playerPosition: number;
  lives: number;
  maxLives: number;
  shield: number;
  enemies: Enemy[];
  deck: Chip[];
  discard: Chip[];
  playedThisRound: Chip[];
  hand: Chip[];
  selectedChipIds: string[];
  turnsRemaining: number;
  discardsRemaining: number;
  killsThisRound: number;
  enemiesDefeatedTotal: number;
  firstKillBonusUsed: boolean;
  upgradeIds: string[];
  eventLog: string[];
  bossDefeated: boolean;
  playerTurnCount: number;
  firstChipDoubledUsed: boolean;
  pendingUpgradeOptions: string[];
  lastKillFlash: boolean;
  gold: number;
  upgradeTickets: number;
  instantTickets: InstantTickets;
  shopChipOffers: ShopChipOffer[];
  shopOpen: boolean;
  /** Must pick one of pendingUpgradeOptions before leaving shop (after boss rounds). */
  bossUpgradePending: boolean;
  endlessMode: boolean;
  runMilestones: RunMilestones;
  pendingEndlessChoice: boolean;
}

export interface RunEndStats {
  round: number;
  enemiesDefeated: number;
  gold: number;
  bossDefeated: boolean;
  endlessMode: boolean;
  campaignCompleted: boolean;
  won: boolean;
  reason?: string;
}

export interface GameOverStats {
  round: number;
  enemiesDefeated: number;
  reason: string;
}

export interface VictoryStats {
  round: number;
  enemiesDefeated: number;
  bossDefeated: boolean;
}
