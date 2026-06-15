"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Award,
  Package,
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useProducts } from "@/context/ProductStoreContext";
import { ProductCard } from "@/components/ProductCard";
import { HeroBanner } from "@/components/HeroBanner";
import { Button } from "@/components/ui/Button";
import { getCategoryLabel } from "@/lib/i18n";
import { categoryNavItems } from "@/lib/categories";

export default function HomePage() {
  const { t, locale } = useTranslation();
  const { products } = useProducts();

  const featured = products.slice(0, 8);

  const features = [
    {
      icon: Award,
      title: t("feature_wholesale"),
      desc: t("feature_wholesale_desc"),
    },
    {
      icon: Truck,
      title: t("feature_pickup"),
      desc: t("feature_pickup_desc"),
    },
    {
      icon: Package,
      title: t("feature_quality"),
      desc: t("feature_quality_desc"),
    },
  ];

  return (
    <>
      <HeroBanner />

      {/* Promo strip */}
      <section className="relative overflow-hidden border-y border-gold/20 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent">
        <div className="absolute inset-0 bg-[url('/products/hero-banner.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:py-8 lg:px-8">
          <div>
            <p className="text-lg font-bold text-gold sm:text-xl">{t("promo_title")}</p>
            <p className="text-sm text-gray-400 mt-1">{t("promo_subtitle")}</p>
          </div>
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              {t("hero_cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories with images */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16 lg:px-8">
        <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
          {t("nav_categories")}
        </h2>
        <p className="mb-8 text-sm text-gray-500">{t("nav_categories_subtitle")}</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categoryNavItems.map(({ id, icon: Icon, image }) => (
            <Link
              key={id}
              href={`/products?category=${id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt={getCategoryLabel(locale, id)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width:768px) 50vw, 14vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-gold" />
                  <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">
                    {getCategoryLabel(locale, id)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface/50 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center md:text-left">
                <div className="mb-4 inline-flex rounded-xl bg-gold/10 p-3">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{t("nav_products")}</h2>
          <Link href="/products">
            <Button variant="ghost" size="sm">
              {t("hero_cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
