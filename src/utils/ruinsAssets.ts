import bgGame from '../../assets/ruins/background-game.png';
import bgMenu from '../../assets/ruins/background-menu.png';

import boardCellGround from '../../assets/ruins/ground-cell.png';
import decorBrick from '../../assets/ruins/decor-brick.png';
import panelBox from '../../assets/ruins/wooden-box.png';

import centerRuins from '../../assets/ruins/decor-ruins-01.png';
import centerRuinsAlt from '../../assets/ruins/decor-ruins-02.png';
import centerStatue from '../../assets/ruins/decor-statue.png';
import fence from '../../assets/ruins/fence.png';
import littleWreckage from '../../assets/ruins/little-wreckage.png';
import rock01 from '../../assets/ruins/rock-01.png';
import sign from '../../assets/ruins/sign-01.png';

import coin from '../../assets/ruins/coin.png';
import life from '../../assets/ruins/life.png';
import chest from '../../assets/ruins/chest-unlocked.png';
import key from '../../assets/ruins/key.png';
import star from '../../assets/ruins/star.png';
import barrel from '../../assets/ruins/wooden-barrel.png';
import signEnd from '../../assets/ruins/sign-03.png';

export const RUINS_BACKGROUNDS = {
  game: bgGame,
  menu: bgMenu,
} as const;

export const RUINS_BOARD = {
  centerRuins,
  centerRuinsAlt,
  centerStatue,
  fence,
  littleWreckage,
  rock01,
} as const;

export const RUINS_UI = {
  coin,
  life,
  chest,
  star,
  sign,
  panelBox,
  decorBrick,
} as const;

/** HUD action button sprites */
export const RUINS_ACTIONS = {
  /** Discard hand & redraw */
  discardRedraw: barrel,
  /** End turn */
  endTurn: signEnd,
  /** Open chip bag */
  chipBag: chest,
  /** Bonus / special (unused in HUD) */
  key,
} as const;

/** Ground tile for every board cell */
export const ENTITY_CELL_GROUND = boardCellGround;
