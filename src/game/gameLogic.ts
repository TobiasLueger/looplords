import {
  getBoardSize,
  getDiscardsForRound,
  getEnemyCount,
  getTurnsForRound,
  CAMPAIGN_WIN_ROUND,
  isBossRound,
  STARTING_LIVES,
  STARTING_GOLD,
} from './constants';
import {
  applyOnesToTwosToDeck,
  createChip,
  drawFromDeckOnly,
  prepareRoundDeck,
  refillHand,
  resetChipIdCounter,
  shuffle,
} from './deck';
import type { Chip, Difficulty, Enemy, EnemyType, RunState } from './types';
import { EMPTY_RUN_MILESTONES } from './types';
import {
  EMPTY_INSTANT_TICKETS,
  grantFreeInstantTicket,
} from './instantTickets';
import { getGoldForEnemyType, openShopState, resetShopOfferIdCounter } from './shop';
import {
  getBonusDiscards,
  getBonusLives,
  getBonusTurns,
  getHandSize,
  hasUpgrade,
} from './upgrades';

let enemyIdCounter = 0;

function nextEnemyId(): string {
  enemyIdCounter += 1;
  return `enemy-${enemyIdCounter}`;
}

export function resetEnemyIdCounter(): void {
  enemyIdCounter = 0;
}

export function moveClockwise(pos: number, steps: number, boardSize: number): number {
  return ((pos % boardSize) + steps + boardSize) % boardSize;
}

function adjacentPositions(pos: number, boardSize: number): number[] {
  return [
    (pos - 1 + boardSize) % boardSize,
    (pos + 1) % boardSize,
  ];
}

function addLog(state: RunState, message: string): string[] {
  const log = [message, ...state.eventLog].slice(0, 30);
  return log;
}

function createEnemy(type: EnemyType, position: number, round: number): Enemy {
  const isBoss = type === 'boss';
  const isTank = type === 'tank';
  let hp = 1;
  if (isTank) hp = 2;
  if (type === 'elite') hp = 2;
  if (isBoss) hp = 4 + Math.floor(round / 5);

  return {
    id: nextEnemyId(),
    type,
    position,
    hp,
    maxHp: hp,
  };
}

function pickEnemyType(round: number, index: number, bossRound: boolean): EnemyType {
  if (bossRound && index === 0) return 'boss';
  if (round >= 10 && index % 4 === 0) return 'elite';
  if (round >= 6 && index % 3 === 1) return 'fast';
  if (round >= 4 && index % 3 === 2) return 'tank';
  return 'normal';
}

function spawnEnemies(
  count: number,
  boardSize: number,
  playerPos: number,
  round: number,
): Enemy[] {
  const bossRound = isBossRound(round);
  const enemies: Enemy[] = [];
  const used = new Set<number>([playerPos]);
  let attempts = 0;

  while (enemies.length < count && attempts < 200) {
    attempts++;
    const pos = Math.floor(Math.random() * boardSize);
    if (used.has(pos)) continue;
    used.add(pos);
    const type = pickEnemyType(round, enemies.length, bossRound);
    enemies.push(createEnemy(type, pos, round));
  }

  return enemies;
}

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

function getEnemyDamage(type: EnemyType, difficulty: Difficulty): number {
  const base = type === 'boss' ? 2 : type === 'elite' ? 2 : 1;
  const mult =
    difficulty === 'easy' ? 0.75 : difficulty === 'hard' ? 1.35 : 1;
  return Math.max(1, Math.round(base * mult));
}

export function createInitialRunState(upgradeIds: string[] = []): RunState {
  resetChipIdCounter();
  resetEnemyIdCounter();
  resetShopOfferIdCounter();
  return startRound(
    {
      round: 0,
      boardSize: 12,
      playerPosition: 0,
      lives: STARTING_LIVES + getBonusLives(upgradeIds),
      maxLives: STARTING_LIVES + getBonusLives(upgradeIds),
      shield: 0,
      enemies: [],
      deck: [],
      discard: [],
      playedThisRound: [],
      hand: [],
      selectedChipIds: [],
      turnsRemaining: 0,
      discardsRemaining: 0,
      killsThisRound: 0,
      goldEarnedThisRound: 0,
      enemiesDefeatedTotal: 0,
      firstKillBonusUsed: false,
      upgradeIds,
      eventLog: ['Willkommen, Looplord!'],
      bossDefeated: false,
      playerTurnCount: 0,
      firstChipDoubledUsed: false,
      pendingUpgradeOptions: [],
      lastKillFlash: false,
      gold: STARTING_GOLD,
      upgradeTickets: 0,
      instantTickets: grantFreeInstantTicket({ ...EMPTY_INSTANT_TICKETS }),
      shopChipOffers: [],
      shopTicketOffers: [],
      shopOpen: false,
      shopRerollsUsed: 0,
      bossUpgradePending: false,
      endlessMode: false,
      runMilestones: { ...EMPTY_RUN_MILESTONES },
      pendingEndlessChoice: false,
      playerMoveSteps: [],
      playerMoveToken: 0,
    },
    'normal',
    1,
  );
}

export function isCampaignCompletePending(state: RunState): boolean {
  return (
    state.round === CAMPAIGN_WIN_ROUND &&
    !state.endlessMode &&
    state.pendingEndlessChoice &&
    !state.shopOpen &&
    state.enemies.length === 0
  );
}

export function startRound(
  prev: RunState,
  difficulty: Difficulty,
  round: number,
): RunState {
  const boardSize = getBoardSize(round);
  const enemyCount = getEnemyCount(round, difficulty);
  let deck = prepareRoundDeck(prev.upgradeIds, {
    deck: prev.deck,
    discard: prev.discard,
    playedThisRound: prev.playedThisRound,
    hand: prev.hand,
  });
  let discard: Chip[] = [];

  if (hasUpgrade(prev.upgradeIds, 'ones_to_twos')) {
    const mapped = applyOnesToTwosToDeck(deck, discard, [], []);
    deck = mapped.deck;
    discard = mapped.discard;
  }

  const handSize = getHandSize(prev.upgradeIds);
  const drawn = drawFromDeckOnly(deck, handSize);
  deck = drawn.deck;

  const turns = getTurnsForRound(round, difficulty, getBonusTurns(prev.upgradeIds));
  const discards = getDiscardsForRound(getBonusDiscards(prev.upgradeIds));

  let shield = prev.shield;
  if (hasUpgrade(prev.upgradeIds, 'round_shield')) {
    shield = Math.max(shield, 1);
  }

  const enemies = spawnEnemies(enemyCount, boardSize, 0, round);
  const bossRound = isBossRound(round);

  return {
    ...prev,
    round,
    boardSize,
    playerPosition: 0,
    shield,
    enemies,
    deck: drawn.deck,
    discard,
    playedThisRound: [],
    hand: drawn.hand,
    selectedChipIds: [],
    turnsRemaining: turns,
    discardsRemaining: discards,
    killsThisRound: 0,
    goldEarnedThisRound: 0,
    firstKillBonusUsed: false,
    firstChipDoubledUsed: false,
    playerTurnCount: 0,
    pendingUpgradeOptions: [],
    lastKillFlash: false,
    playerMoveSteps: [],
    eventLog: addLog(
      prev,
      bossRound
        ? `Runde ${round}: Boss-Schlacht!`
        : `Runde ${round} beginnt — ${enemyCount} Gegner.`,
    ),
  };
}

function damagePlayer(state: RunState, amount: number): RunState {
  let shield = state.shield;
  let lives = state.lives;
  let remaining = amount;

  if (shield > 0) {
    const absorbed = Math.min(shield, remaining);
    shield -= absorbed;
    remaining -= absorbed;
  }

  lives -= remaining;

  return {
    ...state,
    shield,
    lives: Math.max(0, lives),
    eventLog: addLog(
      state,
      remaining > 0
        ? `Du erleidest ${remaining} Schaden! (${lives} Leben übrig)`
        : 'Schild blockiert den Angriff!',
    ),
  };
}

function removeEnemyAt(
  enemies: Enemy[],
  position: number,
  upgradeIds: string[],
): { enemies: Enemy[]; killed: Enemy[] } {
  const killed: Enemy[] = [];
  const remaining: Enemy[] = [];

  for (const e of enemies) {
    if (e.position === position) {
      let hp = e.hp;
      if (e.type === 'tank' && hasUpgrade(upgradeIds, 'tank_bane')) {
        hp = 1;
      }
      if (hp > 1) {
        remaining.push({ ...e, hp: hp - 1 });
      } else {
        killed.push(e);
      }
    } else {
      remaining.push(e);
    }
  }

  return { enemies: remaining, killed };
}

function clockwiseDistance(from: number, to: number, boardSize: number): number {
  return (to - from + boardSize) % boardSize;
}

function getNearestEnemyClockwise(
  fromPosition: number,
  enemies: Enemy[],
  boardSize: number,
): Enemy | null {
  if (enemies.length === 0) return null;

  const sorted = [...enemies].sort(
    (a, b) =>
      clockwiseDistance(fromPosition, a.position, boardSize) -
      clockwiseDistance(fromPosition, b.position, boardSize),
  );

  return (
    sorted.find(
      (e) => clockwiseDistance(fromPosition, e.position, boardSize) > 0,
    ) ?? sorted[0]
  );
}

export function cellsAlongPath(from: number, steps: number, boardSize: number): number[] {
  if (steps === 0) return [];

  const cells: number[] = [];
  const dir = steps > 0 ? 1 : -1;
  for (let i = 1; i <= Math.abs(steps); i++) {
    cells.push(moveClockwise(from, dir * i, boardSize));
  }
  return cells;
}

function damageEnemiesOnCells(state: RunState, cells: number[]): RunState {
  let next = { ...state };

  for (const pos of [...new Set(cells)]) {
    const { enemies, killed } = removeEnemyAt(next.enemies, pos, next.upgradeIds);
    next.enemies = enemies;
    next = processKill(next, killed);
    if (next.enemies.length === 0) break;
  }

  return next;
}

function applyHitToNearestFrom(state: RunState, fromPosition: number): RunState {
  const target = getNearestEnemyClockwise(
    fromPosition,
    state.enemies,
    state.boardSize,
  );
  if (!target) return state;

  const dist = clockwiseDistance(fromPosition, target.position, state.boardSize);
  if (dist <= 0) return state;

  const { enemies, killed } = removeEnemyAt(
    state.enemies,
    target.position,
    state.upgradeIds,
  );
  let next = { ...state, enemies };
  return processKill(next, killed);
}

export function applySmiteToNearest(state: RunState): RunState {
  return applyHitToNearestFrom(state, state.playerPosition);
}

/** Board cell index of the sniper ticket's clockwise-nearest target, or null. */
export function getSniperTargetCell(state: RunState): number | null {
  const target = getNearestEnemyClockwise(
    state.playerPosition,
    state.enemies,
    state.boardSize,
  );
  return target?.position ?? null;
}

export function getNearestEnemyTargetCell(
  fromPosition: number,
  enemies: Enemy[],
  boardSize: number,
): number | null {
  const target = getNearestEnemyClockwise(fromPosition, enemies, boardSize);
  if (!target) return null;
  const dist = clockwiseDistance(fromPosition, target.position, boardSize);
  if (dist <= 0) return null;
  return target.position;
}

export function damageAllEnemiesOnce(state: RunState): RunState {
  if (state.enemies.length === 0) return state;

  let next = { ...state };
  const positions = [...new Set(state.enemies.map((e) => e.position))];
  for (const pos of positions) {
    const { enemies, killed } = removeEnemyAt(
      next.enemies,
      pos,
      next.upgradeIds,
    );
    next = { ...next, enemies };
    next = processKill(next, killed);
    if (next.enemies.length === 0) break;
  }
  return next;
}

function processKill(
  state: RunState,
  killed: Enemy[],
): RunState {
  if (killed.length === 0) return state;

  let next = { ...state };
  const bossKill = killed.some((e) => e.type === 'boss');

  next.enemiesDefeatedTotal += killed.length;
  next.killsThisRound += killed.length;
  next.lastKillFlash = true;
  next.eventLog = addLog(
    next,
    killed.length === 1
      ? `${enemyLabel(killed[0].type)} eliminiert!`
      : `${killed.length} Gegner eliminiert!`,
  );

  if (bossKill) {
    next.bossDefeated = true;
  }

  let goldGain = 0;
  for (const e of killed) {
    goldGain += getGoldForEnemyType(e.type);
  }
  if (goldGain > 0) {
    next.gold += goldGain;
    next.goldEarnedThisRound += goldGain;
    next.eventLog = addLog(next, `+${goldGain} Gold`);
  }

  if (
    hasUpgrade(next.upgradeIds, 'first_kill_turn') &&
    !next.firstKillBonusUsed
  ) {
    next.firstKillBonusUsed = true;
    next.turnsRemaining += 1;
    next.eventLog = addLog(next, 'Blutlust: +1 Zug!');
  }

  return next;
}

function enemyLabel(type: EnemyType): string {
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

function resolveLanding(
  state: RunState,
  position: number,
): RunState {
  let next = { ...state };
  const { enemies, killed } = removeEnemyAt(next.enemies, position, next.upgradeIds);
  next.enemies = enemies;
  next = processKill(next, killed);

  if (hasUpgrade(next.upgradeIds, 'adjacent_kills')) {
    for (const adj of adjacentPositions(position, next.boardSize)) {
      const result = removeEnemyAt(next.enemies, adj, next.upgradeIds);
      next.enemies = result.enemies;
      next = processKill(next, result.killed);
    }
  }

  return next;
}

function calculateChipMovement(
  hand: Chip[],
  selectedIds: string[],
  firstChipDoubledUsed: boolean,
  upgradeIds: string[],
): {
  steps: number;
  hasTeleport: boolean;
  extraDraw: number;
  hasNova: boolean;
  hasPierce: boolean;
  hasCleave: boolean;
  hasGrapple: boolean;
  played: Chip[];
} {
  const selected = hand.filter((c) => selectedIds.includes(c.id));
  let steps = 0;
  let hasTeleport = false;
  let extraDraw = 0;
  let hasNova = false;
  let hasPierce = false;
  let hasCleave = false;
  let hasGrapple = false;
  let hasOvercharge = false;
  let firstApplied = firstChipDoubledUsed;

  for (const chip of selected) {
    switch (chip.special) {
      case 'teleport':
        hasTeleport = true;
        continue;
      case 'echo':
        extraDraw = Math.max(extraDraw, 1);
        continue;
      case 'scout':
        extraDraw = Math.max(extraDraw, 2);
        continue;
      case 'nova':
        hasNova = true;
        continue;
      case 'pierce':
        hasPierce = true;
        continue;
      case 'cleave':
        hasCleave = true;
        continue;
      case 'grapple':
        hasGrapple = true;
        continue;
      case 'retreat':
        steps -= 2;
        continue;
      case 'overcharge':
        hasOvercharge = true;
        continue;
      case 'dash':
        steps -= 3;
        continue;
      case 'leap':
        steps -= 4;
        continue;
      default:
        break;
    }
    let val = chip.value;
    if (
      !firstApplied &&
      hasUpgrade(upgradeIds, 'double_first_chip')
    ) {
      val *= 2;
      firstApplied = true;
    }
    steps += val;
  }

  if (hasOvercharge) {
    steps *= 2;
  }

  return {
    steps,
    hasTeleport,
    extraDraw,
    hasNova,
    hasPierce,
    hasCleave,
    hasGrapple,
    played: selected,
  };
}

export function toggleChipSelection(state: RunState, chipId: string): RunState {
  const selected = state.selectedChipIds.includes(chipId)
    ? state.selectedChipIds.filter((id) => id !== chipId)
    : [...state.selectedChipIds, chipId];

  return { ...state, selectedChipIds: selected };
}

export function playChips(state: RunState, difficulty: Difficulty): RunState {
  if (state.selectedChipIds.length === 0) return state;
  if (state.turnsRemaining <= 0) return state;

  const {
    steps,
    hasTeleport,
    extraDraw,
    hasNova,
    hasPierce,
    hasCleave,
    hasGrapple,
    played,
  } = calculateChipMovement(
    state.hand,
    state.selectedChipIds,
    false,
    state.upgradeIds,
  );

  const canPlay =
    steps !== 0 ||
    hasTeleport ||
    extraDraw > 0 ||
    hasNova ||
    hasGrapple ||
    (hasPierce && (steps !== 0 || hasGrapple || hasTeleport)) ||
    (hasCleave && (steps !== 0 || hasGrapple || hasTeleport));
  if (!canPlay) return state;

  if (hasGrapple && state.enemies.length === 0) {
    return state;
  }

  let next: RunState = {
    ...state,
    turnsRemaining: state.turnsRemaining - 1,
    playerTurnCount: state.playerTurnCount + 1,
    selectedChipIds: [],
    hand: state.hand.filter((c) => !played.some((p) => p.id === c.id)),
    playedThisRound: [...state.playedThisRound, ...played],
    firstChipDoubledUsed: false,
    lastKillFlash: false,
  };

  if (hasNova) {
    next = damageAllEnemiesOnce(next);
    next.eventLog = addLog(next, 'Nova-Chip: alle Gegner -1 Treffer.');
  }

  const moveSegments: number[] = [];

  if (hasTeleport) {
    const teleportSteps = Math.floor(next.boardSize / 2);
    moveSegments.push(teleportSteps);
    next.playerPosition = moveClockwise(
      next.playerPosition,
      teleportSteps,
      next.boardSize,
    );
    next.eventLog = addLog(next, `Teleport! +${teleportSteps} Felder.`);
  }

  let moveSteps = steps;
  if (hasGrapple && next.enemies.length > 0) {
    const target = getNearestEnemyClockwise(
      next.playerPosition,
      next.enemies,
      next.boardSize,
    );
    if (target) {
      moveSteps =
        clockwiseDistance(next.playerPosition, target.position, next.boardSize) +
        steps;
    }
  }

  if (moveSteps !== 0) {
    if (hasPierce) {
      const pathCells = cellsAlongPath(
        next.playerPosition,
        moveSteps,
        next.boardSize,
      );
      next = damageEnemiesOnCells(next, pathCells);
      next.eventLog = addLog(next, 'Durchstoß-Chip: Treffer entlang des Wegs!');
    }

    next.playerPosition = moveClockwise(
      next.playerPosition,
      moveSteps,
      next.boardSize,
    );
    moveSegments.push(moveSteps);
    next.eventLog = addLog(
      next,
      hasGrapple
        ? `Enterhaken! ${moveSteps} Feld(er) zum Gegner.`
        : moveSteps > 0
          ? `Du bewegst dich ${moveSteps} Feld(er) vor.`
          : `Rückzug-Chip: ${Math.abs(moveSteps)} Feld(er) zurück.`,
    );
  }

  if (moveSteps !== 0 || hasTeleport) {
    next = resolveLanding(next, next.playerPosition);
  }

  if (hasCleave) {
    next = applyHitToNearestFrom(next, next.playerPosition);
    next.eventLog = addLog(next, 'Spalt-Chip: Treffer auf nächsten Gegner!');
  }

  if (hasUpgrade(next.upgradeIds, 'kill_momentum') && next.killsThisRound > state.killsThisRound) {
    moveSegments.push(1);
    next.playerPosition = moveClockwise(
      next.playerPosition,
      1,
      next.boardSize,
    );
    next = resolveLanding(next, next.playerPosition);
    next.eventLog = addLog(next, 'Durchbruch: +1 Feld nach dem Kill.');
  }

  if (moveSegments.length > 0) {
    next = {
      ...next,
      playerMoveSteps: moveSegments,
      playerMoveToken: state.playerMoveToken + 1,
    };
  }

  if (next.enemies.length === 0) {
    return onRoundWon(next);
  }

  next = runEnemyPhase(next, difficulty);

  if (next.lives <= 0) return next;
  if (next.enemies.length === 0) return onRoundWon(next);
  if (next.turnsRemaining <= 0 && next.enemies.length > 0) {
    next.eventLog = addLog(next, 'Keine Züge mehr — die Schleife bricht!');
    return next;
  }

  const handSize = getHandSize(next.upgradeIds);
  const refilled = refillHand(next.deck, next.hand, handSize);
  next = {
    ...next,
    deck: refilled.deck,
    hand: refilled.hand,
    eventLog: addLog(
      next,
      refilled.drawn > 0
        ? 'Hand aufgefüllt.'
        : hasNoChipsLeftToPlay(next)
          ? 'Beutel leer — du kannst nicht mehr ziehen!'
          : 'Beutel leer — keine neuen Chips.',
    ),
  };

  if (extraDraw > 0 && next.deck.length > 0) {
    const drawn = drawFromDeckOnly(next.deck, extraDraw);
    if (drawn.hand.length > 0) {
      next = {
        ...next,
        deck: drawn.deck,
        hand: [...next.hand, ...drawn.hand],
        eventLog: addLog(
          next,
          extraDraw >= 2
            ? `Späher-Chip: +${drawn.hand.length} Chip(s) aus dem Beutel.`
            : 'Echo-Chip: +1 Chip aus dem Beutel.',
        ),
      };
    }
  }

  return next;
}

export function endTurn(state: RunState, difficulty: Difficulty): RunState {
  if (state.turnsRemaining <= 0) return state;

  let next: RunState = {
    ...state,
    turnsRemaining: state.turnsRemaining - 1,
    playerTurnCount: state.playerTurnCount + 1,
    selectedChipIds: [],
    lastKillFlash: false,
  };

  next.eventLog = addLog(next, 'Zug beendet.');

  if (next.enemies.length === 0) {
    return onRoundWon(next);
  }

  next = runEnemyPhase(next, difficulty);

  if (next.turnsRemaining <= 0 && next.enemies.length > 0) {
    next.eventLog = addLog(next, 'Keine Züge mehr — die Schleife bricht!');
  }

  return next;
}

function runEnemyPhase(state: RunState, difficulty: Difficulty): RunState {
  if (
    hasUpgrade(state.upgradeIds, 'slow_enemies') &&
    state.playerTurnCount % 2 === 0
  ) {
    return {
      ...state,
      eventLog: addLog(state, 'Gegner warten (Zeitfrost).'),
    };
  }

  let next = { ...state };
  const sorted = [...next.enemies].sort((a, b) => a.position - b.position);

  for (const enemy of sorted) {
    const speed = getEnemySpeed(enemy.type);
    const newPos = moveClockwise(enemy.position, speed, next.boardSize);

    next.enemies = next.enemies.map((e) =>
      e.id === enemy.id ? { ...e, position: newPos } : e,
    );

    if (newPos === next.playerPosition) {
      const dmg = getEnemyDamage(enemy.type, difficulty);
      next = damagePlayer(next, dmg);
      if (enemy.type === 'boss') {
        next = damagePlayer(next, 1);
        next.eventLog = addLog(next, 'Boss-Schlag trifft doppelt!');
      }
    }
  }

  next.eventLog = addLog(next, 'Gegnerzug abgeschlossen.');
  return next;
}

function onRoundWon(state: RunState): RunState {
  if (
    state.round === CAMPAIGN_WIN_ROUND &&
    !state.endlessMode
  ) {
    return {
      ...state,
      enemies: [],
      shopOpen: false,
      pendingEndlessChoice: true,
      runMilestones: {
        ...state.runMilestones,
        campaignCompleted: true,
      },
      eventLog: addLog(
        state,
        'Runde 25 geschafft — Kampagnen-Sieg! Wähle: Endlos oder Run beenden.',
      ),
    };
  }

  const shop = openShopState(
    state.instantTickets,
    state.round,
    state.upgradeIds,
  );
  return {
    ...state,
    enemies: [],
    pendingEndlessChoice: false,
    ...shop,
    eventLog: addLog(
      state,
      isBossRound(state.round)
        ? `Boss-Runde ${state.round} geschafft! Wähle ein Upgrade, dann Shop.`
        : `Runde ${state.round} geschafft! Shop — ${state.gold} Gold.`,
    ),
  };
}

/** Opens shop / campaign choice when the board is clear (e.g. Scharfschuss-Ticket). */
export function triggerRoundWinIfClear(state: RunState): RunState {
  if (state.enemies.length > 0 || state.shopOpen || state.pendingEndlessChoice) {
    return state;
  }
  return onRoundWon(state);
}

export function openEndlessShop(state: RunState): RunState {
  const shop = openShopState(
    state.instantTickets,
    state.round,
    state.upgradeIds,
  );
  return {
    ...state,
    endlessMode: true,
    pendingEndlessChoice: false,
    runMilestones: {
      ...state.runMilestones,
      choseEndless: true,
    },
    ...shop,
    eventLog: addLog(state, 'Endlos-Modus! Shop vor Runde 26.'),
  };
}

export function discardAndRedraw(state: RunState): RunState {
  if (state.discardsRemaining <= 0) return state;
  if (state.hand.length === 0) return state;

  const handSize = getHandSize(state.upgradeIds);
  const playedThisRound = [...state.playedThisRound, ...state.hand];
  const drawn = drawFromDeckOnly(state.deck, handSize);

  return {
    ...state,
    discardsRemaining: state.discardsRemaining - 1,
    playedThisRound,
    hand: drawn.hand,
    deck: drawn.deck,
    selectedChipIds: [],
    eventLog: addLog(
      state,
      drawn.hand.length > 0
        ? 'Hand abgeworfen und neu gezogen.'
        : 'Hand abgeworfen — Beutel leer.',
    ),
  };
}

export function applyUpgradeToRun(state: RunState, upgradeId: string): RunState {
  const upgradeIds = [...state.upgradeIds, upgradeId];
  const maxLives = STARTING_LIVES + getBonusLives(upgradeIds);

  let next: RunState = {
    ...state,
    upgradeIds,
    maxLives,
    lives: Math.min(state.lives + (upgradeId === 'extra_life' ? 1 : 0), maxLives),
  };

  if (upgradeId === 'ones_to_twos') {
    const mapped = applyOnesToTwosToDeck(
      next.deck,
      next.discard,
      next.playedThisRound,
      next.hand,
    );
    next = { ...next, ...mapped };
  }

  if (upgradeId === 'add_five_chip') {
    next.deck = shuffle([...next.deck, createChip(5)]);
  }

  if (upgradeId === 'teleport_chip') {
    next.deck = shuffle([...next.deck, createChip(0, 'teleport')]);
  }

  if (upgradeId === 'dash_chip') {
    next.deck = shuffle([...next.deck, createChip(0, 'dash')]);
  }

  if (upgradeId === 'pierce_chip') {
    next.deck = shuffle([...next.deck, createChip(0, 'pierce')]);
  }

  if (upgradeId === 'grapple_chip') {
    next.deck = shuffle([...next.deck, createChip(0, 'grapple')]);
  }

  if (upgradeId === 'nova_chip') {
    next.deck = shuffle([...next.deck, createChip(0, 'nova')]);
  }

  if (upgradeId === 'gold_rush') {
    next.gold += 3;
    next.eventLog = addLog(next, 'Goldrausch: +3 Gold.');
  }

  return next;
}

export function hasNoChipsLeftToPlay(state: RunState): boolean {
  return state.deck.length === 0 && state.hand.length === 0;
}

export function isGameOver(state: RunState): boolean {
  if (state.shopOpen) return false;
  if (state.enemies.length === 0) return false;
  if (state.lives <= 0) return true;
  if (hasNoChipsLeftToPlay(state)) return true;
  if (state.turnsRemaining <= 0) return true;
  return false;
}

export function getGameOverReason(state: RunState): string {
  if (state.lives <= 0) return 'Leben aufgebraucht';
  if (hasNoChipsLeftToPlay(state)) return 'Beutel leer — keine Chips mehr';
  return 'Züge aufgebraucht — Gegner überleben';
}

export function isVictory(_state: RunState): boolean {
  return false;
}

export function getEntitiesOnCell(state: RunState, cellIndex: number): {
  player: boolean;
  enemies: Enemy[];
} {
  return {
    player: state.playerPosition === cellIndex,
    enemies: state.enemies.filter((e) => e.position === cellIndex),
  };
}
