import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildRunEndStats,
  evaluateNewAchievements,
} from '../game/achievements';
import {
  createInitialRunState,
  discardAndRedraw,
  endTurn,
  getGameOverReason,
  isCampaignCompletePending,
  isGameOver,
  openEndlessShop,
  playChips,
  toggleChipSelection,
} from '../game/gameLogic';
import { sumSelectedChipSteps, isUtilityChip } from '../game/chipDisplay';
import type { InstantTicketType, RunEndStats, RunState, Screen } from '../game/types';
import {
  buyInstantTicket,
  buyShopChip,
  leaveShop,
  redeemUpgradeTicket,
  rerollShopOffers,
  useInstantTicket,
} from '../game/shopActions';
import type { GameSettings } from '../game/types';
import { chiptune } from '../audio/chiptuneEngine';

const SETTINGS_KEY = 'looplords-settings';

const defaultSettings: GameSettings = {
  music: true,
  sound: true,
  animations: true,
  difficulty: 'normal',
};

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
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

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const finishRun = useCallback(
    (currentRun: RunState, won: boolean, reason?: string) => {
      const endStats = buildRunEndStats(currentRun, won, reason);
      const newly = evaluateNewAchievements(currentRun, settings, endStats);
      setRunEndStats(endStats);
      setNewlyUnlockedIds(newly);
      setRun(null);
      setScreen('runEnd');
    },
    [settings],
  );

  const beginRun = useCallback(() => {
    const state = createInitialRunState([]);
    setRun(state);
    setRunEndStats(null);
    setNewlyUnlockedIds([]);
    setScreen('game');
  }, []);

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
    setRun(null);
    setRunEndStats(null);
    setNewlyUnlockedIds([]);
    setSettingsReturnScreen(null);
    setScreen('title');
  }, []);

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
    setRun((r) => (r ? toggleChipSelection(r, chipId) : r));
  }, []);

  const handlePlayChips = useCallback(() => {
    setRun((r) => {
      if (!r) return r;
      const prevKills = r.killsThisRound;
      const next = playChips(r, settings.difficulty);
      if (settings.sound) {
        if (next.killsThisRound > prevKills) {
          chiptune.playSfx('kill');
        } else {
          chiptune.playSfx('chip');
        }
      }
      return next;
    });
  }, [settings.difficulty, settings.sound]);

  const handleEndTurn = useCallback(() => {
    setRun((r) => (r ? endTurn(r, settings.difficulty) : r));
  }, [settings.difficulty]);

  const handleDiscard = useCallback(() => {
    setRun((r) => (r ? discardAndRedraw(r) : r));
  }, []);

  const handleBuyShopChip = useCallback((offerId: string) => {
    setRun((r) => (r ? buyShopChip(r, offerId) : r));
  }, []);

  const handleRerollShop = useCallback(() => {
    setRun((r) => (r ? rerollShopOffers(r) : r));
  }, []);

  const handleRedeemUpgrade = useCallback((upgradeId: string) => {
    setRun((r) => (r ? redeemUpgradeTicket(r, upgradeId) : r));
  }, []);

  const handleLeaveShop = useCallback(() => {
    setRun((r) => (r ? leaveShop(r, settings.difficulty) : r));
    setScreen('game');
  }, [settings.difficulty]);

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

  const handleBuyInstantTicket = useCallback((type: InstantTicketType) => {
    setRun((r) => (r ? buyInstantTicket(r, type) : r));
  }, []);

  const handleUseInstantTicket = useCallback((type: InstantTicketType) => {
    setRun((r) => (r ? useInstantTicket(r, type) : r));
  }, []);

  return {
    screen,
    setScreen,
    goToTitle,
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
    clearKillFlash,
    selectedChipSum,
    hasTeleportSelected,
    hasUtilityChipSelected,
    runEndStats,
    newlyUnlockedIds,
  };
}
