import { useEffect } from 'react';
import type { Chip, RunState } from '../game/types';
import { ChipSprite } from './ChipSprite';
import { GameButton } from './ui/GameButton';

interface ChipBagModalProps {
  run: RunState;
  onClose: () => void;
}

function sortChips(chips: Chip[]): Chip[] {
  return [...chips].sort((a, b) => {
    if (a.special === 'teleport') return 1;
    if (b.special === 'teleport') return -1;
    return a.value - b.value;
  });
}

export function ChipBagModal({ run, onClose }: ChipBagModalProps) {
  const bagChips = sortChips(run.deck);
  const playedChips = sortChips(run.playedThisRound);

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
      <div
        className="panel panel-ruins max-h-[85vh] w-full max-w-md overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="chip-bag-title" className="font-display text-xl text-loop-accent">
          Chip-Beutel
        </h2>
        <p className="mt-1 text-sm text-loop-muted">
          {bagChips.length} Chip(s) im Beutel · {run.hand.length} in der Hand ·{' '}
          {playedChips.length} diese Runde gespielt
        </p>

        <section className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-loop-muted">
            Im Beutel (ziehbar)
          </h3>
          {bagChips.length === 0 ? (
            <p className="mt-2 text-sm text-loop-muted">Beutel ist leer.</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {bagChips.map((chip) => (
                <ChipBadge key={chip.id} chip={chip} variant="bag" />
              ))}
            </div>
          )}
        </section>

        {playedChips.length > 0 && (
          <section className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-loop-muted">
              Diese Runde gespielt
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {playedChips.map((chip) => (
                <ChipBadge key={chip.id} chip={chip} variant="played" />
              ))}
            </div>
          </section>
        )}

        <div className="mt-6">
          <GameButton variant="secondary" onClick={onClose}>
            Schließen
          </GameButton>
        </div>
      </div>
    </div>
  );
}

function ChipBadge({
  chip,
  variant,
}: {
  chip: Chip;
  variant: 'bag' | 'played';
}) {
  return (
    <ChipSprite
      chip={chip}
      size="sm"
      showTypeLabel={false}
      dimmed={variant === 'played'}
      className={variant === 'played' ? 'opacity-60 grayscale-[0.35]' : ''}
    />
  );
}
