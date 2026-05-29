import { ScreenLayout } from './ui/ScreenLayout';
import { StoneGroundSurface } from './ui/StoneGroundSurface';
import { StoneMenuButton } from './ui/StoneMenuButton';

interface RunSetupScreenProps {
  onBegin: () => void;
  onBack: () => void;
}

const bodyTextShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function RunSetupScreen({ onBegin, onBack }: RunSetupScreenProps) {
  return (
    <ScreenLayout title="Run vorbereiten" subtitle="Der Loop wartet auf dich">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
        <StoneGroundSurface>
          <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
            <p
              className="text-sm leading-relaxed text-stone-200/95 sm:text-base"
              style={{ textShadow: bodyTextShadow }}
            >
              Du bist ein{' '}
              <strong className="font-bold text-loop-accentHover">Looplord</strong> auf einem
              kreisförmigen Brett. Wirf alle Gegner vom Ring, bevor deine Züge ausgehen.
            </p>
            <ul
              className="list-inside list-disc space-y-2 text-sm text-stone-200/90 sm:text-base"
              style={{ textShadow: bodyTextShadow }}
            >
              <li>Spiele Movement-Chips, um dich im Uhrzeigersinn zu bewegen.</li>
              <li>Landest du auf einem Gegner, fliegt er vom Brett.</li>
              <li>Nach jedem Zug bewegen sich die Gegner — pass auf deine 3 Leben auf.</li>
              <li>Nach jeder Boss-Runde wählst du ein permanentes Upgrade.</li>
              <li>Alle 5 Runden wartet ein Boss. Besiege Runde 25 für den Kampagnen-Sieg!</li>
              <li>Danach kannst du den Endlos-Modus wählen oder den Run beenden.</li>
            </ul>
          </div>
        </StoneGroundSurface>

        <StoneMenuButton
          variant="primary"
          label="Run beginnen"
          onClick={onBegin}
          className="w-full max-w-none"
        />
        <StoneMenuButton label="Zurück" onClick={onBack} className="w-full max-w-none" />
      </div>
    </ScreenLayout>
  );
}
