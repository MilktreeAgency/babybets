-- BabyBets Seed Data
-- This file contains sample data for development and testing

-- ===========================================
-- SAMPLE PROMO CODES
-- ===========================================

INSERT INTO public.promo_codes (code, type, value, max_uses, max_uses_per_user, is_active) VALUES
  ('BABY10', 'percentage', 10, NULL, 1, true),
  ('BABY15', 'percentage', 15, NULL, 1, true),
  ('BABY20', 'percentage', 20, NULL, 1, true),
  ('WELCOME', 'percentage', 10, NULL, 1, true),
  ('LUCKY5', 'percentage', 5, NULL, 1, true),
  ('FIVER', 'fixed_value', 500, 100, 1, true),  -- £5 off in pence
  ('TENOFF', 'fixed_value', 1000, 50, 1, true); -- £10 off in pence

-- ===========================================
-- SAMPLE COMPETITION (iCandy Mega Mum Bundle)
-- ===========================================

INSERT INTO public.competitions (
  id,
  slug,
  title,
  description,
  image_url,
  category,
  status,
  competition_type,
  start_datetime,
  end_datetime,
  max_tickets,
  tickets_sold,
  max_tickets_per_user,
  base_ticket_price_pence,
  tiered_pricing,
  total_value_gbp,
  end_prize,
  is_featured,
  show_on_homepage
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'icandy-mega-mum-bundle',
  'iCandy Mega Mum Bundle',
  E'Win the iCandy Mega Mum Bundle\n\nThis competition is stacked with premium iCandy prizes, plus cash wins and £100 Smyths Toys vouchers as instant wins throughout.\n\nIt''s not just one prize at the end. You can win instantly while the competition is live, with over 1,900 instant win prizes available, and every entry also goes into the end prize draw for £50 cash.',
  '/images/competitions/PRIZE 1 ICANDY PEACH 7.png',
  'Prams',
  'active',
  'instant_win_with_end_prize',
  '2026-01-05T00:00:00Z',
  '2026-02-28T23:59:59Z',
  10000,
  0,
  500,
  200,  -- £2.00 base price in pence
  '[
    {"minQty": 1, "maxQty": 9, "pricePerTicketPence": 200},
    {"minQty": 10, "maxQty": 19, "pricePerTicketPence": 190},
    {"minQty": 20, "maxQty": 39, "pricePerTicketPence": 185},
    {"minQty": 40, "maxQty": 59, "pricePerTicketPence": 180},
    {"minQty": 60, "maxQty": null, "pricePerTicketPence": 170}
  ]'::jsonb,
  8770.00,
  '{"type": "Cash", "name": "£50 Cash", "valueGBP": 50, "quantity": 1}'::jsonb,
  true,
  true
);

-- ===========================================
-- INSTANT WIN PRIZES FOR ICANDY COMPETITION
-- ===========================================

INSERT INTO public.instant_win_prizes (
  competition_id,
  prize_code,
  name,
  short_name,
  type,
  value_gbp,
  cash_alternative_gbp,
  total_quantity,
  remaining_quantity,
  description,
  image_url,
  tier
) VALUES
  -- Tier 1: High Value Physical Prizes
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-001',
    'iCandy Peach 7 (Biscotti Bundle + Cocoon Car Seat & ISOFIX Base)',
    'iCandy Peach 7',
    'Physical',
    1598.00,
    1400.00,
    2,
    2,
    'The iCandy Peach 7 Biscotti Bundle is a complete luxury travel system designed to take your baby from newborn to toddler in comfort and style.',
    '/images/competitions/PRIZE 1 ICANDY PEACH 7.png',
    1
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-002',
    'iCandy Cocoon Swivel car seat + ISOFIX base',
    'iCandy Cocoon',
    'Physical',
    349.00,
    300.00,
    4,
    4,
    'Introducing the iCandy Cocoon car seat - the car seat ADAC-rated for top safety.',
    '/images/competitions/PRIZE 2 ICANDY COOON.png',
    1
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-003',
    'iCandy Pip Pushchair',
    'iCandy Pip',
    'Physical',
    364.00,
    300.00,
    2,
    2,
    'The highly anticipated compact fold pushchair, crafted for the modern family.',
    '/images/competitions/PRIZE 3 ICANDY PIP PUSHCHAIR.png',
    1
  ),
  -- Tier 2: Vouchers and Mid-Value
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-004',
    'Smyths Toy Gift Voucher',
    'Smyths Toy Voucher',
    'Voucher',
    100.00,
    90.00,
    5,
    5,
    'Treat yourself (or the kids) to a £100 Smyths Toys voucher.',
    '/images/competitions/PRIZE 4 SMYTHS TOY VOUCHER.png',
    2
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-005',
    'Rockit Baby Rocker',
    'Rockit Rocker',
    'Physical',
    40.00,
    30.00,
    10,
    10,
    'The Rockit Rocker Rechargeable - Portable Baby Rocker for on-the-go parents.',
    '/images/competitions/PRIZE 5 ROCKIT BABY ROCKER.png',
    2
  ),
  -- Tier 3: Cash Prizes
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-006',
    '£50 Cash',
    '£50 Cash',
    'Cash',
    50.00,
    NULL,
    2,
    2,
    '£50 Cash to spend on whatever you like',
    NULL,
    3
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-007',
    '£20 Cash',
    '£20 Cash',
    'Cash',
    20.00,
    NULL,
    10,
    10,
    '£20 Cash to spend on whatever you like',
    NULL,
    3
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-008',
    '£10 Cash',
    '£10 Cash',
    'Cash',
    10.00,
    NULL,
    20,
    20,
    '£10 Cash to spend on whatever you like',
    NULL,
    3
  ),
  -- Tier 4: Site Credit
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-009',
    '£5 Site Credit',
    '£5 Credit',
    'SiteCredit',
    5.00,
    NULL,
    100,
    100,
    '£5 site credit to use on future BabyBets competitions',
    NULL,
    4
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-010',
    '£2 Site Credit',
    '£2 Credit',
    'SiteCredit',
    2.00,
    NULL,
    250,
    250,
    '£2 site credit to use on future BabyBets competitions',
    NULL,
    4
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-011',
    '£1 Site Credit',
    '£1 Credit',
    'SiteCredit',
    1.00,
    NULL,
    500,
    500,
    '£1 site credit to use on future BabyBets competitions',
    NULL,
    4
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PR-012',
    '50p Site Credit',
    '50p Credit',
    'SiteCredit',
    0.50,
    NULL,
    1000,
    1000,
    '50p site credit to use on future BabyBets competitions',
    NULL,
    4
  );

-- ===========================================
-- SAMPLE £50 CASH COMPETITION
-- ===========================================

INSERT INTO public.competitions (
  id,
  slug,
  title,
  description,
  image_url,
  category,
  status,
  competition_type,
  start_datetime,
  end_datetime,
  max_tickets,
  tickets_sold,
  max_tickets_per_user,
  base_ticket_price_pence,
  tiered_pricing,
  total_value_gbp,
  is_featured,
  show_on_homepage
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'cash-50',
  '£50 Cash Prize',
  'Win £50 cash! A simple competition with a straightforward cash prize. Perfect for those who want a quick entry with a chance to win spending money.',
  'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?auto=format&fit=crop&q=80&w=600',
  'Cash',
  'active',
  'standard',
  '2026-01-10T00:00:00Z',
  '2026-02-15T23:59:59Z',
  500,
  0,
  50,
  100,  -- £1.00 in pence
  '[]'::jsonb,
  50.00,
  false,
  true
);

-- ===========================================
-- SAMPLE WINNERS (for social proof)
-- ===========================================

INSERT INTO public.winners (
  display_name,
  location,
  prize_name,
  prize_value_gbp,
  prize_image_url,
  win_type,
  is_public,
  show_in_ticker,
  won_at
) VALUES
  ('Sarah J.', 'Manchester', '£50 Site Credit', 50.00, NULL, 'instant_win', true, true, NOW() - INTERVAL '2 hours'),
  ('David M.', 'Essex', 'iCandy Cocoon', 349.00, '/images/competitions/PRIZE 2 ICANDY COOON.png', 'instant_win', true, true, NOW() - INTERVAL '5 hours'),
  ('Emma W.', 'Bristol', '£20 Cash', 20.00, NULL, 'instant_win', true, true, NOW() - INTERVAL '8 hours'),
  ('James P.', 'Leeds', 'Rockit Baby Rocker', 40.00, '/images/competitions/PRIZE 5 ROCKIT BABY ROCKER.png', 'instant_win', true, true, NOW() - INTERVAL '12 hours'),
  ('Lisa T.', 'London', '£5 Site Credit', 5.00, NULL, 'instant_win', true, true, NOW() - INTERVAL '1 day'),
  ('Michael R.', 'Birmingham', 'Smyths Toy Voucher', 100.00, '/images/competitions/PRIZE 4 SMYTHS TOY VOUCHER.png', 'instant_win', true, true, NOW() - INTERVAL '1 day 3 hours'),
  ('Sophie B.', 'Glasgow', '£10 Cash', 10.00, NULL, 'instant_win', true, true, NOW() - INTERVAL '1 day 8 hours'),
  ('Chris K.', 'Newcastle', '£2 Site Credit', 2.00, NULL, 'instant_win', true, true, NOW() - INTERVAL '2 days'),
  ('Amy L.', 'Liverpool', 'iCandy Pip', 364.00, '/images/competitions/PRIZE 3 ICANDY PIP PUSHCHAIR.png', 'instant_win', true, true, NOW() - INTERVAL '2 days 5 hours'),
  ('Tom H.', 'Cardiff', '£1 Site Credit', 1.00, NULL, 'instant_win', true, true, NOW() - INTERVAL '3 days');
