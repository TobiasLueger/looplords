export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
}

export const UPGRADES: UpgradeDefinition[] = [
  {
    id: 'extra_life',
    name: 'Eisernes Herz',
    description: '+1 maximales Leben.',
  },
  {
    id: 'extra_turn',
    name: 'Zeitdieb',
    description: '+1 Zug pro Runde.',
  },
  {
    id: 'extra_discard',
    name: 'Glückschip',
    description: '+1 Abwurf pro Runde.',
  },
  {
    id: 'ones_to_twos',
    name: 'Aufwertung',
    description: 'Alle 1er-Chips werden zu 2er-Chips.',
  },
  {
    id: 'add_five_chip',
    name: 'Fünfer-Relikt',
    description: 'Fügt einen 5er-Chip dem Deck hinzu.',
  },
  {
    id: 'first_kill_turn',
    name: 'Blutlust',
    description: 'Erster Kill pro Runde gibt +1 Zug.',
  },
  {
    id: 'slow_enemies',
    name: 'Zeitfrost',
    description: 'Gegner bewegen sich nur jeden zweiten Spielerzug.',
  },
  {
    id: 'kill_momentum',
    name: 'Durchbruch',
    description: 'Beim Kill bewegst du dich 1 Feld weiter.',
  },
  {
    id: 'adjacent_kills',
    name: 'Klingenwirbel',
    description: 'Gegner neben deinem Zielfeld werden auch rausgeworfen.',
  },
  {
    id: 'round_shield',
    name: 'Runenschild',
    description: 'Starte jede Runde mit 1 Schild.',
  },
  {
    id: 'double_first_chip',
    name: 'Doppelwurf',
    description: 'Der erste gespielte Chip pro Zug zählt doppelt.',
  },
  {
    id: 'teleport_chip',
    name: 'Riss im Loop',
    description: 'Fügt einen Teleport-Chip hinzu (springt halbe Runde).',
  },
  {
    id: 'draw_plus_one',
    name: 'Reichere Hand',
    description: 'Ziehe 6 statt 5 Chips pro Runde.',
  },
  {
    id: 'tank_bane',
    name: 'Panzerbrecher',
    description: 'Tanks benötigen nur noch 1 Treffer.',
  },
  {
    id: 'heal_chip',
    name: 'Lebensstein',
    description: 'Fügt einen Heil-Chip dem Deck hinzu.',
  },
  {
    id: 'coin_chip',
    name: 'Münzrelikt',
    description: 'Fügt einen Gold-Chip dem Deck hinzu.',
  },
  {
    id: 'nova_chip',
    name: 'Sternenstoß',
    description: 'Fügt einen Nova-Chip dem Deck hinzu.',
  },
  {
    id: 'rally_chip',
    name: 'Kriegstrommel',
    description: 'Fügt einen Rally-Chip dem Deck hinzu.',
  },
  {
    id: 'gold_rush',
    name: 'Goldrausch',
    description: 'Sofort +3 Gold und reichere Beute.',
  },
];

export function hasUpgrade(upgradeIds: string[], id: string): boolean {
  return upgradeIds.includes(id);
}

export function countUpgrade(upgradeIds: string[], id: string): number {
  return upgradeIds.filter((u) => u === id).length;
}

export function pickRandomUpgrades(owned: string[], count: number): string[] {
  const available = UPGRADES.filter((u) => !owned.includes(u.id));
  const pool = available.length >= count ? available : UPGRADES;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked: string[] = [];
  for (const u of shuffled) {
    if (picked.length >= count) break;
    if (!picked.includes(u.id)) picked.push(u.id);
  }
  while (picked.length < count) {
    const fallback = UPGRADES[picked.length % UPGRADES.length];
    if (!picked.includes(fallback.id)) picked.push(fallback.id);
  }
  return picked;
}

export function getBonusTurns(upgradeIds: string[]): number {
  return countUpgrade(upgradeIds, 'extra_turn');
}

export function getBonusDiscards(upgradeIds: string[]): number {
  return countUpgrade(upgradeIds, 'extra_discard');
}

export function getBonusLives(upgradeIds: string[]): number {
  return countUpgrade(upgradeIds, 'extra_life');
}

export function getHandSize(upgradeIds: string[]): number {
  return hasUpgrade(upgradeIds, 'draw_plus_one') ? 6 : 5;
}
