import { useEffect, useRef, useState } from 'react';

const BLAST_MS = 380;

export interface NovaBlastRequest {
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
  activeSplatterCells: number[];
  defeatedCells: number[];
} {
  const lastTokenRef = useRef(0);
  const [activeSplatterCells, setActiveSplatterCells] = useState<number[]>([]);
  const [defeatedCells, setDefeatedCells] = useState<number[]>([]);
  const onCompleteRef = useRef(onComplete);
  const onImpactRef = useRef(onImpact);
  onCompleteRef.current = onComplete;
  onImpactRef.current = onImpact;

  useEffect(() => {
    if (!request || request.splatterCells.length === 0) {
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
    setActiveSplatterCells(request.splatterCells);
    setDefeatedCells(request.splatterCells);
    onImpactRef.current?.();

    void (async () => {
      await sleep(BLAST_MS);
      if (cancelled) return;

      setActiveSplatterCells([]);
      onCompleteRef.current();
    })();

    return () => {
      cancelled = true;
      setActiveSplatterCells([]);
    };
  }, [animations, request]);

  return { activeSplatterCells, defeatedCells };
}
