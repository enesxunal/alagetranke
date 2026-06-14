"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Building2 } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth, getAllOrders } from "@/context/AuthContext";
import type { Order } from "@/types/database.types";
import { getStatusLabel } from "@/lib/i18n";
import { formatEuro } from "@/lib/pfand";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const { user, isAuthenticated, canSeePrices, orders: authOrders } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const all = getAllOrders().filter((o) => o.user_id === user?.id);
    setOrders(all.length > 0 ? all : authOrders.filter((o) => o.user_id === user?.id));
  }, [isAuthenticated, user, authOrders, router]);

  if (!user) return null;

  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{t("dashboard_title")}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Card>
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400">{t("dashboard_company")}</p>
              <p className="mt-1 font-semibold text-white">{user.company_name}</p>
              <p className="text-xs text-gray-500 mt-1">{user.ust_id_nr}</p>
              {user.phone && (
                <p className="text-xs text-gray-500">{user.phone}</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            {canSeePrices ? (
              <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm text-gray-400">{t("dashboard_status")}</p>
              <Badge
                variant={canSeePrices ? "success" : "warning"}
                className="mt-2"
              >
                {canSeePrices ? t("dashboard_approved") : t("dashboard_pending")}
              </Badge>
              {!canSeePrices && (
                <p className="mt-2 text-xs text-gray-500">
                  {t("approval_pending")}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">{t("nav_products")}</p>
          <Link href="/products">
            <Button variant="secondary" size="sm" className="mt-3">
              {t("hero_cta")}
            </Button>
          </Link>
        </Card>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-white">
        {t("dashboard_orders")}
      </h2>

      {orders.length === 0 ? (
        <Card>
          <p className="text-gray-400">{t("dashboard_no_orders")}</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-surface text-left text-gray-400">
                <th className="px-4 py-3">{t("dashboard_order_id")}</th>
                <th className="px-4 py-3">{t("dashboard_order_date")}</th>
                <th className="px-4 py-3">{t("dashboard_order_status")}</th>
                <th className="px-4 py-3 text-right">{t("dashboard_order_total")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-white font-mono text-xs">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString(fmt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="muted">
                      {getStatusLabel(locale, order.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-gold font-semibold">
                    {formatEuro(order.total, fmt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
