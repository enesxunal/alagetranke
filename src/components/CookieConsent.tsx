"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "alagetrank-cookie-consent";

export function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-3 safe-bottom sm:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-gold/20 bg-surface/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-md sm:flex-row sm:items-center sm:gap-6">
        <div className="flex shrink-0 items-center justify-center rounded-xl bg-gold/10 p-3 self-start">
          <Cookie className="h-6 w-6 text-gold" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{t("cookie_title")}</h3>
          <p className="mt-1 text-sm text-gray-400 leading-relaxed">
            {t("cookie_text")}{" "}
            <Link
              href="/datenschutz"
              className="text-gold underline underline-offset-2 hover:text-gold-light"
            >
              {t("footer_datenschutz")}
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button size="sm" onClick={accept}>
            {t("cookie_accept")}
          </Button>
          <Button size="sm" variant="secondary" onClick={decline}>
            {t("cookie_decline")}
          </Button>
          <button
            onClick={decline}
            className="rounded-lg p-2 text-gray-500 hover:text-white sm:hidden"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
