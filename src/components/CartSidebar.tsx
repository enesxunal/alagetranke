"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { formatEuro, getCasePrice } from "@/lib/pfand";
import { Button } from "@/components/ui/Button";

export function CartSidebar() {
  const { t, locale } = useTranslation();
  const {
    items,
    isOpen,
    closeCart,
    summary,
    updateCaseQuantity,
    removeCase,
  } = useCart();

  const fmtLocale =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">{t("cart_title")}</h2>
          <button
            onClick={closeCart}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-gray-700" />
              <p className="text-gray-400">{t("cart_empty")}</p>
              <Link href="/products" onClick={closeCart}>
                <Button variant="secondary" size="sm" className="mt-4">
                  {t("cart_continue")}
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantityCases }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-lg border border-white/5 bg-black/30 p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white/5">
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      category={product.category}
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {quantityCases}× {t("cart_quantity")} ({product.units_per_case} Stk.)
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gold">
                      {formatEuro(getCasePrice(product) * quantityCases, fmtLocale)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCaseQuantity(product.id, quantityCases - 1)
                        }
                        className="rounded border border-white/10 p-1 text-gray-400 hover:text-gold"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm text-white w-6 text-center">
                        {quantityCases}
                      </span>
                      <button
                        onClick={() =>
                          updateCaseQuantity(product.id, quantityCases + 1)
                        }
                        className="rounded border border-white/10 p-1 text-gray-400 hover:text-gold"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeCase(product.id)}
                        className="ml-auto text-xs text-red-400 hover:text-red-300"
                      >
                        {t("cart_remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{t("cart_net_product")}</span>
                <span>{formatEuro(summary.netProductTotal, fmtLocale)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t("cart_pfand")}</span>
                <span>{formatEuro(summary.pfandTotal, fmtLocale)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t("cart_vat")}</span>
                <span>{formatEuro(summary.vatTotal, fmtLocale)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white pt-1 border-t border-white/10">
                <span>{t("cart_total")}</span>
                <span className="text-gold">
                  {formatEuro(summary.grossTotal, fmtLocale)}
                </span>
              </div>
            </div>
            <Link href="/cart" onClick={closeCart}>
              <Button className="w-full">{t("cart_checkout")}</Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
