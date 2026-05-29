import {
  SHOP_ABILITY_OFFER_COUNT,
  SHOP_REROLL_BASE_COST,
  SHOP_STANDARD_OFFER_COUNT,
  SHOP_TICKET_OFFER_COUNT,
  isBossRound,
} from './constants';
import { createChip, shuffle } from './deck';
import { EMPTY_INSTANT_TICKETS, pickRandomInstantTicketType } from './instantTickets';
import type {
  Chip,
  EnemyType,
  InstantTickets,
  ShopChipOffer,
  ShopTicketOffer,
} from './types';
import { pickRandomUpgrades } from './upgrades';

export { SHOP_REROLL_BASE_COST };

export function getShopRerollCost(rerollsUsed: number): number {
  return SHOP_REROLL_BASE_COST + rerollsUsed;
}

export function getGoldForEnemyType(type: EnemyType): number {
  switch (type) {
    case 'boss':
      return 8;
    case 'elite':
      return 3;
    case 'tank':
    case 'fast':
      return 2;
    default:
      return 1;
  }
}

interface ShopChipTemplate {
  id: string;
  name: string;
  description: string;
  price: number;
  create: () => Chip;
}

const SHOP_STANDARD_CHIPS: ShopChipTemplate[] = [1, 2, 3, 4].map((value) => ({
  id: `step_${value}`,
  name: `${value === 1 ? 'Einer' : value === 2 ? 'Zweier' : value === 3 ? 'Dreier' : 'Vierer'}-Chip`,
  description: `Bewege dich ${value} Feld${value === 1 ? '' : 'er'} im Uhrzeigersinn.`,
  price: value,
  create: () => createChip(value),
}));

const SHOP_ABILITY_CHIPS: ShopChipTemplate[] = [
  {
    id: 'step_5',
    name: 'Fünfer-Chip',
    description: 'Bewege dich 5 Felder im Uhrzeigersinn.',
    price: 6,
    create: () => createChip(5),
  },
  {
    id: 'step_6',
    name: 'Sechser-Chip',
    description: 'Bewege dich 6 Felder im Uhrzeigersinn.',
    price: 8,
    create: () => createChip(6),
  },
  {
    id: 'teleport',
    name: 'Riss-Chip',
    description: 'Teleport: springe halbe Runde vor.',
    price: 7,
    create: () => createChip(0, 'teleport'),
  },
  {
    id: 'overcharge',
    name: 'Überladung',
    description: 'Verdoppelt die Schritte der gleichzeitig gespielten Lauf-Chips.',
    price: 6,
    create: () => createChip(1, 'overcharge'),
  },
  {
    id: 'echo',
    name: 'Echo-Chip',
    description: 'Nach dem Zug: ziehe 1 Chip mehr aus dem Beutel.',
    price: 5,
    create: () => createChip(0, 'echo'),
  },
  {
    id: 'scout',
    name: 'Späher-Chip',
    description: 'Nach dem Zug: ziehe 2 Chips mehr aus dem Beutel.',
    price: 7,
    create: () => createChip(0, 'scout'),
  },
  {
    id: 'dash',
    name: 'Sturm-Chip',
    description: 'Bewege dich 3 Felder gegen den Uhrzeigersinn.',
    price: 5,
    create: () => createChip(0, 'dash'),
  },
  {
    id: 'leap',
    name: 'Sprung-Chip',
    description: 'Bewege dich 4 Felder gegen den Uhrzeigersinn.',
    price: 6,
    create: () => createChip(0, 'leap'),
  },
  {
    id: 'pierce',
    name: 'Durchstoß-Chip',
    description: 'Trifft jeden Gegner auf den Feldern entlang deiner Bewegung.',
    price: 7,
    create: () => createChip(0, 'pierce'),
  },
  {
    id: 'cleave',
    name: 'Spalt-Chip',
    description: 'Trifft nach der Landung den nächsten Gegner im Uhrzeigersinn.',
    price: 6,
    create: () => createChip(0, 'cleave'),
  },
  {
    id: 'grapple',
    name: 'Enterhaken-Chip',
    description: 'Bewege dich zum nächsten Gegner im Uhrzeigersinn (+ Lauf-Chips).',
    price: 8,
    create: () => createChip(0, 'grapple'),
  },
  {
    id: 'nova',
    name: 'Nova-Chip',
    description: 'Alle Gegner verlieren 1 Treffer.',
    price: 8,
    create: () => createChip(0, 'nova'),
  },
  {
    id: 'retreat',
    name: 'Rückzug-Chip',
    description: 'Bewege dich 2 Felder gegen den Uhrzeigersinn.',
    price: 4,
    create: () => createChip(0, 'retreat'),
  },
];

const SHOP_CHIP_POOL: ShopChipTemplate[] = [
  ...SHOP_STANDARD_CHIPS,
  ...SHOP_ABILITY_CHIPS,
];

let offerIdCounter = 0;

function nextOfferId(): string {
  offerIdCounter += 1;
  return `offer-${offerIdCounter}`;
}

export function resetShopOfferIdCounter(): void {
  offerIdCounter = 0;
}

function templateToOffer(
  t: ShopChipTemplate,
  category: ShopChipOffer['category'],
): ShopChipOffer {
  return {
    offerId: nextOfferId(),
    templateId: t.id,
    name: t.name,
    description: t.description,
    price: t.price,
    category,
  };
}

function pickRandomStandardOffers(count: number): ShopChipOffer[] {
  const offers: ShopChipOffer[] = [];
  for (let i = 0; i < count; i++) {
    const value = 1 + Math.floor(Math.random() * 4);
    const t = SHOP_STANDARD_CHIPS[value - 1];
    offers.push(templateToOffer(t, 'standard'));
  }
  return offers;
}

function pickRandomAbilityOffers(count: number): ShopChipOffer[] {
  const shuffled = shuffle([...SHOP_ABILITY_CHIPS]);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((t) =>
    templateToOffer(t, 'ability'),
  );
}

/** 3 Standard-Chips (Wert 1–4, Preis = Wert in Gold) + 3 zufällige Fähigkeits-Chips. */
export function pickRandomShopOffers(): ShopChipOffer[] {
  return [
    ...pickRandomStandardOffers(SHOP_STANDARD_OFFER_COUNT),
    ...pickRandomAbilityOffers(SHOP_ABILITY_OFFER_COUNT),
  ];
}

export function pickRandomShopTicketOffers(
  count: number = SHOP_TICKET_OFFER_COUNT,
): ShopTicketOffer[] {
  const offers: ShopTicketOffer[] = [];
  for (let i = 0; i < count; i++) {
    offers.push({
      offerId: nextOfferId(),
      type: pickRandomInstantTicketType(),
    });
  }
  return offers;
}

export function createChipFromShopTemplate(templateId: string): Chip | null {
  const t = SHOP_CHIP_POOL.find((x) => x.id === templateId);
  return t ? t.create() : null;
}

export function openShopState(
  prevTickets: InstantTickets = EMPTY_INSTANT_TICKETS,
  completedRound: number,
  upgradeIds: string[] = [],
): {
  shopOpen: boolean;
  shopChipOffers: ShopChipOffer[];
  shopTicketOffers: ShopTicketOffer[];
  shopRerollsUsed: number;
  upgradeTickets: number;
  instantTickets: InstantTickets;
  pendingUpgradeOptions: string[];
  bossUpgradePending: boolean;
} {
  const instantTickets = { ...prevTickets };

  const afterBoss = isBossRound(completedRound);

  return {
    shopOpen: true,
    shopChipOffers: pickRandomShopOffers(),
    shopTicketOffers: pickRandomShopTicketOffers(),
    shopRerollsUsed: 0,
    upgradeTickets: 0,
    instantTickets,
    pendingUpgradeOptions: afterBoss
      ? pickRandomUpgrades(upgradeIds, 3)
      : [],
    bossUpgradePending: afterBoss,
  };
}
