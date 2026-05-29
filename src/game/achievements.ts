import type { GameSettings, RunEndStats, RunState } from './types';
import { CAMPAIGN_WIN_ROUND } from './constants';
import { getUnlockedIds, unlockAchievementIds } from './achievementStorage';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'campaign_complete',
    name: 'Looplord',
    description: 'Die Kampagne (25 Runden) abgeschlossen.',
  },
  {
    id: 'endless_enter',
    name: 'Jenseits des Loops',
    description: 'Den Endlos-Modus gewählt.',
  },
  {
    id: 'endless_round_30',
    name: 'Ewiger Wanderer',
    description: 'Runde 30 im Endlos-Modus erreicht.',
  },
  {
    id: 'endless_round_40',
    name: 'Unendliche Schleife',
    description: 'Runde 40 im Endlos-Modus erreicht.',
  },
  {
    id: 'boss_defeated',
    name: 'Bossbezwinger',
    description: 'Einen Boss besiegt.',
  },
  {
    id: 'reach_round_10',
    name: 'Zehnter Kreis',
    description: 'Runde 10 in einem Run erreicht.',
  },
  {
    id: 'kills_50',
    name: 'Henker',
    description: '50 Gegner in einem Run eliminiert.',
  },
  {
    id: 'kills_100',
    name: 'Auslöscher',
    description: '100 Gegner in einem Run eliminiert.',
  },
  {
    id: 'gold_50',
    name: 'Schatzsucher',
    description: '50 Gold in einem Run angesammelt.',
  },
  {
    id: 'gold_100',
    name: 'Goldgier',
    description: '100 Gold in einem Run angesammelt.',
  },
  {
    id: 'hard_campaign',
    name: 'Eiserner Loop',
    description: 'Die Kampagne auf „Schwer“ abgeschlossen.',
  },
  {
    id: 'first_instant_ticket',
    name: 'Ticket ziehen',
    description: 'Ein Sofort-Ticket eingesetzt.',
  },
  {
    id: 'five_upgrades',
    name: 'Sammler',
    description: '5 permanente Upgrades in einem Run.',
  },
  {
    id: 'five_shop_buys',
    name: 'Großeinkauf',
    description: '5 Käufe im Shop in einem Run.',
  },
  {
    id: 'all_achievements',
    name: 'Meister aller Loops',
    description: 'Alle anderen Achievements freigeschaltet.',
  },
];

const META_ID = 'all_achievements';
const NON_META_IDS = ACHIEVEMENTS.filter((a) => a.id !== META_ID).map((a) => a.id);

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

function eligibleIds(
  run: RunState,
  settings: GameSettings,
  endStats: RunEndStats,
): string[] {
  const ids: string[] = [];
  const m = run.runMilestones;

  if (m.campaignCompleted || endStats.campaignCompleted) {
    ids.push('campaign_complete');
  }
  if (m.choseEndless || endStats.endlessMode) {
    ids.push('endless_enter');
  }
  if (run.round >= 30 && (run.endlessMode || endStats.endlessMode)) {
    ids.push('endless_round_30');
  }
  if (run.round >= 40 && (run.endlessMode || endStats.endlessMode)) {
    ids.push('endless_round_40');
  }
  if (run.bossDefeated || endStats.bossDefeated) {
    ids.push('boss_defeated');
  }
  if (run.round >= 10) {
    ids.push('reach_round_10');
  }
  if (run.enemiesDefeatedTotal >= 50) {
    ids.push('kills_50');
  }
  if (run.enemiesDefeatedTotal >= 100) {
    ids.push('kills_100');
  }
  if (run.gold >= 50) {
    ids.push('gold_50');
  }
  if (run.gold >= 100) {
    ids.push('gold_100');
  }
  if (
    m.campaignCompleted &&
    settings.difficulty === 'hard'
  ) {
    ids.push('hard_campaign');
  }
  if (m.usedInstantTicket) {
    ids.push('first_instant_ticket');
  }
  if (run.upgradeIds.length >= 5) {
    ids.push('five_upgrades');
  }
  if (m.shopPurchases >= 5) {
    ids.push('five_shop_buys');
  }

  return ids;
}

export function evaluateNewAchievements(
  run: RunState,
  settings: GameSettings,
  endStats: RunEndStats,
): string[] {
  const already = new Set(getUnlockedIds());
  const eligible = eligibleIds(run, settings, endStats);
  const newly = eligible.filter((id) => !already.has(id));

  if (newly.length === 0) return [];

  const saved = unlockAchievementIds(newly);
  const allNonMetaUnlocked = NON_META_IDS.every((id) =>
    saved.unlockedIds.includes(id),
  );
  if (allNonMetaUnlocked && !saved.unlockedIds.includes(META_ID)) {
    unlockAchievementIds([META_ID]);
    return [...newly, META_ID];
  }

  return newly;
}

export function buildRunEndStats(
  run: RunState,
  won: boolean,
  reason?: string,
): RunEndStats {
  return {
    round: run.round,
    enemiesDefeated: run.enemiesDefeatedTotal,
    gold: run.gold,
    bossDefeated: run.bossDefeated,
    endlessMode: run.endlessMode,
    campaignCompleted:
      run.runMilestones.campaignCompleted || run.round >= CAMPAIGN_WIN_ROUND,
    won,
    reason,
  };
}
