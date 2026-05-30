import { useEffect, useState } from 'react';

export const CHIP_INSPECT_HINT = 'V für Details';

export function useInspectKeyHeld(): boolean {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const sync = (next: boolean) => setHeld(next);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'v' || e.repeat) return;
      sync(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'v') return;
      sync(false);
    };
    const onBlur = () => sync(false);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return held;
}
