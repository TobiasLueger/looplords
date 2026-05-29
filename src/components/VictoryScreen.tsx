import type { VictoryStats } from '../game/types';
import { GameButton } from './ui/GameButton';
import { ScreenLayout } from './ui/ScreenLayout';

interface VictoryScreenProps {
  stats: VictoryStats;
  onNewRun: () => void;
  onTitle: () => void;
}

export function VictoryScreen({ stats, onNewRun, onTitle }: VictoryScreenProps) {
  return (
    <ScreenLayout title="Sieg!" subtitle="Der Loop ist gebrochen — du bist ein wahrer Looplord">
      <div className="panel mx-auto max-w-md space-y-4 text-center">
        <p className="text-loop-muted">
          {stats.bossDefeated
            ? 'Du hast den Boss besiegt und alle 15 Runden überstanden!'
            : 'Alle 15 Runden gemeistert!'}
        </p>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <p className="text-3xl font-bold text-loop-accent">{stats.round}</p>
            <p className="text-sm text-loop-muted">Runden</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-loop-success">{stats.enemiesDefeated}</p>
            <p className="text-sm text-loop-muted">Eliminierungen</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <GameButton onClick={onNewRun}>Neuer Run</GameButton>
          <GameButton variant="secondary" onClick={onTitle}>
            Zum Titel
          </GameButton>
        </div>
      </div>
    </ScreenLayout>
  );
}
