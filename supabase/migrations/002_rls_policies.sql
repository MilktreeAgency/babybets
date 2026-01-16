-- BabyBets Row Level Security Policies
-- Migration: 002_rls_policies
-- Description: RLS policies for secure data access

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instant_win_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is influencer
CREATE OR REPLACE FUNCTION public.is_influencer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'influencer'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- PROFILES POLICIES
-- ===========================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())  -- Can't change own role
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- New users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===========================================
-- COMPETITIONS POLICIES
-- ===========================================

-- Everyone can view active competitions
CREATE POLICY "Anyone can view active competitions"
  ON public.competitions FOR SELECT
  USING (status IN ('active', 'ending_soon', 'sold_out', 'closed', 'drawn', 'completed'));

-- Admins can view all competitions (including drafts)
CREATE POLICY "Admins can view all competitions"
  ON public.competitions FOR SELECT
  USING (public.is_admin());

-- Admins can insert competitions
CREATE POLICY "Admins can insert competitions"
  ON public.competitions FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update competitions
CREATE POLICY "Admins can update competitions"
  ON public.competitions FOR UPDATE
  USING (public.is_admin());

-- Admins can delete competitions (only drafts)
CREATE POLICY "Admins can delete draft competitions"
  ON public.competitions FOR DELETE
  USING (public.is_admin() AND status = 'draft');

-- ===========================================
-- INSTANT WIN PRIZES POLICIES
-- ===========================================

-- Everyone can view prizes for active competitions
CREATE POLICY "Anyone can view prizes for active competitions"
  ON public.instant_win_prizes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.competitions 
      WHERE id = competition_id 
      AND status IN ('active', 'ending_soon', 'sold_out', 'closed', 'drawn', 'completed')
    )
  );

-- Admins can manage all prizes
CREATE POLICY "Admins can view all prizes"
  ON public.instant_win_prizes FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert prizes"
  ON public.instant_win_prizes FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update prizes"
  ON public.instant_win_prizes FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete prizes"
  ON public.instant_win_prizes FOR DELETE
  USING (public.is_admin());

-- ===========================================
-- TICKET ALLOCATIONS POLICIES
-- ===========================================

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets"
  ON public.ticket_allocations FOR SELECT
  USING (sold_to_user_id = auth.uid());

-- Users can update their own tickets (for revealing)
CREATE POLICY "Users can reveal own tickets"
  ON public.ticket_allocations FOR UPDATE
  USING (sold_to_user_id = auth.uid())
  WITH CHECK (
    sold_to_user_id = auth.uid()
    AND is_revealed = true  -- Can only set revealed to true
  );

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
  ON public.ticket_allocations FOR SELECT
  USING (public.is_admin());

-- Admins can manage tickets
CREATE POLICY "Admins can insert tickets"
  ON public.ticket_allocations FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update tickets"
  ON public.ticket_allocations FOR UPDATE
  USING (public.is_admin());

-- ===========================================
-- ORDERS POLICIES
-- ===========================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own pending orders
CREATE POLICY "Users can update own pending orders"
  ON public.orders FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

-- Admins can update all orders
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- Influencers can view orders with their code
CREATE POLICY "Influencers can view attributed orders"
  ON public.orders FOR SELECT
  USING (influencer_id = auth.uid());

-- ===========================================
-- ORDER ITEMS POLICIES
-- ===========================================

-- Users can view their own order items
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Users can create order items for their own orders
CREATE POLICY "Users can create own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (public.is_admin());

-- ===========================================
-- WALLET CREDITS POLICIES
-- ===========================================

-- Users can view their own credits
CREATE POLICY "Users can view own credits"
  ON public.wallet_credits FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all credits
CREATE POLICY "Admins can view all credits"
  ON public.wallet_credits FOR SELECT
  USING (public.is_admin());

-- Admins can manage credits
CREATE POLICY "Admins can insert credits"
  ON public.wallet_credits FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update credits"
  ON public.wallet_credits FOR UPDATE
  USING (public.is_admin());

-- ===========================================
-- WALLET TRANSACTIONS POLICIES
-- ===========================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON public.wallet_transactions FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
  ON public.wallet_transactions FOR SELECT
  USING (public.is_admin());

-- Admins can insert transactions
CREATE POLICY "Admins can insert transactions"
  ON public.wallet_transactions FOR INSERT
  WITH CHECK (public.is_admin());

-- ===========================================
-- PROMO CODES POLICIES
-- ===========================================

-- Anyone can view active promo codes (for validation)
CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes FOR SELECT
  USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

-- Admins can manage all promo codes
CREATE POLICY "Admins can view all promo codes"
  ON public.promo_codes FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert promo codes"
  ON public.promo_codes FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update promo codes"
  ON public.promo_codes FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete promo codes"
  ON public.promo_codes FOR DELETE
  USING (public.is_admin());

-- ===========================================
-- WINNERS POLICIES
-- ===========================================

-- Anyone can view public winners
CREATE POLICY "Anyone can view public winners"
  ON public.winners FOR SELECT
  USING (is_public = true);

-- Admins can manage all winners
CREATE POLICY "Admins can view all winners"
  ON public.winners FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert winners"
  ON public.winners FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update winners"
  ON public.winners FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete winners"
  ON public.winners FOR DELETE
  USING (public.is_admin());

-- ===========================================
-- PRIZE FULFILLMENTS POLICIES
-- ===========================================

-- Users can view their own fulfillments
CREATE POLICY "Users can view own fulfillments"
  ON public.prize_fulfillments FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own pending fulfillments (for choice)
CREATE POLICY "Users can update own pending fulfillments"
  ON public.prize_fulfillments FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all fulfillments
CREATE POLICY "Admins can view all fulfillments"
  ON public.prize_fulfillments FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert fulfillments"
  ON public.prize_fulfillments FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update fulfillments"
  ON public.prize_fulfillments FOR UPDATE
  USING (public.is_admin());

-- ===========================================
-- INFLUENCERS POLICIES
-- ===========================================

-- Anyone can view active influencers (for pages)
CREATE POLICY "Anyone can view active influencers"
  ON public.influencers FOR SELECT
  USING (is_active = true);

-- Users can view their own influencer profile
CREATE POLICY "Users can view own influencer profile"
  ON public.influencers FOR SELECT
  USING (user_id = auth.uid());

-- Influencers can update their own profile
CREATE POLICY "Influencers can update own profile"
  ON public.influencers FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all influencers
CREATE POLICY "Admins can view all influencers"
  ON public.influencers FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert influencers"
  ON public.influencers FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update influencers"
  ON public.influencers FOR UPDATE
  USING (public.is_admin());

-- ===========================================
-- INFLUENCER SALES POLICIES
-- ===========================================

-- Influencers can view their own sales
CREATE POLICY "Influencers can view own sales"
  ON public.influencer_sales FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.influencers 
      WHERE id = influencer_id AND user_id = auth.uid()
    )
  );

-- Admins can manage all influencer sales
CREATE POLICY "Admins can view all influencer sales"
  ON public.influencer_sales FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert influencer sales"
  ON public.influencer_sales FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update influencer sales"
  ON public.influencer_sales FOR UPDATE
  USING (public.is_admin());

-- ===========================================
-- WITHDRAWAL REQUESTS POLICIES
-- ===========================================

-- Users can view their own withdrawal requests
CREATE POLICY "Users can view own withdrawals"
  ON public.withdrawal_requests FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own withdrawal requests
CREATE POLICY "Users can create own withdrawals"
  ON public.withdrawal_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all withdrawal requests
CREATE POLICY "Admins can view all withdrawals"
  ON public.withdrawal_requests FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update withdrawals"
  ON public.withdrawal_requests FOR UPDATE
  USING (public.is_admin());

-- ===========================================
-- SERVICE ROLE BYPASS
-- ===========================================

-- Note: The service role (used by Edge Functions) automatically bypasses RLS
-- This is handled by Supabase automatically when using the service_role key
