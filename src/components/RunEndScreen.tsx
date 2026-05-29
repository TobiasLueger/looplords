import { getAchievementById } from '../game/achievements';
import type { RunEndStats } from '../game/types';
import { RUINS_UI } from '../utils/ruinsAssets';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneGroundSurface } from './ui/StoneGroundSurface';
import { StoneMenuButton } from './ui/StoneMenuButton';
import { StoneStatDisplay } from './ui/StoneStatDisplay';

interface RunEndScreenProps {
  stats: RunEndStats;
  newlyUnlockedIds: string[];
  onNewRun: () => void;
  onTitle: () => void;
}

const bodyTextShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

const sectionTitleShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function RunEndScreen({
  stats,
  newlyUnlockedIds,
  onNewRun,
  onTitle,
}: RunEndScreenProps) {
  const title = stats.won ? 'Sieg!' : 'Game Over';
  const subtitle = stats.won
    ? stats.endlessMode
      ? 'Der Endlos-Run ist vorbei'
      : 'Kampagne abgeschlossen — du bist ein wahrer Looplord'
    : stats.reason ?? 'Der Loop hat dich eingeholt';

  return (
    <ScreenLayout
      title={title}
      subtitle={subtitle}
      titleIcon={stats.won ? RUINS_UI.star : RUINS_UI.sign}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
        <div className="flex flex-wrap justify-center gap-3">
          <StoneStatDisplay
            icon={RUINS_UI.star}
            label="Runden"
            value={stats.round}
          />
          <StoneStatDisplay
            icon={RUINS_UI.sign}
            label="Eliminierungen"
            value={stats.enemiesDefeated}
            variant="default"
          />
        </div>

        <StoneGroundSurface>
          <p
            className="px-4 pb-2 pt-3.5 font-display text-base font-bold text-white/95 sm:px-5 sm:text-lg"
            style={{ textShadow: sectionTitleShadow }}
          >
            Achievements
          </p>
          {newlyUnlockedIds.length === 0 ? (
            <p
              className="px-4 pb-4 text-sm text-stone-200/90 sm:px-5 sm:pb-5 sm:text-base"
              style={{ textShadow: bodyTextShadow }}
            >
              Keine neuen Achievements in diesem Lauf.
            </p>
          ) : (
            <ul className="flex flex-col gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
              {newlyUnlockedIds.map((id) => {
                const def = getAchievementById(id);
                if (!def) return null;
                return (
                  <li key={id}>
                    <StoneGroundSurface variant="primary">
                      <div className="px-4 py-3 sm:px-5 sm:py-3.5">
                        <p
                          className="font-display text-base font-bold text-loop-accentHover sm:text-lg"
                          style={{ textShadow: sectionTitleShadow }}
                        >
                          {def.name}
                        </p>
                        <p
                          className="mt-1 text-sm text-stone-200/90"
                          style={{ textShadow: bodyTextShadow }}
                        >
                          {def.description}
                        </p>
                      </div>
                    </StoneGroundSurface>
                  </li>
                );
              })}
            </ul>
          )}
        </StoneGroundSurface>

        <StoneMenuButton
          variant="primary"
          label="Neuer Run"
          onClick={onNewRun}
          className="w-full max-w-none"
        />
        <StoneMenuButton
          label="Zum Titel"
          onClick={onTitle}
          className="w-full max-w-none"
        />
      </div>
    </ScreenLayout>
  );
}
