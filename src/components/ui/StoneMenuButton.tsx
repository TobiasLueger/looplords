import { ENTITY_CELL_GROUND } from '../../utils/ruinsAssets';

interface StoneMenuButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'default';
  className?: string;
}

export function StoneMenuButton({
  label,
  onClick,
  variant = 'default',
  className = '',
}: StoneMenuButtonProps) {
  const textClass =
    variant === 'primary'
      ? 'text-loop-accentHover text-lg tracking-wide sm:text-xl'
      : 'text-base text-white/95 sm:text-lg';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`stone-menu-btn group ${variant === 'primary' ? 'stone-menu-btn-primary' : ''} ${className}`}
    >
      <span
        aria-hidden
        className={`stone-menu-btn__tiles absolute inset-0 transition duration-200 group-hover:brightness-110 ${
          variant === 'primary' ? 'stone-menu-btn__tiles--primary' : ''
        }`}
        style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
      />
      <span
        className={`relative z-10 px-8 py-3.5 font-display font-bold ${textClass}`}
        style={{
          textShadow:
            '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)',
        }}
      >
        {label}
      </span>
    </button>
  );
}
