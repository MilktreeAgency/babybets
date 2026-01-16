-- Migration: 003_add_date_of_birth
-- Description: Add date_of_birth column to profiles table

-- Add date_of_birth column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.date_of_birth IS 'User date of birth for age verification and birthday rewards';

-- Optional: Create an index if you plan to query by birthday month/day for birthday rewards
CREATE INDEX IF NOT EXISTS idx_profiles_date_of_birth ON public.profiles(date_of_birth);
