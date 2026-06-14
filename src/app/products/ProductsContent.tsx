"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useProducts } from "@/context/ProductStoreContext";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/Input";
import { getCategoryLabel } from "@/lib/i18n";
import { categories } from "@/data/products";

export default function ProductsContent() {
  const { t, locale } = useTranslation();
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category");
  const category =
    categoryParam && categories.includes(categoryParam as (typeof categories)[number])
      ? categoryParam
      : null;

  const [search, setSearch] = useState("");

  const setCategoryFilter = (cat: string | null) => {
    if (cat) {
      router.push(`/products?category=${cat}`, { scroll: false });
    } else {
      router.push("/products", { scroll: false });
    }
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = !category || p.category === category;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {category
            ? getCategoryLabel(locale, category)
            : t("products_title")}
        </h1>
        {category && (
          <button
            onClick={() => setCategoryFilter(null)}
            className="mt-2 text-sm text-gold hover:underline"
          >
            ← {t("products_all_categories")}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-24 space-y-2 rounded-xl glass-panel p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("products_all_categories")}
            </p>
            <button
              onClick={() => setCategoryFilter(null)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !category
                  ? "bg-gold/10 text-gold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {t("products_all_categories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  category === cat
                    ? "bg-gold/10 text-gold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {getCategoryLabel(locale, cat)}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder={t("products_search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-gray-500">
              {t("products_no_results")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
