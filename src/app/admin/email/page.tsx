"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface EmailStatus {
  companyEmail: string;
  configured: boolean;
  smtp: {
    host: string;
    port: number;
    user: string;
    secure: boolean;
  };
}

export default function AdminEmailPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<EmailStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");

  const loadStatus = () => {
    fetch("/api/email/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setMessage(t("error_generic")));
  };

  useEffect(() => {
    loadStatus();
  }, [t]);

  const handleTest = async () => {
    setTesting(true);
    setMessage("");
    try {
      const res = await fetch("/api/email/test", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? t("admin_email_test_fail"));
      } else {
        setMessage(t("admin_email_test_ok"));
      }
    } catch {
      setMessage(t("admin_email_test_fail"));
    } finally {
      setTesting(false);
    }
  };

  if (!status) {
    return <p className="text-gray-400">{t("loading")}</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Mail className="h-6 w-6 text-gold" />
        <h2 className="text-xl font-semibold text-white">{t("admin_email")}</h2>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">{t("admin_email_address")}</p>
            <p className="text-lg font-semibold text-gold">{status.companyEmail}</p>
          </div>
          <Badge variant={status.configured ? "success" : "warning"}>
            {status.configured ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {t("admin_email_active")}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {t("admin_email_missing")}
              </span>
            )}
          </Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-lg bg-black/30 px-4 py-3">
            <p className="text-gray-500">SMTP Host</p>
            <p className="text-white">{status.smtp.host}</p>
          </div>
          <div className="rounded-lg bg-black/30 px-4 py-3">
            <p className="text-gray-500">SMTP Port</p>
            <p className="text-white">{status.smtp.port}</p>
          </div>
          <div className="rounded-lg bg-black/30 px-4 py-3 sm:col-span-2">
            <p className="text-gray-500">Benutzer</p>
            <p className="text-white">{status.smtp.user}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">{t("admin_email_phone_hint")}</p>
      </Card>

      <Card className="mb-6">
        <h3 className="mb-3 font-semibold text-white">{t("admin_email_setup_title")}</h3>
        <p className="text-sm text-gray-400 mb-4">{t("admin_email_setup_desc")}</p>
        <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-green-400">
{`SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=buchhaltung@alagetraenke.de
SMTP_PASS=ihr-mail-passwort`}
        </pre>
        <p className="mt-3 text-xs text-gray-500">{t("admin_email_no_password")}</p>
        <a
          href="https://privateemail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:underline"
        >
          privateemail.com
          <ExternalLink className="h-3 w-3" />
        </a>
      </Card>

      <Button onClick={handleTest} disabled={testing || !status.configured}>
        <Mail className="h-4 w-4" />
        {testing ? t("loading") : t("admin_email_send_test")}
      </Button>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes("✓") || message.toLowerCase().includes("erfolg") || message.toLowerCase().includes("başarı") || message.toLowerCase().includes("success")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
