import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Chip } from '../game/types';
import { CHIP_INSPECT_HINT } from '../hooks/useInspectKeyHeld';
import { ChipDetailPanel } from './ChipDetailPanel';

const OVERLAY_Z_INDEX = 200;
const VIEW_PADDING = 8;
const GAP = 8;

const hintClassName =
  'whitespace-nowrap rounded border border-black/30 bg-black/75 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-stone-200/95 shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-[11px]';

const hintTextShadow = { textShadow: '0 1px 2px rgba(0,0,0,0.9)' };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

interface OverlayCoords {
  hint?: React.CSSProperties;
  detail?: React.CSSProperties;
}

interface ChipInspectPortalOverlaysProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  chip: Chip;
  showHint: boolean;
  showDetail: boolean;
}

export function ChipInspectPortalOverlays({
  anchorRef,
  chip,
  showHint,
  showDetail,
}: ChipInspectPortalOverlaysProps) {
  const hintRef = useRef<HTMLSpanElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<OverlayCoords>({});
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!showHint && !showDetail) {
      setVisible(false);
      setCoords({});
      return;
    }

    const anchor = anchorRef.current;
    if (!anchor) return;

    const update = () => {
      const currentAnchor = anchorRef.current;
      if (!currentAnchor) return;

      const rect = currentAnchor.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const next: OverlayCoords = {};

      if (showHint && hintRef.current) {
        const hintWidth = hintRef.current.offsetWidth;
        const hintHeight = hintRef.current.offsetHeight;
        const left = clamp(
          centerX,
          VIEW_PADDING + hintWidth / 2,
          viewportW - VIEW_PADDING - hintWidth / 2,
        );
        const spaceAbove = rect.top - VIEW_PADDING;
        const spaceBelow = viewportH - rect.bottom - VIEW_PADDING;
        const placeAbove = spaceAbove >= hintHeight + GAP || spaceAbove >= spaceBelow;

        if (placeAbove) {
          next.hint = {
            position: 'fixed',
            left,
            top: rect.top - GAP,
            transform: 'translate(-50%, -100%)',
            zIndex: OVERLAY_Z_INDEX,
          };
        } else {
          next.hint = {
            position: 'fixed',
            left,
            top: rect.bottom + GAP,
            transform: 'translateX(-50%)',
            zIndex: OVERLAY_Z_INDEX,
          };
        }
      }

      if (showDetail && detailRef.current) {
        const detailWidth = detailRef.current.offsetWidth;
        const detailHeight = detailRef.current.offsetHeight;
        const left = clamp(
          centerX,
          VIEW_PADDING + detailWidth / 2,
          viewportW - VIEW_PADDING - detailWidth / 2,
        );
        const spaceAbove = rect.top - VIEW_PADDING;
        const spaceBelow = viewportH - rect.bottom - VIEW_PADDING;
        const placeAbove = spaceAbove >= detailHeight + GAP || spaceAbove >= spaceBelow;

        if (placeAbove) {
          next.detail = {
            position: 'fixed',
            left,
            top: rect.top - GAP,
            transform: 'translate(-50%, -100%)',
            zIndex: OVERLAY_Z_INDEX,
          };
        } else {
          next.detail = {
            position: 'fixed',
            left,
            top: rect.bottom + GAP,
            transform: 'translateX(-50%)',
            zIndex: OVERLAY_Z_INDEX,
          };
        }
      }

      setCoords(next);
      setVisible(true);
    };

    setVisible(false);
    update();
    requestAnimationFrame(update);

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorRef, chip.id, showDetail, showHint]);

  if (!showHint && !showDetail) return null;

  return createPortal(
    <>
      {showHint && (
        <span
          ref={hintRef}
          className={hintClassName}
          style={{
            ...hintTextShadow,
            position: 'fixed',
            left: -9999,
            top: 0,
            visibility: visible && coords.hint ? 'visible' : 'hidden',
            ...(coords.hint ?? {}),
          }}
          role="status"
        >
          {CHIP_INSPECT_HINT}
        </span>
      )}
      {showDetail && (
        <div
          ref={detailRef}
          className="pointer-events-none"
          style={{
            position: 'fixed',
            left: -9999,
            top: 0,
            visibility: visible && coords.detail ? 'visible' : 'hidden',
            ...(coords.detail ?? {}),
          }}
        >
          <ChipDetailPanel chip={chip} />
        </div>
      )}
    </>,
    document.body,
  );
}
