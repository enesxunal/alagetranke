"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import {
  getDemoProfiles,
  updateDemoProfileApproval,
  DEMO_PENDING,
} from "@/context/AuthContext";
import type { Profile } from "@/types/database.types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AdminCustomersPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Profile[]>(getDemoProfiles());

  const toggleApproval = (customer: Profile) => {
    const newStatus = !customer.is_approved;
    updateDemoProfileApproval(customer.id, newStatus);
    setCustomers(
      customers.map((c) =>
        c.id === customer.id ? { ...c, is_approved: newStatus } : c
      )
    );
    if (customer.id === DEMO_PENDING.id) {
      DEMO_PENDING.is_approved = newStatus;
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">
        {t("admin_customers")}
      </h2>

      <div className="space-y-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{customer.company_name}</p>
                <p className="text-sm text-gray-500">{customer.ust_id_nr}</p>
                {customer.phone && (
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={customer.is_approved ? "success" : "warning"}>
                  {customer.is_approved
                    ? t("dashboard_approved")
                    : t("dashboard_pending")}
                </Badge>
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

      <p className="mt-6 text-xs text-gray-600">
        Mit Supabase: Kunden aus der profiles-Tabelle werden automatisch geladen.
        is_approved auf true setzen, um Preise freizuschalten.
      </p>
    </div>
  );
}
