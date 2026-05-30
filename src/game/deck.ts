import { START_DECK_COMPOSITION } from './constants';
import type { Chip } from './types';
import { hasUpgrade } from './upgrades';

let chipIdCounter = 0;

export function resetChipIdCounter(): void {
  chipIdCounter = 0;
}

function nextChipId(): string {
  chipIdCounter += 1;
  return `chip-${chipIdCounter}`;
}

export function createChip(value: number, special?: Chip['special']): Chip {
  return { id: nextChipId(), value, special };
}

export function buildStartingDeck(upgradeIds: string[]): Chip[] {
  const deck: Chip[] = [];
  for (const [valStr, count] of Object.entries(START_DECK_COMPOSITION)) {
    let value = Number(valStr);
    if (hasUpgrade(upgradeIds, 'ones_to_twos') && value === 1) {
      value = 2;
    }
    for (let i = 0; i < count; i++) {
      deck.push(createChip(value));
    }
  }
  if (hasUpgrade(upgradeIds, 'add_five_chip')) {
    deck.push(createChip(5));
  }
  if (hasUpgrade(upgradeIds, 'teleport_chip')) {
    deck.push(createChip(0, 'teleport'));
  }
  return shuffle(deck);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Alle Chips des Runs über alle Stapel (Beutel, Hand, Ablage, diese Runde gespielt). */
export function getAllChipsInPiles(piles: {
  deck: Chip[];
  discard: Chip[];
  playedThisRound: Chip[];
  hand: Chip[];
}): Chip[] {
  return [
    ...piles.deck,
    ...piles.discard,
    ...piles.playedThisRound,
    ...piles.hand,
  ];
}

export function prepareRoundDeck(
  upgradeIds: string[],
  piles: {
    deck: Chip[];
    discard: Chip[];
    playedThisRound: Chip[];
    hand: Chip[];
  },
): Chip[] {
  const existing = getAllChipsInPiles(piles);
  if (existing.length === 0) {
    return buildStartingDeck(upgradeIds);
  }
  return shuffle(existing);
}

export function drawFromDeckOnly(
  deck: Chip[],
  count: number,
): { deck: Chip[]; hand: Chip[] } {
  const d = [...deck];
  const hand: Chip[] = [];
  while (hand.length < count && d.length > 0) {
    const drawn = d.pop();
    if (drawn) hand.push(drawn);
  }
  return { deck: d, hand };
}

export function drawHand(
  deck: Chip[],
  discard: Chip[],
  count: number,
): { deck: Chip[]; discard: Chip[]; hand: Chip[] } {
  let d = [...deck];
  let disc = [...discard];
  const hand: Chip[] = [];

  while (hand.length < count) {
    if (d.length === 0) {
      if (disc.length === 0) break;
      d = shuffle(disc);
      disc = [];
    }
    const drawn = d.pop();
    if (drawn) hand.push(drawn);
  }

  return { deck: d, discard: disc, hand };
}

export function refillHand(
  deck: Chip[],
  currentHand: Chip[],
  targetSize: number,
): { deck: Chip[]; hand: Chip[]; drawn: number } {
  const hand = [...currentHand];
  let d = [...deck];
  const sizeBefore = hand.length;

  while (hand.length < targetSize && d.length > 0) {
    const drawn = d.pop();
    if (drawn) hand.push(drawn);
    else break;
  }

  return { deck: d, hand, drawn: hand.length - sizeBefore };
}

export function applyOnesToTwosToDeck(
  deck: Chip[],
  discard: Chip[],
  playedThisRound: Chip[],
  hand: Chip[],
): {
  deck: Chip[];
  discard: Chip[];
  playedThisRound: Chip[];
  hand: Chip[];
} {
  const map = (c: Chip) => (c.value === 1 && !c.special ? { ...c, value: 2 } : c);
  return {
    deck: deck.map(map),
    discard: discard.map(map),
    playedThisRound: playedThisRound.map(map),
    hand: hand.map(map),
  };
}
