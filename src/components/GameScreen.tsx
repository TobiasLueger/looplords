import { useEffect, useState } from 'react';
import type { GameSettings, RunState } from '../game/types';
import type { InstantTicketType } from '../game/types';
import type { PlayerMoveRequest } from '../hooks/usePlayerHopAnimation';
import type { ProjectileShotRequest } from '../hooks/useProjectileShotAnimation';
import type { NovaBlastRequest } from '../hooks/useNovaBlastAnimation';
import { getChipSprite } from '../utils/assets';
import { RUINS_ACTIONS, RUINS_BACKGROUNDS, RUINS_UI } from '../utils/ruinsAssets';
import { Board } from './Board';
import { ChipBagModal } from './ChipBagModal';
import { ChipHand } from './ChipHand';
import { EventLog } from './EventLog';
import { InstantTicketsPanel } from './InstantTicketsPanel';
import { RuinsPanel } from './ui/RuinsPanel';
import { SpriteGameButton } from './ui/SpriteGameButton';
import { StoneMenuButton } from './ui/StoneMenuButton';
import { StoneStatDisplay } from './ui/StoneStatDisplay';

interface GameScreenProps {
  run: RunState;
  settings: GameSettings;
  selectedChipSum: number;
  hasTeleportSelected: boolean;
  hasUtilityChipSelected: boolean;
  canPlaySelected: boolean;
  onToggleChip: (id: string) => void;
  onPlayChips: () => void;
  onDiscard: () => void;
  onEndTurn: () => void;
  onClearKillFlash: () => void;
  onOpenSettings: () => void;
  onUseInstantTicket: (type: InstantTicketType) => void;
  onSellInstantTicket: (type: InstantTicketType) => void;
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
  isBoardAnimating: boolean;
}

export function GameScreen({
  run,
  settings,
  selectedChipSum,
  hasTeleportSelected,
  hasUtilityChipSelected,
  canPlaySelected,
  onToggleChip,
  onPlayChips,
  onDiscard,
  onEndTurn,
  onClearKillFlash,
  onOpenSettings,
  onUseInstantTicket,
  onSellInstantTicket,
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
  isBoardAnimating,
}: GameScreenProps) {
  const [showBag, setShowBag] = useState(false);

  useEffect(() => {
    if (!run.lastKillFlash) return;
    const t = setTimeout(onClearKillFlash, 500);
    return () => clearTimeout(t);
  }, [run.lastKillFlash, onClearKillFlash]);

  const canPlay =
    !isBoardAnimating && canPlaySelected;

  const hearts = Array.from({ length: run.maxLives }, (_, i) => i < run.lives);

  return (
    <div
      className="screen-bg relative min-h-screen px-2 py-3 sm:px-4 sm:py-4"
      style={{ backgroundImage: `url(${RUINS_BACKGROUNDS.menu})` }}
    >
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex-1">
            <h1 className="font-display text-xl text-loop-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-2xl">
              Runde {run.round}
              {run.endlessMode && (
                <span className="ml-2 text-sm text-cyan-400">ENDLOS</span>
              )}
              {run.round % 5 === 0 && (
                <span className="ml-2 text-sm text-amber-400">BOSS</span>
              )}
            </h1>
            <p className="text-xs text-loop-muted sm:text-sm">
              Ziel: alle Gegner eliminieren
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <StoneStatDisplay
                icon={RUINS_UI.coin}
                label="Gold"
                value={run.gold}
                variant="primary"
                size="compact"
              />
              <StoneStatDisplay
                icon={RUINS_UI.star}
                label="Züge"
                value={run.turnsRemaining}
                variant="default"
                size="compact"
              />
              <StoneStatDisplay
                icon={RUINS_ACTIONS.discardRedraw}
                label="Abwürfe"
                value={run.discardsRemaining}
                variant="default"
                size="compact"
              />
              <StoneStatDisplay
                icon={RUINS_UI.sword}
                label="Gegner"
                value={run.enemies.length}
                variant="default"
                size="compact"
                iconClassName="origin-center scale-[1.5] -rotate-45"
              />
            </div>
            <StoneMenuButton
              label="Einstellungen"
              onClick={onOpenSettings}
              className="h-[3.25rem] w-auto max-w-none shrink-0 sm:h-14 sm:max-w-none"
            />
          </div>
        </header>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-loop-muted">Leben:</span>
          {hearts.map((alive, i) =>
            alive ? (
              <img
                key={i}
                src={RUINS_UI.life}
                alt=""
                className="h-6 w-6 object-contain drop-shadow"
                draggable={false}
              />
            ) : (
              <span key={i} className="h-6 w-6 opacity-30 grayscale">
                <img
                  src={RUINS_UI.life}
                  alt=""
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </span>
            ),
          )}
          {run.shield > 0 && (
            <span className="ml-2 rounded bg-blue-900/50 px-2 py-0.5 text-xs text-blue-300">
              Schild {run.shield}
            </span>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_minmax(280px,360px)]">
          <div className="order-1 self-start overflow-visible lg:order-1">
            <Board
              run={run}
              animations={settings.animations}
              playerMoveRequest={playerMoveRequest}
              onPlayerMoveComplete={onPlayerMoveComplete}
              onKillStrike={onKillStrike}
              sniperShotRequest={sniperShotRequest}
              onSniperShotComplete={onSniperShotComplete}
              onSniperImpact={onSniperImpact}
              cleaveThrowRequest={cleaveThrowRequest}
              onCleaveThrowComplete={onCleaveThrowComplete}
              onCleaveImpact={onCleaveImpact}
              novaBlastRequest={novaBlastRequest}
              onNovaBlastComplete={onNovaBlastComplete}
              onNovaImpact={onNovaImpact}
            />
          </div>

          <div className="order-2 flex flex-col gap-3 lg:order-2">
            <ChipHand
              hand={run.hand}
              selectedIds={run.selectedChipIds}
              onToggle={onToggleChip}
              animations={settings.animations}
            />

            <p className="flex h-5 items-center justify-center text-center text-sm leading-5 text-loop-accent">
              {selectedChipSum > 0 && `Bewegung: ${selectedChipSum} Schritt(e)`}
              {selectedChipSum < 0 &&
                `Bewegung: ${Math.abs(selectedChipSum)} Schritt(e) zurück`}
              {hasTeleportSelected && ' + Teleport'}
              {hasUtilityChipSelected && ' + Spezial'}
            </p>

            <RuinsPanel>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <SpriteGameButton
                  variant="primary"
                  icon={getChipSprite()}
                  label="Chips spielen"
                  onClick={onPlayChips}
                  disabled={!canPlay}
                />
                <SpriteGameButton
                  icon={RUINS_ACTIONS.chipBag}
                  label={`Beutel (${run.deck.length})`}
                  onClick={() => setShowBag(true)}
                />
                <SpriteGameButton
                  icon={RUINS_ACTIONS.discardRedraw}
                  label="Auswahl abwerfen"
                  onClick={onDiscard}
                  disabled={
                    isBoardAnimating ||
                    run.discardsRemaining <= 0 ||
                    run.selectedChipIds.length === 0
                  }
                />
                <SpriteGameButton
                  icon={RUINS_ACTIONS.endTurn}
                  label="Zug beenden"
                  onClick={onEndTurn}
                  disabled={isBoardAnimating || run.turnsRemaining <= 0}
                />
              </div>
            </RuinsPanel>

            <InstantTicketsPanel
              tickets={run.instantTickets}
              mode="use"
              onUse={onUseInstantTicket}
              onSell={onSellInstantTicket}
            />

            {showBag && (
              <ChipBagModal run={run} onClose={() => setShowBag(false)} />
            )}

            <EventLog events={run.eventLog} />
          </div>
        </div>
      </div>
    </div>
  );
}
