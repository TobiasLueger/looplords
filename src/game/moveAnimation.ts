import { cellsAlongPath, getNearestEnemyTargetCell } from './gameLogic';
import type { PlayerMoveSegment } from './playerMovement';
import { canEnemyTakeDamage } from './enemyTraits';
import { hasUpgrade } from './upgrades';
import type { RunState } from './types';

export interface KillTrigger {
  /** Player step that triggers the attack. */
  atCell: number;
  /** Cells that show splatter (includes atCell for direct hits). */
  splatterCells: number[];
}

export interface ProjectileThrow {
  fromCell: number;
  toCell: number;
}

function adjacentPositions(pos: number, boardSize: number): number[] {
  return [(pos - 1 + boardSize) % boardSize, (pos + 1) % boardSize];
}

function buildFullPath(
  startCell: number,
  segments: PlayerMoveSegment[],
  boardSize: number,
): number[] {
  const path: number[] = [];
  let from = startCell;
  for (const segment of segments) {
    for (const cell of cellsAlongPath(from, segment.steps, boardSize)) {
      path.push(cell);
      from = cell;
    }
  }
  return path;
}

function killedEnemyPositions(before: RunState, after: RunState): number[] {
  const aliveIds = new Set(after.enemies.map((e) => e.id));
  return before.enemies.filter((e) => !aliveIds.has(e.id)).map((e) => e.position);
}

export function getKillTriggersForMove(
  before: RunState,
  after: RunState,
  startCell: number,
  segments: PlayerMoveSegment[],
): KillTrigger[] {
  const killedPositions = killedEnemyPositions(before, after);
  if (killedPositions.length === 0 || segments.length === 0) return [];

  const path = buildFullPath(startCell, segments, before.boardSize);
  if (path.length === 0) return [];

  const killedSet = new Set(killedPositions);
  const pathSet = new Set(path);
  const triggers: KillTrigger[] = [];

  for (const cell of path) {
    const splatterCells = new Set<number>();

    // Pierce / landing: enemy on this path cell dies when the player steps here.
    if (killedSet.has(cell)) {
      splatterCells.add(cell);
    }

    // Melee-style kills on adjacent cells (not on the path itself).
    for (const pos of killedPositions) {
      if (pathSet.has(pos)) continue;
      if (adjacentPositions(cell, before.boardSize).includes(pos)) {
        splatterCells.add(pos);
      }
    }

    if (splatterCells.size > 0) {
      triggers.push({
        atCell: cell,
        splatterCells: [...splatterCells],
      });
    }
  }

  return triggers;
}

function wasNovaPlayed(before: RunState, after: RunState): boolean {
  const newPlayed = after.playedThisRound.slice(before.playedThisRound.length);
  return newPlayed.some((c) => c.special === 'nova');
}

/** Alle Gegner-Felder, die vom Nova-Chip getroffen werden (vor dem Spielzug). */
export function getNovaTargetCells(before: RunState, after: RunState): number[] {
  if (!wasNovaPlayed(before, after)) return [];
  return [...new Set(before.enemies.map((e) => e.position))];
}

/** Board cells where Nova-Chip kills an enemy (pre-play enemy list). */
export function getNovaKillCells(before: RunState, after: RunState): number[] {
  if (!wasNovaPlayed(before, after)) return [];

  const positions: number[] = [];
  for (const enemy of before.enemies) {
    if (!canEnemyTakeDamage(enemy.type, 'magic')) continue;
    let hp = enemy.hp;
    if (enemy.type === 'tank' && hasUpgrade(before.upgradeIds, 'tank_bane')) {
      hp = 1;
    }
    if (hp <= 1) {
      positions.push(enemy.position);
    }
  }

  return [...new Set(positions)];
}

function wasCleavePlayed(before: RunState, after: RunState): boolean {
  const newPlayed = after.playedThisRound.slice(before.playedThisRound.length);
  return newPlayed.some((c) => c.special === 'cleave');
}

/** Spalt-Chip: knife throw from landing cell to cleave target after movement. */
export function getCleaveThrowTarget(
  before: RunState,
  after: RunState,
  startCell: number,
  segments: PlayerMoveSegment[],
): ProjectileThrow | null {
  if (!wasCleavePlayed(before, after)) return null;

  const fromCell = after.playerPosition;
  const pathTriggers = getKillTriggersForMove(before, after, startCell, segments);
  const pathKillCells = new Set<number>();
  for (const trigger of pathTriggers) {
    for (const cell of trigger.splatterCells) {
      pathKillCells.add(cell);
    }
  }

  const cleaveKillPositions = killedEnemyPositions(before, after).filter(
    (pos) => !pathKillCells.has(pos),
  );

  const toCell =
    cleaveKillPositions[0] ??
    getNearestEnemyTargetCell(fromCell, after.enemies, after.boardSize);

  if (toCell === null) return null;
  return { fromCell, toCell };
}
