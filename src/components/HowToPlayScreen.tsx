import { GameButton } from './ui/GameButton';
import { RuinsPanel } from './ui/RuinsPanel';
import { ScreenLayout } from './ui/ScreenLayout';

interface HowToPlayScreenProps {
  onBack: () => void;
}

export function HowToPlayScreen({ onBack }: HowToPlayScreenProps) {
  return (
    <ScreenLayout title="So geht's" subtitle="Kurzanleitung">
      <RuinsPanel className="mx-auto max-w-lg space-y-4 text-sm text-loop-muted">
        <section>
          <h2 className="mb-2 font-semibold text-white">Ziel</h2>
          <p>
            Eliminiere alle Gegner auf dem Kreis, bevor deine Züge aufgebraucht sind. Überlebe
            25 Runden und besiege die Bosse, um die Kampagne zu gewinnen.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">Chips</h2>
          <p>
            Jede Runde ziehst du 5 Chips (Werte 1–4). Wähle mehrere aus und spiele sie — die Summe
            bewegt dich im Uhrzeigersinn. Landest du auf einem Gegner, wird er rausgeworfen.
            Abwürfe erlauben eine neue Hand (begrenzt pro Runde).
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">Gegner</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Normal: 1 Feld pro Zug</li>
            <li>Schnell: 2 Felder</li>
            <li>Tank: 2 Treffer nötig</li>
            <li>Elite: stärker, 2 Treffer</li>
            <li>Boss: viele Leben, extra Schaden (alle 5 Runden)</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">Shop & Gold</h2>
          <p>
            Besiegte Gegner geben Gold (Boss am meisten). Nach jeder gewonnenen Runde öffnet sich
            der Shop für Chips und Sofort-Tickets. Nach jeder Boss-Runde (5, 10, 15, 20, 25)
            wählst du zuerst genau ein permanentes Upgrade aus drei Optionen, danach den Shop.
            Pro Shop gibt es 1 zufälliges Gratis-Sofort-Ticket; weitere sind käuflich.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">Spezial-Chips</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Teleport: halbe Runde springen</li>
            <li>Überladung: verdoppelt Lauf-Schritte der gleichzeitig gespielten Chips</li>
            <li>Sturm / Sprung: 3 bzw. 4 Felder gegen den Uhrzeigersinn</li>
            <li>Enterhaken: springe zum nächsten Gegner (+ Lauf-Chips)</li>
            <li>Durchstoß / Spalt: Treffer entlang des Wegs bzw. auf den nächsten Gegner</li>
            <li>Echo / Späher: zieht 1 bzw. 2 Chips nach dem Zug</li>
            <li>Nova: alle Gegner -1 Treffer</li>
            <li>Rückzug: 2 Felder zurück</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">Kampagnen-Sieg & Endlos</h2>
          <p>
            Nach Runde 25 wählst du: Run beenden (Sieg) oder Endlos weiterspielen. Im
            Endlos-Modus gibt es danach den Shop und es geht ab Runde 26 ohne Limit
            weiter — bis du fällst. Achievements werden am Ende jedes Runs gespeichert
            und sind im Titelmenü einsehbar.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-white">Sofort-Tickets</h2>
          <p>
            Im Spiel jederzeit nutzbar (ohne Zug zu verbrauchen): Heilung, Gold, Scharfschuss,
            Impuls (+1 Zug) oder Wächter (+2 Schild). Im Shop kaufen oder als Gratis-Bonus
            nach jeder Runde.
          </p>
        </section>
        <GameButton variant="secondary" onClick={onBack}>
          Zurück
        </GameButton>
      </RuinsPanel>
    </ScreenLayout>
  );
}
