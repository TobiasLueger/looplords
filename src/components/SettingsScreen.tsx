import type { Difficulty, GameSettings } from '../game/types';
import { GameButton } from './ui/GameButton';
import { RuinsPanel } from './ui/RuinsPanel';
import { ScreenLayout } from './ui/ScreenLayout';
import { Toggle } from './ui/Toggle';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdate: (patch: Partial<GameSettings>) => void;
  onBack: () => void;
  backLabel?: string;
}

const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Leicht' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Schwer' },
];

export function SettingsScreen({
  settings,
  onUpdate,
  onBack,
  backLabel = 'Zurück',
}: SettingsScreenProps) {
  return (
    <ScreenLayout title="Einstellungen">
      <RuinsPanel className="mx-auto max-w-md space-y-4">
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

        <div className="rounded-lg border border-loop-border bg-loop-bg/50 p-4">
          <p className="mb-3 font-medium">Schwierigkeit</p>
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onUpdate({ difficulty: d.id })}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                  settings.difficulty === d.id
                    ? 'border-loop-accent bg-loop-accent/20 text-loop-accentHover'
                    : 'border-loop-border text-loop-muted hover:border-loop-muted'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <GameButton variant="secondary" onClick={onBack} className="mt-4">
          {backLabel}
        </GameButton>
      </RuinsPanel>
    </ScreenLayout>
  );
}
