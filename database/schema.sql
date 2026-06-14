-- Alagetränke GmbH B2B E-Commerce Schema
-- Run this in Supabase SQL Editor

-- Profiles table extending Supabase Auth users
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT NOT NULL,
    ust_id_nr TEXT NOT NULL,
    phone TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit_price_with_pfand NUMERIC(10,2) NOT NULL,
    pfand_per_unit NUMERIC(10,2) NOT NULL DEFAULT 0,
    units_per_case INT NOT NULL DEFAULT 1,
    container_type TEXT NOT NULL DEFAULT 'none',
    image_url TEXT,
    stock INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    fulfillment_type TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    delivery_street TEXT,
    delivery_city TEXT,
    delivery_postal_code TEXT,
    delivery_notes TEXT,
    subtotal_net NUMERIC(10,2) NOT NULL,
    pfand_total NUMERIC(10,2) NOT NULL,
    vat_total NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity_cases INT NOT NULL,
    units_per_case INT NOT NULL,
    unit_price_with_pfand NUMERIC(10,2) NOT NULL,
    pfand_per_unit NUMERIC(10,2) NOT NULL,
    line_total NUMERIC(10,2) NOT NULL
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: everyone can read active products
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage products" ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Orders: users see own orders, admins see all
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Order items follow order access" ON order_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = order_id
        AND (o.user_id = auth.uid() OR EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
        ))
    )
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, company_name, ust_id_nr, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'ust_id_nr', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
