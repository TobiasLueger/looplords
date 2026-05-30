import { ENTITY_CELL_GROUND } from '../../utils/ruinsAssets';

interface StoneStatDisplayProps {
  icon: string;
  label: string;
  value: number | string;
  variant?: 'primary' | 'default';
  size?: 'default' | 'compact';
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const HUD_CONTROL_HEIGHT = 'h-[3.25rem] sm:h-14';

export function StoneStatDisplay({
  icon,
  label,
  value,
  variant = 'primary',
  size = 'default',
  className = '',
  iconClassName = '',
  onClick,
}: StoneStatDisplayProps) {
  const isCompact = size === 'compact';
  const valueClass =
    variant === 'primary' ? 'text-loop-accentHover' : 'text-white/95';

  const inner = (
    <>
      <span
        aria-hidden
        className={`stone-menu-btn__tiles absolute inset-0 ${
          variant === 'primary' ? 'stone-menu-btn__tiles--primary' : ''
        }`}
        style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
      />
      <span
        className={
          isCompact
            ? 'relative z-10 flex h-full items-center gap-2.5 px-4 sm:gap-3 sm:px-5'
            : 'relative z-10 flex items-center gap-3 px-5 py-2.5 sm:px-6 sm:py-3'
        }
      >
        <img
          src={icon}
          alt=""
          className={`shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] ${
            isCompact ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-8 sm:w-8'
          } ${iconClassName}`}
          draggable={false}
        />
        <span
          className={`flex flex-col ${isCompact ? 'justify-center gap-0.5 leading-none' : 'leading-tight'}`}
        >
          <span
            className={`font-body font-semibold uppercase tracking-[0.14em] text-white/75 ${
              isCompact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'
            }`}
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          >
            {label}
          </span>
          <span
            className={`font-display font-bold ${
              isCompact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
            } ${valueClass}`}
            style={{
              textShadow:
                '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)',
            }}
          >
            {value}
          </span>
        </span>
      </span>
    </>
  );

  const baseClass = `stone-menu-btn stone-stat-display relative inline-flex w-auto max-w-none items-center justify-center ${
    isCompact ? HUD_CONTROL_HEIGHT : ''
  } ${variant === 'primary' ? 'stone-menu-btn-primary' : ''} ${
    onClick ? 'cursor-pointer transition duration-200 hover:scale-[1.04] active:scale-[0.97]' : ''
  } ${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} border-0 bg-transparent p-0`}
        aria-label={`${label}: ${value}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={baseClass} aria-label={`${label}: ${value}`}>
      {inner}
    </div>
  );
}
