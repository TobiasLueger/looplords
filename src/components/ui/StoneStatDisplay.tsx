import { ENTITY_CELL_GROUND } from '../../utils/ruinsAssets';

interface StoneStatDisplayProps {
  icon: string;
  label: string;
  value: number | string;
  variant?: 'primary' | 'default';
  className?: string;
}

export function StoneStatDisplay({
  icon,
  label,
  value,
  variant = 'primary',
  className = '',
}: StoneStatDisplayProps) {
  const valueClass =
    variant === 'primary' ? 'text-loop-accentHover' : 'text-white/95';

  return (
    <div
      className={`stone-menu-btn stone-stat-display relative inline-flex w-auto max-w-none items-center justify-center ${
        variant === 'primary' ? 'stone-menu-btn-primary' : ''
      } ${className}`}
      aria-label={`${label}: ${value}`}
    >
      <span
        aria-hidden
        className={`stone-menu-btn__tiles absolute inset-0 ${
          variant === 'primary' ? 'stone-menu-btn__tiles--primary' : ''
        }`}
        style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
      />
      <span className="relative z-10 flex items-center gap-3 px-5 py-2.5 sm:px-6 sm:py-3">
        <img
          src={icon}
          alt=""
          className="h-7 w-7 shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] sm:h-8 sm:w-8"
          draggable={false}
        />
        <span className="flex flex-col leading-tight">
          <span
            className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 sm:text-xs"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          >
            {label}
          </span>
          <span
            className={`font-display text-xl font-bold sm:text-2xl ${valueClass}`}
            style={{
              textShadow:
                '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)',
            }}
          >
            {value}
          </span>
        </span>
      </span>
    </div>
  );
}
