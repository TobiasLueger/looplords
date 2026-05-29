import { useEffect, useRef, useState } from 'react';

const FLIGHT_MS = 420;
const IMPACT_MS = 340;

export interface ProjectileShotRequest {
  fromCell: number;
  toCell: number;
  token: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function useProjectileShotAnimation(
  request: ProjectileShotRequest | null,
  animations: boolean,
  onComplete: () => void,
  onImpact?: () => void,
): {
  phase: 'idle' | 'flight' | 'impact';
  splatterCell: number | null;
} {
  const lastTokenRef = useRef(0);
  const [phase, setPhase] = useState<'idle' | 'flight' | 'impact'>('idle');
  const [splatterCell, setSplatterCell] = useState<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onImpactRef = useRef(onImpact);
  onCompleteRef.current = onComplete;
  onImpactRef.current = onImpact;

  useEffect(() => {
    if (!request) {
      setPhase('idle');
      setSplatterCell(null);
      return;
    }

    if (!animations) {
      lastTokenRef.current = request.token;
      onCompleteRef.current();
      return;
    }

    if (request.token === lastTokenRef.current) return;
    lastTokenRef.current = request.token;

    let cancelled = false;
    setPhase('flight');
    setSplatterCell(null);

    void (async () => {
      await sleep(FLIGHT_MS);
      if (cancelled) return;

      setPhase('impact');
      setSplatterCell(request.toCell);
      onImpactRef.current?.();

      await sleep(IMPACT_MS);
      if (cancelled) return;

      setPhase('idle');
      setSplatterCell(null);
      onCompleteRef.current();
    })();

    return () => {
      cancelled = true;
      setPhase('idle');
      setSplatterCell(null);
    };
  }, [animations, request]);

  return { phase, splatterCell };
}

// Backwards-compatible alias for sniper ticket
export type SniperShotRequest = ProjectileShotRequest;
export const useSniperShotAnimation = useProjectileShotAnimation;
