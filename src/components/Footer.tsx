"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/5 bg-surface safe-bottom">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gold">
              {t("footer_company")}
            </h3>
            <p className="text-sm text-gray-400">{t("footer_tagline")}</p>
            <p className="mt-4 text-xs text-gray-500 italic">
              {t("footer_b2b_note")}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t("footer_hours")}
            </h4>
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {t("footer_hours_value")}
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-gray-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {t("footer_address")}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Kontakt
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                {t("footer_phone")}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                {t("footer_mobile")}
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${t("footer_contact_email")}`}
                  className="truncate hover:text-gold transition-colors"
                >
                  {t("footer_contact_email")}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t("footer_legal")}
            </h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/agb"
                className="text-gray-300 hover:text-gold transition-colors"
              >
                {t("footer_agb")}
              </Link>
              <Link
                href="/datenschutz"
                className="text-gray-300 hover:text-gold transition-colors"
              >
                {t("footer_datenschutz")}
              </Link>
              <Link
                href="/impressum"
                className="text-gray-300 hover:text-gold transition-colors"
              >
                {t("footer_impressum")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Alagetränke GmbH. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
