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
import type { CartItem, Product } from "@/types/database.types";
import { calculateCartSummary } from "@/lib/pfand";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  summary: ReturnType<typeof calculateCartSummary>;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addCase: (product: Product) => void;
  removeCase: (productId: string) => void;
  updateCaseQuantity: (productId: string, quantityCases: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "alagetrank-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addCase = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantityCases: i.quantityCases + 1 }
            : i
        );
      }
      return [...prev, { product, quantityCases: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeCase = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateCaseQuantity = useCallback(
    (productId: string, quantityCases: number) => {
      if (quantityCases <= 0) {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantityCases } : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const summary = useMemo(() => calculateCartSummary(items), [items]);
  const itemCount = useMemo(
    () => items.reduce((acc, i) => acc + i.quantityCases, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      summary,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((o) => !o),
      addCase,
      removeCase,
      updateCaseQuantity,
      clearCart,
    }),
    [items, itemCount, summary, isOpen, addCase, removeCase, updateCaseQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
