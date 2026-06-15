"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Pencil, Save } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { fetchAllProfiles, updateProfile } from "@/lib/supabase/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getDemoProfiles } from "@/context/AuthContext";
import type { Profile } from "@/types/database.types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function AdminCustomersPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    company_name: "",
    ust_id_nr: "",
    phone: "",
    contact_name: "",
    street: "",
    city: "",
    postal_code: "",
    discount_percent: 0,
    notes: "",
    is_approved: false,
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await fetchAllProfiles();
        setCustomers(data.filter((c) => !c.is_admin));
      } else {
        setCustomers(getDemoProfiles());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (customer: Profile) => {
    setEditing(customer);
    setForm({
      company_name: customer.company_name,
      ust_id_nr: customer.ust_id_nr,
      phone: customer.phone ?? "",
      contact_name: customer.contact_name ?? "",
      street: customer.street ?? "",
      city: customer.city ?? "",
      postal_code: customer.postal_code ?? "",
      discount_percent: customer.discount_percent ?? 0,
      notes: customer.notes ?? "",
      is_approved: customer.is_approved,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    await updateProfile(editing.id, form);
    setEditing(null);
    load();
  };

  const toggleApproval = async (customer: Profile) => {
    await updateProfile(customer.id, { is_approved: !customer.is_approved });
    load();
  };

  if (loading) {
    return <p className="text-gray-400">{t("loading")}</p>;
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">
        {t("admin_customers")}
      </h2>

      {editing && (
        <Card className="mb-6">
          <h3 className="mb-4 font-semibold text-gold">{t("admin_edit_customer")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("register_company")}
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
            <Input
              label={t("register_tax_id")}
              value={form.ust_id_nr}
              onChange={(e) => setForm({ ...form, ust_id_nr: e.target.value })}
            />
            <Input
              label={t("dash_contact_name")}
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
            />
            <Input
              label={t("register_phone")}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label={t("checkout_delivery_street")}
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
            />
            <Input
              label={t("checkout_delivery_postal")}
              value={form.postal_code}
              onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
            />
            <Input
              label={t("checkout_delivery_city")}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <Input
              label={t("admin_customer_discount")}
              type="number"
              step="0.5"
              min="0"
              max="100"
              value={form.discount_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_percent: parseFloat(e.target.value) || 0,
                })
              }
            />
            <div className="sm:col-span-2">
              <Textarea
                label={t("dash_notes")}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.is_approved}
                onChange={(e) =>
                  setForm({ ...form, is_approved: e.target.checked })
                }
                className="rounded border-white/20"
              />
              {t("dashboard_approved")}
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
              {t("admin_save")}
            </Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              {t("admin_cancel")}
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{customer.company_name}</p>
                <p className="text-sm text-gray-500">{customer.ust_id_nr}</p>
                {customer.contact_name && (
                  <p className="text-sm text-gray-400">{customer.contact_name}</p>
                )}
                {customer.phone && (
                  <p className="text-xs text-gray-500">{customer.phone}</p>
                )}
                {(customer.discount_percent ?? 0) > 0 && (
                  <Badge variant="gold" className="mt-2">
                    -{customer.discount_percent}%
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={customer.is_approved ? "success" : "warning"}>
                  {customer.is_approved
                    ? t("dashboard_approved")
                    : t("dashboard_pending")}
                </Badge>
                <Button size="sm" variant="secondary" onClick={() => openEdit(customer)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={customer.is_approved ? "danger" : "primary"}
                  onClick={() => toggleApproval(customer)}
                >
                  {customer.is_approved ? (
                    <>
                      <XCircle className="h-4 w-4" />
                      {t("admin_revoke")}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {t("admin_approve")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
