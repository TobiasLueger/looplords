import type { Difficulty, GameSettings } from '../game/types';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneGroundSurface } from './ui/StoneGroundSurface';
import { StoneMenuButton } from './ui/StoneMenuButton';
import { Toggle } from './ui/Toggle';
import { ENTITY_CELL_GROUND } from '../utils/ruinsAssets';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdate: (patch: Partial<GameSettings>) => void;
  onBack: () => void;
  backLabel?: string;
  showRunActions?: boolean;
  onGoToTitle?: () => void;
  onRestartRun?: () => void;
}

const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Leicht' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Schwer' },
];

const optionLabelShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function SettingsScreen({
  settings,
  onUpdate,
  onBack,
  backLabel = 'Zurück',
  showRunActions = false,
  onGoToTitle,
  onRestartRun,
}: SettingsScreenProps) {
  return (
    <ScreenLayout title="Einstellungen">
      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        <Toggle
          label="Musik"
          checked={settings.music}
          onChange={(music) => onUpdate({ music })}
        />
        <Toggle
          label="Sound"
          checked={settings.sound}
          onChange={(sound) => onUpdate({ sound })}
        />
        <Toggle
          label="Animationen"
          checked={settings.animations}
          onChange={(animations) => onUpdate({ animations })}
        />

        <StoneGroundSurface>
          <p
            className="px-4 pb-2 pt-3.5 font-display text-base font-bold text-white/95 sm:px-5 sm:text-lg"
            style={{ textShadow: optionLabelShadow }}
          >
            Schwierigkeit
          </p>
          <div className="flex gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
            {difficulties.map((d) => {
              const selected = settings.difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onUpdate({ difficulty: d.id })}
                  className={`stone-menu-btn group relative flex flex-1 items-center justify-center overflow-hidden rounded-md border-0 bg-transparent py-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.55)] transition duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                    selected ? 'stone-menu-btn-primary' : ''
                  }`}
                >
                  <span
                    aria-hidden
                    className={`stone-menu-btn__tiles absolute inset-0 transition duration-200 group-hover:brightness-110 ${
                      selected ? 'stone-menu-btn__tiles--primary' : ''
                    }`}
                    style={{ backgroundImage: `url(${ENTITY_CELL_GROUND})` }}
                  />
                  <span
                    className={`relative z-10 px-2 font-display text-sm font-bold sm:text-base ${
                      selected ? 'text-loop-accentHover' : 'text-white/95'
                    }`}
                    style={{ textShadow: optionLabelShadow }}
                  >
                    {d.label}
                  </span>
                </button>
              );
            })}
          </div>
        </StoneGroundSurface>

        {showRunActions && onGoToTitle && onRestartRun && (
          <StoneGroundSurface>
            <p
              className="px-4 pb-2 pt-3.5 font-display text-base font-bold text-white/95 sm:px-5 sm:text-lg"
              style={{ textShadow: optionLabelShadow }}
            >
              Aktueller Run
            </p>
            <div className="flex flex-col gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
              <StoneMenuButton
                label="Run neu starten"
                description="Neues Spiel — Fortschritt des aktuellen Runs geht verloren."
                onClick={onRestartRun}
                variant="primary"
                className="w-full max-w-none"
              />
              <StoneMenuButton
                label="Zum Titelmenü"
                description="Run beenden und zurück zum Hauptmenü."
                onClick={onGoToTitle}
                className="w-full max-w-none"
              />
            </div>
          </StoneGroundSurface>
        )}

        <StoneMenuButton
          label={backLabel}
          onClick={onBack}
          className="mt-2 w-full max-w-none"
        />
      </div>
    </ScreenLayout>
  );
}
