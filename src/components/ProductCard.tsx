"use client";

import Link from "next/link";
import { Lock, ShoppingBag, EyeOff, CheckCircle } from "lucide-react";
import type { Product } from "@/types/database.types";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getCategoryLabel } from "@/lib/i18n";
import { formatEuro } from "@/lib/pfand";
import { ProductImage } from "@/components/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, locale } = useTranslation();
  const { canSeePrices, isAuthenticated } = useAuth();
  const { addCase } = useCart();

  const showPrices = canSeePrices;
  const showPending = isAuthenticated && !canSeePrices;

  return (
    <Card hover className="flex flex-col overflow-hidden p-0">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square overflow-hidden bg-white/5"
      >
        <ProductImage
          src={product.image_url}
          alt={product.name}
          category={product.category}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute left-2 top-2 z-10 sm:left-3 sm:top-3">
          <Badge variant="gold" className="text-[10px] px-1.5 py-0.5 sm:text-xs sm:px-2 sm:py-1">
            {getCategoryLabel(locale, product.category)}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-gold transition-colors sm:text-base">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500">
          {product.units_per_case > 1
            ? `(${product.units_per_case}x${product.name.match(/[\d,]+l/)?.[0] ?? "Stück"})`
            : "Einzelstück"}
        </p>

        <div className="mt-auto pt-3 sm:pt-4">
          {showPrices ? (
            <div className="mb-2 sm:mb-3">
              <p className="text-lg font-bold text-gold sm:text-2xl">
                {formatEuro(
                  product.unit_price_with_pfand,
                  locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE"
                )}
              </p>
              <p className="text-xs text-gray-500">
                {t("products_unit_price")} · {t("products_pfand_included")}
              </p>
            </div>
          ) : showPending ? (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-yellow-900/20 px-3 py-2">
              <EyeOff className="h-4 w-4 text-yellow-500 shrink-0" />
              <p className="text-xs text-yellow-400">
                {t("approval_pending_short")}
              </p>
            </div>
          ) : (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <Lock className="h-4 w-4 text-gray-500 shrink-0" />
              <p className="text-xs text-gray-400">{t("price_locked_short")}</p>
            </div>
          )}

          {showPrices && product.stock > 0 ? (
            <Button
              className="w-full"
              size="sm"
              onClick={() => addCase(product)}
            >
              <ShoppingBag className="h-4 w-4" />
              {t("products_add_case")}
            </Button>
          ) : showPrices ? (
            <Button className="w-full" size="sm" disabled variant="secondary">
              {t("products_out_of_stock")}
            </Button>
          ) : (
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button className="w-full" size="sm" variant="secondary">
                {isAuthenticated ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {t("approval_pending_short")}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    {t("login_to_order")}
                  </>
                )}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
