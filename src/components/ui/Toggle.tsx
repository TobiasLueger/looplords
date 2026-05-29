import { StoneGroundSurface } from './StoneGroundSurface';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const labelShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <StoneGroundSurface>
      <label className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
        <span
          className="font-display text-base font-bold text-white/95 sm:text-lg"
          style={{ textShadow: labelShadow }}
        >
          {label}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative h-7 w-12 shrink-0 rounded-full border border-black/30 transition ${
            checked ? 'bg-loop-accent' : 'bg-stone-900/60'
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              checked ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
      </label>
    </StoneGroundSurface>
  );
}
