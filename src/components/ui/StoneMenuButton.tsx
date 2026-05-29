import { ENTITY_CELL_GROUND } from '../../utils/ruinsAssets';

interface StoneMenuButtonProps {
  label: string;
  description?: string;
  onClick: () => void;
  variant?: 'primary' | 'default';
  disabled?: boolean;
  className?: string;
}

export function StoneMenuButton({
  label,
  description,
  onClick,
  variant = 'default',
  disabled = false,
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
      disabled={disabled}
      className={`stone-menu-btn group ${variant === 'primary' ? 'stone-menu-btn-primary' : ''} ${
        description ? 'items-stretch text-left' : ''
      } ${disabled ? 'cursor-not-allowed opacity-45 hover:scale-100 active:scale-100' : ''} ${className}`}
    >
      <span
        aria-hidden
        className={`stone-menu-btn__tiles absolute inset-0 transition duration-200 ${
          disabled ? '' : 'group-hover:brightness-110'
        } ${variant === 'primary' ? 'stone-menu-btn__tiles--primary' : ''}`}
        style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
      />
      <span
        className={`relative z-10 flex flex-col ${
          description ? 'px-5 py-4 sm:px-6' : 'px-8 py-3.5'
        } font-display font-bold ${description ? 'w-full' : ''} ${textClass}`}
        style={{
          textShadow:
            '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)',
        }}
      >
        {label}
        {description && (
          <span className="mt-2 font-body text-sm font-normal leading-snug text-white/85">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
