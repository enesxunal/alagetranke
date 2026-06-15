"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Percent,
  Mail,
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "admin_dashboard" as const },
  { href: "/admin/products", icon: Package, labelKey: "admin_products" as const },
  { href: "/admin/orders", icon: ShoppingCart, labelKey: "admin_orders" as const },
  { href: "/admin/customers", icon: Users, labelKey: "admin_customers" as const },
  { href: "/admin/campaigns", icon: Percent, labelKey: "admin_campaigns" as const },
  { href: "/admin/email", icon: Mail, labelKey: "admin_email" as const },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-400">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-gold sm:text-2xl">{t("admin_title")}</h1>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-56 shrink-0">
          <nav className="flex gap-2 overflow-x-auto rounded-xl glass-panel p-2 scrollbar-hide lg:flex-col lg:gap-1 lg:overflow-visible lg:p-3">
            {adminLinks.map(({ href, icon: Icon, labelKey }) => (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors whitespace-nowrap lg:w-full ${
                  pathname === href
                    ? "bg-gold/10 text-gold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(labelKey)}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
