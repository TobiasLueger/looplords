import { useState } from 'react';
import type { UpgradeDefinition } from '../game/upgrades';
import { UPGRADES } from '../game/upgrades';
import type { RunState } from '../game/types';
import { INSTANT_TICKET_PRICE } from '../game/constants';
import { getShopRerollCost } from '../game/shop';
import { RUINS_UI } from '../utils/ruinsAssets';
import { INSTANT_TICKET_DEFS } from '../game/instantTickets';
import { InstantTicketCard } from './InstantTicketCard';
import { ChipBagModal } from './ChipBagModal';
import { ShopChipOffer as ShopChipOfferCard } from './ShopChipOffer';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneBagIconButton } from './ui/StoneBagIconButton';
import { StoneMenuButton } from './ui/StoneMenuButton';
import { StoneStatDisplay } from './ui/StoneStatDisplay';

interface ShopScreenProps {
  run: RunState;
  onBuyChip: (offerId: string) => void;
  onReroll: () => void;
  onSelectUpgrade: (id: string) => void;
  onLeave: () => void;
  onOpenSettings: () => void;
  onBuyInstantTicket: (offerId: string) => void;
}

export function ShopScreen({
  run,
  onBuyChip,
  onReroll,
  onSelectUpgrade,
  onLeave,
  onOpenSettings,
  onBuyInstantTicket,
}: ShopScreenProps) {
  const [showBag, setShowBag] = useState(false);
  const pickingUpgrade = run.pendingUpgradeOptions.length > 0;
  const rerollCost = getShopRerollCost(run.shopRerollsUsed);
  const upgradeOptions = run.pendingUpgradeOptions
    .map((id) => UPGRADES.find((u) => u.id === id))
    .filter(Boolean) as UpgradeDefinition[];

  if (pickingUpgrade) {
    return (
      <ScreenLayout
        title="Boss-Upgrade"
        subtitle="Wähle 1 permanentes Upgrade — danach geht es in den Shop"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {upgradeOptions.map((opt) => (
            <StoneMenuButton
              key={opt.id}
              label={opt.name}
              description={opt.description}
              onClick={() => onSelectUpgrade(opt.id)}
              className="h-full w-full max-w-none"
            />
          ))}
        </div>
        {run.bossUpgradePending && (
          <p className="mt-4 text-center text-sm text-amber-400/90">
            Nach jedem Boss (Runde 5, 10, 15 …) erhältst du genau ein Upgrade.
          </p>
        )}
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="Loop-Shop"
      subtitle={`Runde ${run.round} geschafft — gib dein Gold aus`}
      titleIcon={RUINS_UI.chest}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <StoneStatDisplay
            icon={RUINS_UI.coin}
            label="Gold"
            value={run.gold}
            variant="primary"
          />
          <StoneBagIconButton onClick={() => setShowBag(true)} />
        </div>
        <StoneMenuButton
          label="Einstellungen"
          onClick={onOpenSettings}
          className="w-auto max-w-none shrink-0 sm:max-w-none"
        />
      </div>

      {(['standard', 'ability'] as const).map((category) => {
        const offers = run.shopChipOffers.filter((o) => o.category === category);
        if (offers.length === 0) return null;
        const title =
          category === 'standard' ? 'Standard-Chips' : 'Spezial-Chips';
        return (
          <section key={category} className="mb-8">
            <h2 className="mb-4 font-display text-lg text-loop-accent">{title}</h2>
            <div className="flex flex-wrap justify-start gap-6 sm:gap-8">
              {offers.map((offer) => (
                <ShopChipOfferCard
                  key={offer.offerId}
                  offer={offer}
                  gold={run.gold}
                  onBuy={onBuyChip}
                />
              ))}
            </div>
          </section>
        );
      })}
      {run.shopChipOffers.length === 0 && (
        <p className="text-loop-muted">Alle Chip-Angebote gekauft.</p>
      )}

      <div className="mt-4">
        <StoneMenuButton
          label={`Chips neu würfeln (${rerollCost} Gold)`}
          onClick={onReroll}
          disabled={run.gold < rerollCost}
          className="w-auto max-w-none sm:max-w-md"
        />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg text-loop-accent">Sofort-Tickets</h2>
        <p className="mb-4 text-xs text-stone-300/80">
          Je {INSTANT_TICKET_PRICE} Gold — im Spiel jederzeit nutzbar.
        </p>
        {run.shopTicketOffers.length === 0 ? (
          <p className="text-sm text-loop-muted">Alle Ticket-Angebote gekauft.</p>
        ) : (
          <div className="ticket-shop-grid grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {run.shopTicketOffers.map((offer) => {
              const def = INSTANT_TICKET_DEFS.find((d) => d.id === offer.type);
              if (!def) return null;
              return (
                <InstantTicketCard
                  key={offer.offerId}
                  def={def}
                  mode="buy"
                  compact
                  ticketPrice={INSTANT_TICKET_PRICE}
                  canAfford={run.gold >= INSTANT_TICKET_PRICE}
                  onBuy={() => onBuyInstantTicket(offer.offerId)}
                />
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-10 flex justify-start">
        <StoneMenuButton variant="primary" label="Weiter — nächste Runde" onClick={onLeave} />
      </div>

      {showBag && (
        <ChipBagModal
          run={run}
          context="shop"
          onClose={() => setShowBag(false)}
        />
      )}
    </ScreenLayout>
  );
}
