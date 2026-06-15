"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { formatEuro, getCasePrice } from "@/lib/pfand";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { t, locale } = useTranslation();
  const {
    items,
    summary,
    updateCaseQuantity,
    removeCase,
    clearCart,
  } = useCart();

  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-xl text-gray-400">{t("cart_empty")}</p>
        <Link href="/products">
          <Button className="mt-6">{t("cart_continue")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{t("cart_title")}</h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="self-start">
          <Trash2 className="h-4 w-4" />
          {t("cart_clear")}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantityCases }) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-xl glass-panel p-3 sm:flex-row sm:gap-4 sm:p-4"
            >
              <div className="flex gap-3 sm:gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:h-20 sm:w-20">
                  <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    category={product.category}
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {product.units_per_case} Stk./{t("cart_quantity")} ·{" "}
                    {formatEuro(product.unit_price_with_pfand, fmt)}/Stk.
                  </p>
                  <p className="mt-2 font-semibold text-gold">
                    {formatEuro(getCasePrice(product) * quantityCases, fmt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-3 sm:flex-col sm:items-end sm:justify-between sm:border-0 sm:pt-0">
                <button
                  onClick={() => removeCase(product.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  {t("cart_remove")}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateCaseQuantity(product.id, quantityCases - 1)
                    }
                    className="rounded border border-white/10 p-1.5 text-gray-400 hover:text-gold"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {quantityCases}
                  </span>
                  <button
                    onClick={() =>
                      updateCaseQuantity(product.id, quantityCases + 1)
                    }
                    className="rounded border border-white/10 p-1.5 text-gray-400 hover:text-gold"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <p className="text-sm text-gray-500">
            {t("cart_units_total")}: {summary.totalUnits}
          </p>
        </div>

        <div className="space-y-4">
          <PriceBreakdown
            netProduct={summary.netProductTotal}
            pfand={summary.pfandTotal}
            vat={summary.vatTotal}
            total={summary.grossTotal}
          />
          <Link href="/checkout">
            <Button className="w-full" size="lg">
              {t("cart_checkout")}
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary" className="w-full">
              {t("cart_continue")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
