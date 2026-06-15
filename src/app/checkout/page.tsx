"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Truck, CreditCard, Banknote } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { FulfillmentType, OrderItem, PaymentMethod } from "@/types/database.types";
import { createOrderDb, fetchActiveCampaigns } from "@/lib/supabase/data";
import {
  applyDiscountToSummary,
  getApplicableDiscountPercent,
} from "@/lib/discount";
import { VAT_RATE, getCasePrice } from "@/lib/pfand";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { isAuthenticated, canSeePrices, user } = useAuth();
  const { items, summary, clearCart } = useCart();
  const router = useRouter();

  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchActiveCampaigns().then((campaigns) => {
      setDiscountPercent(
        getApplicableDiscountPercent(
          user.id,
          items,
          user.discount_percent ?? 0,
          campaigns
        )
      );
    });
  }, [user, items]);

  const pricing = useMemo(() => {
    const result = applyDiscountToSummary(
      summary.netProductTotal,
      summary.pfandTotal,
      VAT_RATE,
      discountPercent
    );
    return result;
  }, [summary, discountPercent]);

  if (!isAuthenticated || !canSeePrices) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-gray-400">{t("price_locked")}</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          {t("nav_login")}
        </Button>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderId = `ORD-${Date.now()}`;
    const orderItems: OrderItem[] = items.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity_cases: item.quantityCases,
      units_per_case: item.product.units_per_case,
      unit_price_with_pfand: item.product.unit_price_with_pfand,
      pfand_per_unit: item.product.pfand_per_unit,
      line_total: getCasePrice(item.product) * item.quantityCases,
    }));

    const order = {
      id: orderId,
      user_id: user!.id,
      status: "pending" as const,
      fulfillment_type: fulfillment,
      payment_method: payment,
      delivery_street: fulfillment === "delivery" ? street : null,
      delivery_city: fulfillment === "delivery" ? city : null,
      delivery_postal_code: fulfillment === "delivery" ? postal : null,
      delivery_notes: notes || null,
      subtotal_net: pricing.adjustedNet,
      pfand_total: summary.pfandTotal,
      vat_total: pricing.vatTotal,
      discount_total: pricing.discountTotal,
      total: pricing.grossTotal,
      created_at: new Date().toISOString(),
    };

    try {
      await createOrderDb(order, orderItems);
      fetch("/api/orders/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order,
          items: orderItems,
          companyName: user!.company_name,
          customerEmail: user!.email,
        }),
      }).catch(() => {});
      clearCart();
      setSuccess(true);
    } catch {
      alert(t("error_generic"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-2xl glass-panel p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30">
            <CreditCard className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {t("checkout_order_success")}
          </h1>
          {payment === "paypal" && (
            <p className="mt-3 text-sm text-gray-400">
              {t("checkout_paypal_placeholder")}
            </p>
          )}
          <Button className="mt-6" onClick={() => router.push("/dashboard")}>
            {t("nav_dashboard")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-3xl">{t("checkout_title")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Fulfillment */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold">{t("checkout_fulfillment")}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    fulfillment === "pickup"
                      ? "border-gold/50 bg-gold/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{t("checkout_pickup")}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {t("footer_address")}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    fulfillment === "delivery"
                      ? "border-gold/50 bg-gold/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <Truck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{t("checkout_delivery")}</p>
                  </div>
                </button>
              </div>
            </Card>

            {fulfillment === "delivery" && (
              <Card>
                <h2 className="mb-4 text-lg font-semibold">{t("checkout_delivery")}</h2>
                <div className="space-y-4">
                  <Input
                    label={t("checkout_delivery_street")}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label={t("checkout_delivery_postal")}
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      required
                    />
                    <Input
                      label={t("checkout_delivery_city")}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label={t("checkout_delivery_notes")}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </Card>
            )}

            {/* Payment */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold">{t("checkout_payment")}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { id: "cash" as const, icon: Banknote, label: t("checkout_cash") },
                    { id: "paypal" as const, icon: CreditCard, label: t("checkout_paypal") },
                    { id: "online" as const, icon: CreditCard, label: t("checkout_online") },
                  ] as const
                ).map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayment(id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      payment === id
                        ? "border-gold/50 bg-gold/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Icon className="h-6 w-6 text-gold" />
                    <span className="text-sm text-white text-center">{label}</span>
                  </button>
                ))}
              </div>

              {payment === "paypal" && (
                <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-6 text-center">
                  <div className="mx-auto mb-3 h-12 w-40 rounded-lg bg-[#0070ba] flex items-center justify-center text-white font-bold italic text-lg">
                    Pay<span className="text-[#009cde]">Pal</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {t("checkout_paypal_placeholder")}
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <PriceBreakdown
              netProduct={pricing.adjustedNet}
              pfand={summary.pfandTotal}
              vat={pricing.vatTotal}
              total={pricing.grossTotal}
              discount={pricing.discountTotal}
            />
            {discountPercent > 0 && (
              <p className="text-sm text-gold text-center">
                {t("dash_your_discount")}: {discountPercent}%
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? t("loading") : t("checkout_place_order")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
