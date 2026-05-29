import { ACHIEVEMENTS } from '../game/achievements';
import { loadAchievementSave } from '../game/achievementStorage';
import { GameButton } from './ui/GameButton';
import { ScreenLayout } from './ui/ScreenLayout';

interface AchievementsScreenProps {
  onBack: () => void;
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const save = loadAchievementSave();
  const unlocked = new Set(save.unlockedIds);

  return (
    <ScreenLayout title="Achievements" subtitle="Deine Erfolge im Loop">
      <div className="mx-auto max-w-lg space-y-3">
        {ACHIEVEMENTS.map((def) => {
          const isUnlocked = unlocked.has(def.id);
          const unlockedAt = save.unlockedAt[def.id];

          return (
            <div
              key={def.id}
              className={`panel panel-ruins flex gap-3 ${
                isUnlocked ? 'border-loop-accent/30' : 'opacity-90'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl font-bold ${
                  isUnlocked
                    ? 'bg-loop-accent/20 text-loop-accent'
                    : 'bg-loop-border/50 text-loop-muted'
                }`}
              >
                {isUnlocked ? '✓' : '?'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">
                  {isUnlocked ? def.name : '?'}
                </h3>
                <p className="text-sm text-loop-muted">
                  {isUnlocked ? def.description : '???'}
                </p>
                {isUnlocked && unlockedAt && (
                  <p className="mt-1 text-[10px] text-loop-muted">
                    {new Date(unlockedAt).toLocaleDateString('de-DE')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <GameButton variant="secondary" onClick={onBack} className="mt-6 w-full">
          Zurück
        </GameButton>
      </div>
    </ScreenLayout>
  );
}
