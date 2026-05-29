interface SpriteGameButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
}

export function SpriteGameButton({
  icon,
  label,
  onClick,
  variant = 'secondary',
  disabled,
  className = '',
  iconClassName = 'h-9 w-9 sm:h-10 sm:w-10',
}: SpriteGameButtonProps) {
  const base =
    variant === 'primary' ? 'btn-sprite btn-sprite-primary' : 'btn-sprite btn-sprite-secondary';

  return (
    <button
      type="button"
      className={`${base} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <img
        src={icon}
        alt=""
        draggable={false}
        className={`object-contain drop-shadow-md ${iconClassName}`}
      />
      <span className="max-w-[5.5rem] text-center text-[10px] font-semibold leading-tight sm:max-w-none sm:text-xs">
        {label}
      </span>
    </button>
  );
}
