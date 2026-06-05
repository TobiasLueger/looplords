import type { EnemyType } from './types';

export type DamageSource = 'melee' | 'magic' | 'projectile';

export function isNovaImmune(type: EnemyType): boolean {
  return type === 'nullward';
}

export function isProjectileImmune(type: EnemyType): boolean {
  return type === 'bulwark';
}

export function canEnemyTakeDamage(type: EnemyType, source: DamageSource): boolean {
  if (source === 'magic' && isNovaImmune(type)) return false;
  if (source === 'projectile' && isProjectileImmune(type)) return false;
  return true;
}
