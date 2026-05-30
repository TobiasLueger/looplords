import { RUINS_ACTIONS } from '../../utils/ruinsAssets';
import { ENTITY_CELL_GROUND } from '../../utils/ruinsAssets';

interface StoneBagIconButtonProps {
  onClick: () => void;
  className?: string;
}

export function StoneBagIconButton({ onClick, className = '' }: StoneBagIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`stone-menu-btn group relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-md border-0 bg-transparent shadow-[0_4px_14px_rgba(0,0,0,0.55)] transition duration-200 hover:scale-[1.06] active:scale-[0.97] sm:h-14 sm:w-14 ${className}`}
      aria-label="Beutel und Tickets anzeigen"
      title="Beutel anzeigen"
    >
      <span
        aria-hidden
        className="stone-menu-btn__tiles absolute inset-0 transition duration-200 group-hover:brightness-110"
        style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
      />
      <img
        src={RUINS_ACTIONS.chipBag}
        alt=""
        className="relative z-10 h-8 w-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] sm:h-9 sm:w-9"
        draggable={false}
      />
    </button>
  );
}
