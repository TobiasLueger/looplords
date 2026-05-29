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
  | 'overcharge'
  | 'echo'
  | 'scout'
  | 'nova'
  | 'retreat'
  | 'dash'
  | 'leap'
  | 'pierce'
  | 'cleave'
  | 'grapple';

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

export interface ShopTicketOffer {
  offerId: string;
  type: InstantTicketType;
}

export interface GameSettings {
  music: boolean;
  musicVolume: number;
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
  goldEarnedThisRound: number;
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
  shopTicketOffers: ShopTicketOffer[];
  shopOpen: boolean;
  /** Rerolls used this shop visit; cost is SHOP_REROLL_BASE_COST + shopRerollsUsed. */
  shopRerollsUsed: number;
  /** Must pick one of pendingUpgradeOptions before leaving shop (after boss rounds). */
  bossUpgradePending: boolean;
  endlessMode: boolean;
  runMilestones: RunMilestones;
  pendingEndlessChoice: boolean;
  /** Step counts per movement segment for board hop animation (last playChips action). */
  playerMoveSteps: number[];
  /** Incremented when playerMoveSteps is set so the UI animates once per action. */
  playerMoveToken: number;
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
