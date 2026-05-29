import {
  chipImageFilter,
  chipLabel,
  chipSelectedClass,
  chipTypeLabel,
} from '../game/chipDisplay';
import { getChipSprite } from '../utils/assets';
import type { Chip } from '../game/types';

interface ChipSpriteProps {
  chip: Chip;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTypeLabel?: boolean;
  dimmed?: boolean;
  className?: string;
  as?: 'button' | 'span';
  onClick?: () => void;
  animations?: boolean;
}

const SIZE_CLASSES = {
  sm: { wrap: 'h-10 w-10', label: 'text-sm', type: 'text-[8px]' },
  md: { wrap: 'h-14 w-14 sm:h-16 sm:w-16', label: 'text-lg sm:text-xl', type: 'text-[9px]' },
  lg: { wrap: 'h-16 w-16', label: 'text-xl', type: 'text-[10px]' },
};

export function ChipSprite({
  chip,
  selected = false,
  size = 'md',
  showTypeLabel = true,
  dimmed = false,
  className = '',
  as = 'span',
  onClick,
  animations = false,
}: ChipSpriteProps) {
  const s = SIZE_CLASSES[size];
  const filter = chipImageFilter(chip);
  const label = chipLabel(chip);
  const isInteractive = as === 'button' && onClick != null;

  const chipWrapClass = [
    `relative ${s.wrap} shrink-0 transition-transform duration-200 ease-out`,
    selected && animations ? 'animate-chip-select' : '',
    selected ? 'scale-105 -translate-y-0.5' : '',
    isInteractive
      ? 'group-hover/chip:-translate-y-1.5 group-active/chip:translate-y-0 group-hover/chip:brightness-110'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <div className={chipWrapClass}>
        <img
          src={getChipSprite()}
          alt=""
          draggable={false}
          className={`h-full w-full object-contain drop-shadow-md ${
            dimmed ? 'opacity-50' : ''
          }`}
          style={{ filter }}
        />
        <span
          className={`pointer-events-none absolute inset-0 flex items-center justify-center font-display font-bold leading-none text-white ${s.label}`}
          style={{
            textShadow:
              '0 0 4px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.75)',
          }}
        >
          {label}
        </span>
      </div>
      {showTypeLabel && (
        <span
          className={`mt-0.5 max-w-[4.5rem] truncate text-center ${s.type} text-loop-muted`}
        >
          {chipTypeLabel(chip)}
        </span>
      )}
    </>
  );

  const baseClass = `flex flex-col items-center justify-center border-0 bg-transparent p-0 ${chipSelectedClass(
    selected,
  )} ${className}`;

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} group/chip cursor-pointer`}
        aria-label={`${chipTypeLabel(chip)} ${label}`}
      >
        {inner}
      </button>
    );
  }

  return <span className={baseClass}>{inner}</span>;
}
