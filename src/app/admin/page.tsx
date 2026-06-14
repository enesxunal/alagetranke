"use client";

import { useMemo } from "react";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { getAllOrders, getDemoProfiles } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductStoreContext";
import { formatEuro } from "@/lib/pfand";
import { Card } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  const { t, locale } = useTranslation();
  const { products } = useProducts();
  const orders = getAllOrders();
  const customers = getDemoProfiles();

  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  const revenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders]
  );

  const pendingApprovals = customers.filter((c) => !c.is_approved).length;

  const stats = [
    {
      icon: ShoppingCart,
      label: t("admin_total_orders"),
      value: orders.length.toString(),
    },
    {
      icon: Users,
      label: t("admin_total_customers"),
      value: customers.length.toString(),
    },
    {
      icon: Package,
      label: t("admin_products"),
      value: products.length.toString(),
    },
    {
      icon: TrendingUp,
      label: t("admin_revenue"),
      value: formatEuro(revenue, fmt),
    },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gold/10 p-2">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-white">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pendingApprovals > 0 && (
        <Card className="border-yellow-800/50 bg-yellow-900/10">
          <p className="text-yellow-400">
            {t("admin_pending_approvals")}: {pendingApprovals}
          </p>
        </Card>
      )}

      <Card className="mt-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {t("admin_orders")}
        </h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("dashboard_no_orders")}</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex justify-between rounded-lg bg-black/30 px-4 py-3 text-sm"
              >
                <span className="text-gray-300 font-mono">{order.id}</span>
                <span className="text-gold font-semibold">
                  {formatEuro(order.total, fmt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
