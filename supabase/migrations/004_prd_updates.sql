/**
 * PRD Updates Migration
 * 
 * Per PRD Section 3 (Categories) and Section 5 (Wallet)
 * - Update competition_category enum values
 * - Add bank details columns to withdrawal_requests
 * - Add email_notifications table for tracking
 */

-- ============================================
-- SECTION 3: Category Updates
-- ============================================

-- Rename 'Nursery' to 'Baby & Nursery' (combines Nursery and Prams)
-- Note: PostgreSQL doesn't support renaming enum values directly
-- We need to add new values and migrate data

-- Add new category values
DO $$ 
BEGIN
  -- Add 'Baby & Nursery' if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Baby & Nursery' 
                 AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'competition_category')) THEN
    ALTER TYPE competition_category ADD VALUE 'Baby & Nursery';
  END IF;

  -- Add 'Instant Wins' if it doesn't exist  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Instant Wins'
                 AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'competition_category')) THEN
    ALTER TYPE competition_category ADD VALUE 'Instant Wins';
  END IF;

  -- Add 'Other' if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Other'
                 AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'competition_category')) THEN
    ALTER TYPE competition_category ADD VALUE 'Other';
  END IF;
END $$;

-- Migrate existing data: 'Nursery' and 'Prams' -> 'Baby & Nursery'
UPDATE competitions SET category = 'Baby & Nursery'::competition_category 
WHERE category IN ('Nursery'::competition_category, 'Prams'::competition_category);

-- Migrate existing data: 'Essentials' and 'Holidays' -> 'Other'
UPDATE competitions SET category = 'Other'::competition_category 
WHERE category IN ('Essentials'::competition_category, 'Holidays'::competition_category);


-- ============================================
-- SECTION 5: Withdrawal Bank Details
-- ============================================

-- Add specific bank detail columns to withdrawal_requests (if they don't exist)
-- The table already has bank_details JSONB, but we add explicit columns for better querying

DO $$
BEGIN
  -- Add bank_sort_code column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'withdrawal_requests' AND column_name = 'bank_sort_code') THEN
    ALTER TABLE withdrawal_requests ADD COLUMN bank_sort_code TEXT;
  END IF;

  -- Add bank_account_number column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'withdrawal_requests' AND column_name = 'bank_account_number') THEN
    ALTER TABLE withdrawal_requests ADD COLUMN bank_account_number TEXT;
  END IF;

  -- Add bank_account_name column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'withdrawal_requests' AND column_name = 'bank_account_name') THEN
    ALTER TABLE withdrawal_requests ADD COLUMN bank_account_name TEXT;
  END IF;

  -- Add approved_at timestamp
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'withdrawal_requests' AND column_name = 'approved_at') THEN
    ALTER TABLE withdrawal_requests ADD COLUMN approved_at TIMESTAMPTZ;
  END IF;

  -- Add paid_at timestamp
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'withdrawal_requests' AND column_name = 'paid_at') THEN
    ALTER TABLE withdrawal_requests ADD COLUMN paid_at TIMESTAMPTZ;
  END IF;

  -- Add admin_notes column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'withdrawal_requests' AND column_name = 'admin_notes') THEN
    ALTER TABLE withdrawal_requests ADD COLUMN admin_notes TEXT;
  END IF;
END $$;


-- ============================================
-- SECTION 11: Email Notifications Tracking
-- ============================================

-- Create email_notifications table for logging (MVP - before Edge Functions)
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  recipient_email TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for querying by type and status
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created_at ON email_notifications(created_at DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_email_notifications_updated_at ON email_notifications;
CREATE TRIGGER update_email_notifications_updated_at
  BEFORE UPDATE ON email_notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- SECTION 9: Influencer Pages
-- ============================================

-- Add slug validation and unique index if needed
CREATE INDEX IF NOT EXISTS idx_influencers_slug ON influencers(slug);

-- Add partner page settings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'influencers' AND column_name = 'page_bio') THEN
    ALTER TABLE influencers ADD COLUMN page_bio TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'influencers' AND column_name = 'page_image_url') THEN
    ALTER TABLE influencers ADD COLUMN page_image_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'influencers' AND column_name = 'total_followers') THEN
    ALTER TABLE influencers ADD COLUMN total_followers TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'influencers' AND column_name = 'primary_platform') THEN
    ALTER TABLE influencers ADD COLUMN primary_platform TEXT;
  END IF;
END $$;


-- ============================================
-- Add comments for documentation
-- ============================================

COMMENT ON TABLE email_notifications IS 'Stores email notification logs for debugging and resending';
COMMENT ON COLUMN withdrawal_requests.bank_sort_code IS 'UK bank sort code (format: XX-XX-XX)';
COMMENT ON COLUMN withdrawal_requests.bank_account_number IS 'UK bank account number (8 digits)';
COMMENT ON COLUMN withdrawal_requests.bank_account_name IS 'Name on the bank account';
COMMENT ON COLUMN withdrawal_requests.approved_at IS 'Timestamp when withdrawal was approved by admin';
COMMENT ON COLUMN withdrawal_requests.paid_at IS 'Timestamp when payment was sent to user';
