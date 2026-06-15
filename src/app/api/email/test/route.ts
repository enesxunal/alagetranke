import { NextResponse } from "next/server";
import { COMPANY_EMAIL } from "@/lib/email/config";
import { sendEmail } from "@/lib/email/send";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const result = await sendEmail({
    to: COMPANY_EMAIL,
    subject: "Alagetränke — Test-E-Mail",
    html: `
      <div style="font-family:sans-serif">
        <h2 style="color:#c9a227">Test erfolgreich</h2>
        <p>Ihre E-Mail-Einstellungen funktionieren.</p>
        <p>Gesendet an: ${COMPANY_EMAIL}</p>
      </div>
    `,
    text: "Test erfolgreich — Ihre E-Mail-Einstellungen funktionieren.",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sentTo: COMPANY_EMAIL });
}
