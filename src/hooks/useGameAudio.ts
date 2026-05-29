import { useEffect } from 'react';
import { chiptune } from '../audio/chiptuneEngine';
import type { GameSettings, Screen } from '../game/types';

export function useGameAudio(_screen: Screen, settings: GameSettings): void {
  useEffect(() => {
    chiptune.setMusicEnabled(settings.music);
    chiptune.setMusicVolume(settings.musicVolume);
    chiptune.setSfxEnabled(settings.sound);
  }, [settings.music, settings.musicVolume, settings.sound]);
}
