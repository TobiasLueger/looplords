import { useCallback, useMemo } from 'react';
import type { PlayerMoveRequest } from './usePlayerHopAnimation';
import type { ProjectileShotRequest } from './useProjectileShotAnimation';
import type { NovaBlastRequest } from './useNovaBlastAnimation';
import {
  buildRunEndStats,
  evaluateNewAchievements,
} from '../game/achievements';
import {
  createInitialRunState,
  getSniperTargetCell,
} from '../game/gameLogic';
import {
  devAddChipToHand,
  devAddInstantTicket,
  devClearEnemies,
  devCreateFreshRun,
  devFillDeckWithChips,
  devForceBossUpgradePicker,
  devGrantAllTickets,
  devJumpToRound,
  devKillPlayer,
  devLineEnemiesForPierce,
  devOpenEndlessChoice,
  devOpenShop,
  devResetTickets,
  devRichRun,
  devSetHandCombo,
  devSpawnEnemy,
  devToggleUpgrade,
  devWinRound,
  type DevChipSpec,
} from '../game/devToolsActions';
import type { EnemyType, InstantTicketType, RunEndStats, RunState, Screen } from '../game/types';

export interface DevToolsApi {
  goToScreen: (screen: Screen) => void;
  ensureRun: () => void;
  startFreshRun: (round: number) => void;
  jumpToRound: (round: number) => void;
  makeRich: () => void;
  setGold: (gold: number) => void;
  addGold: (amount: number) => void;
  healFull: () => void;
  setLivesOne: () => void;
  addTurns: (n: number) => void;
  addDiscards: (n: number) => void;
  addShield: (n: number) => void;
  openShop: (boss: boolean) => void;
  openBossUpgrade: () => void;
  openEndlessChoice: () => void;
  winRound: () => void;
  setPlayerPosition: (pos: number) => void;
  clearEnemies: () => void;
  spawnPierceLine: () => void;
  spawnEnemy: (type: EnemyType) => void;
  setHandCombo: (specs: DevChipSpec[]) => void;
  addChip: (spec: DevChipSpec) => void;
  clearHand: () => void;
  fillDeck: () => void;
  grantAllTickets: () => void;
  resetTickets: () => void;
  addTicket: (type: InstantTicketType) => void;
  toggleUpgrade: (id: string) => void;
  previewNova: () => void;
  previewMove: () => void;
  previewSniper: () => void;
  previewCleave: () => void;
  previewFullCombo: () => void;
  clearAnimations: () => void;
  simulateDefeat: () => void;
  simulateVictory: () => void;
}

interface UseDevToolsApiOptions {
  enabled: boolean;
  run: RunState | null;
  setRun: React.Dispatch<React.SetStateAction<RunState | null>>;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  setRunEndStats: React.Dispatch<React.SetStateAction<RunEndStats | null>>;
  setNewlyUnlockedIds: React.Dispatch<React.SetStateAction<string[]>>;
  beginRun: () => void;
  clearPendingMove: () => void;
  finishRun: (run: RunState, won: boolean, reason?: string) => void;
  setPlayerMoveAnim: React.Dispatch<React.SetStateAction<PlayerMoveRequest | null>>;
  setSniperShotAnim: React.Dispatch<React.SetStateAction<ProjectileShotRequest | null>>;
  setCleaveThrowAnim: React.Dispatch<React.SetStateAction<ProjectileShotRequest | null>>;
  setNovaBlastAnim: React.Dispatch<React.SetStateAction<NovaBlastRequest | null>>;
  moveAnimTokenRef: React.MutableRefObject<number>;
  sniperAnimTokenRef: React.MutableRefObject<number>;
  cleaveAnimTokenRef: React.MutableRefObject<number>;
  novaAnimTokenRef: React.MutableRefObject<number>;
}

export function useDevToolsApi({
  enabled,
  run,
  setRun,
  setScreen,
  setRunEndStats,
  setNewlyUnlockedIds,
  beginRun,
  clearPendingMove,
  finishRun,
  setPlayerMoveAnim,
  setSniperShotAnim,
  setCleaveThrowAnim,
  setNovaBlastAnim,
  moveAnimTokenRef,
  sniperAnimTokenRef,
  cleaveAnimTokenRef,
  novaAnimTokenRef,
}: UseDevToolsApiOptions): DevToolsApi | null {
  const patch = useCallback(
    (updater: (r: RunState) => RunState) => {
      clearPendingMove();
      setRun((r) => (r ? updater(r) : r));
    },
    [clearPendingMove, setRun],
  );

  const goToScreen = useCallback(
    (screen: Screen) => {
      clearPendingMove();
      if (screen === 'game' || screen === 'shop' || screen === 'endlessChoice') {
        setRun((r) => r ?? createInitialRunState([]));
      }
      if (screen === 'runEnd') {
        const mock = run ?? devCreateFreshRun(10);
        const stats = buildRunEndStats(mock, true);
        const newly = evaluateNewAchievements(mock, stats);
        setRunEndStats(stats);
        setNewlyUnlockedIds(newly);
        setRun(null);
      }
      setScreen(screen);
      if (screen === 'shop') {
        setRun((r) => (r ? devOpenShop(r) : r));
      }
      if (screen === 'endlessChoice') {
        setRun((r) => (r ? devOpenEndlessChoice(r) : r));
      }
    },
    [clearPendingMove, run, setNewlyUnlockedIds, setRun, setRunEndStats, setScreen],
  );

  const ensureRun = useCallback(() => {
    if (!run) beginRun();
  }, [beginRun, run]);

  const startFreshRun = useCallback(
    (round: number) => {
      clearPendingMove();
      const state = devCreateFreshRun(round);
      setRun(state);
      setScreen('game');
    },
    [clearPendingMove, setRun, setScreen],
  );

  const previewNova = useCallback(() => {
    if (!run) return;
    clearPendingMove();
    const cells =
      run.enemies.length > 0
        ? run.enemies.map((e) => e.position)
        : [(run.playerPosition + 2) % run.boardSize, (run.playerPosition + 4) % run.boardSize];
    novaAnimTokenRef.current += 1;
    setNovaBlastAnim({ splatterCells: cells, token: novaAnimTokenRef.current });
  }, [clearPendingMove, novaAnimTokenRef, run, setNovaBlastAnim]);

  const previewMove = useCallback(() => {
    if (!run) return;
    clearPendingMove();
    moveAnimTokenRef.current += 1;
    setPlayerMoveAnim({
      segments: [2, 3],
      token: moveAnimTokenRef.current,
      killTriggers: [],
    });
  }, [clearPendingMove, moveAnimTokenRef, run, setPlayerMoveAnim]);

  const previewSniper = useCallback(() => {
    if (!run) return;
    clearPendingMove();
    const target = getSniperTargetCell(run) ?? (run.playerPosition + 3) % run.boardSize;
    sniperAnimTokenRef.current += 1;
    setSniperShotAnim({
      fromCell: run.playerPosition,
      toCell: target,
      token: sniperAnimTokenRef.current,
    });
  }, [clearPendingMove, run, setSniperShotAnim, sniperAnimTokenRef]);

  const previewCleave = useCallback(() => {
    if (!run) return;
    clearPendingMove();
    const to = (run.playerPosition + 4) % run.boardSize;
    cleaveAnimTokenRef.current += 1;
    setCleaveThrowAnim({
      fromCell: run.playerPosition,
      toCell: to,
      token: cleaveAnimTokenRef.current,
    });
  }, [cleaveAnimTokenRef, clearPendingMove, run, setCleaveThrowAnim]);

  const previewFullCombo = useCallback(() => {
    if (!run) return;
    clearPendingMove();
    const cells =
      run.enemies.length > 0
        ? run.enemies.map((e) => e.position)
        : [(run.playerPosition + 1) % run.boardSize];
    novaAnimTokenRef.current += 1;
    setNovaBlastAnim({ splatterCells: cells, token: novaAnimTokenRef.current });
    window.setTimeout(() => {
      moveAnimTokenRef.current += 1;
      setPlayerMoveAnim({
        segments: [3],
        token: moveAnimTokenRef.current,
        killTriggers: [],
      });
    }, 700);
    window.setTimeout(() => {
      const to = (run.playerPosition + 5) % run.boardSize;
      cleaveAnimTokenRef.current += 1;
      setCleaveThrowAnim({
        fromCell: run.playerPosition,
        toCell: to,
        token: cleaveAnimTokenRef.current,
      });
    }, 1400);
  }, [
    cleaveAnimTokenRef,
    clearPendingMove,
    moveAnimTokenRef,
    novaAnimTokenRef,
    run,
    setCleaveThrowAnim,
    setNovaBlastAnim,
    setPlayerMoveAnim,
  ]);

  return useMemo(() => {
    if (!enabled) return null;

    return {
      goToScreen,
      ensureRun,
      startFreshRun,
      jumpToRound: (round) => patch((r) => devJumpToRound(r, round)),
      makeRich: () => patch(devRichRun),
      setGold: (gold) => patch((r) => ({ ...r, gold })),
      addGold: (amount) => patch((r) => ({ ...r, gold: r.gold + amount })),
      healFull: () => patch((r) => ({ ...r, lives: r.maxLives })),
      setLivesOne: () => patch((r) => ({ ...r, lives: 1 })),
      addTurns: (n) => patch((r) => ({ ...r, turnsRemaining: r.turnsRemaining + n })),
      addDiscards: (n) => patch((r) => ({ ...r, discardsRemaining: r.discardsRemaining + n })),
      addShield: (n) => patch((r) => ({ ...r, shield: r.shield + n })),
      openShop: (boss) => {
        patch((r) => devOpenShop(r, boss));
        setScreen('shop');
      },
      openBossUpgrade: () => {
        patch(devForceBossUpgradePicker);
        setScreen('shop');
      },
      openEndlessChoice: () => {
        patch(devOpenEndlessChoice);
        setScreen('endlessChoice');
      },
      winRound: () => {
        clearPendingMove();
        setRun((r) => {
          if (!r) return r;
          const next = devWinRound(r);
          if (next.shopOpen) setScreen('shop');
          else if (next.pendingEndlessChoice) setScreen('endlessChoice');
          return next;
        });
      },
      setPlayerPosition: (pos) =>
        patch((r) => ({
          ...r,
          playerPosition: ((pos % r.boardSize) + r.boardSize) % r.boardSize,
        })),
      clearEnemies: () => patch(devClearEnemies),
      spawnPierceLine: () => patch(devLineEnemiesForPierce),
      spawnEnemy: (type) => patch((r) => devSpawnEnemy(r, type)),
      setHandCombo: (specs) => patch((r) => devSetHandCombo(r, specs)),
      addChip: (spec) => patch((r) => devAddChipToHand(r, spec)),
      clearHand: () => patch((r) => ({ ...r, hand: [], selectedChipIds: [] })),
      fillDeck: () => patch((r) => devFillDeckWithChips(r, 12)),
      grantAllTickets: () => patch(devGrantAllTickets),
      resetTickets: () => patch(devResetTickets),
      addTicket: (type) => patch((r) => devAddInstantTicket(r, type)),
      toggleUpgrade: (id) => patch((r) => devToggleUpgrade(r, id)),
      previewNova,
      previewMove,
      previewSniper,
      previewCleave,
      previewFullCombo,
      clearAnimations: clearPendingMove,
      simulateDefeat: () => {
        if (!run) return;
        finishRun(devKillPlayer(run), false, '[Dev] Niederlage simuliert.');
      },
      simulateVictory: () => {
        if (!run) return;
        finishRun(run, true);
      },
    };
  }, [
    enabled,
    goToScreen,
    ensureRun,
    startFreshRun,
    patch,
    setScreen,
    clearPendingMove,
    previewNova,
    previewMove,
    previewSniper,
    previewCleave,
    previewFullCombo,
    run,
    finishRun,
  ]);
}
