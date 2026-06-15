/** Tek resmi iletişim ve sipariş e-postası */
export const COMPANY_EMAIL = "buchhaltung@alagetraenke.de";

export const SMTP_HOST = process.env.SMTP_HOST ?? "mail.privateemail.com";
export const SMTP_PORT = Number(process.env.SMTP_PORT ?? "465");
export const SMTP_USER = process.env.SMTP_USER ?? COMPANY_EMAIL;
export const SMTP_PASS = process.env.SMTP_PASS ?? "";

export function isEmailConfigured(): boolean {
  return Boolean(SMTP_PASS && SMTP_USER);
}

export function getSmtpSettingsForDisplay() {
  return {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    secure: SMTP_PORT === 465,
  };
}
