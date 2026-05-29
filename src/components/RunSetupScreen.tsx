import { GameButton } from './ui/GameButton';
import { RuinsPanel } from './ui/RuinsPanel';
import { ScreenLayout } from './ui/ScreenLayout';

interface RunSetupScreenProps {
  onBegin: () => void;
  onBack: () => void;
}

export function RunSetupScreen({ onBegin, onBack }: RunSetupScreenProps) {
  return (
    <ScreenLayout title="Run vorbereiten" subtitle="Der Loop wartet auf dich">
      <RuinsPanel className="mx-auto max-w-lg space-y-4 text-loop-muted">
        <p>
          Du bist ein <strong className="text-white">Looplord</strong> auf einem kreisförmigen
          Brett. Wirf alle Gegner vom Ring, bevor deine Züge ausgehen.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>Spiele Movement-Chips, um dich im Uhrzeigersinn zu bewegen.</li>
          <li>Landest du auf einem Gegner, fliegt er vom Brett.</li>
          <li>Nach jedem Zug bewegen sich die Gegner — pass auf deine 3 Leben auf.</li>
          <li>Nach jeder Boss-Runde wählst du ein permanentes Upgrade.</li>
          <li>Alle 5 Runden wartet ein Boss. Besiege Runde 25 für den Kampagnen-Sieg!</li>
          <li>Danach kannst du den Endlos-Modus wählen oder den Run beenden.</li>
        </ul>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <GameButton onClick={onBegin}>Run beginnen</GameButton>
          <GameButton variant="secondary" onClick={onBack}>
            Zurück
          </GameButton>
        </div>
      </RuinsPanel>
    </ScreenLayout>
  );
}
