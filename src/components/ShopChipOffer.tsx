import { useMemo } from 'react';
import { createChipFromShopTemplate } from '../game/shop';
import type { ShopChipOffer as ShopChipOfferType } from '../game/types';
import { ChipSprite } from './ChipSprite';
import { RUINS_UI } from '../utils/ruinsAssets';

interface ShopChipOfferProps {
  offer: ShopChipOfferType;
  gold: number;
  onBuy: (offerId: string) => void;
}

export function ShopChipOffer({ offer, gold, onBuy }: ShopChipOfferProps) {
  const previewChip = useMemo(
    () => createChipFromShopTemplate(offer.templateId),
    [offer.templateId],
  );
  const canAfford = gold >= offer.price;

  if (!previewChip) return null;

  return (
    <div className="group/shop-offer relative flex flex-col items-center">
      <button
        type="button"
        onClick={() => onBuy(offer.offerId)}
        disabled={!canAfford}
        className="flex flex-col items-center rounded-xl border-0 bg-transparent p-1 transition enabled:cursor-pointer enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45"
        aria-label={`${offer.name} kaufen für ${offer.price} Gold`}
      >
        <ChipSprite chip={previewChip} size="lg" showTypeLabel={false} />
      </button>

      <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-loop-accent">
        <img
          src={RUINS_UI.coin}
          alt=""
          className="h-4 w-4 object-contain"
          draggable={false}
        />
        <span>{offer.price}</span>
      </div>

      <div
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-52 -translate-x-1/2 rounded-lg border border-loop-border bg-loop-bg px-3 py-2 text-left shadow-xl backdrop-blur-sm group-hover/shop-offer:block group-focus-within/shop-offer:block"
        role="tooltip"
      >
        <p className="font-semibold text-loop-accent">{offer.name}</p>
        <p className="mt-1 text-xs leading-snug text-loop-muted">
          {offer.description}
        </p>
        {!canAfford && (
          <p className="mt-1.5 text-xs text-loop-danger">Nicht genug Gold</p>
        )}
      </div>
    </div>
  );
}
