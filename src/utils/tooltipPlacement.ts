export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

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
