import type { EnemyType } from '../game/types';
import { ENEMY_FALLBACK_COLORS, getEnemySprite, getPlayerSprite } from '../utils/assets';

interface EntitySpriteProps {
  kind: 'player' | 'enemy';
  enemyType?: EnemyType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  flash?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8 sm:h-10 sm:w-10',
  md: 'h-10 w-10 sm:h-12 sm:w-12',
  lg: 'h-12 w-12 sm:h-14 sm:w-14',
  xl: 'h-14 w-14 sm:h-16 sm:w-16',
};

/** White silhouette outline so sprites read clearly on ground tiles */
const ENTITY_OUTLINE_FILTER = [
  'drop-shadow(0 0 0.5px #fff)',
  'drop-shadow(1px 0 0 #fff)',
  'drop-shadow(-1px 0 0 #fff)',
  'drop-shadow(0 1px 0 #fff)',
  'drop-shadow(0 -1px 0 #fff)',
  'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
].join(' ');

export function EntitySprite({
  kind,
  enemyType = 'normal',
  size = 'md',
  animate,
  flash,
  className = '',
}: EntitySpriteProps) {
  const src =
    kind === 'player' ? getPlayerSprite() : getEnemySprite(enemyType);

  const sizeClass = sizeMap[size];
  const animClass = animate ? 'transition-transform duration-300 hover:scale-110' : '';
  const flashClass = flash ? 'animate-pulse-kill ring-2 ring-loop-success' : '';

  if (src) {
    return (
      <img
        src={src}
        alt={kind === 'player' ? 'Spieler' : enemyType}
        className={`${sizeClass} object-contain ${animClass} ${flashClass} ${className}`}
        style={{ filter: ENTITY_OUTLINE_FILTER }}
        draggable={false}
      />
    );
  }

  const color =
    kind === 'player'
      ? 'bg-loop-accent ring-1 ring-white ring-offset-1 ring-offset-transparent'
      : `${ENEMY_FALLBACK_COLORS[enemyType]} ring-1 ring-white ring-offset-1 ring-offset-transparent`;

  return (
    <span
      className={`inline-block rounded-full ${sizeClass} ${color} ${animClass} ${flashClass} ${className}`}
      aria-hidden
    />
  );
}
