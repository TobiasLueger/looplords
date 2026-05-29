import { StoneGroundSurface } from './StoneGroundSurface';

interface VolumeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const labelShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function VolumeSlider({
  label,
  value,
  onChange,
  disabled = false,
}: VolumeSliderProps) {
  return (
    <StoneGroundSurface className={disabled ? 'pointer-events-none opacity-45' : ''}>
      <div className="px-4 py-3.5 sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className="font-display text-base font-bold text-white/95 sm:text-lg"
            style={{ textShadow: labelShadow }}
          >
            {label}
          </span>
          <span
            className="shrink-0 font-display text-sm font-bold tabular-nums text-loop-accentHover sm:text-base"
            style={{ textShadow: labelShadow }}
          >
            {value}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="volume-slider w-full"
        />
      </div>
    </StoneGroundSurface>
  );
}
