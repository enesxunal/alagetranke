import type { Product } from "@/types/database.types";
import { getPfandPerUnit } from "@/lib/pfand";
import { getProductImage } from "@/data/productImages";

function p(
  id: string,
  name: string,
  category: Product["category"],
  unitPrice: number,
  unitsPerCase: number,
  containerType: Product["container_type"],
  stock = 100
): Product {
  return {
    id,
    name,
    category,
    unit_price_with_pfand: unitPrice,
    pfand_per_unit: getPfandPerUnit(containerType),
    units_per_case: unitsPerCase,
    container_type: containerType,
    image_url: getProductImage(id, category),
    stock,
    is_active: true,
  };
}

export const products: Product[] = [
  // ── Softdrinks & Wasser (Brochure 1) ──
  p("sd-001", "Coca Cola 0,33l DS", "softdrinks", 0.49, 24, "can"),
  p("sd-002", "Coca Cola 0,5l", "softdrinks", 0.79, 12, "pet_einweg"),
  p("sd-003", "Coca Cola Classic 0,20l", "softdrinks", 0.48, 24, "glass_mehrweg"),
  p("sd-004", "Coca Cola 0,33l Glas", "softdrinks", 0.62, 24, "glass_mehrweg"),
  p("sd-005", "Capri-Sun 0,2l", "softdrinks", 0.29, 10, "none"),
  p("sd-006", "Durstlöscher 0,5l", "softdrinks", 0.49, 12, "pet_einweg"),
  p("sd-007", "Fuze Tea 0,4l", "softdrinks", 0.89, 12, "pet_einweg"),
  p("sd-008", "Uludag Gazoz 0,33l", "softdrinks", 0.59, 24, "glass_mehrweg"),
  p("en-001", "Powerade 0,5l", "energy", 1.09, 12, "pet_einweg"),
  p("en-002", "Red Bull 0,25l", "energy", 0.9, 24, "can"),
  p("en-003", "Action Energy 0,25l", "energy", 0.49, 24, "can"),
  p("wa-001", "Yurt Wasser 0,5l", "wasser", 0.33, 12, "pet_einweg"),

  // ── Bier (Brochure 2) ──
  p("bi-001", "Früh Kölsch 0,5l", "bier", 0.69, 20, "glass_mehrweg"),
  p("bi-002", "Erdinger Weißbier 0,5l", "bier", 0.75, 20, "glass_mehrweg"),
  p("bi-003", "Paulaner Hell 0,5l", "bier", 0.74, 20, "glass_mehrweg"),
  p("bi-004", "Reissdorf Kölsch 0,5l", "bier", 0.7, 20, "glass_mehrweg"),
  p("bi-005", "Becks Pils 0,5l", "bier", 0.7, 20, "glass_mehrweg"),
  p("bi-006", "Augustiner Hell 0,5l", "bier", 0.82, 20, "glass_mehrweg"),
  p("bi-007", "Corona Extra 0,35l", "bier", 1.0, 24, "glass_einweg"),
  p("bi-008", "Heineken Bier 0,33l", "bier", 0.67, 24, "glass_mehrweg"),
  p("bi-009", "Efes Pilsener 0,5l", "bier", 0.75, 20, "glass_mehrweg"),
  p("bi-010", "Benediktiner Weißbier 0,5l", "bier", 0.82, 20, "glass_mehrweg"),
  p("bi-011", "Bitburger Pils 0,33l", "bier", 0.58, 24, "glass_mehrweg"),
  p("bi-012", "Desperados 0,33l", "bier", 1.04, 24, "glass_einweg"),
  p("bi-013", "Salitos 0,33l", "bier", 0.98, 24, "glass_einweg"),
  p("bi-014", "Mixery 0,33l", "mixed", 0.58, 24, "glass_einweg"),

  // ── Brochure 3 extras ──
  p("bi-015", "Warsteiner Premium Pils 0,5l", "bier", 0.72, 20, "glass_mehrweg"),
  p("bi-016", "Desperados Tequila 0,33l", "mixed", 1.06, 24, "glass_einweg"),
  p("bi-017", "Vita Malz Original 0,33l", "softdrinks", 0.55, 24, "glass_mehrweg"),

  // ── Spirituosen ──
  p("sp-001", "Chivas Regal 12 Years 0,7l", "spirits", 28.99, 1, "none"),
  p("sp-002", "Jack Daniel's Old No. 7 0,7l", "spirits", 22.49, 1, "none"),
  p("sp-003", "9 Mile Vodka 0,7l", "spirits", 8.99, 1, "none"),
  p("sp-004", "Absolut Vodka 0,7l", "spirits", 14.99, 1, "none"),
  p("sp-005", "Bombay Sapphire Gin 0,7l", "spirits", 18.99, 1, "none"),
  p("sp-006", "FLIMM Waldmeister II 0,7l", "spirits", 9.99, 1, "none"),
  p("sp-007", "Beylerbeyi Göbek Rakı 100cl", "spirits", 24.99, 1, "none"),
  p("sp-008", "Grey Goose Vodka 0,7l", "spirits", 32.99, 1, "none"),
  p("sp-009", "Belvedere Vodka 0,7l", "spirits", 29.99, 1, "none"),

  // ── Wein & Sekt ──
  p("wi-001", "Salkım Chardonnay 0,75l", "wine", 6.99, 1, "none"),
  p("wi-002", "Cà dei Frati Lugana 0,75l", "wine", 11.99, 1, "none"),
  p("wi-003", "Thia Merlot 0,75l", "wine", 5.99, 1, "none"),
  p("wi-004", "Moët & Chandon Brut Impérial 0,75l", "wine", 34.99, 1, "none"),
  p("wi-005", "Moët & Chandon Ice Impérial 0,75l", "wine", 39.99, 1, "none"),
  p("wi-006", "Scavi & Ray Banquet Secco 0,75l", "wine", 4.99, 1, "none"),
  p("wi-007", "Scavi & Ray Ice Prestige 0,75l", "wine", 5.99, 1, "none"),
];

export function getProductById(id: string): Product | undefined {
  return products.find((prod) => prod.id === id);
}

export function getProductsByCategory(category: string | null): Product[] {
  if (!category) return products.filter((prod) => prod.is_active !== false);
  return products.filter(
    (prod) => prod.category === category && prod.is_active !== false
  );
}

export const categories = [
  "bier",
  "softdrinks",
  "energy",
  "wasser",
  "spirits",
  "wine",
  "mixed",
] as const;
