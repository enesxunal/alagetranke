import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  Campaign,
  Order,
  OrderItem,
  OrderStatus,
  Profile,
  ProfileUpdateInput,
  Product,
} from "@/types/database.types";

const ORDERS_KEY = "alagetrank-orders";
const CAMPAIGNS_KEY = "alagetrank-campaigns";

function getSupabase() {
  return createClient();
}

// ── Profiles ──

export async function fetchAllProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function updateProfile(
  id: string,
  updates: ProfileUpdateInput & { discount_percent?: number; is_approved?: boolean }
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await getSupabase()
    .from("profiles")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function updateOwnProfile(
  id: string,
  updates: ProfileUpdateInput
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await getSupabase()
    .from("profiles")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

// ── Orders ──

export function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalOrder(order: Order) {
  const orders = getLocalOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function fetchAllOrdersAdmin(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return getLocalOrders();

  const supabase = getSupabase();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, profiles(company_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const withItems = await Promise.all(
    (orders ?? []).map(async (order) => {
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      return {
        ...order,
        items: (items ?? []) as OrderItem[],
        customer_company: (order.profiles as { company_name?: string })?.company_name,
      } as Order;
    })
  );

  return withItems;
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return getLocalOrders().filter((o) => o.user_id === userId);
  }

  const supabase = getSupabase();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return Promise.all(
    (orders ?? []).map(async (order) => {
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      return { ...order, items: (items ?? []) as OrderItem[] } as Order;
    })
  );
}

export async function updateOrderStatusDb(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const local = getLocalOrders().map((o) =>
    o.id === orderId ? { ...o, status } : o
  );
  localStorage.setItem(ORDERS_KEY, JSON.stringify(local));

  if (!isSupabaseConfigured()) return;
  const { error } = await getSupabase()
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw error;
}

export async function createOrderDb(
  order: Omit<Order, "items">,
  items: OrderItem[]
): Promise<void> {
  saveLocalOrder({ ...order, items });

  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();
  const { error: orderError } = await supabase.from("orders").insert({
    id: order.id,
    user_id: order.user_id,
    status: order.status,
    fulfillment_type: order.fulfillment_type,
    payment_method: order.payment_method,
    delivery_street: order.delivery_street,
    delivery_city: order.delivery_city,
    delivery_postal_code: order.delivery_postal_code,
    delivery_notes: order.delivery_notes,
    subtotal_net: order.subtotal_net,
    pfand_total: order.pfand_total,
    vat_total: order.vat_total,
    discount_total: order.discount_total ?? 0,
    total: order.total,
  });

  if (orderError) throw orderError;

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity_cases: item.quantity_cases,
        units_per_case: item.units_per_case,
        unit_price_with_pfand: item.unit_price_with_pfand,
        pfand_per_unit: item.pfand_per_unit,
        line_total: item.line_total,
      }))
    );
    if (itemsError) throw itemsError;
  }
}

// ── Campaigns ──

export function getLocalCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CAMPAIGNS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalCampaigns(campaigns: Campaign[]) {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  if (!isSupabaseConfigured()) return getLocalCampaigns();

  const { data, error } = await getSupabase()
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return getLocalCampaigns();
  }
  return (data ?? []) as Campaign[];
}

export async function fetchActiveCampaigns(): Promise<Campaign[]> {
  const all = await fetchCampaigns();
  const now = new Date();
  return all.filter(
    (c) =>
      c.is_active &&
      new Date(c.starts_at) <= now &&
      new Date(c.ends_at) >= now
  );
}

export async function saveCampaign(campaign: Campaign): Promise<void> {
  const local = getLocalCampaigns();
  const idx = local.findIndex((c) => c.id === campaign.id);
  if (idx >= 0) local[idx] = campaign;
  else local.unshift(campaign);
  saveLocalCampaigns(local);

  if (!isSupabaseConfigured()) return;

  const { error } = await getSupabase().from("campaigns").upsert(campaign);
  if (error) throw error;
}

export async function deleteCampaign(id: string): Promise<void> {
  saveLocalCampaigns(getLocalCampaigns().filter((c) => c.id !== id));

  if (!isSupabaseConfigured()) return;
  await getSupabase().from("campaigns").delete().eq("id", id);
}

// ── Products (admin) ──

export async function upsertProductDb(product: Product): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await getSupabase().from("products").upsert({
    id: product.id.startsWith("custom-") ? undefined : product.id,
    name: product.name,
    category: product.category,
    unit_price_with_pfand: product.unit_price_with_pfand,
    pfand_per_unit: product.pfand_per_unit,
    units_per_case: product.units_per_case,
    container_type: product.container_type,
    image_url: product.image_url,
    description: product.description ?? null,
    stock: product.stock,
    is_active: product.is_active ?? true,
  });
  if (error) throw error;
}

export async function deleteProductDb(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await getSupabase()
    .from("products")
    .update({ is_active: false })
    .eq("id", id);
}
