import { NextResponse } from "next/server";
import type { Order, OrderItem } from "@/types/database.types";
import { sendOrderNotifications } from "@/lib/email/order-mails";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    order: Order;
    items: OrderItem[];
    companyName: string;
    customerEmail?: string | null;
  };

  if (!body.order?.id || !body.items?.length || !body.companyName) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await sendOrderNotifications({
    order: body.order,
    items: body.items,
    companyName: body.companyName,
    customerEmail: body.customerEmail,
  });

  return NextResponse.json(result);
}

/** Admin-only manual resend */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const body = (await request.json()) as {
    order: Order;
    items: OrderItem[];
    companyName: string;
    customerEmail?: string | null;
  };

  const result = await sendOrderNotifications(body);
  return NextResponse.json(result);
}
