import type { Campaign, CartItem } from "@/types/database.types";

export function getApplicableDiscountPercent(
  userId: string,
  items: CartItem[],
  profileDiscount: number,
  campaigns: Campaign[]
): number {
  const now = new Date();
  const active = campaigns.filter(
    (c) =>
      c.is_active &&
      new Date(c.starts_at) <= now &&
      new Date(c.ends_at) >= now
  );

  let maxDiscount = profileDiscount || 0;

  for (const c of active) {
    if (c.campaign_type === "global") {
      maxDiscount = Math.max(maxDiscount, c.discount_percent);
    }
    if (c.campaign_type === "customer" && c.user_id === userId) {
      maxDiscount = Math.max(maxDiscount, c.discount_percent);
    }
    if (c.campaign_type === "product" && c.product_id) {
      const hasProduct = items.some((i) => i.product.id === c.product_id);
      if (hasProduct) {
        maxDiscount = Math.max(maxDiscount, c.discount_percent);
      }
    }
  }

  return maxDiscount;
}

export function applyDiscountToSummary(
  netProductTotal: number,
  pfandTotal: number,
  vatRate: number,
  discountPercent: number
) {
  const discountTotal =
    discountPercent > 0 ? (netProductTotal * discountPercent) / 100 : 0;
  const adjustedNet = netProductTotal - discountTotal;
  const vatTotal = adjustedNet - adjustedNet / (1 + vatRate);
  const grossTotal = adjustedNet + pfandTotal;

  return { discountTotal, adjustedNet, vatTotal, grossTotal };
}
