import {
  Beer,
  CupSoda,
  Zap,
  Droplets,
  Wine,
  FlaskConical,
  GlassWater,
  type LucideIcon,
} from "lucide-react";
import type { ProductCategory } from "@/types/database.types";
import { categoryImages } from "@/data/productImages";

export interface CategoryNavItem {
  id: ProductCategory;
  icon: LucideIcon;
  image: string;
}

export const categoryNavItems: CategoryNavItem[] = [
  { id: "bier", icon: Beer, image: categoryImages.bier },
  { id: "softdrinks", icon: CupSoda, image: categoryImages.softdrinks },
  { id: "energy", icon: Zap, image: categoryImages.energy },
  { id: "wasser", icon: Droplets, image: categoryImages.wasser },
  { id: "spirits", icon: FlaskConical, image: categoryImages.spirits },
  { id: "wine", icon: Wine, image: categoryImages.wine },
  { id: "mixed", icon: GlassWater, image: categoryImages.mixed },
];
