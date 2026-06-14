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
import type { Profile, Order, OrderStatus } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  canSeePrices: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  orders: Order[];
}

interface RegisterData {
  email: string;
  password: string;
  company_name: string;
  ust_id_nr: string;
  phone: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_ADMIN: Profile = {
  id: "demo-admin",
  company_name: "Alagetränke GmbH",
  ust_id_nr: "DE123456789",
  phone: "022321507729",
  is_approved: true,
  is_admin: true,
};

const DEMO_USER: Profile = {
  id: "demo-user",
  company_name: "Demo Gastronomie KG",
  ust_id_nr: "DE987654321",
  phone: "017630716796",
  is_approved: true,
  is_admin: false,
};

const DEMO_PENDING: Profile = {
  id: "demo-pending",
  company_name: "Neue Firma GmbH",
  ust_id_nr: "DE111222333",
  phone: "022321507729",
  is_approved: false,
  is_admin: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadDemoSession = useCallback(() => {
    const session = localStorage.getItem("alagetrank-demo-user");
    if (session === "admin") setUser(DEMO_ADMIN);
    else if (session === "user") setUser(DEMO_USER);
    else if (session === "pending") setUser(DEMO_PENDING);
    else setUser(null);

    const storedOrders = localStorage.getItem("alagetrank-orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch {
        setOrders([]);
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      loadDemoSession();
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profile) setUser(profile as Profile);

      const { data: userOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (userOrders) setOrders(userOrders as Order[]);
    } catch {
      loadDemoSession();
    } finally {
      setLoading(false);
    }
  }, [loadDemoSession]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured()) {
        if (email === "admin@alagetraenke.de") {
          localStorage.setItem("alagetrank-demo-user", "admin");
          setUser(DEMO_ADMIN);
          return {};
        }
        if (email === "pending@alagetraenke.de") {
          localStorage.setItem("alagetrank-demo-user", "pending");
          setUser(DEMO_PENDING);
          return {};
        }
        if (email.includes("@")) {
          localStorage.setItem("alagetrank-demo-user", "user");
          setUser(DEMO_USER);
          return {};
        }
        return { error: "Invalid credentials" };
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      await refreshProfile();
      return {};
    },
    [refreshProfile]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      if (!isSupabaseConfigured()) {
        localStorage.setItem("alagetrank-demo-user", "pending");
        setUser({ ...DEMO_PENDING, company_name: data.company_name, ust_id_nr: data.ust_id_nr, phone: data.phone });
        return {};
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            company_name: data.company_name,
            ust_id_nr: data.ust_id_nr,
            phone: data.phone,
          },
        },
      });
      if (error) return { error: error.message };
      await refreshProfile();
      return {};
    },
    [refreshProfile]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem("alagetrank-demo-user");
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setOrders([]);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      canSeePrices: !!user?.is_approved,
      isAdmin: !!user?.is_admin,
      login,
      register,
      logout,
      refreshProfile,
      orders,
    }),
    [user, loading, login, register, logout, refreshProfile, orders]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function saveOrder(order: Order) {
  const stored = localStorage.getItem("alagetrank-orders");
  const orders: Order[] = stored ? JSON.parse(stored) : [];
  orders.unshift(order);
  localStorage.setItem("alagetrank-orders", JSON.stringify(orders));
}

export function getAllOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("alagetrank-orders");
  return stored ? JSON.parse(stored) : [];
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = getAllOrders();
  const updated = orders.map((o) =>
    o.id === orderId ? { ...o, status } : o
  );
  localStorage.setItem("alagetrank-orders", JSON.stringify(updated));
  return updated;
}

export function getDemoProfiles(): Profile[] {
  return [DEMO_USER, DEMO_PENDING];
}

export function updateDemoProfileApproval(id: string, approved: boolean) {
  if (id === DEMO_PENDING.id || id === "demo-pending") {
    DEMO_PENDING.is_approved = approved;
  }
  if (id === DEMO_USER.id) {
    DEMO_USER.is_approved = approved;
  }
}

export { DEMO_ADMIN, DEMO_USER, DEMO_PENDING };
