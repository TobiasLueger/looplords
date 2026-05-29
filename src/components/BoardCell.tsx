import type { Difficulty, Enemy, RunState } from '../game/types';
import { ENTITY_CELL_GROUND } from '../utils/ruinsAssets';
import { EnemyTooltip } from './EnemyTooltip';
import { PlayerTooltip } from './PlayerTooltip';
import { EntitySprite } from './EntitySprite';

interface BoardCellProps {
  index: number;
  isPlayerHere: boolean;
  enemies: Enemy[];
  animations: boolean;
  killFlash: boolean;
  difficulty: Difficulty;
  upgradeIds: string[];
  run: RunState;
}

export function BoardCell({
  index,
  isPlayerHere,
  enemies,
  animations,
  killFlash,
  difficulty,
  upgradeIds,
  run,
}: BoardCellProps) {
  const occupied = isPlayerHere || enemies.length > 0;
  const enemySize = enemies.length > 1 ? 'md' : 'lg';
  const playerSize = enemies.length > 0 ? 'lg' : 'xl';
  const groundTile = ENTITY_CELL_GROUND;

  return (
    <div
      className={`relative isolate flex aspect-square items-center justify-center overflow-visible rounded-lg shadow-md transition ${
        occupied
          ? 'ring-2 ring-loop-accent/70 ring-offset-1 ring-offset-transparent'
          : 'ring-1 ring-black/30'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
        <img
          src={groundTile}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>

      <span
        className="pointer-events-none absolute left-0.5 top-0.5 z-10 text-[9px] font-semibold text-white sm:text-[10px]"
        style={{
          textShadow: '0 0 3px #000, 0 1px 2px #000',
        }}
      >
        {index + 1}
      </span>

      <div className="relative z-10 flex flex-col items-center gap-0.5 overflow-visible p-1">
        {isPlayerHere && (
          <PlayerTooltip run={run} difficulty={difficulty}>
            <EntitySprite
              kind="player"
              size={playerSize}
              animate={animations}
              flash={killFlash}
            />
          </PlayerTooltip>
        )}
        {enemies.map((e, i) => (
          <EnemyTooltip
            key={e.id}
            enemy={e}
            difficulty={difficulty}
            upgradeIds={upgradeIds}
          >
            <div
              className="relative overflow-visible"
              style={{
                marginTop: isPlayerHere && i === 0 ? -4 : 0,
                zIndex: 10 + i,
              }}
            >
              <EntitySprite
                kind="enemy"
                enemyType={e.type}
                size={enemySize}
                animate={animations}
              />
              {e.hp > 1 && (
                <span className="absolute -right-2 -top-2 z-30 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-loop-danger text-[11px] font-bold leading-none text-white shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  {e.hp}
                </span>
              )}
            </div>
          </EnemyTooltip>
        ))}
      </div>
    </div>
  );
}
