import type { RunState } from '../game/types';
import { GameButton } from './ui/GameButton';
import { RuinsPanel } from './ui/RuinsPanel';
import { ScreenLayout } from './ui/ScreenLayout';

interface EndlessChoiceScreenProps {
  run: RunState;
  onChooseEndless: () => void;
  onEndRun: () => void;
}

export function EndlessChoiceScreen({
  run,
  onChooseEndless,
  onEndRun,
}: EndlessChoiceScreenProps) {
  return (
    <ScreenLayout
      title="Kampagnen-Sieg!"
      subtitle="25 Runden überstanden — der Loop gehört dir"
    >
      <RuinsPanel className="mx-auto max-w-lg space-y-6 text-center">
        <p className="text-loop-muted">
          Du hast die Kampagne gemeistert. Willst du den Loop für immer weiterdrehen
          oder deinen Run beenden?
        </p>
        <div className="grid grid-cols-3 gap-4 py-2">
          <div>
            <p className="text-2xl font-bold text-loop-accent">{run.round}</p>
            <p className="text-xs text-loop-muted">Runden</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-loop-success">
              {run.enemiesDefeatedTotal}
            </p>
            <p className="text-xs text-loop-muted">Eliminierungen</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">{run.gold}</p>
            <p className="text-xs text-loop-muted">Gold</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <GameButton onClick={onChooseEndless}>
            Endlos weiterspielen
          </GameButton>
          <p className="text-xs text-loop-muted">
            Danach öffnet sich der Shop — dann geht es ab Runde 26 weiter.
          </p>
          <GameButton variant="secondary" onClick={onEndRun}>
            Run beenden
          </GameButton>
        </div>
      </RuinsPanel>
    </ScreenLayout>
  );
}
