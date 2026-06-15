"use client";

import { useTranslation } from "@/context/LanguageContext";
import { Card } from "@/components/ui/Card";

export default function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">
        {t("legal_impressum_title")}
      </h1>
      <Card className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">Angaben gemäß § 5 TMG</h2>
          <p>
            <strong className="text-white">Alagetränke GmbH</strong><br />
            Industriestraße 45<br />
            50389 Wesseling<br />
            Deutschland
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">Kontakt</h2>
          <p>
            Telefon: 02232 1507729<br />
            Mobil/WhatsApp: 0176 30716796<br />
            E-Mail: buchhaltung@alagetraenke.de
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">Öffnungszeiten</h2>
          <p>Mo–Fr: 08:00 – 18:00 Uhr</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
            [USt-IdNr. eintragen]
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">Geschäftsführung</h2>
          <p>[Name des Geschäftsführers eintragen]</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">Registergericht</h2>
          <p>
            Registergericht: Amtsgericht [Ort]<br />
            Registernummer: HRB [Nummer]
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gold mb-2">Haftungsausschluss</h2>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für
            die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind
            ausschließlich deren Betreiber verantwortlich.
          </p>
        </section>
      </Card>
    </div>
  );
}
