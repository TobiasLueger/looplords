interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export function GameButton({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className = '',
}: GameButtonProps) {
  const base =
    variant === 'primary'
      ? 'btn-primary w-full sm:w-auto'
      : 'btn-secondary w-full sm:w-auto';

  return (
    <button type="button" className={`${base} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
