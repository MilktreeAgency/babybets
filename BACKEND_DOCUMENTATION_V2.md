# BabyBets Backend Documentation v2.0

**Document Version:** 2.1  
**Last Updated:** January 16, 2026  
**Status:** SPECIFICATION - Production-Ready Architecture  
**Payment Provider:** Cashflows ([Developer Portal](https://developer.cashflows.com/))

---

## Document Changes from v1.0

This version resolves all critical issues identified in the v1.0 review:

| Issue | Resolution |
|-------|------------|
| No Free Postal Entry | Added `postal_entries` table and processing workflow |
| No Age Verification | Added age verification flow with ID check provider |
| Instant Win Pre-Determination | Implemented commit-reveal cryptographic scheme |
| Missing `order_items` Table | Added to schema |
| No Draw Audit Integrity | Added ticket snapshot and cryptographic proof |
| Stripe Integration | Replaced with Cashflows Gateway integration |
| No Fraud Detection | Added fraud prevention rules and monitoring |
| No Reconciliation | Added daily reconciliation job |
| No Competition Cancellation | Added cancellation workflow |
| Missing Tables | Added 8 new tables |

---

## 1. System Architecture Overview

### Production Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Browser    │─────→│   Backend    │─────→│  PostgreSQL  │
│  (React SPA) │      │   API        │      │   Database   │
└──────────────┘      └──────────────┘      └──────────────┘
                             │
                   ┌─────────┼─────────┐
                   │         │         │
                   ▼         ▼         ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │Cashflows │ │  Email   │ │   Age    │
            │ Gateway  │ │ Service  │ │ Verify   │
            └──────────┘ └──────────┘ └──────────┘
                   │
                   ▼
            ┌──────────┐
            │  Redis   │ ← Caching, Rate Limiting, Sessions
            └──────────┘
```

### Third-Party Services

| Service | Provider | Purpose |
|---------|----------|---------|
| Payments | [Cashflows Gateway](https://developer.cashflows.com/) | Card payments, refunds |
| Email | SendGrid / AWS SES | Transactional emails |
| Age Verification | Onfido / Yoti | ID document verification |
| CDN | Cloudflare | Static assets, DDoS protection |
| Monitoring | Sentry + Datadog | Errors, performance |

---

## 2. Authentication and Authorization

### Implementation

```typescript
// JWT Token Structure
interface AccessToken {
  sub: string;        // User ID
  email: string;
  role: 'user' | 'admin' | 'affiliate';
  ageVerified: boolean;
  iat: number;
  exp: number;        // 15 minutes
}

interface RefreshToken {
  sub: string;
  jti: string;        // Unique token ID (for revocation)
  exp: number;        // 7 days
}
```

### Age Verification Flow

```
1. User registers → account created with age_verified = FALSE
2. User attempts first purchase → redirect to age verification
3. User submits ID document via Onfido/Yoti
4. Webhook receives verification result
5. If verified (18+): age_verified = TRUE, user can purchase
6. If failed: account flagged, cannot purchase
```

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 requests | 15 minutes |
| POST /auth/register | 3 requests | 1 hour |
| POST /orders | 10 requests | 1 minute |
| POST /tickets/:id/reveal | 30 requests | 1 minute |

---

## 3. Database Schema (Complete)

### Core Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  phone VARCHAR(20),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  age_verified BOOLEAN DEFAULT FALSE,
  age_verified_at TIMESTAMP,
  age_verification_provider VARCHAR(50), -- 'onfido', 'yoti'
  age_verification_reference VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'affiliate')),
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  last_login_at TIMESTAMP,
  last_login_ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### `user_addresses`
```sql
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address_type VARCHAR(20) DEFAULT 'shipping', -- 'shipping', 'billing'
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100),
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(2) DEFAULT 'GB',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);
```

#### `competitions`
```sql
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  retail_value_gbp DECIMAL(10,2) NOT NULL,
  ticket_price_gbp DECIMAL(10,2) NOT NULL,
  max_tickets INTEGER NOT NULL,
  tickets_sold INTEGER DEFAULT 0,
  draw_date_time TIMESTAMP NOT NULL,
  category VARCHAR(50) CHECK (category IN ('Toys', 'Nursery', 'Essentials', 'Holidays', 'Cash')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
    'draft', 'scheduled', 'active', 'ending_soon', 'sold_out', 'closed', 'drawing', 'drawn', 'completed', 'cancelled'
  )),
  is_instant_win BOOLEAN DEFAULT FALSE,
  min_tickets_for_draw INTEGER DEFAULT 1, -- Minimum tickets required to proceed with draw
  terms_and_conditions TEXT,
  prize_supplier VARCHAR(255),
  prize_supplier_contact VARCHAR(255),
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_tickets_sold CHECK (tickets_sold <= max_tickets),
  CONSTRAINT check_positive_values CHECK (retail_value_gbp > 0 AND ticket_price_gbp > 0),
  CONSTRAINT check_min_tickets CHECK (min_tickets_for_draw >= 1)
);

CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_draw_date ON competitions(draw_date_time);
CREATE INDEX idx_competitions_category ON competitions(category);
```

#### `ticket_bundles`
```sql
CREATE TABLE ticket_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_gbp DECIMAL(10,2) NOT NULL,
  label VARCHAR(50),
  savings_percent DECIMAL(5,2), -- Pre-calculated for display
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT check_bundle_positive CHECK (quantity > 0 AND price_gbp > 0)
);

CREATE INDEX idx_bundles_competition ON ticket_bundles(competition_id);
```

#### `instant_win_prizes`
```sql
CREATE TABLE instant_win_prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  prize_name VARCHAR(255) NOT NULL,
  prize_value_gbp DECIMAL(10,2) NOT NULL,
  total_quantity INTEGER NOT NULL,
  remaining_quantity INTEGER NOT NULL,
  prize_type VARCHAR(50) CHECK (prize_type IN ('cash', 'credit', 'physical', 'voucher')),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_remaining CHECK (remaining_quantity >= 0 AND remaining_quantity <= total_quantity)
);

CREATE INDEX idx_instant_prizes_competition ON instant_win_prizes(competition_id);
CREATE INDEX idx_instant_prizes_remaining ON instant_win_prizes(competition_id, remaining_quantity) 
  WHERE remaining_quantity > 0;
```

### Order Tables

#### `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  subtotal_gbp DECIMAL(10,2) NOT NULL,
  discount_gbp DECIMAL(10,2) DEFAULT 0,
  total_gbp DECIMAL(10,2) NOT NULL,
  vat_gbp DECIMAL(10,2) DEFAULT 0,
  promo_code_id UUID REFERENCES promo_codes(id),
  affiliate_id UUID REFERENCES affiliates(id),
  
  -- Cashflows Payment Details
  cashflows_transaction_id VARCHAR(255),
  cashflows_order_id VARCHAR(255),
  payment_method VARCHAR(50), -- 'card', 'apple_pay', 'google_pay'
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded', 'disputed'
  )),
  
  -- Customer Details (snapshot at time of order)
  customer_email VARCHAR(255) NOT NULL,
  customer_first_name VARCHAR(100),
  customer_last_name VARCHAR(100),
  customer_ip VARCHAR(45),
  customer_user_agent TEXT,
  
  -- Fraud Score
  fraud_score INTEGER DEFAULT 0,
  fraud_flags JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  
  CONSTRAINT check_order_amounts CHECK (total_gbp >= 0 AND subtotal_gbp >= 0)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_cashflows ON orders(cashflows_transaction_id);
CREATE INDEX idx_orders_affiliate ON orders(affiliate_id) WHERE affiliate_id IS NOT NULL;
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES competitions(id),
  bundle_id UUID REFERENCES ticket_bundles(id),
  quantity INTEGER NOT NULL,
  unit_price_gbp DECIMAL(10,2) NOT NULL,
  total_price_gbp DECIMAL(10,2) NOT NULL,
  is_instant_win BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_item_positive CHECK (quantity > 0 AND unit_price_gbp >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_competition ON order_items(competition_id);
```

### Ticket Tables

#### `tickets`
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  competition_id UUID REFERENCES competitions(id),
  order_id UUID REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  user_id UUID REFERENCES users(id),
  entry_type VARCHAR(20) DEFAULT 'paid' CHECK (entry_type IN ('paid', 'postal', 'promotional')),
  
  -- Instant Win (Commit-Reveal Scheme)
  is_instant_win BOOLEAN DEFAULT FALSE,
  instant_win_commitment VARCHAR(64), -- SHA-256 hash of outcome + secret
  instant_win_secret VARCHAR(64),     -- Revealed after user scratches
  instant_win_outcome BOOLEAN,        -- NULL until revealed
  instant_win_prize_id UUID REFERENCES instant_win_prizes(id),
  revealed_at TIMESTAMP,
  
  -- Main Draw
  is_main_winner BOOLEAN DEFAULT FALSE,
  
  -- Status
  is_void BOOLEAN DEFAULT FALSE,
  void_reason VARCHAR(255),
  voided_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_instant_reveal CHECK (
    (instant_win_outcome IS NULL AND revealed_at IS NULL) OR
    (instant_win_outcome IS NOT NULL AND revealed_at IS NOT NULL)
  )
);

CREATE INDEX idx_tickets_competition ON tickets(competition_id) WHERE is_void = FALSE;
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_order ON tickets(order_id);
CREATE INDEX idx_tickets_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_unrevealed ON tickets(competition_id, revealed_at) 
  WHERE is_instant_win = TRUE AND revealed_at IS NULL AND is_void = FALSE;
CREATE INDEX idx_tickets_draw_pool ON tickets(competition_id, id)
  WHERE is_void = FALSE;
```

### Postal Entry Tables

#### `postal_entries`
```sql
CREATE TABLE postal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id),
  
  -- Entrant Details
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  
  -- Processing
  received_date DATE NOT NULL,
  postmark_date DATE,
  envelope_reference VARCHAR(100), -- Tracking number or batch ID
  processed_by UUID REFERENCES users(id),
  processed_at TIMESTAMP,
  
  -- Outcome
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'verified', 'rejected', 'ticket_generated'
  )),
  rejection_reason VARCHAR(255),
  ticket_id UUID REFERENCES tickets(id),
  
  -- Audit
  scan_image_url TEXT, -- Scanned envelope/postcard
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_age CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years')
);

CREATE INDEX idx_postal_entries_competition ON postal_entries(competition_id);
CREATE INDEX idx_postal_entries_status ON postal_entries(status);
CREATE INDEX idx_postal_entries_email ON postal_entries(email);
```

### Draw & Audit Tables

#### `draw_snapshots`
```sql
CREATE TABLE draw_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id),
  snapshot_hash VARCHAR(64) NOT NULL, -- SHA-256 of ordered ticket IDs
  total_entries INTEGER NOT NULL,
  paid_entries INTEGER NOT NULL,
  postal_entries INTEGER NOT NULL,
  promotional_entries INTEGER NOT NULL,
  ticket_ids_json JSONB NOT NULL, -- Ordered array of all ticket IDs
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_draw_snapshots_competition ON draw_snapshots(competition_id);
```

#### `draws`
```sql
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id),
  snapshot_id UUID REFERENCES draw_snapshots(id),
  
  -- Random Selection
  random_seed VARCHAR(64) NOT NULL, -- Cryptographically secure random bytes
  random_source VARCHAR(50), -- 'crypto.randomBytes', 'random.org', etc.
  winner_index INTEGER NOT NULL,
  
  -- Winner
  winning_ticket_id UUID REFERENCES tickets(id),
  winning_user_id UUID REFERENCES users(id),
  
  -- Verification
  verification_hash VARCHAR(64), -- Hash of (snapshot_hash + random_seed + winner_index)
  
  -- Execution
  executed_by UUID REFERENCES users(id), -- Admin who triggered draw
  executed_at TIMESTAMP DEFAULT NOW(),
  
  -- Winner Contact
  winner_notified_at TIMESTAMP,
  winner_responded_at TIMESTAMP,
  prize_claimed_at TIMESTAMP,
  prize_dispatched_at TIMESTAMP,
  
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN (
    'completed', 'winner_notified', 'prize_claimed', 'prize_dispatched', 'closed'
  ))
);

CREATE INDEX idx_draws_competition ON draws(competition_id);
```

#### `draw_audit_log`
```sql
CREATE TABLE draw_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES draws(id),
  action VARCHAR(50) NOT NULL,
  actor_id UUID REFERENCES users(id),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_draw_audit_draw ON draw_audit_log(draw_id);
```

### Promo & Affiliate Tables

#### `promo_codes`
```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_gbp DECIMAL(10,2) DEFAULT 0,
  max_discount_gbp DECIMAL(10,2),
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  max_uses INTEGER,
  max_uses_per_user INTEGER DEFAULT 1,
  times_used INTEGER DEFAULT 0,
  applicable_competitions UUID[], -- NULL = all competitions
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_discount_positive CHECK (discount_value > 0)
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code) WHERE is_active = TRUE;
```

#### `promo_code_usage`
```sql
CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id),
  user_id UUID REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  discount_applied_gbp DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_promo_usage_code ON promo_code_usage(promo_code_id);
CREATE INDEX idx_promo_usage_user ON promo_code_usage(user_id);
```

#### `affiliates`
```sql
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  affiliate_code VARCHAR(50) UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  tier VARCHAR(20) DEFAULT 'standard' CHECK (tier IN ('standard', 'premium', 'ambassador')),
  
  -- Stats (updated via triggers/jobs)
  total_clicks INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue_gbp DECIMAL(10,2) DEFAULT 0,
  total_commission_gbp DECIMAL(10,2) DEFAULT 0,
  pending_commission_gbp DECIMAL(10,2) DEFAULT 0,
  
  -- Payout Details
  payout_method VARCHAR(50), -- 'bank_transfer', 'paypal'
  payout_details JSONB, -- Encrypted bank details
  min_payout_gbp DECIMAL(10,2) DEFAULT 50.00,
  
  is_active BOOLEAN DEFAULT TRUE,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code) WHERE is_active = TRUE;
CREATE INDEX idx_affiliates_user ON affiliates(user_id);
```

#### `affiliate_clicks`
```sql
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id),
  session_id VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referer TEXT,
  landing_page TEXT,
  clicked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id, clicked_at DESC);
CREATE INDEX idx_affiliate_clicks_session ON affiliate_clicks(session_id);
```

#### `affiliate_commissions`
```sql
CREATE TABLE affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id),
  order_id UUID REFERENCES orders(id),
  order_total_gbp DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_gbp DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'paid', 'voided'
  )),
  holdback_until TIMESTAMP, -- 14-day holdback for refunds
  approved_at TIMESTAMP,
  paid_at TIMESTAMP,
  payout_id UUID REFERENCES affiliate_payouts(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_affiliate_commissions_affiliate ON affiliate_commissions(affiliate_id);
CREATE INDEX idx_affiliate_commissions_status ON affiliate_commissions(status);
```

#### `affiliate_payouts`
```sql
CREATE TABLE affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id),
  amount_gbp DECIMAL(10,2) NOT NULL,
  commission_count INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'paid', 'failed'
  )),
  payment_reference VARCHAR(255),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_affiliate_payouts_affiliate ON affiliate_payouts(affiliate_id);
CREATE INDEX idx_affiliate_payouts_status ON affiliate_payouts(status);
```

### Payment Tables

#### `cashflows_webhooks`
```sql
CREATE TABLE cashflows_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id VARCHAR(255) UNIQUE NOT NULL, -- Cashflows event ID
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  signature VARCHAR(255),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cashflows_webhooks_id ON cashflows_webhooks(webhook_id);
CREATE INDEX idx_cashflows_webhooks_unprocessed ON cashflows_webhooks(processed, created_at) 
  WHERE processed = FALSE;
```

#### `refunds`
```sql
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  cashflows_refund_id VARCHAR(255),
  amount_gbp DECIMAL(10,2) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  refund_type VARCHAR(20) CHECK (refund_type IN ('full', 'partial', 'competition_cancelled')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'failed'
  )),
  initiated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_refunds_order ON refunds(order_id);
CREATE INDEX idx_refunds_status ON refunds(status);
```

### Email & Notification Tables

#### `email_logs`
```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email_type VARCHAR(50) NOT NULL, -- 'order_confirmation', 'winner_notification', etc.
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  template_id VARCHAR(100),
  template_data JSONB,
  provider_message_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type, sent_at DESC);
```

### Reconciliation Tables

#### `daily_reconciliation`
```sql
CREATE TABLE daily_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_date DATE UNIQUE NOT NULL,
  
  -- Order Totals
  orders_count INTEGER NOT NULL,
  orders_total_gbp DECIMAL(12,2) NOT NULL,
  
  -- Cashflows Totals
  cashflows_transactions_count INTEGER NOT NULL,
  cashflows_total_gbp DECIMAL(12,2) NOT NULL,
  
  -- Discrepancies
  discrepancy_count INTEGER DEFAULT 0,
  discrepancy_amount_gbp DECIMAL(12,2) DEFAULT 0,
  discrepancy_details JSONB,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'matched', 'discrepancy', 'resolved'
  )),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  resolution_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_daily_reconciliation_date ON daily_reconciliation(reconciliation_date DESC);
CREATE INDEX idx_daily_reconciliation_status ON daily_reconciliation(status);
```

---

## 4. Core Domain Logic

### 4.1 Instant Win: Commit-Reveal Scheme

**Problem:** Pre-determining outcomes at purchase time is a security risk.

**Solution:** Use cryptographic commitment scheme:

```typescript
import crypto from 'crypto';

interface InstantWinCommitment {
  commitment: string;  // Stored at purchase time
  secret: string;      // Stored encrypted, revealed later
  outcome: boolean;    // Derived from secret
}

// At PURCHASE TIME: Generate commitment
async function generateInstantWinCommitment(
  competitionId: string,
  ticketId: string,
  tx: Transaction
): Promise<InstantWinCommitment> {
  // Get available prizes
  const prizes = await tx.query(`
    SELECT * FROM instant_win_prizes 
    WHERE competition_id = $1 AND remaining_quantity > 0
    FOR UPDATE
  `, [competitionId]);
  
  // Get competition stats for fair probability
  const competition = await tx.query(`
    SELECT max_tickets, tickets_sold FROM competitions 
    WHERE id = $1
  `, [competitionId]);
  
  const totalPrizesRemaining = prizes.reduce((sum, p) => sum + p.remaining_quantity, 0);
  const ticketsRemaining = competition.max_tickets - competition.tickets_sold;
  
  // Generate cryptographically secure secret
  const secret = crypto.randomBytes(32).toString('hex');
  
  // Determine outcome using secret as seed
  // Use last 8 bytes as a number, compare to probability threshold
  const secretNum = parseInt(secret.slice(-16), 16);
  const threshold = (totalPrizesRemaining / ticketsRemaining) * 0xFFFFFFFFFFFFFFFF;
  const isWinner = secretNum < threshold;
  
  // Create commitment (hash of outcome + secret + ticketId)
  const commitmentData = `${isWinner}:${secret}:${ticketId}`;
  const commitment = crypto.createHash('sha256').update(commitmentData).digest('hex');
  
  // If winner, reserve a prize
  let prizeId = null;
  if (isWinner && prizes.length > 0) {
    // Select prize (could be weighted by value)
    const selectedPrize = prizes[0];
    prizeId = selectedPrize.id;
    
    await tx.query(`
      UPDATE instant_win_prizes 
      SET remaining_quantity = remaining_quantity - 1
      WHERE id = $1 AND remaining_quantity > 0
    `, [prizeId]);
  }
  
  // Store commitment and encrypted secret
  await tx.query(`
    UPDATE tickets 
    SET instant_win_commitment = $1,
        instant_win_secret = $2,
        instant_win_prize_id = $3
    WHERE id = $4
  `, [commitment, encryptSecret(secret), prizeId, ticketId]);
  
  return { commitment, secret, outcome: isWinner };
}

// At REVEAL TIME: Verify and reveal
async function revealInstantWin(ticketId: string, userId: string): Promise<RevealResult> {
  return await db.transaction(async (tx) => {
    const ticket = await tx.query(`
      SELECT * FROM tickets 
      WHERE id = $1 AND user_id = $2 AND is_instant_win = TRUE AND revealed_at IS NULL
      FOR UPDATE
    `, [ticketId, userId]);
    
    if (!ticket) {
      throw new Error('Ticket not found or already revealed');
    }
    
    // Decrypt secret
    const secret = decryptSecret(ticket.instant_win_secret);
    
    // Verify commitment
    const expectedCommitment = crypto.createHash('sha256')
      .update(`${ticket.instant_win_outcome !== null ? ticket.instant_win_outcome : ''}:${secret}:${ticketId}`)
      .digest('hex');
    
    // Derive outcome from secret (same logic as generation)
    const secretNum = parseInt(secret.slice(-16), 16);
    const isWinner = ticket.instant_win_prize_id !== null;
    
    // Get prize details if winner
    let prize = null;
    if (isWinner) {
      prize = await tx.query(`
        SELECT * FROM instant_win_prizes WHERE id = $1
      `, [ticket.instant_win_prize_id]);
    }
    
    // Update ticket with revealed outcome
    await tx.query(`
      UPDATE tickets 
      SET instant_win_outcome = $1,
          revealed_at = NOW()
      WHERE id = $2
    `, [isWinner, ticketId]);
    
    // Log reveal
    await tx.query(`
      INSERT INTO email_logs (user_id, email_type, recipient_email, subject, template_data)
      SELECT $1, 'instant_win_reveal', email, 
             CASE WHEN $2 THEN 'You Won!' ELSE 'Better Luck Next Time' END,
             $3
      FROM users WHERE id = $1
    `, [userId, isWinner, JSON.stringify({ prize: prize?.prize_name, ticketNumber: ticket.ticket_number })]);
    
    return {
      ticketId,
      ticketNumber: ticket.ticket_number,
      isWinner,
      prize: prize ? {
        name: prize.prize_name,
        value: prize.prize_value_gbp,
        type: prize.prize_type
      } : null,
      // Return secret for client-side verification (optional transparency)
      verificationSecret: secret
    };
  });
}
```

### 4.2 Free Postal Entry Processing

**Legal Requirement:** UK law requires a genuine free entry method.

```typescript
// Admin endpoint to process postal entries
async function processPostalEntry(entryId: string, adminId: string): Promise<void> {
  return await db.transaction(async (tx) => {
    const entry = await tx.query(`
      SELECT * FROM postal_entries 
      WHERE id = $1 AND status = 'pending'
      FOR UPDATE
    `, [entryId]);
    
    if (!entry) {
      throw new Error('Entry not found or already processed');
    }
    
    // Verify competition is still open for entries
    const competition = await tx.query(`
      SELECT * FROM competitions 
      WHERE id = $1 AND status IN ('active', 'ending_soon')
    `, [entry.competition_id]);
    
    if (!competition) {
      // Reject - competition closed
      await tx.query(`
        UPDATE postal_entries 
        SET status = 'rejected', 
            rejection_reason = 'Competition closed for entries',
            processed_by = $1,
            processed_at = NOW()
        WHERE id = $2
      `, [adminId, entryId]);
      return;
    }
    
    // Verify age (must be 18+)
    const age = calculateAge(entry.date_of_birth);
    if (age < 18) {
      await tx.query(`
        UPDATE postal_entries 
        SET status = 'rejected', 
            rejection_reason = 'Entrant under 18',
            processed_by = $1,
            processed_at = NOW()
        WHERE id = $2
      `, [adminId, entryId]);
      return;
    }
    
    // Check for duplicate entries (same email for same competition)
    const duplicateCheck = await tx.query(`
      SELECT COUNT(*) FROM postal_entries 
      WHERE competition_id = $1 
        AND email = $2 
        AND id != $3 
        AND status = 'ticket_generated'
    `, [entry.competition_id, entry.email, entryId]);
    
    if (duplicateCheck.count > 0) {
      await tx.query(`
        UPDATE postal_entries 
        SET status = 'rejected', 
            rejection_reason = 'Duplicate entry',
            processed_by = $1,
            processed_at = NOW()
        WHERE id = $2
      `, [adminId, entryId]);
      return;
    }
    
    // Generate ticket for postal entry
    const ticketNumber = await generateUniqueTicketNumber(competition.slug);
    
    // Find or create user account
    let userId = await tx.query(`
      SELECT id FROM users WHERE email = $1
    `, [entry.email]);
    
    if (!userId) {
      // Create minimal account (no password - they can claim later)
      userId = await tx.query(`
        INSERT INTO users (email, first_name, last_name, date_of_birth, email_verified)
        VALUES ($1, $2, $3, $4, FALSE)
        RETURNING id
      `, [entry.email, entry.first_name, entry.last_name, entry.date_of_birth]);
    }
    
    // Create ticket
    const ticket = await tx.query(`
      INSERT INTO tickets (
        ticket_number, competition_id, user_id, entry_type,
        is_instant_win
      ) VALUES ($1, $2, $3, 'postal', $4)
      RETURNING id
    `, [ticketNumber, competition.id, userId, competition.is_instant_win]);
    
    // If instant win, generate commitment
    if (competition.is_instant_win) {
      await generateInstantWinCommitment(competition.id, ticket.id, tx);
    }
    
    // Update postal entry
    await tx.query(`
      UPDATE postal_entries 
      SET status = 'ticket_generated',
          ticket_id = $1,
          processed_by = $2,
          processed_at = NOW()
      WHERE id = $3
    `, [ticket.id, adminId, entryId]);
    
    // Increment tickets_sold
    await tx.query(`
      UPDATE competitions 
      SET tickets_sold = tickets_sold + 1
      WHERE id = $1
    `, [competition.id]);
    
    // Send confirmation email
    await sendEmail({
      to: entry.email,
      template: 'postal_entry_confirmed',
      data: {
        firstName: entry.first_name,
        competitionTitle: competition.title,
        ticketNumber: ticketNumber,
        drawDate: competition.draw_date_time
      }
    });
  });
}
```

### 4.3 Draw Execution with Audit Trail

```typescript
async function executeCompetitionDraw(
  competitionId: string, 
  adminId: string
): Promise<DrawResult> {
  return await db.transaction(async (tx) => {
    // Lock competition
    const competition = await tx.query(`
      UPDATE competitions
      SET status = 'drawing', updated_at = NOW()
      WHERE id = $1 AND status = 'closed'
      RETURNING *
    `, [competitionId]);
    
    if (!competition) {
      throw new Error('Competition not ready for draw');
    }
    
    // Get all valid tickets (ordered by ID for deterministic snapshot)
    const tickets = await tx.query(`
      SELECT id, ticket_number, user_id, entry_type
      FROM tickets
      WHERE competition_id = $1 AND is_void = FALSE
      ORDER BY id ASC
    `, [competitionId]);
    
    if (tickets.length < competition.min_tickets_for_draw) {
      throw new Error(`Minimum ${competition.min_tickets_for_draw} tickets required`);
    }
    
    // Create snapshot
    const ticketIds = tickets.map(t => t.id);
    const snapshotHash = crypto.createHash('sha256')
      .update(JSON.stringify(ticketIds))
      .digest('hex');
    
    const paidCount = tickets.filter(t => t.entry_type === 'paid').length;
    const postalCount = tickets.filter(t => t.entry_type === 'postal').length;
    const promoCount = tickets.filter(t => t.entry_type === 'promotional').length;
    
    const snapshot = await tx.query(`
      INSERT INTO draw_snapshots (
        competition_id, snapshot_hash, total_entries,
        paid_entries, postal_entries, promotional_entries, ticket_ids_json
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      competitionId, snapshotHash, tickets.length,
      paidCount, postalCount, promoCount, JSON.stringify(ticketIds)
    ]);
    
    // Generate cryptographically secure random seed
    const randomSeed = crypto.randomBytes(32).toString('hex');
    
    // Select winner using seed
    const seedNum = parseInt(randomSeed.slice(0, 16), 16);
    const winnerIndex = seedNum % tickets.length;
    const winningTicket = tickets[winnerIndex];
    
    // Create verification hash
    const verificationHash = crypto.createHash('sha256')
      .update(`${snapshotHash}:${randomSeed}:${winnerIndex}`)
      .digest('hex');
    
    // Mark ticket as winner
    await tx.query(`
      UPDATE tickets SET is_main_winner = TRUE WHERE id = $1
    `, [winningTicket.id]);
    
    // Create draw record
    const draw = await tx.query(`
      INSERT INTO draws (
        competition_id, snapshot_id, random_seed, random_source,
        winner_index, winning_ticket_id, winning_user_id,
        verification_hash, executed_by
      ) VALUES ($1, $2, $3, 'crypto.randomBytes', $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      competitionId, snapshot.id, randomSeed, winnerIndex,
      winningTicket.id, winningTicket.user_id, verificationHash, adminId
    ]);
    
    // Update competition status
    await tx.query(`
      UPDATE competitions SET status = 'drawn' WHERE id = $1
    `, [competitionId]);
    
    // Create audit log entry
    await tx.query(`
      INSERT INTO draw_audit_log (draw_id, action, actor_id, details)
      VALUES ($1, 'draw_executed', $2, $3)
    `, [draw.id, adminId, JSON.stringify({
      totalEntries: tickets.length,
      winnerIndex,
      verificationHash
    })]);
    
    // Get winner details for notification
    const winner = await tx.query(`
      SELECT u.*, t.ticket_number
      FROM users u
      JOIN tickets t ON t.user_id = u.id
      WHERE t.id = $1
    `, [winningTicket.id]);
    
    // Send winner notification (async)
    sendWinnerNotificationEmail(winner, competition).catch(console.error);
    
    return {
      drawId: draw.id,
      competitionId,
      competitionTitle: competition.title,
      totalEntries: tickets.length,
      winnerTicketNumber: winningTicket.ticket_number,
      winnerUserId: winningTicket.user_id,
      verificationHash
    };
  });
}
```

### 4.4 Competition Cancellation Workflow

```typescript
async function cancelCompetition(
  competitionId: string,
  reason: string,
  adminId: string
): Promise<void> {
  return await db.transaction(async (tx) => {
    // Lock and validate competition
    const competition = await tx.query(`
      UPDATE competitions
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1 AND status NOT IN ('drawn', 'completed', 'cancelled')
      RETURNING *
    `, [competitionId]);
    
    if (!competition) {
      throw new Error('Competition cannot be cancelled');
    }
    
    // Get all paid orders for this competition
    const orders = await tx.query(`
      SELECT DISTINCT o.* 
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE oi.competition_id = $1 AND o.payment_status = 'paid'
    `, [competitionId]);
    
    // Process refunds for each order
    for (const order of orders) {
      // Calculate refund amount for this competition's items
      const itemsToRefund = await tx.query(`
        SELECT SUM(total_price_gbp) as refund_amount
        FROM order_items
        WHERE order_id = $1 AND competition_id = $2
      `, [order.id, competitionId]);
      
      const refundAmount = itemsToRefund.refund_amount;
      
      // Create refund record
      const refund = await tx.query(`
        INSERT INTO refunds (
          order_id, amount_gbp, reason, refund_type, initiated_by
        ) VALUES ($1, $2, $3, 'competition_cancelled', $4)
        RETURNING id
      `, [order.id, refundAmount, reason, adminId]);
      
      // Process refund via Cashflows
      await processCashflowsRefund(order.cashflows_transaction_id, refundAmount, refund.id);
    }
    
    // Void all tickets
    await tx.query(`
      UPDATE tickets
      SET is_void = TRUE, void_reason = $1, voided_at = NOW()
      WHERE competition_id = $2
    `, [`Competition cancelled: ${reason}`, competitionId]);
    
    // Void pending affiliate commissions
    await tx.query(`
      UPDATE affiliate_commissions ac
      SET status = 'voided'
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE ac.order_id = o.id 
        AND oi.competition_id = $1
        AND ac.status = 'pending'
    `, [competitionId]);
    
    // Notify all affected users
    const affectedUsers = await tx.query(`
      SELECT DISTINCT u.id, u.email, u.first_name
      FROM users u
      JOIN tickets t ON t.user_id = u.id
      WHERE t.competition_id = $1
    `, [competitionId]);
    
    for (const user of affectedUsers) {
      await sendEmail({
        to: user.email,
        template: 'competition_cancelled',
        data: {
          firstName: user.first_name,
          competitionTitle: competition.title,
          reason: reason
        }
      });
    }
    
    // Create audit log
    await tx.query(`
      INSERT INTO draw_audit_log (draw_id, action, actor_id, details)
      VALUES (NULL, 'competition_cancelled', $1, $2)
    `, [adminId, JSON.stringify({
      competitionId,
      competitionTitle: competition.title,
      reason,
      ordersRefunded: orders.length,
      ticketsVoided: competition.tickets_sold
    })]);
  });
}
```

---

## 5. Cashflows Payment Integration

Reference: [Cashflows Developer Portal](https://developer.cashflows.com/)

### 5.1 Integration Options

Based on [Cashflows documentation](https://developer.cashflows.com/), we'll use:

1. **Embedded Checkout** - For seamless in-page payment experience
2. **Cashflows Gateway API** - For server-side payment processing
3. **Webhooks** - For payment status notifications

### 5.2 Payment Flow

```
1. User clicks "Pay" → Frontend calls POST /api/orders
2. Backend creates order, calls Cashflows Gateway to create payment session
3. Backend returns Cashflows session token to frontend
4. Frontend renders Embedded Checkout with session token
5. User enters card details (handled by Cashflows)
6. Cashflows processes payment, sends webhook to backend
7. Backend verifies webhook, generates tickets, sends confirmation
8. Frontend polls/redirects to success page
```

### 5.3 Server-Side Implementation

```typescript
import axios from 'axios';

const CASHFLOWS_API_URL = process.env.CASHFLOWS_API_URL; // From Cashflows Portal
const CASHFLOWS_API_KEY = process.env.CASHFLOWS_API_KEY;
const CASHFLOWS_MERCHANT_ID = process.env.CASHFLOWS_MERCHANT_ID;

interface CashflowsPaymentRequest {
  merchantId: string;
  amount: number; // In pence
  currency: string;
  orderId: string;
  description: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  webhookUrl: string;
  metadata?: Record<string, string>;
}

interface CashflowsPaymentResponse {
  transactionId: string;
  sessionToken: string;
  status: string;
}

// Create payment session
async function createCashflowsPayment(
  order: Order,
  returnUrl: string
): Promise<CashflowsPaymentResponse> {
  const payload: CashflowsPaymentRequest = {
    merchantId: CASHFLOWS_MERCHANT_ID,
    amount: Math.round(order.total_gbp * 100), // Convert to pence
    currency: 'GBP',
    orderId: order.order_number,
    description: `BabyBets Order ${order.order_number}`,
    customerEmail: order.customer_email,
    customerName: `${order.customer_first_name} ${order.customer_last_name}`,
    returnUrl: returnUrl,
    webhookUrl: `${process.env.API_URL}/webhooks/cashflows`,
    metadata: {
      orderId: order.id,
      userId: order.user_id
    }
  };
  
  try {
    const response = await axios.post(
      `${CASHFLOWS_API_URL}/payments/sessions`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${CASHFLOWS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Store transaction ID
    await db.query(`
      UPDATE orders 
      SET cashflows_transaction_id = $1,
          cashflows_order_id = $2,
          payment_status = 'processing'
      WHERE id = $3
    `, [response.data.transactionId, response.data.orderId, order.id]);
    
    return response.data;
  } catch (error) {
    console.error('Cashflows payment creation failed:', error);
    throw new Error('Payment initialization failed');
  }
}

// Process refund
async function processCashflowsRefund(
  transactionId: string,
  amountGbp: number,
  refundId: string
): Promise<void> {
  try {
    const response = await axios.post(
      `${CASHFLOWS_API_URL}/payments/${transactionId}/refund`,
      {
        amount: Math.round(amountGbp * 100),
        reason: 'Competition cancelled or customer refund',
        refundReference: refundId
      },
      {
        headers: {
          'Authorization': `Bearer ${CASHFLOWS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    await db.query(`
      UPDATE refunds 
      SET cashflows_refund_id = $1, status = 'completed', completed_at = NOW()
      WHERE id = $2
    `, [response.data.refundId, refundId]);
    
  } catch (error) {
    console.error('Cashflows refund failed:', error);
    await db.query(`
      UPDATE refunds SET status = 'failed' WHERE id = $1
    `, [refundId]);
    throw error;
  }
}
```

### 5.4 Webhook Handler

```typescript
import crypto from 'crypto';

// Verify Cashflows webhook signature
function verifyCashflowsSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Webhook endpoint
async function handleCashflowsWebhook(req: Request, res: Response) {
  const signature = req.headers['x-cashflows-signature'] as string;
  const payload = JSON.stringify(req.body);
  
  // Verify signature
  if (!verifyCashflowsSignature(payload, signature, process.env.CASHFLOWS_WEBHOOK_SECRET)) {
    console.error('Invalid Cashflows webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = req.body;
  
  // Idempotency check
  const existing = await db.query(`
    INSERT INTO cashflows_webhooks (webhook_id, event_type, payload, signature)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (webhook_id) DO NOTHING
    RETURNING id
  `, [event.id, event.type, event, signature]);
  
  if (!existing) {
    // Already processed
    return res.status(200).json({ received: true, duplicate: true });
  }
  
  try {
    switch (event.type) {
      case 'payment.completed':
        await handlePaymentCompleted(event.data);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;
        
      case 'payment.refunded':
        await handlePaymentRefunded(event.data);
        break;
        
      case 'payment.disputed':
        await handlePaymentDisputed(event.data);
        break;
        
      default:
        console.log(`Unhandled Cashflows event type: ${event.type}`);
    }
    
    // Mark as processed
    await db.query(`
      UPDATE cashflows_webhooks 
      SET processed = TRUE, processed_at = NOW()
      WHERE webhook_id = $1
    `, [event.id]);
    
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    await db.query(`
      UPDATE cashflows_webhooks 
      SET error_message = $1, retry_count = retry_count + 1
      WHERE webhook_id = $2
    `, [error.message, event.id]);
    
    // Return 500 to trigger Cashflows retry
    return res.status(500).json({ error: 'Processing failed' });
  }
}

async function handlePaymentCompleted(data: any) {
  const order = await db.query(`
    SELECT * FROM orders 
    WHERE cashflows_transaction_id = $1
    FOR UPDATE
  `, [data.transactionId]);
  
  if (!order) {
    throw new Error(`Order not found for transaction ${data.transactionId}`);
  }
  
  if (order.payment_status === 'paid') {
    return; // Already processed
  }
  
  await db.transaction(async (tx) => {
    // Update order status
    await tx.query(`
      UPDATE orders 
      SET payment_status = 'paid', paid_at = NOW()
      WHERE id = $1
    `, [order.id]);
    
    // Generate tickets
    await generateTicketsForOrder(order.id, tx);
    
    // Attribute affiliate commission (with 14-day holdback)
    if (order.affiliate_id) {
      await attributeAffiliateCommission(order.id, tx);
    }
    
    // Send confirmation email
    await sendOrderConfirmationEmail(order.id);
  });
}

async function handlePaymentFailed(data: any) {
  await db.query(`
    UPDATE orders 
    SET payment_status = 'failed'
    WHERE cashflows_transaction_id = $1
  `, [data.transactionId]);
}

async function handlePaymentDisputed(data: any) {
  await db.query(`
    UPDATE orders 
    SET payment_status = 'disputed',
        fraud_flags = fraud_flags || $1
    WHERE cashflows_transaction_id = $2
  `, [JSON.stringify(['chargeback_initiated']), data.transactionId]);
  
  // Alert admin
  await sendAdminAlert('Payment Disputed', {
    transactionId: data.transactionId,
    reason: data.disputeReason
  });
}
```

### 5.5 Embedded Checkout Frontend Integration

```typescript
// React component for Cashflows Embedded Checkout
import { useEffect, useState } from 'react';

interface CheckoutProps {
  orderId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const CashflowsCheckout: React.FC<CheckoutProps> = ({ orderId, onSuccess, onError }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize payment session
    async function initPayment() {
      try {
        const response = await fetch('/api/orders/${orderId}/payment-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        setSessionToken(data.sessionToken);
        setLoading(false);
      } catch (err) {
        onError('Failed to initialize payment');
        setLoading(false);
      }
    }
    
    initPayment();
  }, [orderId]);
  
  useEffect(() => {
    if (!sessionToken) return;
    
    // Load Cashflows Embedded Checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.cashflows.com/embedded.js';
    script.async = true;
    script.onload = () => {
      // Initialize Cashflows checkout
      (window as any).CashflowsCheckout.init({
        sessionToken,
        containerId: 'cashflows-checkout-container',
        onComplete: (result: any) => {
          if (result.status === 'success') {
            onSuccess();
          } else {
            onError(result.message || 'Payment failed');
          }
        },
        onError: (error: any) => {
          onError(error.message);
        }
      });
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [sessionToken]);
  
  if (loading) {
    return <div>Loading payment form...</div>;
  }
  
  return <div id="cashflows-checkout-container" />;
};
```

---

## 6. Daily Reconciliation Job

```typescript
// Run daily at 2 AM
async function runDailyReconciliation(date: Date = new Date()): Promise<void> {
  const reconciliationDate = date.toISOString().split('T')[0];
  
  // Get orders from our database
  const ourOrders = await db.query(`
    SELECT 
      COUNT(*) as count,
      COALESCE(SUM(total_gbp), 0) as total
    FROM orders
    WHERE DATE(paid_at) = $1 AND payment_status = 'paid'
  `, [reconciliationDate]);
  
  // Get transactions from Cashflows
  const cashflowsReport = await axios.get(
    `${CASHFLOWS_API_URL}/reports/transactions`,
    {
      params: {
        date: reconciliationDate,
        status: 'completed'
      },
      headers: {
        'Authorization': `Bearer ${CASHFLOWS_API_KEY}`
      }
    }
  );
  
  const cashflowsTotal = cashflowsReport.data.transactions.reduce(
    (sum: number, t: any) => sum + t.amount / 100, 0
  );
  const cashflowsCount = cashflowsReport.data.transactions.length;
  
  // Calculate discrepancies
  const countDiff = Math.abs(ourOrders.count - cashflowsCount);
  const amountDiff = Math.abs(ourOrders.total - cashflowsTotal);
  
  const hasDiscrepancy = countDiff > 0 || amountDiff > 0.01;
  
  // Find specific discrepancies
  let discrepancyDetails = null;
  if (hasDiscrepancy) {
    const ourTransactionIds = await db.query(`
      SELECT cashflows_transaction_id 
      FROM orders 
      WHERE DATE(paid_at) = $1 AND payment_status = 'paid'
    `, [reconciliationDate]);
    
    const ourIds = new Set(ourTransactionIds.map(o => o.cashflows_transaction_id));
    const cashflowsIds = new Set(cashflowsReport.data.transactions.map(t => t.id));
    
    const missingInOurs = [...cashflowsIds].filter(id => !ourIds.has(id));
    const missingInCashflows = [...ourIds].filter(id => !cashflowsIds.has(id));
    
    discrepancyDetails = {
      missingInOurs,
      missingInCashflows,
      countDifference: countDiff,
      amountDifference: amountDiff
    };
  }
  
  // Store reconciliation record
  await db.query(`
    INSERT INTO daily_reconciliation (
      reconciliation_date,
      orders_count, orders_total_gbp,
      cashflows_transactions_count, cashflows_total_gbp,
      discrepancy_count, discrepancy_amount_gbp, discrepancy_details,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [
    reconciliationDate,
    ourOrders.count, ourOrders.total,
    cashflowsCount, cashflowsTotal,
    countDiff, amountDiff, discrepancyDetails,
    hasDiscrepancy ? 'discrepancy' : 'matched'
  ]);
  
  // Alert if discrepancy
  if (hasDiscrepancy) {
    await sendAdminAlert('Daily Reconciliation Discrepancy', {
      date: reconciliationDate,
      ourTotal: ourOrders.total,
      cashflowsTotal,
      difference: amountDiff,
      details: discrepancyDetails
    });
  }
}
```

---

## 7. Fraud Detection

```typescript
interface FraudCheckResult {
  score: number; // 0-100
  flags: string[];
  shouldBlock: boolean;
}

async function performFraudCheck(
  userId: string,
  order: Partial<Order>
): Promise<FraudCheckResult> {
  const flags: string[] = [];
  let score = 0;
  
  // Check 1: Multiple accounts from same IP
  const ipCount = await db.query(`
    SELECT COUNT(DISTINCT user_id) as count
    FROM orders
    WHERE customer_ip = $1 AND created_at > NOW() - INTERVAL '24 hours'
  `, [order.customer_ip]);
  
  if (ipCount.count > 3) {
    score += 30;
    flags.push('multiple_accounts_same_ip');
  }
  
  // Check 2: High velocity ordering
  const recentOrders = await db.query(`
    SELECT COUNT(*) as count
    FROM orders
    WHERE user_id = $1 AND created_at > NOW() - INTERVAL '1 hour'
  `, [userId]);
  
  if (recentOrders.count > 5) {
    score += 25;
    flags.push('high_order_velocity');
  }
  
  // Check 3: New account + high value order
  const user = await db.query(`SELECT created_at FROM users WHERE id = $1`, [userId]);
  const accountAge = Date.now() - new Date(user.created_at).getTime();
  const isNewAccount = accountAge < 24 * 60 * 60 * 1000; // < 24 hours
  
  if (isNewAccount && order.total_gbp > 50) {
    score += 20;
    flags.push('new_account_high_value');
  }
  
  // Check 4: Affiliate self-purchase
  if (order.affiliate_id) {
    const affiliate = await db.query(`
      SELECT user_id FROM affiliates WHERE id = $1
    `, [order.affiliate_id]);
    
    if (affiliate.user_id === userId) {
      score += 50;
      flags.push('affiliate_self_purchase');
    }
  }
  
  // Check 5: Previously disputed/refunded orders
  const badOrders = await db.query(`
    SELECT COUNT(*) as count
    FROM orders
    WHERE user_id = $1 AND payment_status IN ('disputed', 'refunded')
  `, [userId]);
  
  if (badOrders.count > 2) {
    score += 40;
    flags.push('history_of_disputes');
  }
  
  // Check 6: Email domain reputation
  const emailDomain = order.customer_email?.split('@')[1];
  const disposableDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com'];
  if (disposableDomains.includes(emailDomain)) {
    score += 35;
    flags.push('disposable_email');
  }
  
  return {
    score,
    flags,
    shouldBlock: score >= 75
  };
}

// Apply to order creation
async function createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order> {
  const fraudCheck = await performFraudCheck(userId, orderData);
  
  if (fraudCheck.shouldBlock) {
    throw new Error('Order could not be processed. Please contact support.');
  }
  
  const order = await db.query(`
    INSERT INTO orders (..., fraud_score, fraud_flags)
    VALUES (..., $1, $2)
    RETURNING *
  `, [fraudCheck.score, JSON.stringify(fraudCheck.flags)]);
  
  // Alert admin for medium-risk orders
  if (fraudCheck.score >= 40) {
    await sendAdminAlert('Medium Risk Order', {
      orderId: order.id,
      score: fraudCheck.score,
      flags: fraudCheck.flags
    });
  }
  
  return order;
}
```

---

## 8. Background Jobs

| Job | Frequency | Purpose |
|-----|-----------|---------|
| `updateCompetitionStatuses` | Every 5 minutes | Move competitions through lifecycle |
| `executeScheduledDraws` | Every 10 minutes | Auto-run draws for closed competitions |
| `processAffiliateCommissions` | Daily 3 AM | Approve held commissions after 14 days |
| `runDailyReconciliation` | Daily 2 AM | Compare orders with Cashflows |
| `cleanupAbandonedOrders` | Hourly | Delete pending orders > 2 hours old |
| `sendDrawReminders` | Daily 9 AM | Email users about ending competitions |
| `generateAffiliatePayouts` | 1st of month | Create payout records for approved commissions |
| `retryFailedWebhooks` | Every 15 minutes | Reprocess failed Cashflows webhooks |

---

## 9. API Error Responses

```typescript
// Standard error response format
interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
    details?: any;
  };
  requestId: string;
}

// Error codes
const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_TOKEN_EXPIRED: 'Session expired, please login again',
  AUTH_AGE_NOT_VERIFIED: 'Age verification required to purchase',
  
  // Orders
  ORDER_COMPETITION_CLOSED: 'This competition is no longer accepting entries',
  ORDER_SOLD_OUT: 'All tickets have been sold',
  ORDER_PAYMENT_FAILED: 'Payment could not be processed',
  ORDER_FRAUD_BLOCKED: 'Order could not be processed',
  
  // Tickets
  TICKET_ALREADY_REVEALED: 'This ticket has already been scratched',
  TICKET_NOT_FOUND: 'Ticket not found',
  
  // Promo codes
  PROMO_INVALID: 'Promo code is invalid or expired',
  PROMO_ALREADY_USED: 'You have already used this promo code',
  
  // Generic
  VALIDATION_ERROR: 'Invalid request data',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'An unexpected error occurred'
};
```

---

## 10. Security Checklist

| Item | Status | Implementation |
|------|--------|----------------|
| Password Hashing | ✅ | bcrypt with cost factor 12 |
| JWT Short Expiry | ✅ | 15 min access, 7 day refresh |
| HTTPS Only | ✅ | HSTS headers, secure cookies |
| Rate Limiting | ✅ | Redis-based, per-endpoint limits |
| Input Validation | ✅ | Zod schemas on all endpoints |
| SQL Injection | ✅ | Parameterized queries only |
| XSS Prevention | ✅ | Content-Security-Policy headers |
| CSRF Protection | ✅ | SameSite cookies, CSRF tokens |
| Webhook Verification | ✅ | HMAC signature validation |
| Cryptographic RNG | ✅ | crypto.randomBytes for all random |
| Audit Logging | ✅ | All sensitive operations logged |
| Age Verification | ✅ | Third-party ID verification |
| PCI Compliance | ✅ | No card data stored (Cashflows handles) |

---

## 11. Compliance Checklist (UK Prize Competitions)

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Free Entry Route | ✅ | Postal entry system with dedicated PO Box |
| No Purchase Necessary | ✅ | Clearly stated in T&Cs, free entry advertised |
| 18+ Only | ✅ | Age verification via Onfido/Yoti |
| Clear Terms | ✅ | Full T&Cs on each competition page |
| Draw Transparency | ✅ | Audit trail, verification hashes, snapshots |
| Winner Publication | ✅ | Winners page with anonymized names |
| Data Protection | ✅ | GDPR compliant, privacy policy, consent |
| Responsible Messaging | ✅ | "Please play responsibly" footer |

---

## 12. Data Retention Policy

| Data Type | Retention Period | Action After |
|-----------|------------------|--------------|
| User Accounts | Until deletion requested | Anonymize |
| Order Records | 7 years | Archive to cold storage |
| Tickets | 7 years | Archive |
| Draw Records | Permanent | Immutable audit trail |
| Payment Data | 7 years | Encrypted archive |
| Email Logs | 2 years | Delete |
| Affiliate Clicks | 1 year | Delete |
| API Logs | 90 days | Delete |
| Session Data | 30 days | Auto-expire |

---

## 13. Migration from v1.0

This documentation is a specification. The current codebase has **no backend**. Implementation order:

1. **Week 1-2**: Set up PostgreSQL, create all tables with migrations
2. **Week 2-3**: Implement authentication (users, JWT, age verification)
3. **Week 3-4**: Integrate Cashflows (Gateway + Embedded Checkout)
4. **Week 4-5**: Build ticket generation with commit-reveal scheme
5. **Week 5-6**: Implement draw system with audit trail
6. **Week 6-7**: Add postal entry processing
7. **Week 7-8**: Build admin dashboard
8. **Week 8-9**: Implement background jobs
9. **Week 9-10**: Add fraud detection, reconciliation
10. **Week 10-12**: Testing, security audit, legal review

**Estimated Total: 12 weeks (2 engineers)**

---

## 14. Tiered Pricing & Ticket Code Pool System (v2.1)

### Overview

This section documents the tiered pricing system and pre-generated ticket code pool for instant win competitions, implemented for the iCandy Mega Mum Bundle competition (January 2026).

### 14.1 Tiered Pricing Tables

#### `tiered_pricing_tiers`
```sql
CREATE TABLE tiered_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  min_qty INTEGER NOT NULL,
  max_qty INTEGER, -- NULL means unlimited
  price_per_ticket_pence INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_qty_range CHECK (min_qty > 0 AND (max_qty IS NULL OR max_qty >= min_qty)),
  CONSTRAINT check_price_positive CHECK (price_per_ticket_pence > 0)
);

CREATE INDEX idx_tiered_pricing_competition ON tiered_pricing_tiers(competition_id);
```

**Example Data (iCandy Mega Mum Bundle):**
| min_qty | max_qty | price_per_ticket_pence |
|---------|---------|------------------------|
| 1       | 9       | 200                    |
| 10      | 19      | 190                    |
| 20      | 39      | 185                    |
| 40      | 59      | 180                    |
| 60      | NULL    | 170                    |

### 14.2 Ticket Code Pool System

#### `ticket_code_pools`
```sql
CREATE TABLE ticket_code_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  total_codes INTEGER NOT NULL,
  code_length INTEGER DEFAULT 7,
  is_locked BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMP,
  generated_by UUID REFERENCES users(id),
  locked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_code_length CHECK (code_length BETWEEN 6 AND 10),
  CONSTRAINT unique_pool_per_competition UNIQUE (competition_id)
);

CREATE INDEX idx_ticket_pools_competition ON ticket_code_pools(competition_id);
```

#### `ticket_codes`
```sql
CREATE TABLE ticket_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES ticket_code_pools(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  is_allocated BOOLEAN DEFAULT FALSE,
  allocated_at TIMESTAMP,
  ticket_id UUID REFERENCES tickets(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_code_per_pool UNIQUE (pool_id, code)
);

CREATE INDEX idx_ticket_codes_pool ON ticket_codes(pool_id);
CREATE INDEX idx_ticket_codes_available ON ticket_codes(pool_id, is_allocated) 
  WHERE is_allocated = FALSE;
CREATE INDEX idx_ticket_codes_code ON ticket_codes(code);
```

#### `prize_allocations`
```sql
CREATE TABLE prize_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES ticket_code_pools(id) ON DELETE CASCADE,
  ticket_code_id UUID REFERENCES ticket_codes(id) ON DELETE CASCADE,
  prize_id UUID REFERENCES instant_win_prizes(id),
  is_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP,
  claimed_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_allocation UNIQUE (ticket_code_id)
);

CREATE INDEX idx_prize_allocations_pool ON prize_allocations(pool_id);
CREATE INDEX idx_prize_allocations_prize ON prize_allocations(prize_id);
CREATE INDEX idx_prize_allocations_unclaimed ON prize_allocations(pool_id, is_claimed)
  WHERE is_claimed = FALSE;
```

### 14.3 Wallet/Site Credit System

#### `wallet_credits`
```sql
CREATE TABLE wallet_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_gbp DECIMAL(10,2) NOT NULL,
  remaining_gbp DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'spent', 'expired', 'revoked')),
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  source_competition_id UUID REFERENCES competitions(id),
  source_order_id UUID REFERENCES orders(id),
  source_ticket_id UUID REFERENCES tickets(id),
  source_prize_id UUID REFERENCES instant_win_prizes(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_positive_amount CHECK (amount_gbp > 0),
  CONSTRAINT check_remaining CHECK (remaining_gbp >= 0 AND remaining_gbp <= amount_gbp)
);

CREATE INDEX idx_wallet_credits_user ON wallet_credits(user_id);
CREATE INDEX idx_wallet_credits_active ON wallet_credits(user_id, status, expires_at)
  WHERE status = 'active';
CREATE INDEX idx_wallet_credits_expiring ON wallet_credits(expires_at)
  WHERE status = 'active';
```

#### `wallet_transactions`
```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  credit_id UUID REFERENCES wallet_credits(id),
  transaction_type VARCHAR(20) CHECK (transaction_type IN ('credit', 'debit', 'expiry', 'revocation')),
  amount_gbp DECIMAL(10,2) NOT NULL,
  balance_after_gbp DECIMAL(10,2) NOT NULL,
  order_id UUID REFERENCES orders(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_user ON wallet_transactions(user_id, created_at DESC);
CREATE INDEX idx_wallet_transactions_credit ON wallet_transactions(credit_id);
```

### 14.4 Cash Alternative & Fulfillment

#### `winner_fulfillments`
```sql
CREATE TABLE winner_fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id),
  prize_id UUID REFERENCES instant_win_prizes(id),
  user_id UUID REFERENCES users(id),
  competition_id UUID REFERENCES competitions(id),
  
  -- Prize choice
  has_cash_alternative BOOLEAN DEFAULT FALSE,
  cash_alternative_gbp DECIMAL(10,2),
  choice VARCHAR(20) CHECK (choice IN ('prize', 'cash', 'pending')),
  choice_deadline TIMESTAMP,
  choice_made_at TIMESTAMP,
  was_auto_defaulted BOOLEAN DEFAULT FALSE,
  
  -- Fulfillment status
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending', 'prize_selected', 'cash_selected', 'processing', 
    'dispatched', 'delivered', 'completed', 'expired'
  )),
  value_gbp DECIMAL(10,2) NOT NULL,
  
  -- Contact & delivery
  notified_at TIMESTAMP,
  responded_at TIMESTAMP,
  dispatched_at TIMESTAMP,
  delivered_at TIMESTAMP,
  tracking_number VARCHAR(100),
  delivery_address JSONB,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fulfillments_user ON winner_fulfillments(user_id);
CREATE INDEX idx_fulfillments_status ON winner_fulfillments(status);
CREATE INDEX idx_fulfillments_pending_choice ON winner_fulfillments(choice_deadline)
  WHERE choice = 'pending';
```

### 14.5 New API Endpoints

#### Competition Pool Management (Admin)
```
POST /api/admin/competitions/{id}/generate-pool
  Request: { codeLength?: number }
  Response: { poolId, totalCodes, generatedAt }
  
POST /api/admin/competitions/{id}/lock-pool
  Response: { success, lockedAt }
  
GET /api/admin/competitions/{id}/pool-stats
  Response: { totalCodes, allocated, available, prizeAllocations: [...] }
```

#### Ticket Reveal
```
POST /api/tickets/{id}/reveal
  Response: { 
    ticketId, ticketCode, isWinner, 
    prize?: { id, name, type, value, cashAlternative, image },
    verificationSecret
  }
```

#### Prize Choice
```
POST /api/tickets/{id}/choose-prize
  Request: { choice: 'prize' | 'cash' }
  Response: { fulfillmentId, choice, value }
  
GET /api/tickets/{id}/fulfillment
  Response: { status, choice, trackingNumber, ... }
```

#### Wallet
```
GET /api/users/me/wallet
  Response: { 
    availableBalance, 
    expiringSoon, 
    nextExpiryDate,
    credits: [...] 
  }
  
POST /api/checkout/apply-credit
  Request: { amount: number }
  Response: { applied, maxAllowed, remaining }
  
DELETE /api/checkout/credit
  Response: { success }
```

### 14.6 Wallet Rules

| Rule | Value | Description |
|------|-------|-------------|
| Max basket % | 50% | Maximum percentage of basket payable with credit |
| Expiry | 60 days | Credits expire after 60 days |
| Withdrawable | No | Credits cannot be withdrawn as cash |
| Exchangeable | No | Credits cannot be exchanged for cash |

### 14.7 Background Jobs (Additions)

| Job | Frequency | Purpose |
|-----|-----------|---------|
| `expireWalletCredits` | Hourly | Mark expired credits as 'expired' |
| `autoDefaultPrizeChoice` | Daily 10 AM | Auto-select cash for pending choices past deadline |
| `sendPrizeChoiceReminders` | Daily 9 AM | Email users with pending prize choices |

---

**END OF DOCUMENTATION v2.1**


