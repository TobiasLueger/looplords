const ACHIEVEMENTS_KEY = 'looplords-achievements';

export interface AchievementSaveData {
  unlockedIds: string[];
  unlockedAt: Record<string, number>;
}

const emptySave: AchievementSaveData = {
  unlockedIds: [],
  unlockedAt: {},
};

export function loadAchievementSave(): AchievementSaveData {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return { ...emptySave, unlockedIds: [], unlockedAt: {} };
    const parsed = JSON.parse(raw) as AchievementSaveData;
    return {
      unlockedIds: Array.isArray(parsed.unlockedIds) ? parsed.unlockedIds : [],
      unlockedAt:
        parsed.unlockedAt && typeof parsed.unlockedAt === 'object'
          ? parsed.unlockedAt
          : {},
    };
  } catch {
    return { ...emptySave };
  }
}

export function saveAchievementSave(data: AchievementSaveData): void {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data));
}

export function unlockAchievementIds(ids: string[]): AchievementSaveData {
  const current = loadAchievementSave();
  const now = Date.now();
  const nextIds = [...current.unlockedIds];
  const nextAt = { ...current.unlockedAt };

  for (const id of ids) {
    if (!nextIds.includes(id)) {
      nextIds.push(id);
      nextAt[id] = now;
    }
  }

  const next = { unlockedIds: nextIds, unlockedAt: nextAt };
  saveAchievementSave(next);
  return next;
}

export function getUnlockedIds(): string[] {
  return loadAchievementSave().unlockedIds;
}
