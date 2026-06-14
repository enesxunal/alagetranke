"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Globe,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { locales, localeLabels, getCategoryLabel, type Locale } from "@/lib/i18n";
import { categoryNavItems } from "@/lib/categories";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isCategoryActive = (id: string) =>
    pathname.startsWith("/products") && activeCategory === id;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.svg"
            alt="Alagetränke GmbH"
            width={180}
            height={34}
            className="h-8 w-auto lg:h-9"
            priority
          />
        </Link>

        {/* Desktop: flat category links like classic e-commerce */}
        <nav className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
          {categoryNavItems.map(({ id, icon: Icon }) => (
            <Link
              key={id}
              href={`/products?category=${id}`}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isCategoryActive(id)
                  ? "bg-gold/10 text-gold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {getCategoryLabel(locale, id)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-gold"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline uppercase">{locale}</span>
            </button>
            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-white/10 bg-surface py-1 shadow-xl">
                  {locales.map((l: Locale) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLocale(l);
                        setLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                        locale === l ? "text-gold" : "text-gray-300"
                      }`}
                    >
                      {localeLabels[l]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={openCart}
            className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-gold"
            aria-label={t("nav_cart")}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-1 md:flex">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">{t("nav_dashboard")}</span>
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="secondary" size="sm">
                    <Shield className="h-4 w-4" />
                    <span className="hidden lg:inline">{t("nav_admin")}</span>
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("nav_login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  {t("nav_register")}
                </Button>
              </Link>
            </div>
          )}

          <button
            className="rounded-lg p-2 text-gray-400 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Tablet: horizontal category scroll */}
      <div className="border-t border-white/5 bg-black/50 xl:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
          {categoryNavItems.map(({ id, icon: Icon }) => (
            <Link
              key={id}
              href={`/products?category=${id}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isCategoryActive(id)
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-white/10 text-gray-400 hover:border-gold/20 hover:text-white"
              }`}
            >
              <Icon className="h-3 w-3" />
              {getCategoryLabel(locale, id)}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-surface px-4 py-4 xl:hidden">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t("nav_categories_subtitle")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {categoryNavItems.map(({ id, icon: Icon }) => (
              <Link
                key={id}
                href={`/products?category=${id}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                  isCategoryActive(id)
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-white/5 text-gray-300 hover:border-gold/20"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {getCategoryLabel(locale, id)}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    {t("nav_dashboard")}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
                      {t("nav_admin")}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  {t("nav_logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    {t("nav_login")}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    {t("nav_register")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
