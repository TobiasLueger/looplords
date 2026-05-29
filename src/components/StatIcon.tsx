interface StatIconProps {
  icon: string;
  label: string;
  value: number | string;
  valueClassName?: string;
}

export function StatIcon({ icon, label, value, valueClassName = 'text-white' }: StatIconProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-loop-border/80 bg-loop-panel/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
      <img src={icon} alt="" className="h-5 w-5 object-contain" draggable={false} />
      <div className="text-left leading-tight">
        <p className="text-[9px] uppercase tracking-wide text-loop-muted">{label}</p>
        <p className={`text-sm font-bold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
