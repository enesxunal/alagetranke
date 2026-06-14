"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { getAllOrders, updateOrderStatus } from "@/context/AuthContext";
import type { Order, OrderStatus } from "@/types/database.types";
import { getStatusLabel } from "@/lib/i18n";
import { formatEuro } from "@/lib/pfand";
import { Badge } from "@/components/ui/Badge";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const { t, locale } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getAllOrders());
  }, []);

  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">{t("admin_orders")}</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">{t("dashboard_no_orders")}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl glass-panel p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-gold">{order.id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleString(fmt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="muted">{order.fulfillment_type}</Badge>
                    <Badge variant="muted">{order.payment_method}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gold">
                    {formatEuro(order.total, fmt)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Netto: {formatEuro(order.subtotal_net, fmt)} · Pfand:{" "}
                    {formatEuro(order.pfand_total, fmt)} · MwSt:{" "}
                    {formatEuro(order.vat_total, fmt)}
                  </p>
                </div>
              </div>

              {order.delivery_street && (
                <p className="mt-3 text-sm text-gray-400">
                  {order.delivery_street}, {order.delivery_postal_code}{" "}
                  {order.delivery_city}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">
                  {t("admin_update_status")}:
                </span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  className="rounded-lg border border-white/10 bg-black px-3 py-1.5 text-sm text-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {getStatusLabel(locale, s)}
                    </option>
                  ))}
                </select>
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "success"
                      : order.status === "cancelled"
                        ? "danger"
                        : "warning"
                  }
                >
                  {getStatusLabel(locale, order.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
