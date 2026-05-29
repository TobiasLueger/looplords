import type { GameSettings } from '../game/types';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneGroundSurface } from './ui/StoneGroundSurface';
import { StoneMenuButton } from './ui/StoneMenuButton';
import { Toggle } from './ui/Toggle';
import { VolumeSlider } from './ui/VolumeSlider';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdate: (patch: Partial<GameSettings>) => void;
  onBack: () => void;
  backLabel?: string;
  showRunActions?: boolean;
  onGoToTitle?: () => void;
  onRestartRun?: () => void;
}

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
        <VolumeSlider
          label="Musiklautstärke"
          value={settings.musicVolume}
          onChange={(musicVolume) => onUpdate({ musicVolume })}
          disabled={!settings.music}
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
