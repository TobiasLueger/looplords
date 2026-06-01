import { useEffect, useRef, useState } from 'react';
import { cellsAlongPath } from '../game/gameLogic';
import type { KillTrigger } from '../game/moveAnimation';
import type { PlayerMoveSegment } from '../game/playerMovement';

const STEP_MS = 190;
const KILL_PAUSE_MS = 320;
const TELEPORT_VANISH_MS = 220;
const TELEPORT_GAP_MS = 60;
const TELEPORT_APPEAR_MS = 300;
const TELEPORT_SMOKE_MS = 420;
const GRAPPLE_MS_PER_STEP = 95;
const GRAPPLE_MS_MIN = 320;

export type PlayerAnimMode =
  | 'hop'
  | 'strike'
  | 'vanish'
  | 'appear'
  | 'grapple'
  | 'idle';

export interface GrapplePullState {
  fromCell: number;
  toCell: number;
  progress: number;
}

export interface PlayerMoveRequest {
  segments: PlayerMoveSegment[];
  token: number;
  killTriggers: KillTrigger[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function easeInCubic(t: number): number {
  return t * t * t;
}

function animateGrapplePull(
  durationMs: number,
  onProgress: (progress: number) => void,
  isCancelled: () => boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      if (isCancelled()) {
        resolve();
        return;
      }
      const t = Math.min(1, (now - start) / durationMs);
      onProgress(easeInCubic(t));
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

export function usePlayerHopAnimation(
  startCell: number,
  boardSize: number,
  moveRequest: PlayerMoveRequest | null,
  animations: boolean,
  onComplete: () => void,
  onKillStrike?: () => void,
): {
  displayCell: number;
  isAnimating: boolean;
  splatterCells: number[];
  defeatedEnemyCells: number[];
  teleportSmokeCells: number[];
  playerVisible: boolean;
  instantPosition: boolean;
  playerAnimMode: PlayerAnimMode;
  grapplePull: GrapplePullState | null;
} {
  const [displayCell, setDisplayCell] = useState(startCell);
  const [isAnimating, setIsAnimating] = useState(false);
  const [splatterCells, setSplatterCells] = useState<number[]>([]);
  const [defeatedEnemyCells, setDefeatedEnemyCells] = useState<number[]>([]);
  const [teleportSmokeCells, setTeleportSmokeCells] = useState<number[]>([]);
  const [playerVisible, setPlayerVisible] = useState(true);
  const [instantPosition, setInstantPosition] = useState(false);
  const [playerAnimMode, setPlayerAnimMode] = useState<PlayerAnimMode>('idle');
  const [grapplePull, setGrapplePull] = useState<GrapplePullState | null>(null);
  const lastTokenRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onKillStrikeRef = useRef(onKillStrike);
  onCompleteRef.current = onComplete;
  onKillStrikeRef.current = onKillStrike;

  useEffect(() => {
    if (!isAnimating && !moveRequest) {
      setDisplayCell(startCell);
      setTeleportSmokeCells([]);
      setPlayerVisible(true);
      setInstantPosition(false);
      setPlayerAnimMode('idle');
      setGrapplePull(null);
    }
  }, [startCell, isAnimating, moveRequest]);

  useEffect(() => {
    if (!moveRequest || moveRequest.segments.length === 0) return;
    if (!animations) {
      lastTokenRef.current = moveRequest.token;
      onCompleteRef.current();
      return;
    }
    if (moveRequest.token === lastTokenRef.current) return;

    lastTokenRef.current = moveRequest.token;
    let cancelled = false;
    setIsAnimating(true);
    setDisplayCell(startCell);
    setSplatterCells([]);
    setDefeatedEnemyCells([]);
    setTeleportSmokeCells([]);
    setPlayerVisible(true);
    setInstantPosition(false);
    setPlayerAnimMode('idle');
    setGrapplePull(null);

    const killByCell = new Map(
      moveRequest.killTriggers.map((t) => [t.atCell, t.splatterCells]),
    );

    const triggerKillAt = async (cell: number) => {
      const splatter = killByCell.get(cell);
      if (!splatter || splatter.length === 0) return;
      setSplatterCells(splatter);
      setDefeatedEnemyCells((prev) => [...new Set([...prev, ...splatter])]);
      setPlayerAnimMode('strike');
      onKillStrikeRef.current?.();
      await sleep(KILL_PAUSE_MS);
      if (cancelled) return;
      setSplatterCells([]);
      setPlayerAnimMode('idle');
    };

    const triggerKillsAlongPath = async (path: number[]) => {
      for (const cell of path) {
        if (!killByCell.has(cell)) continue;
        await triggerKillAt(cell);
        if (cancelled) return;
      }
    };

    const runTeleport = async (from: number, steps: number) => {
      const path = cellsAlongPath(from, steps, boardSize);
      const toCell = path[path.length - 1] ?? from;
      if (cancelled) return from;

      setInstantPosition(true);
      setTeleportSmokeCells([from]);
      setPlayerAnimMode('vanish');
      setDisplayCell(from);
      await sleep(TELEPORT_VANISH_MS);
      if (cancelled) return from;

      setPlayerVisible(false);
      await sleep(TELEPORT_GAP_MS);
      if (cancelled) return from;

      setDisplayCell(toCell);
      setTeleportSmokeCells([from, toCell]);
      setPlayerVisible(true);
      setPlayerAnimMode('appear');
      await sleep(TELEPORT_APPEAR_MS);
      if (cancelled) return from;

      await triggerKillsAlongPath(path);
      if (cancelled) return from;

      await sleep(TELEPORT_SMOKE_MS);
      if (cancelled) return from;
      setTeleportSmokeCells([]);
      setPlayerAnimMode('idle');
      setInstantPosition(false);
      return toCell;
    };

    const runHop = async (from: number, steps: number) => {
      const path = cellsAlongPath(from, steps, boardSize);
      for (const cell of path) {
        if (cancelled) return from;
        setInstantPosition(false);
        setDisplayCell(cell);
        setPlayerAnimMode('hop');

        await triggerKillAt(cell);
        if (cancelled) return from;

        await sleep(STEP_MS);
        from = cell;
      }
      setPlayerAnimMode('idle');
      return from;
    };

    const runGrapple = async (from: number, steps: number) => {
      const path = cellsAlongPath(from, steps, boardSize);
      const toCell = path[path.length - 1] ?? from;
      if (cancelled || path.length === 0) return from;

      const durationMs = Math.max(
        GRAPPLE_MS_MIN,
        path.length * GRAPPLE_MS_PER_STEP,
      );

      setInstantPosition(true);
      setDisplayCell(from);
      setPlayerAnimMode('grapple');
      setGrapplePull({ fromCell: from, toCell, progress: 0 });

      await animateGrapplePull(
        durationMs,
        (progress) => {
          setGrapplePull({ fromCell: from, toCell, progress });
        },
        () => cancelled,
      );
      if (cancelled) return from;

      setGrapplePull(null);
      setDisplayCell(toCell);
      setPlayerAnimMode('grapple');
      await sleep(80);
      if (cancelled) return from;

      await triggerKillsAlongPath(path);
      if (cancelled) return from;

      setPlayerAnimMode('idle');
      setInstantPosition(false);
      return toCell;
    };

    void (async () => {
      let from = startCell;

      for (const segment of moveRequest.segments) {
        if (segment.kind === 'teleport') {
          from = await runTeleport(from, segment.steps);
        } else if (segment.kind === 'grapple') {
          from = await runGrapple(from, segment.steps);
        } else {
          from = await runHop(from, segment.steps);
        }
      }

      if (cancelled) return;
      setSplatterCells([]);
      setTeleportSmokeCells([]);
      setGrapplePull(null);
      setPlayerVisible(true);
      setInstantPosition(false);
      setPlayerAnimMode('idle');
      setIsAnimating(false);
      onCompleteRef.current();
    })();

    return () => {
      cancelled = true;
      setIsAnimating(false);
      setSplatterCells([]);
      setDefeatedEnemyCells([]);
      setTeleportSmokeCells([]);
      setGrapplePull(null);
      setPlayerVisible(true);
      setInstantPosition(false);
      setPlayerAnimMode('idle');
    };
  }, [animations, boardSize, moveRequest, startCell]);

  return {
    displayCell,
    isAnimating,
    splatterCells,
    defeatedEnemyCells,
    teleportSmokeCells,
    playerVisible,
    instantPosition,
    playerAnimMode,
    grapplePull,
  };
}
