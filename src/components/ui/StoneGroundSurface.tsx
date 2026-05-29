import type { ReactNode } from 'react';
import { ENTITY_CELL_GROUND } from '../../utils/ruinsAssets';

interface StoneGroundSurfaceProps {
  children: ReactNode;
  variant?: 'primary' | 'default';
  className?: string;
}

export function StoneGroundSurface({
  children,
  variant = 'default',
  className = '',
}: StoneGroundSurfaceProps) {
  return (
    <div
      className={`stone-ground-surface relative overflow-hidden rounded-md shadow-[0_4px_14px_rgba(0,0,0,0.55)] ${
        variant === 'primary' ? 'stone-menu-btn-primary' : ''
      } ${className}`}
    >
      <span
        aria-hidden
        className={`stone-menu-btn__tiles absolute inset-0 ${
          variant === 'primary' ? 'stone-menu-btn__tiles--primary' : ''
        }`}
        style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
