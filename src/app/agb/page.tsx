"use client";

import { useTranslation } from "@/context/LanguageContext";
import { Card } from "@/components/ui/Card";

export default function AGBPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">
        {t("legal_agb_title")}
      </h1>
      <Card className="prose prose-invert max-w-none space-y-4 text-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">§ 1 Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen und
            Lieferungen der Alagetränke GmbH, Industriestraße 45, 50389 Wesseling
            (nachfolgend &quot;Anbieter&quot;), ausschließlich gegenüber gewerblichen Kunden
            im Sinne des § 14 BGB.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">§ 2 Vertragsschluss</h2>
          <p>
            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes
            Angebot dar. Durch Absenden einer Bestellung gibt der Kunde ein verbindliches
            Angebot ab. Der Vertrag kommt zustande, wenn der Anbieter die Bestellung
            bestätigt.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">§ 3 Preise und Pfand</h2>
          <p>
            Alle angegebenen Preise verstehen sich in Euro und enthalten die gesetzliche
            Mehrwertsteuer sowie das Pfand, sofern nicht anders angegeben. Das Pfand
            wird gesondert in der Rechnung ausgewiesen.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">§ 4 Lieferung und Abholung</h2>
          <p>
            Der Kunde kann zwischen Abholung in unserem Lager in Wesseling und
            Lieferservice wählen. Lieferbedingungen werden individuell vereinbart.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">§ 5 Zahlung</h2>
          <p>
            Zahlung ist per Barzahlung bei Abholung, Online-Zahlung oder PayPal möglich.
            Bei gewerblichen Kunden kann auf Rechnung geliefert werden, sofern vereinbart.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">§ 6 Gewährleistung</h2>
          <p>
            Es gelten die gesetzlichen Gewährleistungsrechte. Mängel sind unverzüglich
            nach Entdeckung schriftlich anzuzeigen.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">§ 7 Schlussbestimmungen</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Köln,
            sofern der Kunde Kaufmann ist.
          </p>
        </section>
      </Card>
    </div>
  );
}
