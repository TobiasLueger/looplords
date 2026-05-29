import { useMemo } from 'react';
import type { Difficulty, RunState } from '../game/types';
import { getEntitiesOnCell } from '../game/gameLogic';
import { RUINS_BACKGROUNDS, RUINS_BOARD } from '../utils/ruinsAssets';
import { BoardCell } from './BoardCell';

const BOARD_COORD_SIZE = 200;

interface BoardProps {
  run: RunState;
  animations: boolean;
  difficulty: Difficulty;
}

export function Board({ run, animations, difficulty }: BoardProps) {
  const cellPositions = useMemo(() => {
    const cells: { index: number; x: number; y: number }[] = [];
    const n = run.boardSize;
    const radius = BOARD_COORD_SIZE * 0.42;

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      cells.push({
        index: i,
        x: BOARD_COORD_SIZE / 2 + Math.cos(angle) * radius,
        y: BOARD_COORD_SIZE / 2 + Math.sin(angle) * radius,
      });
    }
    return cells;
  }, [run.boardSize]);

  const cellSizePercent = Math.max(10, Math.min(18, 130 / run.boardSize));

  return (
    <div
      className="board-frame relative mr-auto overflow-visible"
      style={{ backgroundImage: `url(${RUINS_BACKGROUNDS.game})` }}
    >
      <svg
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full text-amber-900/50"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="3 2"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
        <div className="flex max-w-[45%] flex-col items-center text-center">
          <img
            src={RUINS_BOARD.centerRuins}
            alt=""
            className="w-full max-w-[280px] object-contain drop-shadow-lg sm:max-w-[220px]"
            draggable={false}
          />
          <p className="font-display text-xs text-loop-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-sm">
            LOOP
          </p>
          <p className="text-[10px] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {run.boardSize} Felder
          </p>
        </div>
      </div>

      <div className="absolute inset-0 z-[10] overflow-visible">
        {cellPositions.map(({ index, x, y }) => {
          const { player, enemies } = getEntitiesOnCell(run, index);
          return (
            <div
              key={index}
              className="absolute z-10 overflow-visible -translate-x-1/2 -translate-y-1/2 hover:z-[200] focus-within:z-[200]"
              style={{
                left: `${(x / BOARD_COORD_SIZE) * 100}%`,
                top: `${(y / BOARD_COORD_SIZE) * 100}%`,
                width: `${cellSizePercent}%`,
                maxWidth: '5.5rem',
              }}
            >
              <BoardCell
                index={index}
                isPlayerHere={player}
                enemies={enemies}
                animations={animations}
                killFlash={run.lastKillFlash && player}
                difficulty={difficulty}
                upgradeIds={run.upgradeIds}
                run={run}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
