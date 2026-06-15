"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Building2,
  Package,
  ChevronDown,
  ChevronUp,
  Save,
  User,
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types/database.types";
import { getStatusLabel } from "@/lib/i18n";
import { formatEuro } from "@/lib/pfand";
import { fetchUserOrders, updateOwnProfile } from "@/lib/supabase/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Tabs } from "@/components/ui/Tabs";

export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const { user, isAuthenticated, canSeePrices, refreshProfile } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profileForm, setProfileForm] = useState({
    company_name: "",
    ust_id_nr: "",
    phone: "",
    contact_name: "",
    street: "",
    city: "",
    postal_code: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user) {
      setProfileForm({
        company_name: user.company_name ?? "",
        ust_id_nr: user.ust_id_nr ?? "",
        phone: user.phone ?? "",
        contact_name: user.contact_name ?? "",
        street: user.street ?? "",
        city: user.city ?? "",
        postal_code: user.postal_code ?? "",
        notes: user.notes ?? "",
      });
      fetchUserOrders(user.id).then(setOrders);
    }
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  const tabs = [
    { id: "overview", label: t("dash_tab_overview") },
    { id: "profile", label: t("dash_tab_profile") },
    { id: "orders", label: t("dash_tab_orders") },
  ];

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateOwnProfile(user.id, profileForm);
      await refreshProfile();
      setMessage(t("dash_saved"));
    } catch {
      setMessage(t("error_generic"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{t("dashboard_title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {user.contact_name || user.company_name}
            {user.email ? ` · ${user.email}` : ""}
          </p>
        </div>
        {user.discount_percent && user.discount_percent > 0 ? (
          <Badge variant="gold" className="text-sm px-3 py-1">
            {t("dash_your_discount")}: {user.discount_percent}%
          </Badge>
        ) : null}
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab}>
        {tab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">{t("dashboard_company")}</p>
                  <p className="mt-1 font-semibold text-white">{user.company_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.ust_id_nr}</p>
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
                  <Badge variant={canSeePrices ? "success" : "warning"} className="mt-2">
                    {canSeePrices ? t("dashboard_approved") : t("dashboard_pending")}
                  </Badge>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">{t("dashboard_orders")}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{orders.length}</p>
                </div>
              </div>
            </Card>
            <Link href="/products">
              <Button variant="secondary">{t("hero_cta")}</Button>
            </Link>
          </div>
        )}

        {tab === "profile" && (
          <Card>
            <div className="mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-semibold text-white">{t("dash_edit_profile")}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("register_company")}
                value={profileForm.company_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, company_name: e.target.value })
                }
              />
              <Input
                label={t("register_tax_id")}
                value={profileForm.ust_id_nr}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, ust_id_nr: e.target.value })
                }
              />
              <Input
                label={t("dash_contact_name")}
                value={profileForm.contact_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, contact_name: e.target.value })
                }
              />
              <Input
                label={t("register_phone")}
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
              />
              <Input
                label={t("checkout_delivery_street")}
                value={profileForm.street}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, street: e.target.value })
                }
              />
              <Input
                label={t("checkout_delivery_postal")}
                value={profileForm.postal_code}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, postal_code: e.target.value })
                }
              />
              <Input
                label={t("checkout_delivery_city")}
                value={profileForm.city}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, city: e.target.value })
                }
              />
              <div className="sm:col-span-2">
                <Textarea
                  label={t("dash_notes")}
                  value={profileForm.notes}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, notes: e.target.value })
                  }
                />
              </div>
            </div>
            {message && (
              <p className={`mt-4 text-sm ${message === t("dash_saved") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
            <Button className="mt-6" onClick={handleSaveProfile} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? t("loading") : t("admin_save")}
            </Button>
          </Card>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <p className="text-gray-400">{t("dashboard_no_orders")}</p>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                  >
                    <div>
                      <p className="font-mono text-sm text-gold">{order.id.slice(0, 20)}…</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleString(fmt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
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
                      <span className="font-semibold text-gold">
                        {formatEuro(order.total, fmt)}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedOrder === order.id && (
                    <div className="mt-4 border-t border-white/10 pt-4 space-y-4">
                      <div className="grid gap-2 sm:grid-cols-2 text-sm">
                        <div>
                          <span className="text-gray-500">{t("checkout_fulfillment")}: </span>
                          <span className="text-white">{order.fulfillment_type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">{t("checkout_payment")}: </span>
                          <span className="text-white">{order.payment_method}</span>
                        </div>
                        {order.delivery_street && (
                          <div className="sm:col-span-2 text-gray-400">
                            {order.delivery_street}, {order.delivery_postal_code}{" "}
                            {order.delivery_city}
                          </div>
                        )}
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="rounded-lg border border-white/5 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-black/30 text-gray-400 text-left">
                                <th className="px-3 py-2">{t("nav_products")}</th>
                                <th className="px-3 py-2">{t("cart_quantity")}</th>
                                <th className="px-3 py-2 text-right">{t("cart_total")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, i) => (
                                <tr key={i} className="border-t border-white/5">
                                  <td className="px-3 py-2 text-white">{item.product_name}</td>
                                  <td className="px-3 py-2 text-gray-400">
                                    {item.quantity_cases}× ({item.units_per_case} Stk.)
                                  </td>
                                  <td className="px-3 py-2 text-right text-gold">
                                    {formatEuro(item.line_total, fmt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>{t("cart_net_product")}: {formatEuro(order.subtotal_net, fmt)}</span>
                        <span>{t("cart_pfand")}: {formatEuro(order.pfand_total, fmt)}</span>
                        <span>{t("cart_vat")}: {formatEuro(order.vat_total, fmt)}</span>
                        {(order.discount_total ?? 0) > 0 && (
                          <span className="text-gold">
                            Rabatt: -{formatEuro(order.discount_total!, fmt)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
}
