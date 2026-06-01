import { useMemo } from 'react';
import type { RunState } from '../game/types';
import { getEntitiesOnCell } from '../game/gameLogic';
import {
  usePlayerHopAnimation,
  type PlayerMoveRequest,
} from '../hooks/usePlayerHopAnimation';
import {
  useProjectileShotAnimation,
  type ProjectileShotRequest,
} from '../hooks/useProjectileShotAnimation';
import {
  useNovaBlastAnimation,
  type NovaBlastRequest,
} from '../hooks/useNovaBlastAnimation';
import { RUINS_BACKGROUNDS, RUINS_BOARD } from '../utils/ruinsAssets';
import { BoardCell } from './BoardCell';
import { BoardProjectile } from './BoardProjectile';
import { BoardGrappleLine } from './BoardGrappleLine';
import { BoardSmokePuff } from './BoardSmokePuff';
import { EntitySprite } from './EntitySprite';

const BOARD_COORD_SIZE = 200;

interface BoardProps {
  run: RunState;
  animations: boolean;
  playerMoveRequest: PlayerMoveRequest | null;
  onPlayerMoveComplete: () => void;
  onKillStrike?: () => void;
  sniperShotRequest: ProjectileShotRequest | null;
  onSniperShotComplete: () => void;
  onSniperImpact?: () => void;
  cleaveThrowRequest: ProjectileShotRequest | null;
  onCleaveThrowComplete: () => void;
  onCleaveImpact?: () => void;
  novaBlastRequest: NovaBlastRequest | null;
  onNovaBlastComplete: () => void;
  onNovaImpact?: () => void;
}

export function Board({
  run,
  animations,
  playerMoveRequest,
  onPlayerMoveComplete,
  onKillStrike,
  sniperShotRequest,
  onSniperShotComplete,
  onSniperImpact,
  cleaveThrowRequest,
  onCleaveThrowComplete,
  onCleaveImpact,
  novaBlastRequest,
  onNovaBlastComplete,
  onNovaImpact,
}: BoardProps) {
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

  const {
    displayCell,
    isAnimating,
    splatterCells,
    defeatedEnemyCells,
    teleportSmokeCells,
    playerVisible,
    instantPosition,
    playerAnimMode,
    grapplePull,
  } = usePlayerHopAnimation(
    run.playerPosition,
    run.boardSize,
    playerMoveRequest,
    animations,
    onPlayerMoveComplete,
    onKillStrike,
  );

  const { phase: sniperPhase, splatterCell: sniperSplatterCell } =
    useProjectileShotAnimation(
      sniperShotRequest,
      animations,
      onSniperShotComplete,
      onSniperImpact,
    );

  const { phase: cleavePhase, splatterCell: cleaveSplatterCell } =
    useProjectileShotAnimation(
      cleaveThrowRequest,
      animations,
      onCleaveThrowComplete,
      onCleaveImpact,
    );

  const {
    phase: novaPhase,
    activeSplatterCells: novaSplatterCells,
    defeatedCells: novaDefeatedCells,
  } = useNovaBlastAnimation(
    novaBlastRequest,
    animations,
    onNovaBlastComplete,
    onNovaImpact,
  );

  const defeatedEnemyCellSet = useMemo(() => {
    const set = new Set(defeatedEnemyCells);
    for (const cell of novaDefeatedCells) {
      set.add(cell);
    }
    return set;
  }, [defeatedEnemyCells, novaDefeatedCells]);

  const splatterSet = useMemo(() => {
    const set = new Set(splatterCells);
    for (const cell of novaSplatterCells) {
      set.add(cell);
    }
    if (sniperSplatterCell !== null) set.add(sniperSplatterCell);
    if (cleaveSplatterCell !== null) set.add(cleaveSplatterCell);
    return set;
  }, [splatterCells, novaSplatterCells, sniperSplatterCell, cleaveSplatterCell]);

  const teleportSmokeSet = useMemo(
    () => new Set(teleportSmokeCells),
    [teleportSmokeCells],
  );

  const playerMotionClass =
    playerAnimMode === 'strike'
      ? 'animate-player-strike'
      : playerAnimMode === 'vanish'
        ? 'animate-teleport-vanish'
        : playerAnimMode === 'appear'
          ? 'animate-teleport-appear'
          : playerAnimMode === 'hop'
            ? 'animate-player-hop'
            : playerAnimMode === 'grapple'
              ? 'animate-player-grapple'
              : '';

  const animatedPlayerPos = cellPositions.find((c) => c.index === displayCell);

  const playerBoardCoords = useMemo(() => {
    if (!grapplePull) {
      return animatedPlayerPos ?? null;
    }
    const from = cellPositions.find((c) => c.index === grapplePull.fromCell);
    const to = cellPositions.find((c) => c.index === grapplePull.toCell);
    if (!from || !to) return animatedPlayerPos ?? null;
    const t = grapplePull.progress;
    return {
      index: displayCell,
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  }, [animatedPlayerPos, cellPositions, displayCell, grapplePull]);

  const grappleAnchorPos = useMemo(() => {
    if (!grapplePull) return null;
    return cellPositions.find((c) => c.index === grapplePull.toCell) ?? null;
  }, [cellPositions, grapplePull]);

  const grappleLeanDeg = useMemo(() => {
    if (!grapplePull || !playerBoardCoords || !grappleAnchorPos) return 0;
    return (
      (Math.atan2(
        grappleAnchorPos.y - playerBoardCoords.y,
        grappleAnchorPos.x - playerBoardCoords.x,
      ) *
        180) /
      Math.PI
    );
  }, [grappleAnchorPos, grapplePull, playerBoardCoords]);

  const cellSizePercent = Math.max(10, Math.min(18, 130 / run.boardSize));
  const showAnimatedPlayer =
    playerBoardCoords &&
    (isAnimating || playerMoveRequest !== null || cleaveThrowRequest !== null);

  const sniperFrom = sniperShotRequest
    ? cellPositions.find((c) => c.index === sniperShotRequest.fromCell)
    : null;
  const sniperTo = sniperShotRequest
    ? cellPositions.find((c) => c.index === sniperShotRequest.toCell)
    : null;

  const cleaveFrom = cleaveThrowRequest
    ? cellPositions.find((c) => c.index === cleaveThrowRequest.fromCell)
    : null;
  const cleaveTo = cleaveThrowRequest
    ? cellPositions.find((c) => c.index === cleaveThrowRequest.toCell)
    : null;

  const novaFrom = novaBlastRequest
    ? cellPositions.find((c) => c.index === novaBlastRequest.fromCell)
    : null;

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
          const { enemies: cellEnemies } = getEntitiesOnCell(run, index);
          const enemies = cellEnemies.filter(
            (e) => !defeatedEnemyCellSet.has(e.position),
          );
          const isPlayerHere = !showAnimatedPlayer && run.playerPosition === index;
          const enemyDying =
            splatterSet.has(index) ||
            (sniperPhase === 'impact' && sniperSplatterCell === index) ||
            (cleavePhase === 'impact' && cleaveSplatterCell === index);
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
                isPlayerHere={isPlayerHere}
                enemies={enemies}
                animations={animations}
                killFlash={run.lastKillFlash && isPlayerHere}
                showSplatter={splatterSet.has(index)}
                enemyDying={enemyDying}
                upgradeIds={run.upgradeIds}
                run={run}
              />
              {teleportSmokeSet.has(index) && <BoardSmokePuff />}
            </div>
          );
        })}
      </div>

      {sniperFrom && sniperTo && (
        <BoardProjectile
          kind="arrow"
          fromX={sniperFrom.x}
          fromY={sniperFrom.y}
          toX={sniperTo.x}
          toY={sniperTo.y}
          boardCoordSize={BOARD_COORD_SIZE}
          active={sniperPhase === 'flight'}
        />
      )}

      {cleaveFrom && cleaveTo && (
        <BoardProjectile
          kind="knife"
          fromX={cleaveFrom.x}
          fromY={cleaveFrom.y}
          toX={cleaveTo.x}
          toY={cleaveTo.y}
          boardCoordSize={BOARD_COORD_SIZE}
          active={cleavePhase === 'flight'}
        />
      )}

      {novaFrom &&
        novaBlastRequest &&
        novaPhase === 'flight' &&
        novaBlastRequest.targetCells.map((targetCell) => {
          const targetPos = cellPositions.find((c) => c.index === targetCell);
          if (!targetPos) return null;
          return (
            <BoardProjectile
              key={`nova-${targetCell}`}
              kind="lightning"
              fromX={novaFrom.x}
              fromY={novaFrom.y}
              toX={targetPos.x}
              toY={targetPos.y}
              boardCoordSize={BOARD_COORD_SIZE}
              active
            />
          );
        })}

      {grapplePull && grappleAnchorPos && playerBoardCoords && (
        <BoardGrappleLine
          anchorX={grappleAnchorPos.x}
          anchorY={grappleAnchorPos.y}
          playerX={playerBoardCoords.x}
          playerY={playerBoardCoords.y}
        />
      )}

      {showAnimatedPlayer && (
        <div
          className={`pointer-events-none absolute z-[30] -translate-x-1/2 -translate-y-1/2 ${
            instantPosition || grapplePull
              ? ''
              : 'transition-[left,top] duration-[190ms] ease-out'
          }`}
          style={{
            left: `${(playerBoardCoords.x / BOARD_COORD_SIZE) * 100}%`,
            top: `${(playerBoardCoords.y / BOARD_COORD_SIZE) * 100}%`,
            width: `${cellSizePercent}%`,
            maxWidth: '5.5rem',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={
              grapplePull
                ? { transform: `rotate(${grappleLeanDeg + 90}deg)` }
                : undefined
            }
          >
            <div
              className={`flex items-center justify-center ${playerMotionClass} ${
                playerVisible ? '' : 'invisible opacity-0'
              }`}
            >
              <EntitySprite kind="player" size="xl" animate={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
