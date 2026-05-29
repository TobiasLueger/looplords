import { INSTANT_TICKET_SELL_PRICE } from '../game/constants';
import { INSTANT_TICKET_DEFS } from '../game/instantTickets';
import type { InstantTicketType, InstantTickets } from '../game/types';
import { InstantTicketCard } from './InstantTicketCard';
import { RuinsPanel } from './ui/RuinsPanel';

interface InstantTicketsPanelProps {
  tickets: InstantTickets;
  mode: 'use' | 'buy';
  onUse?: (type: InstantTicketType) => void;
  onSell?: (type: InstantTicketType) => void;
  onBuy?: (type: InstantTicketType) => void;
  gold?: number;
  ticketPrice?: number;
  sellPrice?: number;
}

export function InstantTicketsPanel({
  tickets,
  mode,
  onUse,
  onSell,
  onBuy,
  gold = 0,
  ticketPrice = 4,
  sellPrice = INSTANT_TICKET_SELL_PRICE,
}: InstantTicketsPanelProps) {
  const hasAny = INSTANT_TICKET_DEFS.some((d) => tickets[d.id] > 0);

  if (mode === 'use' && !hasAny) return null;

  const visibleDefs =
    mode === 'use'
      ? INSTANT_TICKET_DEFS.filter((d) => tickets[d.id] > 0)
      : INSTANT_TICKET_DEFS;

  return (
    <RuinsPanel className="!bg-loop-panel/70">
      <h3 className="mb-1 font-display text-base tracking-wide text-loop-accent">
        {mode === 'use' ? 'Sofort-Tickets' : 'Sofort-Tickets kaufen'}
      </h3>
      <p className="mb-4 text-xs text-stone-300/80">
        {mode === 'use'
          ? `Einmalig einsetzen — kein Zug. Verkauf bringt ${sellPrice} Gold.`
          : `Je ${ticketPrice} Gold — im Spiel jederzeit nutzbar.`}
      </p>
      <div className="flex flex-col gap-3">
        {visibleDefs.map((def) => (
          <InstantTicketCard
            key={def.id}
            def={def}
            mode={mode}
            count={tickets[def.id]}
            ticketPrice={ticketPrice}
            sellPrice={sellPrice}
            canAfford={gold >= ticketPrice}
            onUse={() => onUse?.(def.id)}
            onSell={() => onSell?.(def.id)}
            onBuy={() => onBuy?.(def.id)}
          />
        ))}
      </div>
    </RuinsPanel>
  );
}
