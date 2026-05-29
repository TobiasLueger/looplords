import { ACHIEVEMENTS } from '../game/achievements';
import { loadAchievementSave } from '../game/achievementStorage';
import { RUINS_UI } from '../utils/ruinsAssets';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneGroundSurface } from './ui/StoneGroundSurface';
import { StoneMenuButton } from './ui/StoneMenuButton';
import { StoneStatDisplay } from './ui/StoneStatDisplay';

interface AchievementsScreenProps {
  onBack: () => void;
}

const bodyTextShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

const sectionTitleShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const save = loadAchievementSave();
  const unlocked = new Set(save.unlockedIds);
  const unlockedCount = ACHIEVEMENTS.filter((def) => unlocked.has(def.id)).length;

  return (
    <ScreenLayout
      title="Achievements"
      subtitle="Deine Erfolge im Loop"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
        <div className="flex justify-center">
          <StoneStatDisplay
            icon={RUINS_UI.star}
            label="Freigeschaltet"
            value={`${unlockedCount}/${ACHIEVEMENTS.length}`}
          />
        </div>

        <StoneGroundSurface scrollable className="max-h-[min(70vh,720px)]">
          <ul className="flex flex-col gap-2 px-3 py-3 sm:px-4 sm:py-4">
            {ACHIEVEMENTS.map((def) => {
              const isUnlocked = unlocked.has(def.id);
              const unlockedAt = save.unlockedAt[def.id];

              return (
                <li key={def.id}>
                  <StoneGroundSurface
                    variant={isUnlocked ? 'primary' : 'default'}
                    className={isUnlocked ? '' : 'opacity-85'}
                  >
                    <div className="flex gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-black/30 font-display text-lg font-bold ${
                          isUnlocked
                            ? 'bg-black/20 text-loop-accentHover'
                            : 'bg-black/30 text-stone-400/90'
                        }`}
                        style={{ textShadow: sectionTitleShadow }}
                        aria-hidden
                      >
                        {isUnlocked ? '✓' : '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-display text-base font-bold sm:text-lg ${
                            isUnlocked ? 'text-loop-accentHover' : 'text-stone-300/90'
                          }`}
                          style={{ textShadow: sectionTitleShadow }}
                        >
                          {isUnlocked ? def.name : '?'}
                        </p>
                        <p
                          className="mt-1 text-sm text-stone-200/90"
                          style={{ textShadow: bodyTextShadow }}
                        >
                          {isUnlocked ? def.description : '???'}
                        </p>
                        {isUnlocked && unlockedAt && (
                          <p
                            className="mt-1.5 text-[10px] uppercase tracking-wide text-stone-300/70 sm:text-xs"
                            style={{ textShadow: bodyTextShadow }}
                          >
                            {new Date(unlockedAt).toLocaleDateString('de-DE')}
                          </p>
                        )}
                      </div>
                    </div>
                  </StoneGroundSurface>
                </li>
              );
            })}
          </ul>
        </StoneGroundSurface>

        <StoneMenuButton label="Zurück" onClick={onBack} className="w-full max-w-none" />
      </div>
    </ScreenLayout>
  );
}
