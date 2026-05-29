import type { Chip, ChipSpecial } from './types';

const UTILITY_SPECIALS: ChipSpecial[] = [
  'teleport',
  'echo',
  'scout',
  'pierce',
  'cleave',
  'grapple',
  'nova',
];

export function isUtilityChip(chip: Chip): boolean {
  return chip.special != null && UTILITY_SPECIALS.includes(chip.special);
}

export function chipLabel(chip: Chip): string {
  switch (chip.special) {
    case 'teleport':
      return 'TP';
    case 'overcharge':
      return '×2';
    case 'echo':
      return '↻';
    case 'scout':
      return '👁';
    case 'nova':
      return '✦';
    case 'retreat':
      return '←';
    case 'dash':
      return '←3';
    case 'leap':
      return '←4';
    case 'pierce':
      return '➤';
    case 'cleave':
      return '⚔';
    case 'grapple':
      return '↯';
    default:
      return String(chip.value);
  }
}

export function chipTypeLabel(chip: Chip): string {
  switch (chip.special) {
    case 'teleport':
      return 'Teleport';
    case 'overcharge':
      return 'Überladung';
    case 'echo':
      return 'Echo';
    case 'scout':
      return 'Späher';
    case 'nova':
      return 'Nova';
    case 'retreat':
      return 'Rückzug';
    case 'dash':
      return 'Sturm';
    case 'leap':
      return 'Sprung';
    case 'pierce':
      return 'Durchstoß';
    case 'cleave':
      return 'Spalt';
    case 'grapple':
      return 'Enterhaken';
    default:
      return chip.value === 1 ? 'Schritt' : 'Schritte';
  }
}

/** CSS filter string to tint chip.png per chip type/value */
export function chipImageFilter(chip: Chip): string {
  const base = 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))';

  switch (chip.special) {
    case 'teleport':
      return `${base} hue-rotate(265deg) saturate(1.45) brightness(1.05)`;
    case 'overcharge':
      return `${base} hue-rotate(28deg) saturate(1.6) brightness(1.12)`;
    case 'echo':
      return `${base} hue-rotate(175deg) saturate(1.4) brightness(1.05)`;
    case 'scout':
      return `${base} hue-rotate(195deg) saturate(1.5) brightness(1.1)`;
    case 'nova':
      return `${base} hue-rotate(295deg) saturate(1.6) brightness(1.15)`;
    case 'retreat':
      return `${base} hue-rotate(155deg) saturate(1.35) brightness(1.02)`;
    case 'dash':
      return `${base} hue-rotate(18deg) saturate(1.5) brightness(1.1)`;
    case 'leap':
      return `${base} hue-rotate(48deg) saturate(1.55) brightness(1.12)`;
    case 'pierce':
      return `${base} hue-rotate(340deg) saturate(1.5) brightness(1.08)`;
    case 'cleave':
      return `${base} hue-rotate(0deg) saturate(1.45) brightness(1.1)`;
    case 'grapple':
      return `${base} hue-rotate(210deg) saturate(1.4) brightness(1.08)`;
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
  return 'ring-2 ring-loop-accent ring-offset-2 ring-offset-loop-bg rounded-xl shadow-[0_0_16px_rgba(201,162,39,0.35)]';
}

/** @deprecated Use ChipSprite + chipImageFilter */
export function chipTailwindClass(_chip: Chip, selected: boolean): string {
  return chipSelectedClass(selected);
}

export function sumSelectedChipSteps(
  hand: Chip[],
  selectedIds: string[],
): number {
  const selected = hand.filter((c) => selectedIds.includes(c.id));
  let base = 0;
  let hasOvercharge = false;

  for (const c of selected) {
    if (c.special === 'overcharge') {
      hasOvercharge = true;
      continue;
    }
    if (c.special === 'retreat') {
      base -= 2;
      continue;
    }
    if (c.special === 'dash') {
      base -= 3;
      continue;
    }
    if (c.special === 'leap') {
      base -= 4;
      continue;
    }
    if (isUtilityChip(c)) {
      continue;
    }
    base += c.value;
  }

  return hasOvercharge ? base * 2 : base;
}
