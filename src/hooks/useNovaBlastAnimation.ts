import { useEffect, useRef, useState } from 'react';

const FLIGHT_MS = 400;
const IMPACT_MS = 340;

export interface NovaBlastRequest {
  fromCell: number;
  targetCells: number[];
  splatterCells: number[];
  token: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function useNovaBlastAnimation(
  request: NovaBlastRequest | null,
  animations: boolean,
  onComplete: () => void,
  onImpact?: () => void,
): {
  phase: 'idle' | 'flight' | 'impact';
  activeSplatterCells: number[];
  defeatedCells: number[];
} {
  const lastTokenRef = useRef(0);
  const [phase, setPhase] = useState<'idle' | 'flight' | 'impact'>('idle');
  const [activeSplatterCells, setActiveSplatterCells] = useState<number[]>([]);
  const [defeatedCells, setDefeatedCells] = useState<number[]>([]);
  const onCompleteRef = useRef(onComplete);
  const onImpactRef = useRef(onImpact);
  onCompleteRef.current = onComplete;
  onImpactRef.current = onImpact;

  useEffect(() => {
    if (!request || request.targetCells.length === 0) {
      setPhase('idle');
      setActiveSplatterCells([]);
      setDefeatedCells([]);
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
    setActiveSplatterCells([]);
    setDefeatedCells([]);

    void (async () => {
      await sleep(FLIGHT_MS);
      if (cancelled) return;

      setPhase('impact');
      const kills = request.splatterCells;
      setActiveSplatterCells(kills);
      setDefeatedCells(kills);
      onImpactRef.current?.();

      await sleep(IMPACT_MS);
      if (cancelled) return;

      setPhase('idle');
      setActiveSplatterCells([]);
      onCompleteRef.current();
    })();

    return () => {
      cancelled = true;
      setPhase('idle');
      setActiveSplatterCells([]);
    };
  }, [animations, request]);

  return { phase, activeSplatterCells, defeatedCells };
}
