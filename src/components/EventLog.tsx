import { RuinsPanel } from './ui/RuinsPanel';

interface EventLogProps {
  events: string[];
}

export function EventLog({ events }: EventLogProps) {
  return (
    <RuinsPanel className="max-h-32 overflow-y-auto sm:max-h-40">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-loop-muted">
        Ereignisse
      </h3>
      <ul className="space-y-1 text-sm text-loop-muted">
        {events.length === 0 && <li>—</li>}
        {events.map((e, i) => (
          <li key={`${i}-${e.slice(0, 20)}`} className={i === 0 ? 'text-white' : ''}>
            {e}
          </li>
        ))}
      </ul>
    </RuinsPanel>
  );
}
