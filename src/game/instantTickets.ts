import type { InstantTicketType, InstantTickets } from './types';

export interface InstantTicketDefinition {
  id: InstantTicketType;
  name: string;
  description: string;
  stamp: string;
  code: string;
}

export const INSTANT_TICKET_DEFS: InstantTicketDefinition[] = [
  {
    id: 'heal',
    name: 'Heil-Ticket',
    description: 'Stellt sofort 1 Leben wieder her (bis Maximum).',
    stamp: '♥',
    code: 'HL-01',
  },
  {
    id: 'gold',
    name: 'Gold-Ticket',
    description: 'Gibt sofort +5 Gold.',
    stamp: '¤',
    code: 'GD-02',
  },
  {
    id: 'sniper',
    name: 'Scharfschützen-Ticket',
    description: 'Fügt dem nächsten Gegner im Uhrzeigersinn 1 Treffer zu.',
    stamp: '◎',
    code: 'SN-03',
  },
  {
    id: 'surge',
    name: 'Impuls-Ticket',
    description: 'Gibt +1 Zug in dieser Runde.',
    stamp: '»',
    code: 'IM-04',
  },
  {
    id: 'ward',
    name: 'Wächter-Ticket',
    description: 'Gibt sofort +2 Schild.',
    stamp: '⛨',
    code: 'WD-05',
  },
];

export const EMPTY_INSTANT_TICKETS: InstantTickets = {
  heal: 0,
  gold: 0,
  sniper: 0,
  surge: 0,
  ward: 0,
};

export function totalInstantTickets(tickets: InstantTickets): number {
  return tickets.heal + tickets.gold + tickets.sniper + tickets.surge + tickets.ward;
}

export function pickRandomInstantTicketType(): InstantTicketType {
  const types = INSTANT_TICKET_DEFS.map((d) => d.id);
  return types[Math.floor(Math.random() * types.length)];
}

export function grantFreeInstantTicket(tickets: InstantTickets): InstantTickets {
  const type = pickRandomInstantTicketType();
  return { ...tickets, [type]: tickets[type] + 1 };
}
