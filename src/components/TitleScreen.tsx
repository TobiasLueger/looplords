import { getPlayerSprite } from '../utils/assets';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneMenuButton } from './ui/StoneMenuButton';

interface TitleScreenProps {
  onStart: () => void;
  onSettings: () => void;
  onHowToPlay: () => void;
  onAchievements: () => void;
}

const playerOutlineFilter = [
  'drop-shadow(0 0 0.5px #fff)',
  'drop-shadow(1px 0 0 #fff)',
  'drop-shadow(-1px 0 0 #fff)',
  'drop-shadow(0 1px 0 #fff)',
  'drop-shadow(0 -1px 0 #fff)',
  'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
].join(' ');

export function TitleScreen({
  onStart,
  onSettings,
  onHowToPlay,
  onAchievements,
}: TitleScreenProps) {
  return (
    <ScreenLayout>
      <div className="flex flex-col items-center justify-center gap-10 py-12">
        <div className="text-center">
          <img
            src={getPlayerSprite() ?? undefined}
            alt="Looplord"
            className="mx-auto mb-4 max-h-36 w-auto object-contain sm:max-h-44"
            style={{ filter: playerOutlineFilter }}
            draggable={false}
          />
          <h1 className="font-display text-5xl font-bold tracking-widest text-loop-accent drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-6xl">
            Looplords
          </h1>
          <p className="mt-3 max-w-md text-base text-stone-200/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:text-md">
            Rundenbasierter Roguelite-Deckbuilder auf dem ewigen Kreis.
          </p>
        </div>

        <div className="flex w-full max-w-xs flex-col items-center gap-3 sm:gap-4">
          <StoneMenuButton variant="primary" label="Spiel starten" onClick={onStart} />
          <StoneMenuButton label="Einstellungen" onClick={onSettings} />
          <StoneMenuButton label="So geht's" onClick={onHowToPlay} />
          <StoneMenuButton label="Achievements" onClick={onAchievements} />
        </div>
      </div>
    </ScreenLayout>
  );
}
