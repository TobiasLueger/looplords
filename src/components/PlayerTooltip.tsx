import type { RunState } from '../game/types';
import { getPlayerTooltipLines, getPlayerTooltipTitle, PLAYER_TOOLTIP_HEADING } from '../game/playerInfo';
import type { TooltipPlacement } from '../utils/tooltipPlacement';
import { tooltipPlacementClasses } from '../utils/tooltipPlacement';

interface PlayerTooltipProps {
  run: RunState;
  placement?: TooltipPlacement;
  children: React.ReactNode;
}

export function PlayerTooltip({
  run,
  placement = 'bottom',
  children,
}: PlayerTooltipProps) {
  const lines = getPlayerTooltipLines(run);
  const title = getPlayerTooltipTitle(run);

  return (
    <div className="group/player relative z-0 hover:z-[60]" title={title}>
      {children}
      <div
        className={`${tooltipPlacementClasses(placement)} group-hover/player:block group-focus-within/player:block`}
        role="tooltip"
      >
        <p className="font-semibold text-loop-accent">{PLAYER_TOOLTIP_HEADING}</p>
        <ul className="mt-1 space-y-0.5 text-[11px] leading-snug text-loop-muted">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
