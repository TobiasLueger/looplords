import { chiptune, unlockGameAudio } from './audio/chiptuneEngine';
import { AchievementsScreen } from './components/AchievementsScreen';
import { EndlessChoiceScreen } from './components/EndlessChoiceScreen';
import { GameScreen } from './components/GameScreen';
import { HowToPlayScreen } from './components/HowToPlayScreen';
import { RunEndScreen } from './components/RunEndScreen';
import { RunSetupScreen } from './components/RunSetupScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ShopScreen } from './components/ShopScreen';
import { TitleScreen } from './components/TitleScreen';
import type { Screen } from './game/types';
import { useGameAudio } from './hooks/useGameAudio';
import { useGameState } from './hooks/useGameState';

function settingsBackLabel(returnScreen: Screen | null): string {
  switch (returnScreen) {
    case 'game':
      return 'Zurück zum Spiel';
    case 'shop':
      return 'Zurück zum Shop';
    case 'endlessChoice':
      return 'Zurück zur Wahl';
    default:
      return 'Zurück';
  }
}

export default function App() {
  const {
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
  } = useGameState();

  useGameAudio(screen, settings);

  const unlockAnd = async (fn: () => void) => {
    if (!chiptune.isUnlocked()) {
      await unlockGameAudio();
    }
    fn();
  };

  switch (screen) {
    case 'title':
      return (
        <TitleScreen
          onStart={() => void unlockAnd(() => setScreen('runSetup'))}
          onSettings={() => void unlockAnd(() => openSettings('title'))}
          onHowToPlay={() => void unlockAnd(() => setScreen('howToPlay'))}
          onAchievements={() => void unlockAnd(openAchievements)}
        />
      );

    case 'runSetup':
      return (
        <RunSetupScreen
          onBegin={() => void unlockAnd(beginRun)}
          onBack={goToTitle}
        />
      );

    case 'settings':
      return (
        <SettingsScreen
          settings={settings}
          onUpdate={updateSettings}
          onBack={closeSettings}
          backLabel={settingsBackLabel(settingsReturnScreen)}
        />
      );

    case 'howToPlay':
      return <HowToPlayScreen onBack={goToTitle} />;

    case 'achievements':
      return <AchievementsScreen onBack={goToTitle} />;

    case 'endlessChoice':
      if (!run) return null;
      return (
        <EndlessChoiceScreen
          run={run}
          onChooseEndless={handleChooseEndless}
          onEndRun={handleChooseEndRun}
        />
      );

    case 'runEnd':
      if (!runEndStats) return null;
      return (
        <RunEndScreen
          stats={runEndStats}
          newlyUnlockedIds={newlyUnlockedIds}
          onNewRun={() => {
            void unlockAnd(beginRun);
          }}
          onTitle={goToTitle}
        />
      );

    case 'game':
      if (!run) return null;
      return (
        <GameScreen
          run={run}
          settings={settings}
          selectedChipSum={selectedChipSum}
          hasTeleportSelected={hasTeleportSelected}
          hasUtilityChipSelected={hasUtilityChipSelected}
          onToggleChip={toggleChip}
          onPlayChips={handlePlayChips}
          onDiscard={handleDiscard}
          onEndTurn={handleEndTurn}
          onClearKillFlash={clearKillFlash}
          onOpenSettings={() => openSettings('game')}
          onUseInstantTicket={handleUseInstantTicket}
        />
      );

    case 'shop':
      if (!run) return null;
      return (
        <ShopScreen
          run={run}
          onBuyChip={handleBuyShopChip}
          onReroll={handleRerollShop}
          onSelectUpgrade={handleRedeemUpgrade}
          onLeave={handleLeaveShop}
          onOpenSettings={() => openSettings('shop')}
          onBuyInstantTicket={handleBuyInstantTicket}
        />
      );

    default:
      return null;
  }
}
