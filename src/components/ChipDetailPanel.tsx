import { chipDescription, chipName } from '../game/chipDisplay';
import type { Chip } from '../game/types';
import { ChipSprite } from './ChipSprite';
import { StoneGroundSurface } from './ui/StoneGroundSurface';

interface ChipDetailPanelProps {
  chip: Chip;
  className?: string;
}

const titleShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

const bodyShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function ChipDetailPanel({ chip, className = '' }: ChipDetailPanelProps) {
  return (
    <StoneGroundSurface
      className={`pointer-events-none w-56 sm:w-60 ${className}`}
      variant="primary"
    >
      <div className="flex items-start gap-3 px-3 py-3 sm:px-4 sm:py-3.5">
        <ChipSprite chip={chip} size="sm" showTypeLabel={false} />
        <div className="min-w-0 flex-1">
          <p
            className="font-display text-sm font-bold text-loop-accentHover sm:text-base"
            style={{ textShadow: titleShadow }}
          >
            {chipName(chip)}
          </p>
          <p
            className="mt-1 text-xs leading-snug text-stone-200/90 sm:text-sm"
            style={{ textShadow: bodyShadow }}
          >
            {chipDescription(chip)}
          </p>
        </div>
      </div>
    </StoneGroundSurface>
  );
}
