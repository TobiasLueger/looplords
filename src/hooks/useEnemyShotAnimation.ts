import { useEffect, useRef, useState } from 'react';

const FLIGHT_MS = 420;
const IMPACT_MS = 280;

export interface EnemyShot {
  fromCell: number;
  toCell: number;
}

export interface EnemyShotRequest {
  shots: EnemyShot[];
  token: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function useEnemyShotAnimation(
  request: EnemyShotRequest | null,
  animations: boolean,
  onComplete: () => void,
  onImpact?: () => void,
): {
  phase: 'idle' | 'flight' | 'impact';
} {
  const lastTokenRef = useRef(0);
  const [phase, setPhase] = useState<'idle' | 'flight' | 'impact'>('idle');
  const onCompleteRef = useRef(onComplete);
  const onImpactRef = useRef(onImpact);
  onCompleteRef.current = onComplete;
  onImpactRef.current = onImpact;

  useEffect(() => {
    if (!request || request.shots.length === 0) {
      setPhase('idle');
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

    void (async () => {
      await sleep(FLIGHT_MS);
      if (cancelled) return;

      setPhase('impact');
      onImpactRef.current?.();

      await sleep(IMPACT_MS);
      if (cancelled) return;

      setPhase('idle');
      onCompleteRef.current();
    })();

    return () => {
      cancelled = true;
      setPhase('idle');
    };
  }, [animations, request]);

  return { phase };
}
