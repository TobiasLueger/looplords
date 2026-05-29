import type { UpgradeDefinition } from '../game/upgrades';
import { UPGRADES } from '../game/upgrades';
import type { RunState } from '../game/types';
import { INSTANT_TICKET_PRICE } from '../game/constants';
import type { InstantTicketType } from '../game/types';
import { SHOP_REROLL_COST } from '../game/shop';
import { RUINS_UI } from '../utils/ruinsAssets';
import { InstantTicketsPanel } from './InstantTicketsPanel';
import { ShopChipOffer as ShopChipOfferCard } from './ShopChipOffer';
import { StatIcon } from './StatIcon';
import { GameButton } from './ui/GameButton';
import { ScreenLayout } from './ui/ScreenLayout';

interface ShopScreenProps {
  run: RunState;
  onBuyChip: (offerId: string) => void;
  onReroll: () => void;
  onSelectUpgrade: (id: string) => void;
  onLeave: () => void;
  onOpenSettings: () => void;
  onBuyInstantTicket: (type: InstantTicketType) => void;
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
  const pickingUpgrade = run.pendingUpgradeOptions.length > 0;
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
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectUpgrade(opt.id)}
              className="panel panel-ruins group text-left transition hover:border-loop-accent hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]"
            >
              <h3 className="font-display text-lg text-loop-accent group-hover:text-loop-accentHover">
                {opt.name}
              </h3>
              <p className="mt-2 text-sm text-loop-muted">{opt.description}</p>
              <span className="mt-4 inline-block text-xs text-loop-accent">
                Auswählen →
              </span>
            </button>
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
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-lg border border-loop-border bg-loop-panel/80 px-3 py-2 text-sm text-loop-muted transition hover:border-loop-muted hover:text-white"
          aria-label="Einstellungen"
        >
          ⚙ Einstellungen
        </button>
      </div>

      <div className="mb-4">
        <StatIcon
          icon={RUINS_UI.coin}
          label="Gold"
          value={run.gold}
          valueClassName="text-loop-accent"
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

      <div className="mt-4 flex flex-wrap gap-2">
        <GameButton
          variant="secondary"
          onClick={onReroll}
          disabled={run.gold < SHOP_REROLL_COST}
        >
          Chips neu würfeln ({SHOP_REROLL_COST} Gold)
        </GameButton>
      </div>

      <div className="mt-8">
        <InstantTicketsPanel
          tickets={run.instantTickets}
          mode="buy"
          gold={run.gold}
          ticketPrice={INSTANT_TICKET_PRICE}
          onBuy={onBuyInstantTicket}
        />
      </div>

      <div className="mt-10">
        <GameButton onClick={onLeave}>Weiter — nächste Runde</GameButton>
      </div>
    </ScreenLayout>
  );
}
