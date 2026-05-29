import type { ReactNode } from 'react';
import { ENTITY_CELL_GROUND } from '../../utils/ruinsAssets';

interface StoneGroundSurfaceProps {
  children: ReactNode;
  variant?: 'primary' | 'default';
  className?: string;
  /** Scrollbarer Inhalt — Ground-Kacheln erstrecken sich über die volle Inhaltshöhe. */
  scrollable?: boolean;
}

export function StoneGroundSurface({
  children,
  variant = 'default',
  className = '',
  scrollable = false,
}: StoneGroundSurfaceProps) {
  return (
    <div
      className={`stone-ground-surface relative rounded-md shadow-[0_4px_14px_rgba(0,0,0,0.55)] ${
        scrollable ? 'overflow-y-auto' : 'overflow-hidden'
      } ${variant === 'primary' ? 'stone-menu-btn-primary' : ''} ${className}`}
    >
      <div className="relative">
        <span
          aria-hidden
          className={`stone-menu-btn__tiles pointer-events-none absolute inset-0 ${
            variant === 'primary' ? 'stone-menu-btn__tiles--primary' : ''
          }`}
          style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
