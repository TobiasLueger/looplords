import { useEffect, useState } from 'react';

export type ProjectileKind = 'arrow' | 'knife' | 'lightning';

interface BoardProjectileProps {
  kind: ProjectileKind;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  boardCoordSize: number;
  active: boolean;
}

function ArrowIcon({ angle }: { angle: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]"
      style={{ transform: `rotate(${angle + 90}deg)` }}
      aria-hidden
    >
      <path
        fill="#e8dcc8"
        stroke="#5c4a32"
        strokeWidth="1.2"
        d="M12 2 L14 16 L12 14 L10 16 Z"
      />
      <path fill="#8b6914" d="M11 14 h2 v6 h-2 z" />
      <path fill="#c43c3c" d="M10.5 19.5 h3 v2 h-3 z" />
    </svg>
  );
}

function LightningIcon({ angle }: { angle: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9 drop-shadow-[0_0_10px_rgba(147,112,219,0.95)]"
      style={{ transform: `rotate(${angle + 90}deg)` }}
      aria-hidden
    >
      <path
        fill="none"
        stroke="#c4b5fd"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 2 L8 11 L12 11 L10 22 L17 10 L13 10 Z"
      />
      <path
        fill="#e9d5ff"
        stroke="#7c3aed"
        strokeWidth="0.8"
        strokeLinejoin="round"
        d="M13 2 L8 11 L12 11 L10 22 L17 10 L13 10 Z"
        opacity="0.92"
      />
      <path
        fill="none"
        stroke="#f5f3ff"
        strokeWidth="1"
        strokeLinecap="round"
        d="M12 4 L9.5 10 M14 12 L11.5 18"
        opacity="0.65"
      />
    </svg>
  );
}

function KnifeIcon({ angle }: { angle: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]"
      style={{ transform: `rotate(${angle + 45}deg)` }}
      aria-hidden
    >
      <path
        fill="#c0c0c0"
        stroke="#4a4a4a"
        strokeWidth="1"
        d="M4 20 L18 6 L20 8 L6 22 Z"
      />
      <path fill="#8b4513" d="M3 21 l3 -3 l-2 -2 z" />
      <path fill="#e8e8e8" stroke="#666" strokeWidth="0.6" d="M18 6 L20 4 L22 6 L20 8 Z" />
    </svg>
  );
}

export function BoardProjectile({
  kind,
  fromX,
  fromY,
  toX,
  toY,
  boardCoordSize,
  active,
}: BoardProjectileProps) {
  const [atTarget, setAtTarget] = useState(false);

  const fromLeft = (fromX / boardCoordSize) * 100;
  const fromTop = (fromY / boardCoordSize) * 100;
  const toLeft = (toX / boardCoordSize) * 100;
  const toTop = (toY / boardCoordSize) * 100;
  const angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

  useEffect(() => {
    if (!active) {
      setAtTarget(false);
      return;
    }
    setAtTarget(false);
    const frame = requestAnimationFrame(() => setAtTarget(true));
    return () => cancelAnimationFrame(frame);
  }, [active, fromX, fromY, toX, toY]);

  if (!active) return null;

  return (
    <div
      className={`pointer-events-none absolute z-[28] -translate-x-1/2 -translate-y-1/2 transition-[left,top] ${
        kind === 'lightning' ? 'duration-[400ms] ease-in' : 'duration-[420ms]'
      } ${kind === 'knife' ? 'ease-out' : kind === 'arrow' ? 'ease-in' : ''}`}
      style={{
        left: atTarget ? `${toLeft}%` : `${fromLeft}%`,
        top: atTarget ? `${toTop}%` : `${fromTop}%`,
      }}
    >
      {kind === 'lightning' ? (
        <LightningIcon angle={angle} />
      ) : kind === 'knife' ? (
        <KnifeIcon angle={angle} />
      ) : (
        <ArrowIcon angle={angle} />
      )}
    </div>
  );
}
