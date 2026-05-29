import type { InstantTicketDefinition } from '../game/instantTickets';
import { getTicketSprite } from '../utils/assets';
import { RUINS_UI } from '../utils/ruinsAssets';

interface InstantTicketCardProps {
  def: InstantTicketDefinition;
  mode: 'use' | 'buy';
  count?: number;
  ticketPrice?: number;
  sellPrice?: number;
  canAfford?: boolean;
  compact?: boolean;
  onUse?: () => void;
  onSell?: () => void;
  onBuy?: () => void;
}

function TicketBody({ def }: { def: InstantTicketDefinition }) {
  return (
    <div className="ticket-card__body">
      <p className="ticket-card__title">{def.name}</p>
      <p className="ticket-card__desc">{def.description}</p>
    </div>
  );
}

function TicketUseStub({
  count,
  sellPrice,
  onUse,
  onSell,
}: {
  count: number;
  sellPrice: number;
  onUse?: () => void;
  onSell?: () => void;
}) {
  return (
    <div className="ticket-card__stub ticket-card__stub--right ticket-card__actions">
      <span className="ticket-card__count">×{count}</span>
      <button
        type="button"
        className="ticket-card__btn ticket-card__btn--primary"
        onClick={onUse}
      >
        Nutzen
      </button>
      <button
        type="button"
        className="ticket-card__btn ticket-card__btn--sell"
        onClick={onSell}
      >
        <img src={RUINS_UI.coin} alt="" className="h-3.5 w-3.5 object-contain" draggable={false} />
        +{sellPrice}
      </button>
    </div>
  );
}

function TicketBuyStub({ ticketPrice }: { ticketPrice: number }) {
  return (
    <div className="ticket-card__stub ticket-card__stub--right ticket-card__actions">
      <span className="ticket-card__price">
        <img src={RUINS_UI.coin} alt="" className="h-4 w-4 object-contain" draggable={false} />
        {ticketPrice}
      </span>
    </div>
  );
}

export function InstantTicketCard({
  def,
  mode,
  count = 0,
  ticketPrice = 4,
  sellPrice = 2,
  canAfford = true,
  compact = false,
  onUse,
  onSell,
  onBuy,
}: InstantTicketCardProps) {
  const cardClass = `ticket-card group text-left ${compact ? 'ticket-card--shop' : 'w-full'}`;
  const style = { backgroundImage: `url(${getTicketSprite()})` };

  if (mode === 'buy') {
    return (
      <button
        type="button"
        onClick={onBuy}
        disabled={!canAfford}
        className={`${cardClass} border-0 bg-transparent p-0 transition enabled:cursor-pointer enabled:hover:scale-[1.02] enabled:hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-45`}
        style={style}
        aria-label={`${def.name} kaufen für ${ticketPrice} Gold`}
      >
        <div className="ticket-card__inner ticket-card__inner--actions">
          <TicketBody def={def} />
          <TicketBuyStub ticketPrice={ticketPrice} />
        </div>
      </button>
    );
  }

  return (
    <div className={cardClass} style={style}>
      <div className="ticket-card__inner ticket-card__inner--actions">
        <TicketBody def={def} />
        <TicketUseStub
          count={count}
          sellPrice={sellPrice}
          onUse={onUse}
          onSell={onSell}
        />
      </div>
    </div>
  );
}
