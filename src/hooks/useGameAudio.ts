import { useEffect } from 'react';
import { chiptune } from '../audio/chiptuneEngine';
import type { GameSettings, Screen } from '../game/types';

function trackForScreen(screen: Screen): 'menu' | 'battle' {
  return screen === 'game' ? 'battle' : 'menu';
}

export function useGameAudio(screen: Screen, settings: GameSettings): void {
  useEffect(() => {
    chiptune.setMusicEnabled(settings.music);
    chiptune.setSfxEnabled(settings.sound);
  }, [settings.music, settings.sound]);

  useEffect(() => {
    if (!settings.music) {
      chiptune.stop();
      return;
    }

    const track = trackForScreen(screen);
    chiptune.requestLoop(track);
  }, [screen, settings.music]);
}
