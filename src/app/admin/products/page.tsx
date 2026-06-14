"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useProducts } from "@/context/ProductStoreContext";
import type { Product, ProductCategory, ContainerType } from "@/types/database.types";
import { getPfandPerUnit } from "@/lib/pfand";
import { formatEuro } from "@/lib/pfand";
import { getCategoryLabel } from "@/lib/i18n";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "bier",
  unit_price_with_pfand: 0,
  pfand_per_unit: 0.08,
  units_per_case: 20,
  container_type: "glass_mehrweg",
  image_url: "/products/beer.jpg",
  stock: 100,
  is_active: true,
};

export default function AdminProductsPage() {
  const { t, locale } = useTranslation();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);

  const fmt =
    locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "de-DE";

  const openNew = () => {
    setEditing(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({ ...product });
    setShowForm(true);
  };

  const handleSave = () => {
    const pfand = getPfandPerUnit(form.container_type);
    const data = { ...form, pfand_per_unit: pfand };

    if (editing) {
      updateProduct(editing.id, data);
    } else {
      addProduct({ ...data, id: `custom-${Date.now()}` });
    }
    setShowForm(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t("admin_products")}</h2>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" />
          {t("admin_add_product")}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="mb-4 font-semibold text-gold">
            {editing ? t("admin_edit_product") : t("admin_add_product")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Kategorie</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as ProductCategory })
                }
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(locale, cat)}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Stückpreis (€)"
              type="number"
              step="0.01"
              value={form.unit_price_with_pfand}
              onChange={(e) =>
                setForm({
                  ...form,
                  unit_price_with_pfand: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Stück/Kasten"
              type="number"
              value={form.units_per_case}
              onChange={(e) =>
                setForm({
                  ...form,
                  units_per_case: parseInt(e.target.value) || 1,
                })
              }
            />
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Behälter</label>
              <select
                value={form.container_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    container_type: e.target.value as ContainerType,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-white"
              >
                <option value="can">Dose</option>
                <option value="pet_einweg">PET Einweg</option>
                <option value="glass_mehrweg">Glas Mehrweg</option>
                <option value="glass_einweg">Glas Einweg</option>
                <option value="none">Kein Pfand</option>
              </select>
            </div>
            <Input
              label="Lagerbestand"
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave}>{t("admin_save")}</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              {t("admin_cancel")}
            </Button>
          </div>
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-surface text-left text-gray-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Kategorie</th>
              <th className="px-4 py-3">Stückpreis</th>
              <th className="px-4 py-3">Kasten</th>
              <th className="px-4 py-3">Lager</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3 text-white">{product.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="gold">
                    {getCategoryLabel(locale, product.category)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gold">
                  {formatEuro(product.unit_price_with_pfand, fmt)}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {product.units_per_case}×
                </td>
                <td className="px-4 py-3 text-gray-400">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(product)}
                      className="rounded p-1.5 text-gray-400 hover:text-gold"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="rounded p-1.5 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
