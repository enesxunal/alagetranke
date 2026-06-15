"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { fetchAllOrdersAdmin, updateOrderStatusDb } from "@/lib/supabase/data";
import type { Order, OrderStatus } from "@/types/database.types";
import { getStatusLabel } from "@/lib/i18n";
import { formatEuro } from "@/lib/pfand";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchAllOrdersAdmin();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatusDb(orderId, status);
    load();
  };

  if (loading) return <p className="text-gray-400">{t("loading")}</p>;

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">{t("admin_orders")}</h2>

      {orders.length === 0 ? (
        <Card>
          <p className="text-gray-400">{t("dashboard_no_orders")}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <button
                className="flex w-full items-start justify-between gap-4 text-left"
                onClick={() =>
                  setExpanded(expanded === order.id ? null : order.id)
                }
              >
                <div>
                  <p className="font-mono text-sm text-gold">{order.id}</p>
                  {order.customer_company && (
                    <p className="text-sm text-white mt-1">{order.customer_company}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleString(fmt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="muted">{order.fulfillment_type}</Badge>
                    <Badge variant="muted">{order.payment_method}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-bold text-gold">
                    {formatEuro(order.total, fmt)}
                  </p>
                  {expanded === order.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              {expanded === order.id && (
                <div className="mt-4 border-t border-white/10 pt-4 space-y-4">
                  {order.delivery_street && (
                    <p className="text-sm text-gray-400">
                      {order.delivery_street}, {order.delivery_postal_code}{" "}
                      {order.delivery_city}
                    </p>
                  )}

                  {order.items && order.items.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-gray-300">
                        {t("admin_order_items")}
                      </p>
                      <div className="rounded-lg border border-white/5 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-black/30 text-gray-400 text-left">
                              <th className="px-3 py-2">Produkt</th>
                              <th className="px-3 py-2">Menge</th>
                              <th className="px-3 py-2 text-right">Summe</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, i) => (
                              <tr key={i} className="border-t border-white/5">
                                <td className="px-3 py-2 text-white">
                                  {item.product_name}
                                </td>
                                <td className="px-3 py-2 text-gray-400">
                                  {item.quantity_cases} Kasten
                                </td>
                                <td className="px-3 py-2 text-right text-gold">
                                  {formatEuro(item.line_total, fmt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Netto: {formatEuro(order.subtotal_net, fmt)}</span>
                    <span>Pfand: {formatEuro(order.pfand_total, fmt)}</span>
                    <span>MwSt: {formatEuro(order.vat_total, fmt)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
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
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
