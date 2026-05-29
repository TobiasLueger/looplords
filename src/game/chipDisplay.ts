import type { Chip, ChipSpecial } from './types';

const UTILITY_SPECIALS: ChipSpecial[] = [
  'teleport',
  'shield',
  'echo',
  'scout',
  'heal',
  'coin',
  'smite',
  'rally',
  'nova',
];

export function isUtilityChip(chip: Chip): boolean {
  return chip.special != null && UTILITY_SPECIALS.includes(chip.special);
}

export function chipLabel(chip: Chip): string {
  switch (chip.special) {
    case 'teleport':
      return 'TP';
    case 'shield':
      return '🛡';
    case 'overcharge':
      return `+${chip.value + 2}`;
    case 'echo':
      return '↻';
    case 'scout':
      return '👁';
    case 'heal':
      return '♥';
    case 'coin':
      return '¤';
    case 'smite':
      return '⚡';
    case 'rally':
      return '»';
    case 'nova':
      return '✦';
    case 'retreat':
      return '←';
    default:
      return String(chip.value);
  }
}

export function chipTypeLabel(chip: Chip): string {
  switch (chip.special) {
    case 'teleport':
      return 'Teleport';
    case 'shield':
      return 'Schild';
    case 'overcharge':
      return 'Überladung';
    case 'echo':
      return 'Echo';
    case 'scout':
      return 'Späher';
    case 'heal':
      return 'Heilung';
    case 'coin':
      return 'Gold';
    case 'smite':
      return 'Schlag';
    case 'rally':
      return 'Rally';
    case 'nova':
      return 'Nova';
    case 'retreat':
      return 'Rückzug';
    default:
      return 'Schritte';
  }
}

/** CSS filter string to tint chip.png per chip type/value */
export function chipImageFilter(chip: Chip): string {
  const base = 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))';

  switch (chip.special) {
    case 'teleport':
      return `${base} hue-rotate(265deg) saturate(1.45) brightness(1.05)`;
    case 'shield':
      return `${base} hue-rotate(205deg) saturate(1.35) brightness(1.08)`;
    case 'overcharge':
      return `${base} hue-rotate(28deg) saturate(1.6) brightness(1.12)`;
    case 'echo':
      return `${base} hue-rotate(175deg) saturate(1.4) brightness(1.05)`;
    case 'scout':
      return `${base} hue-rotate(195deg) saturate(1.5) brightness(1.1)`;
    case 'heal':
      return `${base} hue-rotate(330deg) saturate(1.5) brightness(1.08)`;
    case 'coin':
      return `${base} hue-rotate(42deg) saturate(1.55) brightness(1.2)`;
    case 'smite':
      return `${base} hue-rotate(255deg) saturate(1.5) brightness(1.1)`;
    case 'rally':
      return `${base} hue-rotate(75deg) saturate(1.55) brightness(1.1)`;
    case 'nova':
      return `${base} hue-rotate(295deg) saturate(1.6) brightness(1.15)`;
    case 'retreat':
      return `${base} hue-rotate(155deg) saturate(1.35) brightness(1.02)`;
    default:
      break;
  }

  const byValue: Record<number, string> = {
    1: `${base} saturate(0.85) brightness(0.92) contrast(1.05)`,
    2: `${base} hue-rotate(115deg) saturate(1.35) brightness(1.05)`,
    3: `${base} hue-rotate(205deg) saturate(1.4) brightness(1.05)`,
    4: `${base} hue-rotate(38deg) saturate(1.45) brightness(1.1)`,
    5: `${base} hue-rotate(350deg) saturate(1.5) brightness(1.08)`,
    6: `${base} hue-rotate(315deg) saturate(1.45) brightness(1.12)`,
  };

  return byValue[chip.value] ?? `${base} brightness(1)`;
}

export function chipSelectedClass(selected: boolean): string {
  if (!selected) return '';
  return 'ring-2 ring-loop-accent ring-offset-2 ring-offset-loop-bg rounded-xl -translate-y-0.5 shadow-[0_0_16px_rgba(201,162,39,0.35)]';
}

/** @deprecated Use ChipSprite + chipImageFilter */
export function chipTailwindClass(_chip: Chip, selected: boolean): string {
  return chipSelectedClass(selected);
}

export function sumSelectedChipSteps(
  hand: Chip[],
  selectedIds: string[],
): number {
  return hand
    .filter((c) => selectedIds.includes(c.id))
    .reduce((sum, c) => {
      if (isUtilityChip(c)) {
        if (c.special === 'retreat') return sum - 2;
        return sum;
      }
      if (c.special === 'overcharge') return sum + c.value + 2;
      return sum + c.value;
    }, 0);
}
