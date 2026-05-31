import type { RunState } from '../game/types';
import { RUINS_UI } from '../utils/ruinsAssets';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneMenuButton } from './ui/StoneMenuButton';
import { StoneStatDisplay } from './ui/StoneStatDisplay';

interface EndlessChoiceScreenProps {
  run: RunState;
  onChooseEndless: () => void;
  onEndRun: () => void;
}

const bodyTextShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function EndlessChoiceScreen({
  run,
  onChooseEndless,
  onEndRun,
}: EndlessChoiceScreenProps) {
  return (
    <ScreenLayout
      title="Kampagnen-Sieg!"
      subtitle="25 Runden überstanden — der Loop gehört dir"
      titleIcon={RUINS_UI.star}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 sm:gap-10">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          <StoneStatDisplay
            icon={RUINS_UI.star}
            label="Runden"
            value={run.round}
          />
          <StoneStatDisplay
            icon={RUINS_UI.sword}
            label="Besiegt"
            value={run.enemiesDefeatedTotal}
            variant="default"
            iconClassName="origin-center scale-[1.5] -rotate-45"
          />
          <StoneStatDisplay
            icon={RUINS_UI.coin}
            label="Gold"
            value={run.gold}
            variant="default"
          />
        </div>

        <p
          className="px-4 py-2 text-center text-sm leading-relaxed text-stone-200/90 sm:px-6 sm:text-base"
          style={{ textShadow: bodyTextShadow }}
        >
          Du hast die Kampagne gemeistert. Willst du den Loop für immer weiterdrehen
          oder deinen Run beenden?
        </p>

        <div className="flex flex-col gap-4 sm:gap-5">
          <StoneMenuButton
            variant="primary"
            label="Endlos weiterspielen"
            onClick={onChooseEndless}
            className="w-full max-w-none"
          />
          <p
            className="px-4 text-center text-xs leading-relaxed text-stone-300/80 sm:text-sm"
            style={{ textShadow: bodyTextShadow }}
          >
            Shop öffnet sich — danach geht es ab Runde 26 weiter.
          </p>
          <StoneMenuButton
            label="Run beenden"
            onClick={onEndRun}
            className="w-full max-w-none"
          />
        </div>
      </div>
    </ScreenLayout>
  );
}
