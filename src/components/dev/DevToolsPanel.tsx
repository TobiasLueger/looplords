import { useMemo, useState, type ReactNode } from 'react';
import { DEV_TOOLS_ENABLED } from '../../config/devTools';
import type { DevToolsApi } from '../../hooks/useDevToolsApi';
import type { GameSettings, RunState, Screen } from '../../game/types';
import { UPGRADES } from '../../game/upgrades';
import { INSTANT_TICKET_DEFS } from '../../game/instantTickets';
import {
  DEV_CHIP_COMBOS,
  DEV_CHIP_SPECIALS,
} from '../../game/devToolsActions';

interface DevToolsPanelProps {
  api: DevToolsApi;
  screen: Screen;
  run: RunState | null;
  settings: GameSettings;
  updateSettings: (patch: Partial<GameSettings>) => void;
}

const SCREENS: { id: Screen; label: string }[] = [
  { id: 'title', label: 'Titel' },
  { id: 'runSetup', label: 'Setup' },
  { id: 'game', label: 'Spiel' },
  { id: 'shop', label: 'Shop' },
  { id: 'settings', label: 'Einstellungen' },
  { id: 'howToPlay', label: 'Anleitung' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'endlessChoice', label: 'Endlos-Wahl' },
  { id: 'runEnd', label: 'Run-Ende' },
];

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      className="rounded border border-emerald-900/50 bg-black/40"
      open={defaultOpen}
    >
      <summary className="cursor-pointer select-none px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
        {title}
      </summary>
      <div className="space-y-2 border-t border-emerald-900/40 px-3 py-2">{children}</div>
    </details>
  );
}

function Btn({
  label,
  onClick,
  variant = 'default',
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'primary';
  disabled?: boolean;
}) {
  const cls =
    variant === 'danger'
      ? 'border-red-800/60 bg-red-950/50 text-red-200 hover:bg-red-900/50'
      : variant === 'primary'
        ? 'border-emerald-700/60 bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/50'
        : 'border-stone-700/60 bg-stone-900/50 text-stone-200 hover:bg-stone-800/60';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-2 py-1 font-mono text-[11px] transition disabled:cursor-not-allowed disabled:opacity-40 ${cls}`}
    >
      {label}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[4.5rem] font-mono text-[10px] text-stone-400">{label}</span>
      {children}
    </div>
  );
}

export function DevToolsPanel({
  api,
  screen,
  run,
  settings,
  updateSettings,
}: DevToolsPanelProps) {
  const [open, setOpen] = useState(false);
  const [roundInput, setRoundInput] = useState('5');
  const [goldInput, setGoldInput] = useState('20');
  const [posInput, setPosInput] = useState('0');

  const needsRun = screen === 'game' || screen === 'shop' || screen === 'endlessChoice';

  const btnGrid = 'flex flex-wrap gap-1.5';

  const panel = useMemo(
    () => (
      <div className="max-h-[min(78vh,640px)] space-y-2 overflow-y-auto pr-1">
        <Section title="Ansichten" defaultOpen>
          <div className={btnGrid}>
            {SCREENS.map((s) => (
              <Btn
                key={s.id}
                label={s.label}
                variant={screen === s.id ? 'primary' : 'default'}
                onClick={() => api.goToScreen(s.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Run starten / springen">
          <div className={btnGrid}>
            <Btn label="Neuer Run (R1)" onClick={() => api.startFreshRun(1)} />
            <Btn label="Boss R5" onClick={() => api.startFreshRun(5)} />
            <Btn label="Boss R10" onClick={() => api.startFreshRun(10)} />
            <Btn label="Kampagnen-Ende R25" onClick={() => api.startFreshRun(25)} />
            <Btn label="Endlos R26" onClick={() => api.startFreshRun(26)} />
          </div>
          <Row label="Runde">
            <input
              type="number"
              min={1}
              value={roundInput}
              onChange={(e) => setRoundInput(e.target.value)}
              className="w-16 rounded border border-stone-700 bg-stone-950 px-2 py-0.5 font-mono text-xs text-white"
            />
            <Btn
              label="Springen"
              disabled={!run}
              onClick={() => api.jumpToRound(Number(roundInput) || 1)}
            />
          </Row>
          <div className={btnGrid}>
            <Btn label="Run sicherstellen" onClick={api.ensureRun} />
            <Btn label="Reich (Gold/Deck)" disabled={!run} onClick={api.makeRich} />
          </div>
        </Section>

        <Section title="Ressourcen">
          <Row label="Gold">
            <input
              type="number"
              value={goldInput}
              onChange={(e) => setGoldInput(e.target.value)}
              className="w-16 rounded border border-stone-700 bg-stone-950 px-2 py-0.5 font-mono text-xs text-white"
            />
            <Btn
              label="Setzen"
              disabled={!run}
              onClick={() => api.setGold(Number(goldInput) || 0)}
            />
          </Row>
          <div className={btnGrid}>
            <Btn label="+10 Gold" disabled={!run} onClick={() => api.addGold(10)} />
            <Btn label="Volle LP" disabled={!run} onClick={api.healFull} />
            <Btn label="1 LP" disabled={!run} onClick={api.setLivesOne} />
            <Btn label="+3 Züge" disabled={!run} onClick={() => api.addTurns(3)} />
            <Btn label="+3 Abwürfe" disabled={!run} onClick={() => api.addDiscards(3)} />
            <Btn label="Schild +5" disabled={!run} onClick={() => api.addShield(5)} />
          </div>
        </Section>

        <Section title="Shop & Meta">
          <div className={btnGrid}>
            <Btn label="Shop öffnen" disabled={!run} onClick={() => api.openShop(false)} />
            <Btn label="Boss-Shop" disabled={!run} onClick={() => api.openShop(true)} />
            <Btn label="Boss-Upgrade wählen" disabled={!run} onClick={api.openBossUpgrade} />
            <Btn label="Endlos-Wahl" disabled={!run} onClick={api.openEndlessChoice} />
            <Btn label="Runde gewinnen → Shop" disabled={!run} onClick={api.winRound} />
          </div>
        </Section>

        <Section title="Brett & Gegner">
          <Row label="Position">
            <input
              type="number"
              min={0}
              value={posInput}
              onChange={(e) => setPosInput(e.target.value)}
              className="w-16 rounded border border-stone-700 bg-stone-950 px-2 py-0.5 font-mono text-xs text-white"
            />
            <Btn
              label="Spieler setzen"
              disabled={!run}
              onClick={() => api.setPlayerPosition(Number(posInput) || 0)}
            />
          </Row>
          <div className={btnGrid}>
            <Btn label="Gegner weg" disabled={!run} onClick={api.clearEnemies} />
            <Btn label="Linie (Durchstoß)" disabled={!run} onClick={api.spawnPierceLine} />
            <Btn label="+ Normal" disabled={!run} onClick={() => api.spawnEnemy('normal')} />
            <Btn label="+ Schnell" disabled={!run} onClick={() => api.spawnEnemy('fast')} />
            <Btn label="+ Tank" disabled={!run} onClick={() => api.spawnEnemy('tank')} />
            <Btn label="+ Elite" disabled={!run} onClick={() => api.spawnEnemy('elite')} />
            <Btn label="+ Boss" disabled={!run} onClick={() => api.spawnEnemy('boss')} />
            <Btn label="+ Leerwächter" disabled={!run} onClick={() => api.spawnEnemy('nullward')} />
            <Btn label="+ Schildträger" disabled={!run} onClick={() => api.spawnEnemy('bulwark')} />
            <Btn label="+ Schütze" disabled={!run} onClick={() => api.spawnEnemy('marksman')} />
          </div>
        </Section>

        <Section title="Hand — Chip-Kombos">
          <div className={btnGrid}>
            {DEV_CHIP_COMBOS.map((combo) => (
              <Btn
                key={combo.id}
                label={combo.label}
                disabled={!run}
                onClick={() => api.setHandCombo(combo.chips)}
              />
            ))}
          </div>
          <p className="font-mono text-[10px] text-stone-500">Einzelne Spezial-Chips:</p>
          <div className={btnGrid}>
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <Btn
                key={v}
                label={`+${v}`}
                disabled={!run}
                onClick={() => api.addChip({ value: v })}
              />
            ))}
            {DEV_CHIP_SPECIALS.map((s) => (
              <Btn
                key={s.special}
                label={`+${s.label}`}
                disabled={!run}
                onClick={() => api.addChip({ special: s.special })}
              />
            ))}
            <Btn label="Hand leeren" disabled={!run} onClick={api.clearHand} />
            <Btn label="Deck füllen" disabled={!run} onClick={api.fillDeck} />
          </div>
        </Section>

        <Section title="Sofort-Tickets">
          <div className={btnGrid}>
            <Btn label="Alle ×2" disabled={!run} onClick={api.grantAllTickets} />
            <Btn label="Tickets reset" disabled={!run} onClick={api.resetTickets} />
            {INSTANT_TICKET_DEFS.map((t) => (
              <Btn
                key={t.id}
                label={`+${t.name}`}
                disabled={!run}
                onClick={() => api.addTicket(t.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Upgrades">
          <div className={btnGrid}>
            {UPGRADES.map((u) => (
              <Btn
                key={u.id}
                label={run?.upgradeIds.includes(u.id) ? `✓ ${u.name}` : u.name}
                disabled={!run}
                variant={run?.upgradeIds.includes(u.id) ? 'primary' : 'default'}
                onClick={() => api.toggleUpgrade(u.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Animationen testen">
          <p className="font-mono text-[10px] leading-snug text-stone-500">
            Spielt Vorschau-Animationen ab (ohne Zustandsänderung). Gegner ggf. vorher spawnen.
          </p>
          <div className={btnGrid}>
            <Btn label="Nova" disabled={!run} onClick={api.previewNova} />
            <Btn label="Lauf-Hop" disabled={!run} onClick={api.previewMove} />
            <Btn label="Teleport" disabled={!run} onClick={api.previewTeleport} />
            <Btn label="Enterhaken" disabled={!run} onClick={api.previewGrapple} />
            <Btn label="Scharfschuss" disabled={!run} onClick={api.previewSniper} />
            <Btn label="Spalt-Wurf" disabled={!run} onClick={api.previewCleave} />
            <Btn label="Nova→Hop→Spalt" disabled={!run} onClick={api.previewFullCombo} />
            <Btn label="Animationen stoppen" onClick={api.clearAnimations} />
          </div>
        </Section>

        <Section title="Einstellungen">
          <div className={btnGrid}>
            <Btn
              label={`Musik: ${settings.music ? 'AN' : 'AUS'}`}
              onClick={() => updateSettings({ music: !settings.music })}
            />
            <Btn
              label={`Sound: ${settings.sound ? 'AN' : 'AUS'}`}
              onClick={() => updateSettings({ sound: !settings.sound })}
            />
            <Btn
              label={`Anim: ${settings.animations ? 'AN' : 'AUS'}`}
              onClick={() => updateSettings({ animations: !settings.animations })}
            />
          </div>
        </Section>

        <Section title="Run beenden">
          <div className={btnGrid}>
            <Btn label="Niederlage simulieren" disabled={!run} variant="danger" onClick={api.simulateDefeat} />
            <Btn label="Sieg simulieren" disabled={!run} onClick={api.simulateVictory} />
          </div>
        </Section>
      </div>
    ),
    [
      api,
      goldInput,
      posInput,
      roundInput,
      run,
      screen,
      settings.animations,
      settings.music,
      settings.sound,
      updateSettings,
    ],
  );

  if (!DEV_TOOLS_ENABLED) return null;

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-[9999] font-sans">
      <div className="pointer-events-auto">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md border border-emerald-600/70 bg-emerald-950/90 px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-emerald-300 shadow-lg backdrop-blur-sm hover:bg-emerald-900/90"
            title="Entwickler-Tools"
          >
            DEV
          </button>
        ) : (
          <div className="w-[min(92vw,420px)] rounded-lg border border-emerald-700/50 bg-stone-950/95 p-3 shadow-2xl backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Entwickler-Tools
                </p>
                <p className="font-mono text-[10px] text-stone-500">
                  Screen: {screen}
                  {run ? ` · R${run.round} · ${run.gold}G` : ' · kein Run'}
                  {needsRun && !run ? ' ⚠ Run nötig' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-stone-700 px-2 py-0.5 font-mono text-xs text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {panel}
          </div>
        )}
      </div>
    </div>
  );
}
