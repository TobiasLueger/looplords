const BOARD_COORD_SIZE = 200;

interface BoardGrappleLineProps {
  anchorX: number;
  anchorY: number;
  playerX: number;
  playerY: number;
}

/** Seil vom Gegner (Anker) zum gezogenen Spieler. */
export function BoardGrappleLine({
  anchorX,
  anchorY,
  playerX,
  playerY,
}: BoardGrappleLineProps) {
  const ax = (anchorX / BOARD_COORD_SIZE) * 100;
  const ay = (anchorY / BOARD_COORD_SIZE) * 100;
  const px = (playerX / BOARD_COORD_SIZE) * 100;
  const py = (playerY / BOARD_COORD_SIZE) * 100;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[27] h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <line
        x1={ax}
        y1={ay}
        x2={px}
        y2={py}
        stroke="#8b6914"
        strokeWidth="0.55"
        strokeLinecap="round"
        strokeDasharray="1.8 1.1"
        opacity="0.92"
      />
      <line
        x1={ax}
        y1={ay}
        x2={px}
        y2={py}
        stroke="#c9a227"
        strokeWidth="0.22"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx={ax} cy={ay} r="1.35" fill="#c43c3c" stroke="#5c1a1a" strokeWidth="0.25" />
      <circle cx={ax} cy={ay} r="0.55" fill="#e8c547" />
    </svg>
  );
}
