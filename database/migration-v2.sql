-- Migration v2: Erweiterte Profile, Produkte, Kampagnen
-- In Supabase SQL Editor ausführen (nach schema.sql)

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS street TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_total NUMERIC(10,2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('global', 'product', 'customer')),
    discount_percent NUMERIC(5,2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    product_id TEXT,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active campaigns" ON campaigns
    FOR SELECT USING (is_active = TRUE AND starts_at <= NOW() AND ends_at >= NOW());

CREATE POLICY "Admins manage campaigns" ON campaigns FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT USING (
    auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Admins update all profiles" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
