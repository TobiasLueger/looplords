interface KillSplatterProps {
  active: boolean;
}

export function KillSplatter({ active }: KillSplatterProps) {
  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible"
      aria-hidden
    >
      <div className="relative h-full w-full animate-enemy-splatter">
        <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-loop-danger/90 blur-[1px]" />
        <span className="absolute left-[30%] top-[35%] h-4 w-5 rotate-[-25deg] rounded-full bg-red-700/85" />
        <span className="absolute left-[62%] top-[40%] h-3 w-4 rotate-[35deg] rounded-full bg-red-800/80" />
        <span className="absolute left-[45%] top-[58%] h-3 w-6 rotate-[12deg] rounded-full bg-loop-danger/75" />
        <span className="absolute left-[55%] top-[28%] h-2 w-3 rotate-[-40deg] rounded-full bg-red-900/70" />
        <span className="absolute left-[38%] top-[48%] h-2 w-2 rounded-full bg-red-600/90" />
      </div>
    </div>
  );
}
