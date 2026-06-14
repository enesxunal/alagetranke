"use client";

import { useTranslation } from "@/context/LanguageContext";
import { Card } from "@/components/ui/Card";

export default function DatenschutzPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">
        {t("legal_datenschutz_title")}
      </h1>
      <Card className="space-y-4 text-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">1. Verantwortlicher</h2>
          <p>
            Alagetränke GmbH<br />
            Industriestraße 45<br />
            50389 Wesseling<br />
            E-Mail: info@alagetrank.de<br />
            Telefon: 02232 1507729
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">2. Erhebung personenbezogener Daten</h2>
          <p>
            Bei der Registierung und Bestellung erheben wir folgende Daten:
            Firmenname, USt-IdNr., E-Mail-Adresse, Telefonnummer sowie
            Bestell- und Lieferdaten.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">3. Zweck der Verarbeitung</h2>
          <p>
            Die Daten werden zur Abwicklung von B2B-Bestellungen, zur Kundenverifizierung
            und zur Erfüllung gesetzlicher Pflichten verarbeitet.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">4. Rechtsgrundlage</h2>
          <p>
            Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. c DSGVO
            (rechtliche Verpflichtung).
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">5. Speicherdauer</h2>
          <p>
            Personenbezogene Daten werden so lange gespeichert, wie es für die
            Vertragsabwicklung und gesetzliche Aufbewahrungsfristen erforderlich ist.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">6. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
            der Verarbeitung, Datenübertragbarkeit und Widerspruch. Beschwerden können
            Sie an die zuständige Datenschutzbehörde richten.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">7. Cookies</h2>
          <p>
            Diese Website verwendet technisch notwendige Cookies für Spracheinstellungen
            und Warenkorb-Funktionen. Es werden keine Tracking-Cookies ohne Einwilligung gesetzt.
          </p>
        </section>
      </Card>
    </div>
  );
}
