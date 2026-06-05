import { getEnemyDamage, getEnemyDisplayName } from './enemyInfo';
import { canEnemyTakeDamage } from './enemyTraits';
import type { RunState } from './types';
import { hasUpgrade } from './upgrades';

export interface EnemyShot {
  fromCell: number;
  toCell: number;
}

export interface EnemyPhaseResult {
  state: RunState;
  shots: EnemyShot[];
}

function addLog(state: RunState, message: string): string[] {
  return [message, ...state.eventLog].slice(0, 30);
}

function moveClockwise(pos: number, steps: number, boardSize: number): number {
  return ((pos % boardSize) + steps + boardSize) % boardSize;
}

function getEnemySpeed(type: RunState['enemies'][number]['type']): number {
  switch (type) {
    case 'fast':
      return 2;
    default:
      return 1;
  }
}

function damagePlayer(state: RunState, amount: number): RunState {
  let remaining = amount;
  let shield = state.shield;
  let lives = state.lives;

  if (shield > 0) {
    const blocked = Math.min(shield, remaining);
    shield -= blocked;
    remaining -= blocked;
  }
  lives -= remaining;

  return {
    ...state,
    shield,
    lives: Math.max(0, lives),
    eventLog: addLog(
      state,
      remaining > 0
        ? `Du erleidest ${remaining} Schaden! (${Math.max(0, lives)} Leben übrig)`
        : 'Schild blockiert den Angriff!',
    ),
  };
}

export function runEnemyPhase(state: RunState): EnemyPhaseResult {
  if (
    hasUpgrade(state.upgradeIds, 'slow_enemies') &&
    state.playerTurnCount % 2 === 0
  ) {
    return {
      state: {
        ...state,
        eventLog: addLog(state, 'Gegner warten (Zeitfrost).'),
      },
      shots: [],
    };
  }

  let next = { ...state };
  const shots: EnemyShot[] = [];
  const sorted = [...next.enemies].sort((a, b) => a.position - b.position);

  for (const enemy of sorted) {
    if (enemy.type === 'marksman' && enemy.position !== next.playerPosition) {
      shots.push({ fromCell: enemy.position, toCell: next.playerPosition });
      next = damagePlayer(next, getEnemyDamage('marksman'));
      next.eventLog = addLog(next, `${getEnemyDisplayName('marksman')} feuert auf dich!`);
      if (next.lives <= 0) break;
    }

    const speed = getEnemySpeed(enemy.type);
    const newPos = moveClockwise(enemy.position, speed, next.boardSize);

    next.enemies = next.enemies.map((e) =>
      e.id === enemy.id ? { ...e, position: newPos } : e,
    );

    if (newPos === next.playerPosition) {
      const dmg = getEnemyDamage(enemy.type);
      next = damagePlayer(next, dmg);
      if (enemy.type === 'boss') {
        next = damagePlayer(next, 1);
        next.eventLog = addLog(next, 'Boss-Schlag trifft doppelt!');
      }
      if (next.lives <= 0) break;
    }
  }

  next.eventLog = addLog(next, 'Gegnerzug abgeschlossen.');
  return { state: next, shots };
}

/** Prüft, ob der nächste Fernangriff-Ziel blockiert wäre (für UI-Feedback). */
export function wouldProjectileHit(type: RunState['enemies'][number]['type']): boolean {
  return canEnemyTakeDamage(type, 'projectile');
}
