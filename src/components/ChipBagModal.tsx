import { useEffect } from 'react';
import type { Chip, RunState } from '../game/types';
import { getAllChipsInPiles } from '../game/deck';
import { INSTANT_TICKET_DEFS } from '../game/instantTickets';
import { totalInstantTickets } from '../game/instantTickets';
import { ChipSprite } from './ChipSprite';
import { StoneGroundSurface } from './ui/StoneGroundSurface';
import { StoneMenuButton } from './ui/StoneMenuButton';

interface ChipBagModalProps {
  run: RunState;
  onClose: () => void;
  /** Shop: alle besessenen Chips in einer Liste. Spiel: Beutel/Hand/gespielt getrennt. */
  context?: 'game' | 'shop';
}

const bodyTextShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

const sectionTitleShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

function sortChips(chips: Chip[]): Chip[] {
  return [...chips].sort((a, b) => {
    if (a.special === 'teleport') return 1;
    if (b.special === 'teleport') return -1;
    return a.value - b.value;
  });
}

function getAllOwnedChips(run: RunState): Chip[] {
  return sortChips(
    getAllChipsInPiles({
      deck: run.deck,
      discard: run.discard,
      playedThisRound: run.playedThisRound,
      hand: run.hand,
    }),
  );
}

export function ChipBagModal({
  run,
  onClose,
  context = 'game',
}: ChipBagModalProps) {
  const isShop = context === 'shop';
  const bagChips = sortChips(run.deck);
  const handChips = sortChips(run.hand);
  const playedChips = sortChips(run.playedThisRound);
  const ownedChips = getAllOwnedChips(run);
  const ticketCount = totalInstantTickets(run.instantTickets);
  const ownedTickets = INSTANT_TICKET_DEFS.filter((d) => run.instantTickets[d.id] > 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chip-bag-title"
    >
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <StoneGroundSurface scrollable className="max-h-[85vh]">
          <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
            <div>
              <h2
                id="chip-bag-title"
                className="font-display text-xl font-bold text-loop-accentHover sm:text-2xl"
                style={{ textShadow: sectionTitleShadow }}
              >
                {isShop ? 'Inventar' : 'Beutel & Tickets'}
              </h2>
              <p
                className="mt-1 text-sm text-stone-200/90"
                style={{ textShadow: bodyTextShadow }}
              >
                {isShop ? (
                  <>
                    {ownedChips.length} Chip(s)
                    {ticketCount > 0
                      ? ` · ${ticketCount} Sofort-Ticket(s)`
                      : ''}
                  </>
                ) : (
                  <>
                    {bagChips.length} Chip(s) im Beutel
                    {handChips.length > 0 ? ` · ${handChips.length} in der Hand` : ''}
                    {playedChips.length > 0
                      ? ` · ${playedChips.length} diese Runde gespielt`
                      : ''}
                    {ticketCount > 0 ? ` · ${ticketCount} Sofort-Ticket(s)` : ''}
                  </>
                )}
              </p>
            </div>

            {isShop ? (
              <section>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider text-stone-300/90"
                  style={{ textShadow: bodyTextShadow }}
                >
                  Chips
                </h3>
                {ownedChips.length === 0 ? (
                  <p
                    className="mt-2 text-sm text-stone-200/80"
                    style={{ textShadow: bodyTextShadow }}
                  >
                    Keine Chips im Besitz.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ownedChips.map((chip) => (
                      <ChipSprite
                        key={chip.id}
                        chip={chip}
                        size="sm"
                        showTypeLabel={false}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <>
                <section>
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider text-stone-300/90"
                    style={{ textShadow: bodyTextShadow }}
                  >
                    Im Beutel (ziehbar)
                  </h3>
                  {bagChips.length === 0 ? (
                    <p
                      className="mt-2 text-sm text-stone-200/80"
                      style={{ textShadow: bodyTextShadow }}
                    >
                      Beutel ist leer.
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {bagChips.map((chip) => (
                        <ChipBadge key={chip.id} chip={chip} variant="bag" />
                      ))}
                    </div>
                  )}
                </section>

                {handChips.length > 0 && (
                  <section>
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider text-stone-300/90"
                      style={{ textShadow: bodyTextShadow }}
                    >
                      In der Hand
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {handChips.map((chip) => (
                        <ChipBadge key={chip.id} chip={chip} variant="hand" />
                      ))}
                    </div>
                  </section>
                )}

                {playedChips.length > 0 && (
                  <section>
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider text-stone-300/90"
                      style={{ textShadow: bodyTextShadow }}
                    >
                      Diese Runde gespielt
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {playedChips.map((chip) => (
                        <ChipBadge key={chip.id} chip={chip} variant="played" />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            <section>
              <h3
                className="text-xs font-semibold uppercase tracking-wider text-stone-300/90"
                style={{ textShadow: bodyTextShadow }}
              >
                Sofort-Tickets
              </h3>
              {ownedTickets.length === 0 ? (
                <p
                  className="mt-2 text-sm text-stone-200/80"
                  style={{ textShadow: bodyTextShadow }}
                >
                  Keine Sofort-Tickets im Besitz.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {ownedTickets.map((def) => (
                    <li
                      key={def.id}
                      className="flex items-start justify-between gap-2 rounded-md border border-black/25 bg-black/20 px-3 py-2"
                    >
                      <div>
                        <p
                          className="font-display text-sm font-bold text-loop-accentHover"
                          style={{ textShadow: sectionTitleShadow }}
                        >
                          {def.name}
                        </p>
                        <p
                          className="text-xs text-stone-200/85"
                          style={{ textShadow: bodyTextShadow }}
                        >
                          {def.description}
                        </p>
                      </div>
                      <span
                        className="shrink-0 font-display text-lg font-bold text-white/95"
                        style={{ textShadow: sectionTitleShadow }}
                      >
                        ×{run.instantTickets[def.id]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <StoneMenuButton
              label="Schließen"
              onClick={onClose}
              className="w-full max-w-none"
            />
          </div>
        </StoneGroundSurface>
      </div>
    </div>
  );
}

function ChipBadge({
  chip,
  variant,
}: {
  chip: Chip;
  variant: 'bag' | 'hand' | 'played';
}) {
  return (
    <ChipSprite
      chip={chip}
      size="sm"
      showTypeLabel={false}
      dimmed={variant === 'played'}
      className={
        variant === 'played'
          ? 'opacity-60 grayscale-[0.35]'
          : variant === 'hand'
            ? 'ring-1 ring-loop-accent/50'
            : ''
      }
    />
  );
}
