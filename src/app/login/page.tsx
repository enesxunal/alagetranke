"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <h1 className="mb-2 text-2xl font-bold text-white">{t("login_title")}</h1>
        <p className="mb-6 text-sm text-gray-500">
          Alagetränke GmbH B2B Portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label={t("login_email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label={t("login_password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("loading") : t("login_submit")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {t("login_no_account")}{" "}
          <Link href="/register" className="text-gold hover:underline">
            {t("nav_register")}
          </Link>
        </p>

        <div className="mt-6 rounded-lg bg-white/5 p-3 text-xs text-gray-500">
          <p className="font-medium text-gray-400 mb-1">Demo (ohne Supabase):</p>
          <p>admin@alagetrank.de — Admin Panel</p>
          <p>pending@alagetrank.de — Onay bekleyen</p>
          <p>herhangi bir @ — Onaylı müşteri</p>
        </div>
      </Card>
    </div>
  );
}
