/** Rauchwolke für Teleport (Vanish/Appear) auf einer Brettzelle. */
export function BoardSmokePuff() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <div className="relative h-[88%] w-[88%] animate-smoke-puff">
        <span className="absolute left-1/2 top-1/2 h-[42%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-300/55 blur-md" />
        <span className="absolute left-[18%] top-[38%] h-[28%] w-[34%] rounded-full bg-stone-400/45 blur-sm" />
        <span className="absolute right-[14%] top-[42%] h-[26%] w-[30%] rounded-full bg-stone-500/40 blur-sm" />
        <span className="absolute bottom-[22%] left-[32%] h-[22%] w-[38%] rounded-full bg-stone-200/50 blur-md" />
      </div>
    </div>
  );
}
