import type { ContainerType, Product, CartItem, CartSummary } from "@/types/database.types";

export const PFAND_RATES: Record<ContainerType, number> = {
  can: 0.25,
  pet_einweg: 0.25,
  glass_mehrweg: 0.08,
  glass_einweg: 0.15,
  none: 0,
};

export const VAT_RATE = 0.19;

export function getPfandPerUnit(containerType: ContainerType): number {
  return PFAND_RATES[containerType];
}

export function getCasePrice(product: Product): number {
  return product.unit_price_with_pfand * product.units_per_case;
}

export function getCasePfand(product: Product): number {
  return product.pfand_per_unit * product.units_per_case;
}

export function getCaseNetProduct(product: Product): number {
  return getCasePrice(product) - getCasePfand(product);
}

export function calculateCartSummary(items: CartItem[]): CartSummary {
  let pfandTotal = 0;
  let grossTotal = 0;
  let totalUnits = 0;

  for (const item of items) {
    const casePrice = getCasePrice(item.product);
    const casePfand = getCasePfand(item.product);
    const qty = item.quantityCases;

    grossTotal += casePrice * qty;
    pfandTotal += casePfand * qty;
    totalUnits += item.product.units_per_case * qty;
  }

  const netProductTotal = grossTotal - pfandTotal;
  const vatTotal = netProductTotal - netProductTotal / (1 + VAT_RATE);

  return {
    items,
    pfandTotal,
    netProductTotal,
    vatTotal,
    grossTotal,
    totalUnits,
  };
}

export function formatEuro(amount: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
