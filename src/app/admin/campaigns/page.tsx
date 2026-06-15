"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Percent } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useProducts } from "@/context/ProductStoreContext";
import {
  fetchCampaigns,
  saveCampaign,
  deleteCampaign,
  fetchAllProfiles,
} from "@/lib/supabase/data";
import type { Campaign, CampaignType, Profile } from "@/types/database.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function defaultDates() {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7);
  return {
    starts_at: start.toISOString().slice(0, 16),
    ends_at: end.toISOString().slice(0, 16),
  };
}

export default function AdminCampaignsPage() {
  const { t } = useTranslation();
  const { products } = useProducts();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    campaign_type: "global" as CampaignType,
    discount_percent: 10,
    product_id: "",
    user_id: "",
    ...defaultDates(),
  });

  const load = async () => {
    setCampaigns(await fetchCampaigns());
    const profiles = await fetchAllProfiles();
    setCustomers(profiles.filter((p) => !p.is_admin));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    const campaign: Campaign = {
      id: crypto.randomUUID(),
      name: form.name,
      campaign_type: form.campaign_type,
      discount_percent: form.discount_percent,
      product_id: form.campaign_type === "product" ? form.product_id : null,
      user_id: form.campaign_type === "customer" ? form.user_id : null,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: new Date(form.ends_at).toISOString(),
      is_active: true,
    };
    await saveCampaign(campaign);
    setShowForm(false);
    setForm({
      name: "",
      campaign_type: "global",
      discount_percent: 10,
      product_id: "",
      user_id: "",
      ...defaultDates(),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Kampagne löschen?")) return;
    await deleteCampaign(id);
    load();
  };

  const typeLabel = (type: CampaignType) => {
    if (type === "global") return t("admin_campaign_global");
    if (type === "product") return t("admin_campaign_product");
    return t("admin_campaign_customer");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t("admin_campaigns")}</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          {t("admin_add_campaign")}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("admin_campaign_name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="z.B. Frühlingsaktion -10%"
            />
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">
                {t("admin_campaign_type")}
              </label>
              <select
                value={form.campaign_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    campaign_type: e.target.value as CampaignType,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-white"
              >
                <option value="global">{t("admin_campaign_global")}</option>
                <option value="product">{t("admin_campaign_product")}</option>
                <option value="customer">{t("admin_campaign_customer")}</option>
              </select>
            </div>
            <Input
              label={t("admin_discount_percent")}
              type="number"
              min="1"
              max="100"
              value={form.discount_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_percent: parseFloat(e.target.value) || 0,
                })
              }
            />
            {form.campaign_type === "product" && (
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  {t("admin_select_product")}
                </label>
                <select
                  value={form.product_id}
                  onChange={(e) =>
                    setForm({ ...form, product_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-white"
                >
                  <option value="">—</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {form.campaign_type === "customer" && (
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  {t("admin_select_customer")}
                </label>
                <select
                  value={form.user_id}
                  onChange={(e) =>
                    setForm({ ...form, user_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-white"
                >
                  <option value="">—</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Input
              label={t("admin_starts_at")}
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
            />
            <Input
              label={t("admin_ends_at")}
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave}>{t("admin_save")}</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              {t("admin_cancel")}
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {campaigns.length === 0 ? (
          <Card>
            <p className="text-gray-400 text-sm">Noch keine Kampagnen.</p>
          </Card>
        ) : (
          campaigns.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-gold" />
                    <p className="font-semibold text-white">{c.name}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="gold">-{c.discount_percent}%</Badge>
                    <Badge variant="muted">{typeLabel(c.campaign_type)}</Badge>
                    <Badge variant={c.is_active ? "success" : "danger"}>
                      {c.is_active ? t("admin_active") : t("admin_inactive")}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(c.starts_at).toLocaleDateString("de-DE")} —{" "}
                    {new Date(c.ends_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="rounded p-2 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
