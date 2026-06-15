import type { Order, OrderItem } from "@/types/database.types";
import { formatEuro } from "@/lib/pfand";
import { COMPANY_EMAIL } from "./config";
import { sendEmail } from "./send";

function orderLinesHtml(items: OrderItem[]) {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.product_name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity_cases} Kasten</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatEuro(item.line_total)}</td>
        </tr>`
    )
    .join("");
}

export async function sendOrderNotifications(input: {
  order: Order;
  items: OrderItem[];
  companyName: string;
  customerEmail?: string | null;
}) {
  const { order, items, companyName, customerEmail } = input;

  const itemsTable = `
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px;text-align:left">Produkt</th>
          <th style="padding:8px;text-align:left">Menge</th>
          <th style="padding:8px;text-align:right">Summe</th>
        </tr>
      </thead>
      <tbody>${orderLinesHtml(items)}</tbody>
    </table>
  `;

  const summary = `
    <p><strong>Bestell-Nr.:</strong> ${order.id}</p>
    <p><strong>Firma:</strong> ${companyName}</p>
    <p><strong>Abholung/Lieferung:</strong> ${order.fulfillment_type}</p>
    <p><strong>Zahlung:</strong> ${order.payment_method}</p>
    ${
      order.delivery_street
        ? `<p><strong>Lieferadresse:</strong> ${order.delivery_street}, ${order.delivery_postal_code} ${order.delivery_city}</p>`
        : ""
    }
    ${itemsTable}
    <p><strong>Gesamtbetrag:</strong> ${formatEuro(order.total)}</p>
  `;

  const adminResult = await sendEmail({
    to: COMPANY_EMAIL,
    subject: `Neue B2B-Bestellung ${order.id} — ${companyName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#c9a227">Neue Bestellung</h2>
        ${summary}
        <p style="color:#666;font-size:12px">Alagetränke GmbH — Admin-Benachrichtigung</p>
      </div>
    `,
    replyTo: customerEmail ?? COMPANY_EMAIL,
  });

  let customerResult: { ok: boolean; error?: string } = { ok: true };

  if (customerEmail && customerEmail.includes("@")) {
    customerResult = await sendEmail({
      to: customerEmail,
      subject: `Bestellbestätigung ${order.id} — Alagetränke GmbH`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#c9a227">Vielen Dank für Ihre Bestellung</h2>
          <p>Guten Tag ${companyName},</p>
          <p>wir haben Ihre Bestellung erhalten und bearbeiten sie in Kürze.</p>
          ${summary}
          <p>Bei Fragen: <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a></p>
          <p style="color:#666;font-size:12px">Alagetränke GmbH · Industriestraße 45 · 50389 Wesseling</p>
        </div>
      `,
    });
  }

  return { adminResult, customerResult };
}
