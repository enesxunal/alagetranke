"use client";

import { type ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProductStoreProvider } from "@/context/ProductStoreContext";
import { CartSidebar } from "@/components/CartSidebar";
import { CookieConsent } from "@/components/CookieConsent";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProductStoreProvider>
          <CartProvider>
            {children}
            <CartSidebar />
            <CookieConsent />
            <WhatsAppButton />
          </CartProvider>
        </ProductStoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
