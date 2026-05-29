import type { ReactNode } from 'react';
import { ScreenLayout } from './ui/ScreenLayout';
import { StoneGroundSurface } from './ui/StoneGroundSurface';
import { StoneMenuButton } from './ui/StoneMenuButton';

interface HowToPlayScreenProps {
  onBack: () => void;
}

const bodyTextShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

const sectionTitleShadow =
  '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(0,0,0,1)';

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2
        className="mb-2 font-display text-base font-bold text-loop-accentHover sm:text-lg"
        style={{ textShadow: sectionTitleShadow }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function HowToPlayScreen({ onBack }: HowToPlayScreenProps) {
  return (
    <ScreenLayout title="So geht's" subtitle="Kurzanleitung">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
        <StoneGroundSurface scrollable className="max-h-[min(70vh,720px)]">
          <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
            <Section title="Ziel">
              <p
                className="text-sm leading-relaxed text-stone-200/90 sm:text-base"
                style={{ textShadow: bodyTextShadow }}
              >
                Eliminiere alle Gegner auf dem Kreis, bevor deine Züge aufgebraucht sind.
                Überlebe 25 Runden und besiege die Bosse, um die Kampagne zu gewinnen.
              </p>
            </Section>

            <Section title="Chips">
              <p
                className="text-sm leading-relaxed text-stone-200/90 sm:text-base"
                style={{ textShadow: bodyTextShadow }}
              >
                Jede Runde ziehst du 5 Chips (Werte 1–4). Wähle mehrere aus und spiele sie — die
                Summe bewegt dich im Uhrzeigersinn. Landest du auf einem Gegner, wird er
                rausgeworfen. Abwürfe erlauben eine neue Hand (begrenzt pro Runde).
              </p>
            </Section>

            <Section title="Gegner">
              <ul
                className="list-inside list-disc space-y-1.5 text-sm text-stone-200/90 sm:text-base"
                style={{ textShadow: bodyTextShadow }}
              >
                <li>Normal: 1 Feld pro Zug</li>
                <li>Schnell: 2 Felder</li>
                <li>Tank: 2 Treffer nötig</li>
                <li>Elite: stärker, 2 Treffer</li>
                <li>Boss: viele Leben, extra Schaden (alle 5 Runden)</li>
              </ul>
            </Section>

            <Section title="Shop & Gold">
              <p
                className="text-sm leading-relaxed text-stone-200/90 sm:text-base"
                style={{ textShadow: bodyTextShadow }}
              >
                Besiegte Gegner geben Gold (Boss am meisten). Nach jeder gewonnenen Runde öffnet
                sich der Shop für Chips und Sofort-Tickets. Nach jeder Boss-Runde (5, 10, 15, 20,
                25) wählst du zuerst genau ein permanentes Upgrade aus drei Optionen, danach den
                Shop. Pro Shop gibt es 1 zufälliges Gratis-Sofort-Ticket; weitere sind käuflich.
              </p>
            </Section>

            <Section title="Spezial-Chips">
              <ul
                className="list-inside list-disc space-y-1.5 text-sm text-stone-200/90 sm:text-base"
                style={{ textShadow: bodyTextShadow }}
              >
                <li>Teleport: halbe Runde springen</li>
                <li>Überladung: verdoppelt Lauf-Schritte der gleichzeitig gespielten Chips</li>
                <li>Sturm / Sprung: 3 bzw. 4 Felder gegen den Uhrzeigersinn</li>
                <li>Enterhaken: springe zum nächsten Gegner (+ Lauf-Chips)</li>
                <li>Durchstoß / Spalt: Treffer entlang des Wegs bzw. auf den nächsten Gegner</li>
                <li>Echo / Späher: zieht 1 bzw. 2 Chips nach dem Zug</li>
                <li>Nova: alle Gegner -1 Treffer</li>
                <li>Rückzug: 2 Felder zurück</li>
              </ul>
            </Section>

            <Section title="Kampagnen-Sieg & Endlos">
              <p
                className="text-sm leading-relaxed text-stone-200/90 sm:text-base"
                style={{ textShadow: bodyTextShadow }}
              >
                Nach Runde 25 wählst du: Run beenden (Sieg) oder Endlos weiterspielen. Im
                Endlos-Modus gibt es danach den Shop und es geht ab Runde 26 ohne Limit weiter
                — bis du fällst. Achievements werden am Ende jedes Runs gespeichert und sind im
                Titelmenü einsehbar.
              </p>
            </Section>

            <Section title="Sofort-Tickets">
              <p
                className="text-sm leading-relaxed text-stone-200/90 sm:text-base"
                style={{ textShadow: bodyTextShadow }}
              >
                Im Spiel jederzeit nutzbar (ohne Zug zu verbrauchen): Heilung, Gold, Scharfschuss,
                Impuls (+1 Zug) oder Wächter (+2 Schild). Im Shop kaufen oder als Gratis-Bonus
                nach jeder Runde.
              </p>
            </Section>
          </div>
        </StoneGroundSurface>

        <StoneMenuButton label="Zurück" onClick={onBack} className="w-full max-w-none" />
      </div>
    </ScreenLayout>
  );
}
