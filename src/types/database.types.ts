export type ContainerType =
  | "can"
  | "pet_einweg"
  | "glass_mehrweg"
  | "glass_einweg"
  | "none";

export type ProductCategory =
  | "bier"
  | "softdrinks"
  | "energy"
  | "wasser"
  | "spirits"
  | "wine"
  | "mixed";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled";

export type FulfillmentType = "pickup" | "delivery";
export type PaymentMethod = "cash" | "paypal" | "online";
export type CampaignType = "global" | "product" | "customer";

export interface Profile {
  id: string;
  company_name: string;
  ust_id_nr: string;
  phone: string | null;
  contact_name?: string | null;
  email?: string | null;
  street?: string | null;
  city?: string | null;
  postal_code?: string | null;
  discount_percent?: number;
  notes?: string | null;
  is_approved: boolean;
  is_admin: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit_price_with_pfand: number;
  pfand_per_unit: number;
  units_per_case: number;
  container_type: ContainerType;
  image_url: string;
  description?: string | null;
  stock: number;
  is_active?: boolean;
}

export interface CartItem {
  product: Product;
  quantityCases: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity_cases: number;
  units_per_case: number;
  unit_price_with_pfand: number;
  pfand_per_unit: number;
  line_total: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  fulfillment_type: FulfillmentType;
  payment_method: PaymentMethod;
  delivery_street?: string | null;
  delivery_city?: string | null;
  delivery_postal_code?: string | null;
  delivery_notes?: string | null;
  subtotal_net: number;
  pfand_total: number;
  vat_total: number;
  discount_total?: number;
  total: number;
  created_at: string;
  items?: OrderItem[];
  customer_company?: string;
}

export interface Campaign {
  id: string;
  name: string;
  campaign_type: CampaignType;
  discount_percent: number;
  product_id?: string | null;
  user_id?: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at?: string;
}

export interface CartSummary {
  items: CartItem[];
  pfandTotal: number;
  netProductTotal: number;
  vatTotal: number;
  grossTotal: number;
  totalUnits: number;
  discountTotal?: number;
}

export interface ProfileUpdateInput {
  company_name?: string;
  ust_id_nr?: string;
  phone?: string;
  contact_name?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
}
