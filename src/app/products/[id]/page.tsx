"use client";

import { useParams, useRouter } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";
import Link from "next/link";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductStoreContext";
import {
  formatEuro,
  getCaseNetProduct,
  getCasePfand,
  getCasePrice,
} from "@/lib/pfand";
import { getCategoryLabel } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { canSeePrices, isAuthenticated } = useAuth();
  const { addCase } = useCart();
  const { getProduct } = useProducts();

  const product = getProduct(id);
  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-400">{t("products_no_results")}</p>
        <Link href="/products">
          <Button variant="secondary" className="mt-4">
            {t("back")}
          </Button>
        </Link>
      </div>
    );
  }

  const containerLabels: Record<string, string> = {
    can: "Dose (Einweg)",
    pet_einweg: "PET (Einweg)",
    glass_mehrweg: "Glas (Mehrweg)",
    glass_einweg: "Glas (Einweg)",
    none: "Kein Pfand",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </button>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="relative aspect-square max-h-[50vh] overflow-hidden rounded-2xl bg-white/5 sm:max-h-none lg:aspect-square">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <Badge variant="gold" className="mb-3">
            {getCategoryLabel(locale, product.category)}
          </Badge>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-gray-400">
            {product.units_per_case > 1
              ? `${t("products_case_info")}: ${product.units_per_case} Stück`
              : "Einzelstück"}
          </p>

          {canSeePrices ? (
            <div className="mt-6">
              <p className="text-3xl font-bold text-gold sm:text-4xl">
                {formatEuro(product.unit_price_with_pfand, fmt)}
              </p>
              <p className="text-sm text-gray-500">
                {t("detail_unit_price")} · {t("products_per_unit")}
              </p>
            </div>
          ) : (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <Lock className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-400">
                {isAuthenticated ? t("approval_pending") : t("price_locked")}
              </p>
            </div>
          )}

          {canSeePrices && (
            <Button
              className="mt-6 w-full sm:w-auto"
              size="lg"
              onClick={() => addCase(product)}
              disabled={product.stock <= 0}
            >
              <ShoppingBag className="h-5 w-5" />
              {t("products_add_case")}
            </Button>
          )}

          <Card className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-white">
              {t("detail_specs")}
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">{t("detail_packaging")}</dt>
                <dd className="text-white">
                  {product.units_per_case > 1
                    ? `${product.units_per_case}×`
                    : "1×"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">{t("detail_container")}</dt>
                <dd className="text-white">
                  {containerLabels[product.container_type]}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">{t("products_in_stock")}</dt>
                <dd className="text-white">{product.stock}</dd>
              </div>
            </dl>
          </Card>

          {canSeePrices && (
            <Card className="mt-4">
              <h2 className="mb-4 text-lg font-semibold text-white">
                {t("detail_pfand_breakdown")}
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t("detail_case_price")}</dt>
                  <dd className="text-gold font-semibold">
                    {formatEuro(getCasePrice(product), fmt)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t("detail_pfand_per_unit")}</dt>
                  <dd className="text-white">
                    {formatEuro(product.pfand_per_unit, fmt)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t("detail_pfand_per_case")}</dt>
                  <dd className="text-white">
                    {formatEuro(getCasePfand(product), fmt)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <dt className="text-gray-400">{t("detail_net_per_case")}</dt>
                  <dd className="text-white font-medium">
                    {formatEuro(getCaseNetProduct(product), fmt)}
                  </dd>
                </div>
              </dl>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
