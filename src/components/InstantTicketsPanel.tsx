import { INSTANT_TICKET_DEFS } from '../game/instantTickets';
import type { InstantTicketType, InstantTickets } from '../game/types';
import { GameButton } from './ui/GameButton';
import { RuinsPanel } from './ui/RuinsPanel';

interface InstantTicketsPanelProps {
  tickets: InstantTickets;
  mode: 'use' | 'buy';
  onUse?: (type: InstantTicketType) => void;
  onBuy?: (type: InstantTicketType) => void;
  gold?: number;
  ticketPrice?: number;
}

export function InstantTicketsPanel({
  tickets,
  mode,
  onUse,
  onBuy,
  gold = 0,
  ticketPrice = 4,
}: InstantTicketsPanelProps) {
  const hasAny = INSTANT_TICKET_DEFS.some((d) => tickets[d.id] > 0);

  if (mode === 'use' && !hasAny) return null;

  return (
    <RuinsPanel>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-loop-muted">
        {mode === 'use' ? 'Sofort-Tickets' : 'Sofort-Tickets kaufen'}
      </h3>
      <p className="mb-3 text-xs text-loop-muted">
        {mode === 'use'
          ? 'Einmalig einsetzen — kostet keinen Zug.'
          : `Je ${ticketPrice} Gold — im Spiel jederzeit nutzbar.`}
      </p>
      <div className="flex flex-col gap-2">
        {INSTANT_TICKET_DEFS.map((def) => {
          const count = tickets[def.id];
          if (mode === 'use' && count <= 0) return null;

          return (
            <div
              key={def.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-loop-border bg-loop-bg/50 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium text-white">
                  {def.name}
                  {mode === 'use' && (
                    <span className="ml-2 text-loop-accent">×{count}</span>
                  )}
                </span>
                <p className="text-xs text-loop-muted">{def.description}</p>
              </div>
              {mode === 'use' ? (
                <GameButton
                  variant="secondary"
                  className="shrink-0 px-3 py-1 text-xs"
                  onClick={() => onUse?.(def.id)}
                >
                  Nutzen
                </GameButton>
              ) : (
                <GameButton
                  variant="secondary"
                  className="shrink-0 px-3 py-1 text-xs"
                  onClick={() => onBuy?.(def.id)}
                  disabled={gold < ticketPrice}
                >
                  Kaufen ({ticketPrice})
                </GameButton>
              )}
            </div>
          );
        })}
      </div>
    </RuinsPanel>
  );
}
