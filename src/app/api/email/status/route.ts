import { NextResponse } from "next/server";
import {
  COMPANY_EMAIL,
  getSmtpSettingsForDisplay,
  isEmailConfigured,
} from "@/lib/email/config";

export async function GET() {
  const smtp = getSmtpSettingsForDisplay();

  return NextResponse.json({
    companyEmail: COMPANY_EMAIL,
    configured: isEmailConfigured(),
    smtp: {
      host: smtp.host,
      port: smtp.port,
      user: smtp.user,
      secure: smtp.secure,
    },
  });
}
