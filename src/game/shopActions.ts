import { INSTANT_TICKET_PRICE, INSTANT_TICKET_SELL_PRICE } from './constants';
import type { InstantTicketType, RunState } from './types';
import { shuffle } from './deck';
import { applySmiteToNearest, applyUpgradeToRun, startRound, triggerRoundWinIfClear } from './gameLogic';
import { INSTANT_TICKET_DEFS } from './instantTickets';
import {
  createChipFromShopTemplate,
  getShopRerollCost,
  pickRandomShopOffers,
} from './shop';

function addLog(state: RunState, message: string): string[] {
  return [message, ...state.eventLog].slice(0, 30);
}

function bumpShopPurchase(state: RunState): RunState {
  return {
    ...state,
    runMilestones: {
      ...state.runMilestones,
      shopPurchases: state.runMilestones.shopPurchases + 1,
    },
  };
}

export function buyShopChip(state: RunState, offerId: string): RunState {
  const offer = state.shopChipOffers.find((o) => o.offerId === offerId);
  if (!offer || state.gold < offer.price) return state;

  const chip = createChipFromShopTemplate(offer.templateId);
  if (!chip) return state;

  return bumpShopPurchase({
    ...state,
    gold: state.gold - offer.price,
    deck: shuffle([...state.deck, chip]),
    shopChipOffers: state.shopChipOffers.filter((o) => o.offerId !== offerId),
    eventLog: addLog(state, `${offer.name} gekauft (−${offer.price} Gold).`),
  });
}

export function rerollShopOffers(state: RunState): RunState {
  const cost = getShopRerollCost(state.shopRerollsUsed);
  if (state.gold < cost) return state;

  return bumpShopPurchase({
    ...state,
    gold: state.gold - cost,
    shopChipOffers: pickRandomShopOffers(),
    shopRerollsUsed: state.shopRerollsUsed + 1,
    eventLog: addLog(state, `Chips neu gewürfelt (−${cost} Gold).`),
  });
}

export function buyInstantTicket(state: RunState, offerId: string): RunState {
  const offer = state.shopTicketOffers.find((o) => o.offerId === offerId);
  if (!offer || state.gold < INSTANT_TICKET_PRICE) return state;

  const def = INSTANT_TICKET_DEFS.find((d) => d.id === offer.type);
  return bumpShopPurchase({
    ...state,
    gold: state.gold - INSTANT_TICKET_PRICE,
    instantTickets: {
      ...state.instantTickets,
      [offer.type]: state.instantTickets[offer.type] + 1,
    },
    shopTicketOffers: state.shopTicketOffers.filter((o) => o.offerId !== offerId),
    eventLog: addLog(
      state,
      `${def?.name ?? 'Sofort-Ticket'} gekauft (−${INSTANT_TICKET_PRICE} Gold).`,
    ),
  });
}

export function useInstantTicket(
  state: RunState,
  type: InstantTicketType,
): RunState {
  if (state.shopOpen) return state;
  if (state.instantTickets[type] <= 0) return state;

  const def = INSTANT_TICKET_DEFS.find((d) => d.id === type);
  let next: RunState = {
    ...state,
    instantTickets: {
      ...state.instantTickets,
      [type]: state.instantTickets[type] - 1,
    },
    runMilestones: {
      ...state.runMilestones,
      usedInstantTicket: true,
    },
  };

  switch (type) {
    case 'heal':
      if (next.lives >= next.maxLives) return state;
      next = {
        ...next,
        lives: Math.min(next.lives + 1, next.maxLives),
      };
      next = { ...next, eventLog: addLog(next, `${def?.name}: +1 Leben.`) };
      break;
    case 'gold':
      next = {
        ...next,
        gold: next.gold + 5,
        goldEarnedThisRound: next.goldEarnedThisRound + 5,
      };
      next = { ...next, eventLog: addLog(next, `${def?.name}: +5 Gold.`) };
      break;
    case 'sniper':
      if (next.enemies.length === 0) return state;
      next = applySmiteToNearest(next);
      next = { ...next, eventLog: addLog(next, `${def?.name}: Treffer!`) };
      next = triggerRoundWinIfClear(next);
      break;
    case 'surge':
      next = { ...next, turnsRemaining: next.turnsRemaining + 1 };
      next = { ...next, eventLog: addLog(next, `${def?.name}: +1 Zug.`) };
      break;
    case 'ward':
      next = { ...next, shield: next.shield + 2 };
      next = { ...next, eventLog: addLog(next, `${def?.name}: +2 Schild.`) };
      break;
    default:
      return state;
  }

  return next;
}

export function sellInstantTicket(
  state: RunState,
  type: InstantTicketType,
): RunState {
  if (state.shopOpen) return state;
  if (state.instantTickets[type] <= 0) return state;

  const def = INSTANT_TICKET_DEFS.find((d) => d.id === type);
  return {
    ...state,
    gold: state.gold + INSTANT_TICKET_SELL_PRICE,
    instantTickets: {
      ...state.instantTickets,
      [type]: state.instantTickets[type] - 1,
    },
    eventLog: addLog(
      state,
      `${def?.name ?? 'Sofort-Ticket'} verkauft (+${INSTANT_TICKET_SELL_PRICE} Gold).`,
    ),
  };
}

export function redeemUpgradeTicket(
  state: RunState,
  upgradeId: string,
): RunState {
  if (!state.pendingUpgradeOptions.includes(upgradeId)) return state;

  let next = applyUpgradeToRun(state, upgradeId);
  next = {
    ...next,
    pendingUpgradeOptions: [],
    bossUpgradePending: false,
    eventLog: addLog(next, 'Permanentes Upgrade gewählt.'),
  };
  return next;
}

export function cancelUpgradePicker(state: RunState): RunState {
  if (state.bossUpgradePending) return state;
  if (state.pendingUpgradeOptions.length === 0) return state;
  return {
    ...state,
    pendingUpgradeOptions: [],
    eventLog: addLog(state, 'Upgrade-Auswahl abgebrochen.'),
  };
}

export function leaveShop(state: RunState): RunState {
  if (!state.shopOpen) return state;
  if (state.bossUpgradePending && state.pendingUpgradeOptions.length > 0) {
    return {
      ...state,
      eventLog: addLog(
        state,
        'Wähle zuerst dein Boss-Upgrade (3 Karten oben).',
      ),
    };
  }

  const nextRound = state.round + 1;
  const cleared: RunState = {
    ...state,
    shopOpen: false,
    shopChipOffers: [],
    shopTicketOffers: [],
    shopRerollsUsed: 0,
    pendingUpgradeOptions: [],
    bossUpgradePending: false,
    upgradeTickets: 0,
  };
  return startRound(cleared, nextRound);
}
