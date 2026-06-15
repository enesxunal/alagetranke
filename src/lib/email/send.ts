import nodemailer from "nodemailer";
import {
  COMPANY_EMAIL,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
  isEmailConfigured,
} from "./config";

function createTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  if (!isEmailConfigured()) {
    console.warn("[email] SMTP not configured — skipping send");
    return { ok: false as const, error: "SMTP not configured" };
  }

  try {
    const transport = createTransport();
    await transport.sendMail({
      from: `"Alagetränke GmbH" <${COMPANY_EMAIL}>`,
      to: options.to,
      replyTo: options.replyTo ?? COMPANY_EMAIL,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return { ok: true as const };
  } catch (error) {
    console.error("[email] send failed", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Send failed",
    };
  }
}
