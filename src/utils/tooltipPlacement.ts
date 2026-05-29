export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Pick tooltip side pointing away from the board center (readable outside the ring). */
export function getOutwardTooltipPlacement(
  x: number,
  y: number,
  coordSize = 200,
): TooltipPlacement {
  const px = (x / coordSize) * 100;
  const py = (y / coordSize) * 100;
  const dx = px - 50;
  const dy = py - 50;

  if (Math.abs(dy) >= Math.abs(dx)) {
    return dy < 0 ? 'top' : 'bottom';
  }
  return dx < 0 ? 'left' : 'right';
}

export function tooltipPlacementClasses(placement: TooltipPlacement): string {
  const panel =
    'pointer-events-none absolute z-[500] hidden w-44 rounded-lg border border-loop-border bg-loop-bg px-2.5 py-2 text-left shadow-xl backdrop-blur-sm sm:w-52';

  switch (placement) {
    case 'top':
      return `${panel} bottom-full left-1/2 mb-2 -translate-x-1/2`;
    case 'bottom':
      return `${panel} top-full left-1/2 mt-2 -translate-x-1/2`;
    case 'left':
      return `${panel} right-full top-1/2 mr-2 -translate-y-1/2`;
    case 'right':
      return `${panel} left-full top-1/2 ml-2 -translate-y-1/2`;
  }
}
