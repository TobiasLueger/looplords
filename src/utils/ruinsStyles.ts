import type { CSSProperties } from 'react';
import { RUINS_UI } from './ruinsAssets';

export function ruinsPanelStyle(): CSSProperties {
  return {
    backgroundImage: `url(${RUINS_UI.decorBrick}), url(${RUINS_UI.panelBox})`,
    backgroundPosition: 'top center, top right',
    backgroundRepeat: 'repeat-x, no-repeat',
    backgroundSize: 'auto 10px, 56px 56px',
  };
}
