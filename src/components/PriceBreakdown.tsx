"use client";

import { useTranslation } from "@/context/LanguageContext";
import { formatEuro } from "@/lib/pfand";

interface PriceBreakdownProps {
  netProduct: number;
  pfand: number;
  vat: number;
  total: number;
  discount?: number;
}

export function PriceBreakdown({
  netProduct,
  pfand,
  vat,
  total,
  discount,
}: PriceBreakdownProps) {
  const { t, locale } = useTranslation();
  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  const rows = [
    { label: t("cart_net_product"), value: netProduct },
    ...(discount && discount > 0
      ? [{ label: t("cart_discount"), value: -discount }]
      : []),
    { label: t("cart_pfand"), value: pfand },
    { label: t("cart_vat"), value: vat },
  ];

  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-black/30 p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        {t("cart_summary")}
      </h3>
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between text-sm">
          <span className="text-gray-400">{row.label}</span>
          <span className="text-gray-200">{formatEuro(row.value, fmt)}</span>
        </div>
      ))}
      <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold">
        <span className="text-white">{t("cart_total")}</span>
        <span className="text-gold">{formatEuro(total, fmt)}</span>
      </div>
    </div>
  );
}
