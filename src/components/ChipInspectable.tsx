import { useRef, useState, type ReactNode } from 'react';
import type { Chip } from '../game/types';
import { CHIP_INSPECT_HINT, useInspectKeyHeld } from '../hooks/useInspectKeyHeld';
import { ChipDetailPanel } from './ChipDetailPanel';
import { ChipInspectPortalOverlays } from './ChipInspectPortalOverlays';

interface ChipInspectableProps {
  chip: Chip;
  children: ReactNode;
  className?: string;
  /** Detail panel above or below the chip (inline mode only). */
  detailPlacement?: 'above' | 'below';
  /** Portal overlays stay fully visible above scroll containers (e.g. bag modal). */
  overlayMode?: 'inline' | 'portal';
}

export function ChipInspectable({
  chip,
  children,
  className = '',
  detailPlacement = 'above',
  overlayMode = 'inline',
}: ChipInspectableProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const inspectKeyHeld = useInspectKeyHeld();
  const [hovered, setHovered] = useState(false);

  const showHint = hovered && !inspectKeyHeld;
  const showDetail = hovered && inspectKeyHeld;
  const usePortal = overlayMode === 'portal';

  const hintPosition =
    detailPlacement === 'below'
      ? 'top-full left-1/2 mt-1.5 -translate-x-1/2'
      : 'bottom-full left-1/2 mb-1.5 -translate-x-1/2';

  const detailPosition =
    detailPlacement === 'below'
      ? 'top-full left-1/2 mt-2 -translate-x-1/2'
      : 'bottom-full left-1/2 mb-2 -translate-x-1/2';

  return (
    <div
      ref={anchorRef}
      className={`group/chipinspect relative z-0 inline-flex flex-col items-center hover:z-[70] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {usePortal ? (
        <ChipInspectPortalOverlays
          anchorRef={anchorRef}
          chip={chip}
          showHint={showHint}
          showDetail={showDetail}
        />
      ) : (
        <>
          {showHint && (
            <span
              className={`pointer-events-none absolute z-[80] whitespace-nowrap rounded border border-black/30 bg-black/75 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-stone-200/95 shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-[11px] ${hintPosition}`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              role="status"
            >
              {CHIP_INSPECT_HINT}
            </span>
          )}

          {showDetail && (
            <div className={`pointer-events-none absolute z-[80] ${detailPosition}`}>
              <ChipDetailPanel chip={chip} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
