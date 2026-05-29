import { getAchievementById } from '../game/achievements';
import type { RunEndStats } from '../game/types';
import { GameButton } from './ui/GameButton';
import { RuinsPanel } from './ui/RuinsPanel';
import { ScreenLayout } from './ui/ScreenLayout';

interface RunEndScreenProps {
  stats: RunEndStats;
  newlyUnlockedIds: string[];
  onNewRun: () => void;
  onTitle: () => void;
}

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
    <ScreenLayout title={title} subtitle={subtitle}>
      <RuinsPanel className="mx-auto max-w-md space-y-5">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-loop-accent">{stats.round}</p>
            <p className="text-sm text-loop-muted">Runden</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-loop-success">
              {stats.enemiesDefeated}
            </p>
            <p className="text-sm text-loop-muted">Eliminierungen</p>
          </div>
        </div>

        <section>
          <h2 className="mb-3 font-display text-lg text-loop-accent">
            Achievements
          </h2>
          {newlyUnlockedIds.length === 0 ? (
            <p className="text-sm text-loop-muted">
              Keine neuen Achievements in diesem Lauf.
            </p>
          ) : (
            <ul className="space-y-2">
              {newlyUnlockedIds.map((id) => {
                const def = getAchievementById(id);
                if (!def) return null;
                return (
                  <li
                    key={id}
                    className="rounded-lg border border-loop-accent/40 bg-loop-accent/10 px-3 py-2"
                  >
                    <p className="font-semibold text-loop-accent">{def.name}</p>
                    <p className="text-xs text-loop-muted">{def.description}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-3 pt-2">
          <GameButton onClick={onNewRun}>Neuer Run</GameButton>
          <GameButton variant="secondary" onClick={onTitle}>
            Zum Titel
          </GameButton>
        </div>
      </RuinsPanel>
    </ScreenLayout>
  );
}
