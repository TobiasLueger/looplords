import type { GameOverStats } from '../game/types';
import { GameButton } from './ui/GameButton';
import { ScreenLayout } from './ui/ScreenLayout';

interface GameOverScreenProps {
  stats: GameOverStats;
  onRetry: () => void;
  onTitle: () => void;
}

export function GameOverScreen({ stats, onRetry, onTitle }: GameOverScreenProps) {
  return (
    <ScreenLayout title="Game Over" subtitle={stats.reason}>
      <div className="panel mx-auto max-w-md space-y-4 text-center">
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <p className="text-3xl font-bold text-loop-accent">{stats.round}</p>
            <p className="text-sm text-loop-muted">Erreichte Runde</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-loop-success">{stats.enemiesDefeated}</p>
            <p className="text-sm text-loop-muted">Besiegte Gegner</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <GameButton onClick={onRetry}>Nochmal versuchen</GameButton>
          <GameButton variant="secondary" onClick={onTitle}>
            Zum Titel
          </GameButton>
        </div>
      </div>
    </ScreenLayout>
  );
}
