import { useEffect, useRef, useState } from 'react';
import { cellsAlongPath } from '../game/gameLogic';
import type { KillTrigger } from '../game/moveAnimation';

const STEP_MS = 190;
const KILL_PAUSE_MS = 320;

export interface PlayerMoveRequest {
  segments: number[];
  token: number;
  killTriggers: KillTrigger[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
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
} {
  const [displayCell, setDisplayCell] = useState(startCell);
  const [isAnimating, setIsAnimating] = useState(false);
  const [splatterCells, setSplatterCells] = useState<number[]>([]);
  const [defeatedEnemyCells, setDefeatedEnemyCells] = useState<number[]>([]);
  const lastTokenRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onKillStrikeRef = useRef(onKillStrike);
  onCompleteRef.current = onComplete;
  onKillStrikeRef.current = onKillStrike;

  useEffect(() => {
    if (!isAnimating && !moveRequest) {
      setDisplayCell(startCell);
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

    const killByCell = new Map(
      moveRequest.killTriggers.map((t) => [t.atCell, t.splatterCells]),
    );

    void (async () => {
      let from = startCell;

      for (const steps of moveRequest.segments) {
        const path = cellsAlongPath(from, steps, boardSize);
        for (const cell of path) {
          if (cancelled) return;
          setDisplayCell(cell);

          const splatter = killByCell.get(cell);
          if (splatter && splatter.length > 0) {
            setSplatterCells(splatter);
            setDefeatedEnemyCells((prev) => [...new Set([...prev, ...splatter])]);
            onKillStrikeRef.current?.();
            await sleep(KILL_PAUSE_MS);
            if (cancelled) return;
            setSplatterCells([]);
          }

          await sleep(STEP_MS);
          from = cell;
        }
      }

      if (cancelled) return;
      setSplatterCells([]);
      setIsAnimating(false);
      onCompleteRef.current();
    })();

    return () => {
      cancelled = true;
      setIsAnimating(false);
      setSplatterCells([]);
      setDefeatedEnemyCells([]);
    };
  }, [animations, boardSize, moveRequest, startCell]);

  return { displayCell, isAnimating, splatterCells, defeatedEnemyCells };
}
