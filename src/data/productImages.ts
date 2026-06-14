import type { ProductCategory } from "@/types/database.types";

const P = "/products";

export const productImages: Record<string, string> = {
  "sd-001": `${P}/cola-can.jpg`,
  "sd-002": `${P}/cola-bottle.jpg`,
  "sd-003": `${P}/cola-glass.jpg`,
  "sd-004": `${P}/cola-glass.jpg`,
  "sd-005": `${P}/juice.jpg`,
  "sd-006": `${P}/softdrink.jpg`,
  "sd-007": `${P}/tea.jpg`,
  "sd-008": `${P}/lemonade.jpg`,
  "en-001": `${P}/sports-drink.jpg`,
  "en-002": `${P}/energy.jpg`,
  "en-003": `${P}/energy.jpg`,
  "wa-001": `${P}/water.jpg`,

  "bi-001": `${P}/beer.jpg`,
  "bi-002": `${P}/beer.jpg`,
  "bi-003": `${P}/beer.jpg`,
  "bi-004": `${P}/beer-bottle.jpg`,
  "bi-005": `${P}/beer-pils.jpg`,
  "bi-006": `${P}/beer.jpg`,
  "bi-007": `${P}/beer-bottle.jpg`,
  "bi-008": `${P}/beer-bottle.jpg`,
  "bi-009": `${P}/beer.jpg`,
  "bi-010": `${P}/beer.jpg`,
  "bi-011": `${P}/beer-pils.jpg`,
  "bi-012": `${P}/mixed-beer.jpg`,
  "bi-013": `${P}/mixed-beer.jpg`,
  "bi-014": `${P}/mixed-beer.jpg`,
  "bi-015": `${P}/beer-pils.jpg`,
  "bi-016": `${P}/mixed-beer.jpg`,
  "bi-017": `${P}/malt.jpg`,

  "sp-001": `${P}/whiskey.jpg`,
  "sp-002": `${P}/bourbon.jpg`,
  "sp-003": `${P}/vodka.jpg`,
  "sp-004": `${P}/vodka.jpg`,
  "sp-005": `${P}/gin.jpg`,
  "sp-006": `${P}/liqueur.jpg`,
  "sp-007": `${P}/liqueur.jpg`,
  "sp-008": `${P}/vodka.jpg`,
  "sp-009": `${P}/vodka.jpg`,

  "wi-001": `${P}/wine.jpg`,
  "wi-002": `${P}/wine.jpg`,
  "wi-003": `${P}/wine.jpg`,
  "wi-004": `${P}/champagne.jpg`,
  "wi-005": `${P}/champagne.jpg`,
  "wi-006": `${P}/prosecco.jpg`,
  "wi-007": `${P}/prosecco.jpg`,
};

const categoryFallbacks: Record<ProductCategory, string> = {
  bier: `${P}/beer.jpg`,
  softdrinks: `${P}/cola-bottle.jpg`,
  energy: `${P}/energy.jpg`,
  wasser: `${P}/water.jpg`,
  spirits: `${P}/whiskey.jpg`,
  wine: `${P}/wine.jpg`,
  mixed: `${P}/mixed-beer.jpg`,
};

export function getProductImage(id: string, category: ProductCategory): string {
  return productImages[id] ?? categoryFallbacks[category];
}

export function getCategoryFallbackImage(category: ProductCategory): string {
  return categoryFallbacks[category];
}

export const heroBannerImage = `${P}/hero-banner.jpg`;

export const categoryImages: Record<ProductCategory, string> = {
  bier: `${P}/beer.jpg`,
  softdrinks: `${P}/cola-bottle.jpg`,
  energy: `${P}/energy.jpg`,
  wasser: `${P}/water.jpg`,
  spirits: `${P}/whiskey.jpg`,
  wine: `${P}/wine.jpg`,
  mixed: `${P}/mixed-beer.jpg`,
};
