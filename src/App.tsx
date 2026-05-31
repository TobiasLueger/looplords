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
import { DevToolsPanel } from './components/dev/DevToolsPanel';
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
    runEndStats,
    newlyUnlockedIds,
    devTools,
  } = useGameState();

  useGameAudio(screen, settings);

  const unlockAnd = async (fn: () => void) => {
    if (!chiptune.isUnlocked()) {
      await unlockGameAudio();
    }
    fn();
  };

  let content: React.ReactNode;

  switch (screen) {
    case 'title':
      content = (
        <TitleScreen
          onStart={() => void unlockAnd(() => setScreen('runSetup'))}
          onSettings={() => void unlockAnd(() => openSettings('title'))}
          onHowToPlay={() => void unlockAnd(() => setScreen('howToPlay'))}
          onAchievements={() => void unlockAnd(openAchievements)}
        />
      );
      break;

    case 'runSetup':
      content = (
        <RunSetupScreen
          onBegin={() => void unlockAnd(beginRun)}
          onBack={goToTitle}
        />
      );
      break;

    case 'settings':
      content = (
        <SettingsScreen
          settings={settings}
          onUpdate={updateSettings}
          onBack={closeSettings}
          backLabel={settingsBackLabel(settingsReturnScreen)}
          showRunActions={run != null}
          onGoToTitle={goToTitle}
          onRestartRun={restartRun}
        />
      );
      break;

    case 'howToPlay':
      content = <HowToPlayScreen onBack={goToTitle} />;
      break;

    case 'achievements':
      content = <AchievementsScreen onBack={goToTitle} />;
      break;

    case 'endlessChoice':
      content = !run ? null : (
        <EndlessChoiceScreen
          run={run}
          onChooseEndless={handleChooseEndless}
          onEndRun={handleChooseEndRun}
        />
      );
      break;

    case 'runEnd':
      content = !runEndStats ? null : (
        <RunEndScreen
          stats={runEndStats}
          newlyUnlockedIds={newlyUnlockedIds}
          onNewRun={() => {
            void unlockAnd(beginRun);
          }}
          onTitle={goToTitle}
        />
      );
      break;

    case 'game':
      content = !run ? null : (
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
          onSellInstantTicket={handleSellInstantTicket}
          playerMoveRequest={playerMoveAnim}
          onPlayerMoveComplete={handlePlayerMoveComplete}
          onKillStrike={handleKillStrike}
          sniperShotRequest={sniperShotAnim}
          onSniperShotComplete={commitPendingSniper}
          onSniperImpact={handleSniperImpact}
          cleaveThrowRequest={cleaveThrowAnim}
          onCleaveThrowComplete={commitPendingCleave}
          onCleaveImpact={handleCleaveImpact}
          novaBlastRequest={novaBlastAnim}
          onNovaBlastComplete={commitPendingNova}
          onNovaImpact={handleNovaImpact}
          isBoardAnimating={isBoardAnimating}
        />
      );
      break;

    case 'shop':
      content = !run ? null : (
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
      break;

    default:
      content = null;
  }

  return (
    <>
      {content}
      {devTools && (
        <DevToolsPanel
          api={devTools}
          screen={screen}
          run={run}
          settings={settings}
          updateSettings={updateSettings}
        />
      )}
    </>
  );
}
