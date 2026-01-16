-- BabyBets Database Schema
-- Migration: 001_initial_schema
-- Description: Initial database schema for competitions, prizes, tickets, wallet, and users

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- ENUMS
-- ===========================================

-- Prize types
CREATE TYPE prize_type AS ENUM ('Physical', 'Voucher', 'Cash', 'SiteCredit');

-- Competition status
CREATE TYPE competition_status AS ENUM (
  'draft',
  'scheduled', 
  'active',
  'ending_soon',
  'sold_out',
  'closed',
  'drawing',
  'drawn',
  'completed',
  'cancelled'
);

-- Competition type
CREATE TYPE competition_type AS ENUM (
  'standard',
  'instant_win',
  'instant_win_with_end_prize'
);

-- Competition category
CREATE TYPE competition_category AS ENUM (
  'Toys',
  'Nursery', 
  'Prams',
  'Holidays',
  'Cash',
  'Essentials'
);

-- Wallet transaction type
CREATE TYPE wallet_transaction_type AS ENUM ('credit', 'debit', 'expiry', 'revocation', 'withdrawal');

-- Credit status
CREATE TYPE credit_status AS ENUM ('active', 'spent', 'expired', 'revoked', 'withdrawn');

-- Fulfillment status
CREATE TYPE fulfillment_status AS ENUM (
  'pending',
  'prize_selected',
  'cash_selected',
  'processing',
  'dispatched',
  'delivered',
  'completed',
  'expired'
);

-- Promo code type
CREATE TYPE promo_code_type AS ENUM ('percentage', 'fixed_value', 'free_tickets');

-- User role
CREATE TYPE user_role AS ENUM ('user', 'influencer', 'admin', 'super_admin');

-- Order status
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');

-- ===========================================
-- USERS TABLE (extends Supabase auth.users)
-- ===========================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  
  -- Address fields
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  county TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'UK',
  
  -- Marketing preferences
  marketing_email BOOLEAN DEFAULT false,
  marketing_sms BOOLEAN DEFAULT false,
  
  -- Referral tracking
  referred_by UUID REFERENCES public.profiles(id),
  referral_code TEXT UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- COMPETITIONS TABLE
-- ===========================================

CREATE TABLE public.competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category competition_category NOT NULL,
  status competition_status DEFAULT 'draft',
  competition_type competition_type NOT NULL,
  
  -- Dates
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  draw_datetime TIMESTAMPTZ, -- For standard competitions
  
  -- Ticket configuration
  max_tickets INTEGER NOT NULL,
  tickets_sold INTEGER DEFAULT 0,
  max_tickets_per_user INTEGER DEFAULT 100,
  base_ticket_price_pence INTEGER NOT NULL, -- Store in pence for precision
  
  -- Tiered pricing (JSONB array)
  -- Format: [{ "minQty": 1, "maxQty": 9, "pricePerTicketPence": 200 }, ...]
  tiered_pricing JSONB DEFAULT '[]',
  
  -- Legacy bundle pricing for standard competitions
  bundles JSONB DEFAULT '[]',
  
  -- Prize values
  total_value_gbp DECIMAL(10,2) NOT NULL,
  retail_value_gbp DECIMAL(10,2), -- Legacy field
  
  -- End prize for instant win competitions
  end_prize JSONB, -- { "type": "Cash", "name": "£50 Cash", "valueGBP": 50, "quantity": 1 }
  
  -- Ticket pool config
  ticket_pool_locked BOOLEAN DEFAULT false,
  ticket_pool_generated_at TIMESTAMPTZ,
  
  -- Flags
  is_featured BOOLEAN DEFAULT false,
  show_on_homepage BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries
CREATE INDEX idx_competitions_status ON public.competitions(status);
CREATE INDEX idx_competitions_category ON public.competitions(category);
CREATE INDEX idx_competitions_slug ON public.competitions(slug);
CREATE INDEX idx_competitions_featured ON public.competitions(is_featured) WHERE is_featured = true;

-- ===========================================
-- INSTANT WIN PRIZES TABLE
-- ===========================================

CREATE TABLE public.instant_win_prizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  
  -- Prize details
  prize_code TEXT NOT NULL, -- e.g., PR-001
  name TEXT NOT NULL,
  short_name TEXT,
  type prize_type NOT NULL,
  value_gbp DECIMAL(10,2) NOT NULL,
  cash_alternative_gbp DECIMAL(10,2),
  
  -- Quantities
  total_quantity INTEGER NOT NULL,
  remaining_quantity INTEGER NOT NULL,
  
  -- Content
  description TEXT,
  image_url TEXT,
  notes TEXT,
  
  -- Tier for display ordering (1 = highest value)
  tier INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(competition_id, prize_code)
);

-- Index for efficient queries
CREATE INDEX idx_instant_win_prizes_competition ON public.instant_win_prizes(competition_id);

-- ===========================================
-- TICKET ALLOCATIONS TABLE (pre-generated)
-- ===========================================

CREATE TABLE public.ticket_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL, -- 7-digit code
  
  -- Prize allocation (null = no instant win)
  prize_id UUID REFERENCES public.instant_win_prizes(id),
  
  -- Claim tracking
  is_sold BOOLEAN DEFAULT false,
  sold_at TIMESTAMPTZ,
  sold_to_user_id UUID REFERENCES public.profiles(id),
  order_id UUID,
  
  -- Reveal tracking (for instant wins)
  is_revealed BOOLEAN DEFAULT false,
  revealed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(competition_id, ticket_number)
);

-- Indexes for efficient queries
CREATE INDEX idx_ticket_allocations_competition ON public.ticket_allocations(competition_id);
CREATE INDEX idx_ticket_allocations_user ON public.ticket_allocations(sold_to_user_id);
CREATE INDEX idx_ticket_allocations_unsold ON public.ticket_allocations(competition_id) WHERE is_sold = false;
CREATE INDEX idx_ticket_allocations_unrevealed ON public.ticket_allocations(sold_to_user_id) WHERE is_sold = true AND is_revealed = false;

-- ===========================================
-- ORDERS TABLE
-- ===========================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Order details
  status order_status DEFAULT 'pending',
  
  -- Amounts in pence
  subtotal_pence INTEGER NOT NULL,
  discount_pence INTEGER DEFAULT 0,
  credit_applied_pence INTEGER DEFAULT 0,
  total_pence INTEGER NOT NULL,
  
  -- Promo code
  promo_code_id UUID REFERENCES public.promo_codes(id),
  promo_code_value TEXT,
  
  -- Influencer tracking
  influencer_id UUID REFERENCES public.profiles(id),
  influencer_code TEXT,
  
  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  paid_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user orders
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_influencer ON public.orders(influencer_id);

-- ===========================================
-- ORDER ITEMS TABLE
-- ===========================================

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  competition_id UUID NOT NULL REFERENCES public.competitions(id),
  
  -- Ticket details
  ticket_count INTEGER NOT NULL,
  price_per_ticket_pence INTEGER NOT NULL,
  total_pence INTEGER NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for order items
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- ===========================================
-- WALLET CREDITS TABLE
-- ===========================================

CREATE TABLE public.wallet_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Amounts
  amount_pence INTEGER NOT NULL,
  remaining_pence INTEGER NOT NULL,
  status credit_status DEFAULT 'active',
  
  -- Source tracking
  source_type TEXT NOT NULL, -- 'instant_win', 'promo', 'refund', 'manual', 'referral'
  source_competition_id UUID REFERENCES public.competitions(id),
  source_ticket_id UUID REFERENCES public.ticket_allocations(id),
  source_order_id UUID REFERENCES public.orders(id),
  source_prize_id UUID REFERENCES public.instant_win_prizes(id),
  
  -- Description
  description TEXT NOT NULL,
  
  -- Expiry
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_wallet_credits_user ON public.wallet_credits(user_id);
CREATE INDEX idx_wallet_credits_active ON public.wallet_credits(user_id) WHERE status = 'active';

-- ===========================================
-- WALLET TRANSACTIONS TABLE (ledger)
-- ===========================================

CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  credit_id UUID REFERENCES public.wallet_credits(id),
  
  -- Transaction details
  type wallet_transaction_type NOT NULL,
  amount_pence INTEGER NOT NULL, -- Positive for credit, negative for debit
  balance_after_pence INTEGER NOT NULL,
  
  -- References
  order_id UUID REFERENCES public.orders(id),
  
  -- Description
  description TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user transactions
CREATE INDEX idx_wallet_transactions_user ON public.wallet_transactions(user_id);

-- ===========================================
-- PROMO CODES TABLE
-- ===========================================

CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type promo_code_type NOT NULL,
  
  -- Value
  value INTEGER NOT NULL, -- Percentage (0-100) or pence amount
  
  -- Usage limits
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  max_uses_per_user INTEGER DEFAULT 1,
  
  -- Validity
  min_order_pence INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Restrictions
  competition_ids UUID[] DEFAULT '{}', -- Empty = all competitions
  new_customers_only BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for code lookup
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);

-- ===========================================
-- WINNERS TABLE (for social proof display)
-- ===========================================

CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  
  -- Display info (can be anonymous)
  display_name TEXT NOT NULL, -- e.g., "Sarah J."
  location TEXT, -- e.g., "Manchester"
  
  -- Prize details
  prize_name TEXT NOT NULL,
  prize_value_gbp DECIMAL(10,2),
  prize_image_url TEXT,
  
  -- References
  competition_id UUID REFERENCES public.competitions(id),
  ticket_id UUID REFERENCES public.ticket_allocations(id),
  
  -- Win type
  win_type TEXT DEFAULT 'instant_win', -- 'instant_win', 'end_prize', 'manual'
  
  -- Display control
  is_public BOOLEAN DEFAULT true,
  show_in_ticker BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  -- Winner photo (for social proof)
  winner_photo_url TEXT,
  testimonial TEXT,
  
  -- Timestamps
  won_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for recent winners
CREATE INDEX idx_winners_recent ON public.winners(won_at DESC);
CREATE INDEX idx_winners_ticker ON public.winners(show_in_ticker) WHERE show_in_ticker = true;

-- ===========================================
-- PRIZE FULFILLMENTS TABLE
-- ===========================================

CREATE TABLE public.prize_fulfillments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  ticket_id UUID NOT NULL REFERENCES public.ticket_allocations(id),
  prize_id UUID NOT NULL REFERENCES public.instant_win_prizes(id),
  competition_id UUID NOT NULL REFERENCES public.competitions(id),
  
  -- Status
  status fulfillment_status DEFAULT 'pending',
  
  -- Choice (for prizes with cash alternative)
  choice TEXT, -- 'prize' or 'cash'
  value_pence INTEGER NOT NULL,
  
  -- Deadlines
  claim_deadline TIMESTAMPTZ NOT NULL,
  
  -- Tracking
  notified_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Delivery info
  tracking_number TEXT,
  delivery_address JSONB,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user fulfillments
CREATE INDEX idx_prize_fulfillments_user ON public.prize_fulfillments(user_id);
CREATE INDEX idx_prize_fulfillments_pending ON public.prize_fulfillments(status) WHERE status = 'pending';

-- ===========================================
-- INFLUENCERS TABLE
-- ===========================================

CREATE TABLE public.influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id),
  
  -- Profile
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  
  -- Featured competition
  featured_competition_id UUID REFERENCES public.competitions(id),
  
  -- Commission tier
  commission_tier INTEGER DEFAULT 1, -- 1=10%, 2=15%, 3=20%, 4=25%
  
  -- Social links
  social_links JSONB DEFAULT '{}', -- { "instagram": "...", "tiktok": "...", etc }
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_ambassador BOOLEAN DEFAULT false,
  
  -- Stats (denormalized for performance)
  total_sales_pence INTEGER DEFAULT 0,
  total_commission_pence INTEGER DEFAULT 0,
  monthly_sales_pence INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for slug lookup
CREATE INDEX idx_influencers_slug ON public.influencers(slug);
CREATE INDEX idx_influencers_user ON public.influencers(user_id);

-- ===========================================
-- INFLUENCER SALES TABLE
-- ===========================================

CREATE TABLE public.influencer_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID NOT NULL REFERENCES public.influencers(id),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  
  -- Amounts
  order_value_pence INTEGER NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.1500 for 15%
  commission_pence INTEGER NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Index for influencer sales
CREATE INDEX idx_influencer_sales_influencer ON public.influencer_sales(influencer_id);

-- ===========================================
-- WITHDRAWAL REQUESTS TABLE
-- ===========================================

CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Amount
  amount_pence INTEGER NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'paid'
  
  -- Bank details (encrypted in practice)
  bank_details JSONB,
  
  -- Admin
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Index for user withdrawals
CREATE INDEX idx_withdrawal_requests_user ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_pending ON public.withdrawal_requests(status) WHERE status = 'pending';

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instant_win_prizes_updated_at
  BEFORE UPDATE ON public.instant_win_prizes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_credits_updated_at
  BEFORE UPDATE ON public.wallet_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prize_fulfillments_updated_at
  BEFORE UPDATE ON public.prize_fulfillments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- USEFUL VIEWS
-- ===========================================

-- Active competitions with prize counts
CREATE VIEW public.active_competitions_view AS
SELECT 
  c.*,
  COALESCE(p.total_prizes, 0) as total_instant_win_prizes,
  COALESCE(p.remaining_prizes, 0) as remaining_instant_win_prizes
FROM public.competitions c
LEFT JOIN (
  SELECT 
    competition_id,
    SUM(total_quantity) as total_prizes,
    SUM(remaining_quantity) as remaining_prizes
  FROM public.instant_win_prizes
  GROUP BY competition_id
) p ON c.id = p.competition_id
WHERE c.status IN ('active', 'ending_soon');

-- User wallet balance
CREATE VIEW public.wallet_balance_view AS
SELECT 
  user_id,
  SUM(remaining_pence) FILTER (WHERE status = 'active' AND expires_at > NOW()) as available_balance_pence,
  SUM(remaining_pence) FILTER (WHERE status = 'active' AND expires_at > NOW() AND expires_at <= NOW() + INTERVAL '7 days') as expiring_soon_pence,
  MIN(expires_at) FILTER (WHERE status = 'active' AND expires_at > NOW()) as next_expiry_date
FROM public.wallet_credits
GROUP BY user_id;

-- Recent winners for ticker
CREATE VIEW public.recent_winners_view AS
SELECT 
  id,
  display_name,
  location,
  prize_name,
  prize_value_gbp,
  prize_image_url,
  won_at
FROM public.winners
WHERE is_public = true AND show_in_ticker = true
ORDER BY won_at DESC
LIMIT 50;
