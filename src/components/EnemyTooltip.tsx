import type { Difficulty, Enemy } from '../game/types';
import { getEnemyTooltipLines, getEnemyTooltipTitle } from '../game/enemyInfo';
import type { TooltipPlacement } from '../utils/tooltipPlacement';
import { tooltipPlacementClasses } from '../utils/tooltipPlacement';

interface EnemyTooltipProps {
  enemy: Enemy;
  difficulty: Difficulty;
  upgradeIds: string[];
  placement?: TooltipPlacement;
  children: React.ReactNode;
}

export function EnemyTooltip({
  enemy,
  difficulty,
  upgradeIds,
  placement = 'bottom',
  children,
}: EnemyTooltipProps) {
  const lines = getEnemyTooltipLines(
    enemy.type,
    difficulty,
    enemy.hp,
    enemy.maxHp,
    upgradeIds,
  );
  const title = getEnemyTooltipTitle(
    enemy.type,
    difficulty,
    enemy.hp,
    enemy.maxHp,
    upgradeIds,
  );

  return (
    <div className="group/enemy relative z-0 hover:z-[60]" title={title}>
      {children}
      <div
        className={`${tooltipPlacementClasses(placement)} group-hover/enemy:block group-focus-within/enemy:block`}
        role="tooltip"
      >
        <p className="font-semibold text-loop-accent">{lines[0]}</p>
        <ul className="mt-1 space-y-0.5 text-[11px] leading-snug text-loop-muted">
          {lines.slice(1).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
