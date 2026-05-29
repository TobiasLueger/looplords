import { useEffect, useState } from 'react';
import type { GameSettings, RunState } from '../game/types';
import type { InstantTicketType } from '../game/types';
import { getChipSprite } from '../utils/assets';
import { RUINS_ACTIONS, RUINS_BACKGROUNDS, RUINS_UI } from '../utils/ruinsAssets';
import { Board } from './Board';
import { ChipBagModal } from './ChipBagModal';
import { ChipHand } from './ChipHand';
import { EventLog } from './EventLog';
import { InstantTicketsPanel } from './InstantTicketsPanel';
import { StatIcon } from './StatIcon';
import { RuinsPanel } from './ui/RuinsPanel';
import { SpriteGameButton } from './ui/SpriteGameButton';

interface GameScreenProps {
  run: RunState;
  settings: GameSettings;
  selectedChipSum: number;
  hasTeleportSelected: boolean;
  hasUtilityChipSelected: boolean;
  onToggleChip: (id: string) => void;
  onPlayChips: () => void;
  onDiscard: () => void;
  onEndTurn: () => void;
  onClearKillFlash: () => void;
  onOpenSettings: () => void;
  onUseInstantTicket: (type: InstantTicketType) => void;
}

export function GameScreen({
  run,
  settings,
  selectedChipSum,
  hasTeleportSelected,
  hasUtilityChipSelected,
  onToggleChip,
  onPlayChips,
  onDiscard,
  onEndTurn,
  onClearKillFlash,
  onOpenSettings,
  onUseInstantTicket,
}: GameScreenProps) {
  const [showBag, setShowBag] = useState(false);

  useEffect(() => {
    if (!run.lastKillFlash) return;
    const t = setTimeout(onClearKillFlash, 500);
    return () => clearTimeout(t);
  }, [run.lastKillFlash, onClearKillFlash]);

  const canPlay =
    run.selectedChipIds.length > 0 &&
    run.turnsRemaining > 0 &&
    (selectedChipSum > 0 || hasTeleportSelected || hasUtilityChipSelected);

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
          <div className="flex flex-wrap items-start gap-2">
            <button
              type="button"
              onClick={onOpenSettings}
              className="rounded-lg border border-loop-border bg-loop-panel/80 px-3 py-2 text-sm text-loop-muted transition hover:border-loop-muted hover:text-white"
              aria-label="Einstellungen"
              title="Einstellungen"
            >
              ⚙
            </button>
            <div className="flex flex-wrap gap-2">
              <StatIcon
                icon={RUINS_UI.coin}
                label="Gold"
                value={run.gold}
                valueClassName="text-loop-accent"
              />
              <StatIcon icon={RUINS_UI.star} label="Züge" value={run.turnsRemaining} />
              <StatIcon icon={RUINS_UI.sign} label="Abwürfe" value={run.discardsRemaining} />
              <StatIcon icon={RUINS_UI.sign} label="Gegner" value={run.enemies.length} />
            </div>
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
          <div className="order-1 overflow-visible lg:order-1">
            <Board
              run={run}
              animations={settings.animations}
              difficulty={settings.difficulty}
            />
          </div>

          <div className="order-2 flex flex-col gap-3 lg:order-2">
            <ChipHand
              hand={run.hand}
              selectedIds={run.selectedChipIds}
              onToggle={onToggleChip}
              animations={settings.animations}
            />

            {(selectedChipSum > 0 ||
              hasTeleportSelected ||
              hasUtilityChipSelected) && (
              <p className="text-center text-sm text-loop-accent">
                {selectedChipSum > 0 && `Bewegung: ${selectedChipSum} Schritt(e)`}
                {hasTeleportSelected && ' + Teleport'}
                {hasUtilityChipSelected && ' + Spezial'}
              </p>
            )}

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
                  label="Abwerfen / Neu ziehen"
                  onClick={onDiscard}
                  disabled={run.discardsRemaining <= 0}
                />
                <SpriteGameButton
                  icon={RUINS_ACTIONS.endTurn}
                  label="Zug beenden"
                  onClick={onEndTurn}
                  disabled={run.turnsRemaining <= 0}
                />
              </div>
            </RuinsPanel>

            <InstantTicketsPanel
              tickets={run.instantTickets}
              mode="use"
              onUse={onUseInstantTicket}
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
