import type { Chip } from '../game/types';
import { ChipSprite } from './ChipSprite';
import { RuinsPanel } from './ui/RuinsPanel';

interface ChipHandProps {
  hand: Chip[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  animations: boolean;
}

export function ChipHand({ hand, selectedIds, onToggle, animations }: ChipHandProps) {
  return (
    <RuinsPanel>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-loop-muted">
        Hand — Movement-Chips
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {hand.map((chip) => {
          const selected = selectedIds.includes(chip.id);
          return (
            <ChipSprite
              key={chip.id}
              chip={chip}
              selected={selected}
              animations={animations}
              as="button"
              onClick={() => onToggle(chip.id)}
            />
          );
        })}
        {hand.length === 0 && (
          <p className="py-4 text-sm text-loop-muted">Keine Chips in der Hand.</p>
        )}
      </div>
    </RuinsPanel>
  );
}
