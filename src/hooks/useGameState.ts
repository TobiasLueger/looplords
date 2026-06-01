import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlayerMoveRequest } from './usePlayerHopAnimation';
import type { PlayerMoveSegment } from '../game/playerMovement';
import type { ProjectileShotRequest } from './useProjectileShotAnimation';
import type { NovaBlastRequest } from './useNovaBlastAnimation';
import {
  buildRunEndStats,
  evaluateNewAchievements,
} from '../game/achievements';
import {
  canPlaySelectedChips,
  createInitialRunState,
  discardAndRedraw,
  endTurn,
  getGameOverReason,
  getSniperTargetCell,
  isCampaignCompletePending,
  isGameOver,
  openEndlessShop,
  playChips,
  toggleChipSelection,
} from '../game/gameLogic';
import {
  getCleaveThrowTarget,
  getKillTriggersForMove,
  getNovaKillCells,
  getNovaTargetCells,
} from '../game/moveAnimation';
import { sumSelectedChipSteps, isUtilityChip } from '../game/chipDisplay';
import type { InstantTicketType, RunEndStats, RunState, Screen } from '../game/types';
import {
  buyInstantTicket,
  buyShopChip,
  leaveShop,
  redeemUpgradeTicket,
  rerollShopOffers,
  sellInstantTicket,
  useInstantTicket,
} from '../game/shopActions';
import type { GameSettings } from '../game/types';
import { chiptune } from '../audio/chiptuneEngine';
import { DEV_TOOLS_ENABLED } from '../config/devTools';
import { useDevToolsApi } from './useDevToolsApi';

const SETTINGS_KEY = 'looplords-settings';

const defaultSettings: GameSettings = {
  music: true,
  musicVolume: 70,
  sound: true,
  animations: true,
};

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GameSettings>;
      const musicVolume =
        typeof parsed.musicVolume === 'number'
          ? Math.max(0, Math.min(100, Math.round(parsed.musicVolume)))
          : defaultSettings.musicVolume;
      return { ...defaultSettings, ...parsed, musicVolume };
    }
  } catch {
    /* ignore */
  }
  return defaultSettings;
}

export function useGameState() {
  const [screen, setScreen] = useState<Screen>('title');
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [run, setRun] = useState<RunState | null>(null);
  const [runEndStats, setRunEndStats] = useState<RunEndStats | null>(null);
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);
  const [settingsReturnScreen, setSettingsReturnScreen] = useState<Screen | null>(
    null,
  );
  const pendingRunRef = useRef<RunState | null>(null);
  const pendingSfxRef = useRef<{
    prevKills: number;
    nextKills: number;
    killSfxPlayed: boolean;
  } | null>(null);
  const moveAnimTokenRef = useRef(0);
  const [playerMoveAnim, setPlayerMoveAnim] = useState<PlayerMoveRequest | null>(null);
  const pendingSniperRunRef = useRef<RunState | null>(null);
  const sniperAnimTokenRef = useRef(0);
  const [sniperShotAnim, setSniperShotAnim] = useState<ProjectileShotRequest | null>(null);
  const pendingCleaveThrowRef = useRef<{ fromCell: number; toCell: number } | null>(null);
  const cleaveAnimTokenRef = useRef(0);
  const [cleaveThrowAnim, setCleaveThrowAnim] = useState<ProjectileShotRequest | null>(null);
  const pendingAfterNovaRef = useRef<{
    segments: PlayerMoveSegment[];
    cleaveThrow: { fromCell: number; toCell: number } | null;
    killTriggers: ReturnType<typeof getKillTriggersForMove>;
  } | null>(null);
  const novaAnimTokenRef = useRef(0);
  const [novaBlastAnim, setNovaBlastAnim] = useState<NovaBlastRequest | null>(null);

  const clearPendingMove = useCallback(() => {
    pendingRunRef.current = null;
    pendingSfxRef.current = null;
    pendingSniperRunRef.current = null;
    pendingCleaveThrowRef.current = null;
    pendingAfterNovaRef.current = null;
    setPlayerMoveAnim(null);
    setSniperShotAnim(null);
    setCleaveThrowAnim(null);
    setNovaBlastAnim(null);
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const finishRun = useCallback(
    (currentRun: RunState, won: boolean, reason?: string) => {
      const endStats = buildRunEndStats(currentRun, won, reason);
      const newly = evaluateNewAchievements(currentRun, endStats);
      setRunEndStats(endStats);
      setNewlyUnlockedIds(newly);
      setRun(null);
      setScreen('runEnd');
    },
    [settings],
  );

  const beginRun = useCallback(() => {
    clearPendingMove();
    const state = createInitialRunState([]);
    setRun(state);
    setRunEndStats(null);
    setNewlyUnlockedIds([]);
    setScreen('game');
  }, [clearPendingMove]);

  useEffect(() => {
    if (!run) return;

    if (isCampaignCompletePending(run)) {
      if (screen === 'game' || screen === 'shop') {
        setScreen('endlessChoice');
      }
      return;
    }

    if (isGameOver(run) && screen !== 'runEnd') {
      finishRun(run, false, getGameOverReason(run));
      return;
    }

    if (run.shopOpen && screen === 'game') {
      setScreen('shop');
    }
  }, [run, screen, finishRun]);

  const goToTitle = useCallback(() => {
    clearPendingMove();
    setRun(null);
    setRunEndStats(null);
    setNewlyUnlockedIds([]);
    setSettingsReturnScreen(null);
    setScreen('title');
  }, [clearPendingMove]);

  const restartRun = useCallback(() => {
    clearPendingMove();
    setSettingsReturnScreen(null);
    setRunEndStats(null);
    setNewlyUnlockedIds([]);
    setRun(createInitialRunState([]));
    setScreen('game');
  }, [clearPendingMove]);

  const openAchievements = useCallback(() => {
    setScreen('achievements');
  }, []);

  const openSettings = useCallback((returnTo: Screen) => {
    setSettingsReturnScreen(returnTo);
    setScreen('settings');
  }, []);

  const closeSettings = useCallback(() => {
    setScreen(settingsReturnScreen ?? 'title');
    setSettingsReturnScreen(null);
  }, [settingsReturnScreen]);

  const handleChooseEndless = useCallback(() => {
    setRun((r) => (r ? openEndlessShop(r) : r));
    setScreen('shop');
  }, []);

  const handleChooseEndRun = useCallback(() => {
    if (!run) return;
    finishRun(run, true);
  }, [run, finishRun]);

  const toggleChip = useCallback((chipId: string) => {
    if (pendingRunRef.current || pendingSniperRunRef.current) return;
    setRun((r) => (r ? toggleChipSelection(r, chipId) : r));
  }, []);

  const commitPendingRunInternal = useCallback(() => {
    const next = pendingRunRef.current;
    if (!next) return;

    pendingRunRef.current = null;
    pendingCleaveThrowRef.current = null;
    setPlayerMoveAnim(null);
    setCleaveThrowAnim(null);
    setNovaBlastAnim(null);

    const sfx = pendingSfxRef.current;
    pendingSfxRef.current = null;
    if (settings.sound && sfx) {
      const hadKills = sfx.nextKills > sfx.prevKills;
      if (hadKills && !sfx.killSfxPlayed) {
        chiptune.playSfx('kill');
      } else if (!hadKills) {
        chiptune.playSfx('chip');
      }
    }

    setRun({ ...next, playerMoveSteps: [] });
  }, [settings.sound]);

  const handlePlayerMoveComplete = useCallback(() => {
    const cleave = pendingCleaveThrowRef.current;
    if (cleave && settings.animations) {
      pendingCleaveThrowRef.current = null;
      window.setTimeout(() => {
        cleaveAnimTokenRef.current += 1;
        setCleaveThrowAnim({
          fromCell: cleave.fromCell,
          toCell: cleave.toCell,
          token: cleaveAnimTokenRef.current,
        });
      }, 120);
      return;
    }
    commitPendingRunInternal();
  }, [settings.animations, commitPendingRunInternal]);

  const commitPendingCleave = useCallback(() => {
    commitPendingRunInternal();
  }, [commitPendingRunInternal]);

  const handleKillStrike = useCallback(() => {
    if (pendingSfxRef.current) {
      pendingSfxRef.current.killSfxPlayed = true;
    }
    if (settings.sound) {
      chiptune.playSfx('kill');
    }
  }, [settings.sound]);

  const continueChainedAnimations = useCallback(
    (
      segments: PlayerMoveSegment[],
      cleaveThrow: ReturnType<typeof getCleaveThrowTarget>,
      killTriggers: ReturnType<typeof getKillTriggersForMove>,
    ): boolean => {
      if (settings.animations && segments.length > 0) {
        pendingCleaveThrowRef.current = cleaveThrow;
        moveAnimTokenRef.current += 1;
        setPlayerMoveAnim({
          segments,
          token: moveAnimTokenRef.current,
          killTriggers,
        });
        return true;
      }

      if (settings.animations && cleaveThrow) {
        cleaveAnimTokenRef.current += 1;
        setCleaveThrowAnim({
          fromCell: cleaveThrow.fromCell,
          toCell: cleaveThrow.toCell,
          token: cleaveAnimTokenRef.current,
        });
        return true;
      }

      return false;
    },
    [settings.animations],
  );

  const commitPendingNova = useCallback(() => {
    setNovaBlastAnim(null);
    const pending = pendingAfterNovaRef.current;
    pendingAfterNovaRef.current = null;
    if (!pending || !run) {
      commitPendingRunInternal();
      return;
    }

    const continued = continueChainedAnimations(
      pending.segments,
      pending.cleaveThrow,
      pending.killTriggers,
    );
    if (!continued) {
      commitPendingRunInternal();
    }
  }, [commitPendingRunInternal, continueChainedAnimations, run]);

  const handleNovaImpact = useCallback(() => {
    if (pendingSfxRef.current) {
      pendingSfxRef.current.killSfxPlayed = true;
    }
    if (settings.sound) {
      chiptune.playSfx('kill');
    }
  }, [settings.sound]);

  const handlePlayChips = useCallback(() => {
    if (!run || pendingRunRef.current || pendingSniperRunRef.current) return;

    const prevKills = run.killsThisRound;
    const next = playChips(run);
    const segments = next.playerMoveSteps ?? [];
    const cleaveThrow = getCleaveThrowTarget(
      run,
      next,
      run.playerPosition,
      segments,
    );
    const killTriggers = getKillTriggersForMove(
      run,
      next,
      run.playerPosition,
      segments,
    );
    const novaTargetCells = getNovaTargetCells(run, next);
    const novaKillCells = getNovaKillCells(run, next);

    if (settings.animations && novaTargetCells.length > 0) {
      pendingRunRef.current = next;
      pendingSfxRef.current = {
        prevKills,
        nextKills: next.killsThisRound,
        killSfxPlayed: false,
      };
      pendingAfterNovaRef.current = {
        segments,
        cleaveThrow,
        killTriggers,
      };
      novaAnimTokenRef.current += 1;
      setNovaBlastAnim({
        fromCell: run.playerPosition,
        targetCells: novaTargetCells,
        splatterCells: novaKillCells,
        token: novaAnimTokenRef.current,
      });
      return;
    }

    if (settings.animations && segments.length > 0) {
      pendingRunRef.current = next;
      pendingSfxRef.current = {
        prevKills,
        nextKills: next.killsThisRound,
        killSfxPlayed: false,
      };
      pendingCleaveThrowRef.current = cleaveThrow;
      moveAnimTokenRef.current += 1;
      setPlayerMoveAnim({
        segments,
        token: moveAnimTokenRef.current,
        killTriggers,
      });
      return;
    }

    if (settings.animations && segments.length === 0 && cleaveThrow) {
      pendingRunRef.current = next;
      pendingSfxRef.current = {
        prevKills,
        nextKills: next.killsThisRound,
        killSfxPlayed: false,
      };
      cleaveAnimTokenRef.current += 1;
      setCleaveThrowAnim({
        fromCell: cleaveThrow.fromCell,
        toCell: cleaveThrow.toCell,
        token: cleaveAnimTokenRef.current,
      });
      return;
    }

    if (settings.sound) {
      if (next.killsThisRound > prevKills) {
        chiptune.playSfx('kill');
      } else {
        chiptune.playSfx('chip');
      }
    }
    setRun({ ...next, playerMoveSteps: [] });
  }, [run, settings.animations, settings.sound]);

  const handleEndTurn = useCallback(() => {
    if (pendingRunRef.current || pendingSniperRunRef.current) return;
    setRun((r) => (r ? endTurn(r) : r));
  }, []);

  const handleDiscard = useCallback(() => {
    if (pendingRunRef.current || pendingSniperRunRef.current) return;
    setRun((r) => (r ? discardAndRedraw(r) : r));
  }, []);

  const handleBuyShopChip = useCallback((offerId: string) => {
    setRun((r) => {
      if (!r) return r;
      const next = buyShopChip(r, offerId);
      if (settings.sound && next.gold < r.gold) {
        chiptune.playSfx('coin');
      }
      return next;
    });
  }, [settings.sound]);

  const handleRerollShop = useCallback(() => {
    setRun((r) => {
      if (!r) return r;
      const next = rerollShopOffers(r);
      if (settings.sound && next.gold < r.gold) {
        chiptune.playSfx('coin');
      }
      return next;
    });
  }, [settings.sound]);

  const handleRedeemUpgrade = useCallback((upgradeId: string) => {
    setRun((r) => (r ? redeemUpgradeTicket(r, upgradeId) : r));
  }, []);

  const handleLeaveShop = useCallback(() => {
    setRun((r) => (r ? leaveShop(r) : r));
    setScreen('game');
  }, []);

  const clearKillFlash = useCallback(() => {
    setRun((r) => (r ? { ...r, lastKillFlash: false } : r));
  }, []);

  const selectedChipSum = useMemo(() => {
    if (!run) return 0;
    return sumSelectedChipSteps(run.hand, run.selectedChipIds);
  }, [run]);

  const hasTeleportSelected = useMemo(() => {
    if (!run) return false;
    return run.hand.some(
      (c) => run.selectedChipIds.includes(c.id) && c.special === 'teleport',
    );
  }, [run]);

  const hasUtilityChipSelected = useMemo(() => {
    if (!run) return false;
    return run.hand.some(
      (c) => run.selectedChipIds.includes(c.id) && isUtilityChip(c),
    );
  }, [run]);

  const canPlaySelected = useMemo(() => {
    if (!run) return false;
    return canPlaySelectedChips(run);
  }, [run]);

  const handleBuyInstantTicket = useCallback((offerId: string) => {
    setRun((r) => {
      if (!r) return r;
      const next = buyInstantTicket(r, offerId);
      if (settings.sound && next.gold < r.gold) {
        chiptune.playSfx('coin');
      }
      return next;
    });
  }, [settings.sound]);

  const commitPendingSniper = useCallback(() => {
    const next = pendingSniperRunRef.current;
    if (!next) return;

    pendingSniperRunRef.current = null;
    setSniperShotAnim(null);
    setRun({ ...next, playerMoveSteps: [] });
  }, []);

  const handleSniperImpact = useCallback(() => {
    if (!settings.sound || !run || !pendingSniperRunRef.current) return;
    const hadKill =
      pendingSniperRunRef.current.killsThisRound > run.killsThisRound;
    chiptune.playSfx(hadKill ? 'kill' : 'chip');
  }, [run, settings.sound]);

  const handleCleaveImpact = useCallback(() => {
    if (pendingSfxRef.current) {
      pendingSfxRef.current.killSfxPlayed = true;
    }
    if (!settings.sound || !run || !pendingRunRef.current) return;
    const hadKill =
      pendingRunRef.current.killsThisRound > run.killsThisRound;
    chiptune.playSfx(hadKill ? 'kill' : 'chip');
  }, [run, settings.sound]);

  const handleUseInstantTicket = useCallback(
    (type: InstantTicketType) => {
      if (!run || pendingRunRef.current || pendingSniperRunRef.current) return;

      if (type === 'sniper' && settings.animations && run.enemies.length > 0) {
        const targetCell = getSniperTargetCell(run);
        if (targetCell === null) return;

        const next = useInstantTicket(run, type);
        if (next === run) return;

        pendingSniperRunRef.current = next;
        sniperAnimTokenRef.current += 1;
        setSniperShotAnim({
          fromCell: run.playerPosition,
          toCell: targetCell,
          token: sniperAnimTokenRef.current,
        });
        return;
      }

      setRun((r) => (r ? useInstantTicket(r, type) : r));
    },
    [run, settings.animations],
  );

  const handleSellInstantTicket = useCallback((type: InstantTicketType) => {
    if (pendingRunRef.current || pendingSniperRunRef.current) return;
    setRun((r) => (r ? sellInstantTicket(r, type) : r));
  }, []);

  const isBoardAnimating =
    playerMoveAnim !== null ||
    sniperShotAnim !== null ||
    cleaveThrowAnim !== null ||
    novaBlastAnim !== null;

  const devTools = useDevToolsApi({
    enabled: DEV_TOOLS_ENABLED,
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
  });

  return {
    screen,
    setScreen,
    goToTitle,
    restartRun,
    openAchievements,
    openSettings,
    closeSettings,
    settingsReturnScreen,
    settings,
    updateSettings,
    run,
    beginRun,
    handleChooseEndless,
    handleChooseEndRun,
    toggleChip,
    handlePlayChips,
    handleEndTurn,
    handleDiscard,
    handleBuyShopChip,
    handleRerollShop,
    handleRedeemUpgrade,
    handleLeaveShop,
    handleBuyInstantTicket,
    handleUseInstantTicket,
    handleSellInstantTicket,
    clearKillFlash,
    playerMoveAnim,
    handlePlayerMoveComplete,
    handleKillStrike,
    sniperShotAnim,
    commitPendingSniper,
    handleSniperImpact,
    cleaveThrowAnim,
    commitPendingCleave,
    handleCleaveImpact,
    novaBlastAnim,
    commitPendingNova,
    handleNovaImpact,
    isBoardAnimating,
    selectedChipSum,
    hasTeleportSelected,
    hasUtilityChipSelected,
    canPlaySelected,
    runEndStats,
    newlyUnlockedIds,
    devTools,
  };
}
