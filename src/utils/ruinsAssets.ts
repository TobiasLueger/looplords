import bgGame from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Background/Background_01.png';
import bgMenu from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Background/Background_02.png';

import boardCellGround from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Platformer/Ground_06.png';
import decorBrick from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Platformer/Decor_Brick.png';
import panelBox from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Platformer/Wooden_Box.png';

import centerRuins from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Decor_Ruins_01.png';
import centerRuinsAlt from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Decor_Ruins_02.png';
import centerStatue from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Decor_Statue.png';
import fence from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Fence.png';
import littleWreckage from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Little_Wreckage.png';
import rock01 from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Rock_01.png';
import sign from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Sign_01.png';

import coin from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Collectable Object/Coin_01.png';
import life from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Collectable Object/Life.png';
import chest from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Collectable Object/Chest_01_Unlocked.png';
import key from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Collectable Object/Key_01.png';
import star from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Collectable Object/Star.png';
import barrel from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Platformer/Wooden_Barrel.png';
import signEnd from '../../assets/craftpix-net-370528-free-medieval-ruins-cartoon-2d-tileset/PNG/Environment/Sign_03.png';

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
