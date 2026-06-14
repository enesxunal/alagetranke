"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/database.types";
import { products as defaultProducts } from "@/data/products";

interface ProductStoreValue {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductStoreContext = createContext<ProductStoreValue | null>(null);
const STORAGE_KEY = "alagetrank-products-v3";

export function ProductStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        setProducts(defaultProducts);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: false } : p))
    );
  }, []);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id && p.is_active !== false),
    [products]
  );

  const value = useMemo(
    () => ({
      products: products.filter((p) => p.is_active !== false),
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
    }),
    [products, addProduct, updateProduct, deleteProduct, getProduct]
  );

  return (
    <ProductStoreContext.Provider value={value}>
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductStoreContext);
  if (!ctx) throw new Error("useProducts must be used within ProductStoreProvider");
  return ctx;
}
