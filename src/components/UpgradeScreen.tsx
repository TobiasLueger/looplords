import type { UpgradeDefinition } from '../game/upgrades';
import { GameButton } from './ui/GameButton';
import { ScreenLayout } from './ui/ScreenLayout';

interface UpgradeScreenProps {
  options: UpgradeDefinition[];
  round: number;
  onSelect: (id: string) => void;
}

export function UpgradeScreen({ options, round, onSelect }: UpgradeScreenProps) {
  return (
    <ScreenLayout
      title="Upgrade wählen"
      subtitle={`Runde ${round} geschafft — wähle eine Belohnung`}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className="panel group text-left transition hover:border-loop-accent hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]"
          >
            <h3 className="font-display text-lg text-loop-accent group-hover:text-loop-accentHover">
              {opt.name}
            </h3>
            <p className="mt-2 text-sm text-loop-muted">{opt.description}</p>
            <span className="mt-4 inline-block text-xs text-loop-accent">Auswählen →</span>
          </button>
        ))}
      </div>
      {options.length === 0 && (
        <div className="text-center">
          <GameButton disabled>Keine Upgrades verfügbar</GameButton>
        </div>
      )}
    </ScreenLayout>
  );
}
