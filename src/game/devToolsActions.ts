import { CAMPAIGN_WIN_ROUND } from './constants';
import { createChip, shuffle } from './deck';
import {
  createInitialRunState,
  startRound,
  triggerRoundWinIfClear,
} from './gameLogic';
import { EMPTY_INSTANT_TICKETS } from './instantTickets';
import { openShopState } from './shop';
import type { ChipSpecial, Enemy, EnemyType, InstantTicketType, RunState } from './types';
import { pickRandomUpgrades } from './upgrades';

let devEnemyId = 0;

function nextDevEnemyId(): string {
  devEnemyId += 1;
  return `dev-enemy-${devEnemyId}`;
}

function createDevEnemy(type: EnemyType, position: number, round: number): Enemy {
  let hp = 1;
  if (type === 'tank') hp = 2;
  if (type === 'elite') hp = 2;
  if (type === 'boss') hp = 4 + Math.floor(round / 5);
  return {
    id: nextDevEnemyId(),
    type,
    position,
    hp,
    maxHp: hp,
  };
}

function findFreeCell(run: RunState, preferred?: number): number | null {
  const used = new Set([run.playerPosition, ...run.enemies.map((e) => e.position)]);
  if (preferred !== undefined && !used.has(preferred)) return preferred;
  for (let i = 0; i < run.boardSize; i++) {
    if (!used.has(i)) return i;
  }
  return null;
}

export interface DevChipSpec {
  value?: number;
  special?: ChipSpecial;
}

export const DEV_CHIP_COMBOS: { id: string; label: string; chips: DevChipSpec[] }[] = [
  { id: 'move-23', label: '2 + 3 (Bewegung)', chips: [{ value: 2 }, { value: 3 }] },
  { id: 'tp-2', label: 'Teleport + 2', chips: [{ special: 'teleport' }, { value: 2 }] },
  { id: 'pierce-cleave', label: 'Durchstoß + Spalt + 3', chips: [{ special: 'pierce' }, { special: 'cleave' }, { value: 3 }] },
  { id: 'nova', label: 'Nova', chips: [{ special: 'nova' }] },
  { id: 'grapple', label: 'Enterhaken + 1', chips: [{ special: 'grapple' }, { value: 1 }] },
  { id: 'overcharge', label: '×2 + 2 + 2', chips: [{ special: 'overcharge' }, { value: 2 }, { value: 2 }] },
  { id: 'reverse', label: 'Sturm + Sprung', chips: [{ special: 'dash' }, { special: 'leap' }] },
  { id: 'draw', label: 'Echo + Späher', chips: [{ special: 'echo' }, { special: 'scout' }] },
  { id: 'mega', label: 'TP + Durchstoß + Spalt + 4', chips: [{ special: 'teleport' }, { special: 'pierce' }, { special: 'cleave' }, { value: 4 }] },
];

export const DEV_CHIP_SPECIALS: { label: string; special: ChipSpecial }[] = [
  { label: 'Teleport', special: 'teleport' },
  { label: 'Überladung', special: 'overcharge' },
  { label: 'Echo', special: 'echo' },
  { label: 'Späher', special: 'scout' },
  { label: 'Nova', special: 'nova' },
  { label: 'Rückzug', special: 'retreat' },
  { label: 'Sturm', special: 'dash' },
  { label: 'Sprung', special: 'leap' },
  { label: 'Durchstoß', special: 'pierce' },
  { label: 'Spalt', special: 'cleave' },
  { label: 'Enterhaken', special: 'grapple' },
];

export function devCreateFreshRun(round = 1, upgradeIds: string[] = []): RunState {
  return startRound(createInitialRunState(upgradeIds), round);
}

export function devJumpToRound(run: RunState, round: number): RunState {
  return startRound(run, round);
}

export function devOpenShop(run: RunState, bossRound = false): RunState {
  const round = bossRound ? Math.max(5, run.round - (run.round % 5)) : run.round;
  const shop = openShopState(run.instantTickets, round, run.upgradeIds);
  return {
    ...run,
    round,
    enemies: [],
    pendingEndlessChoice: false,
    ...shop,
    eventLog: ['[Dev] Shop geöffnet.', ...run.eventLog].slice(0, 30),
  };
}

export function devOpenEndlessChoice(run: RunState): RunState {
  return {
    ...run,
    round: CAMPAIGN_WIN_ROUND,
    enemies: [],
    shopOpen: false,
    pendingEndlessChoice: true,
    endlessMode: false,
    runMilestones: { ...run.runMilestones, campaignCompleted: true },
    eventLog: ['[Dev] Endlos-Wahl.', ...run.eventLog].slice(0, 30),
  };
}

export function devWinRound(run: RunState): RunState {
  return triggerRoundWinIfClear({ ...run, enemies: [] });
}

export function devKillPlayer(run: RunState): RunState {
  return { ...run, lives: 0 };
}

export function devAddChipToHand(
  run: RunState,
  spec: DevChipSpec = { value: 1 },
): RunState {
  const chip = spec.special
    ? createChip(spec.value ?? 0, spec.special)
    : createChip(spec.value ?? 1);
  return {
    ...run,
    hand: [...run.hand, chip],
    selectedChipIds: [],
  };
}

export function devSetHandCombo(run: RunState, specs: DevChipSpec[]): RunState {
  const hand = specs.map((spec) =>
    spec.special
      ? createChip(spec.value ?? 0, spec.special)
      : createChip(spec.value ?? 1),
  );
  return {
    ...run,
    hand,
    selectedChipIds: [],
  };
}

export function devFillDeckWithChips(run: RunState, count = 10): RunState {
  const extras = Array.from({ length: count }, (_, i) =>
    createChip((i % 4) + 1),
  );
  return {
    ...run,
    deck: shuffle([...run.deck, ...extras]),
  };
}

export function devSpawnEnemy(
  run: RunState,
  type: EnemyType,
  position?: number,
): RunState {
  const pos = findFreeCell(run, position);
  if (pos === null) return run;
  return {
    ...run,
    enemies: [...run.enemies, createDevEnemy(type, pos, run.round)],
  };
}

export function devClearEnemies(run: RunState): RunState {
  return { ...run, enemies: [] };
}

export function devLineEnemiesForPierce(run: RunState): RunState {
  const board = run.boardSize;
  const positions = [1, 2, 3, 4].map((off) => (run.playerPosition + off) % board);
  const enemies = positions.map((pos, i) =>
    createDevEnemy(i === 3 ? 'tank' : 'normal', pos, run.round),
  );
  return { ...run, enemies, playerPosition: 0 };
}

export function devAddInstantTicket(run: RunState, type: InstantTicketType, amount = 1): RunState {
  return {
    ...run,
    instantTickets: {
      ...run.instantTickets,
      [type]: run.instantTickets[type] + amount,
    },
  };
}

export function devGrantAllTickets(run: RunState): RunState {
  return {
    ...run,
    instantTickets: {
      heal: 2,
      gold: 2,
      sniper: 2,
      surge: 2,
      ward: 2,
    },
  };
}

export function devToggleUpgrade(run: RunState, upgradeId: string): RunState {
  const has = run.upgradeIds.includes(upgradeId);
  return {
    ...run,
    upgradeIds: has
      ? run.upgradeIds.filter((id) => id !== upgradeId)
      : [...run.upgradeIds, upgradeId],
  };
}

export function devForceBossUpgradePicker(run: RunState): RunState {
  const shop = openShopState(run.instantTickets, 5, run.upgradeIds);
  return {
    ...run,
    ...shop,
    pendingUpgradeOptions: pickRandomUpgrades(run.upgradeIds, 3),
    bossUpgradePending: true,
  };
}

export function devResetTickets(run: RunState): RunState {
  return { ...run, instantTickets: { ...EMPTY_INSTANT_TICKETS } };
}

export function devRichRun(run: RunState): RunState {
  return {
    ...devFillDeckWithChips(run, 15),
    gold: 99,
    turnsRemaining: 10,
    discardsRemaining: 5,
    lives: run.maxLives,
    shield: 3,
  };
}
