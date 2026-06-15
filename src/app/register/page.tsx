"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    company_name: "",
    ust_id_nr: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    const result = await register({
      email: form.email,
      password: form.password,
      company_name: form.company_name,
      ust_id_nr: form.ust_id_nr,
      phone: form.phone,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <Card>
        <h1 className="mb-2 text-2xl font-bold text-white">
          {t("register_title")}
        </h1>
        <p className="mb-6 text-sm text-gray-500">{t("register_note")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("register_company")}
            value={form.company_name}
            onChange={(e) =>
              setForm({ ...form, company_name: e.target.value })
            }
            required
          />
          <Input
            label={t("register_tax_id")}
            value={form.ust_id_nr}
            onChange={(e) => setForm({ ...form, ust_id_nr: e.target.value })}
            required
          />
          <Input
            label={t("register_phone")}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label={t("login_email")}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label={t("register_password")}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Input
            label={t("register_confirm")}
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("loading") : t("register_submit")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {t("register_has_account")}{" "}
          <Link href="/login" className="text-gold hover:underline">
            {t("nav_login")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
