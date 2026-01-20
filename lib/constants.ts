/**
 * Application Constants
 */

// Wallet Rules (per PRD Section 5 - site credit behaves exactly like cash)
export const WALLET_RULES = {
  /** Maximum percentage of basket payable with credit (100% - no restrictions) */
  maxBasketPercentage: 1.0,
  /** Credit expiry period in days */
  expiryDays: 60,
  /** Whether credit can be withdrawn as cash */
  isWithdrawable: true,
  /** Whether credit can be exchanged for cash */
  isExchangeable: false,
  /** Minimum withdrawal amount in pence (£5) */
  minWithdrawalPence: 500,
  /** Withdrawal processing notice */
  withdrawalNotice: 'Paid within 48 hours',
} as const;

// Commission Tiers for Influencers (per PRD Section 12)
export const COMMISSION_TIERS = [
  { minSalesPence: 0, maxSalesPence: 99999, rate: 0.10 },         // £0-999 → 10%
  { minSalesPence: 100000, maxSalesPence: 299999, rate: 0.15 },   // £1,000-2,999 → 15%
  { minSalesPence: 300000, maxSalesPence: 499999, rate: 0.20 },   // £3,000-4,999 → 20%
  { minSalesPence: 500000, maxSalesPence: null, rate: 0.25 },     // £5,000+ → 25%
] as const;

// Get commission rate based on monthly sales
export const getCommissionRate = (monthlySalesPence: number): number => {
  for (const tier of COMMISSION_TIERS) {
    if (tier.maxSalesPence === null || monthlySalesPence <= tier.maxSalesPence) {
      if (monthlySalesPence >= tier.minSalesPence) {
        return tier.rate;
      }
    }
  }
  return 0.10; // Default to lowest tier
};

// Competition Categories (per PRD Section 3)
export const COMPETITION_CATEGORIES = [
  'Toys',
  'Baby & Nursery',
  'Cash',
  'Instant Wins',
  'Other',
] as const;

// Competition Statuses
export const COMPETITION_STATUSES = [
  'draft',
  'scheduled',
  'active',
  'ending_soon',
  'sold_out',
  'closed',
  'drawing',
  'drawn',
  'completed',
  'cancelled',
] as const;

// Prize Types
export const PRIZE_TYPES = [
  'Physical',
  'Voucher',
  'Cash',
  'SiteCredit',
] as const;

// Default tiered pricing (iCandy example)
export const DEFAULT_TIERED_PRICING = [
  { minQty: 1, maxQty: 9, pricePerTicketPence: 200 },
  { minQty: 10, maxQty: 19, pricePerTicketPence: 190 },
  { minQty: 20, maxQty: 39, pricePerTicketPence: 185 },
  { minQty: 40, maxQty: 59, pricePerTicketPence: 180 },
  { minQty: 60, maxQty: null, pricePerTicketPence: 170 },
] as const;

// Prize claim deadline in days
export const PRIZE_CLAIM_DEADLINE_DAYS = 7;

// Ticket number length
export const TICKET_NUMBER_LENGTH = 7;

// Date/Time formats
export const DATE_FORMAT = 'dd MMM yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'dd MMM yyyy HH:mm';

// Currency formatting
export const formatCurrency = (pence: number): string => {
  const pounds = pence / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pounds);
};

export const formatCurrencyFromPounds = (pounds: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pounds);
};

// Pence/Pounds conversion
export const penceToPounds = (pence: number): number => pence / 100;
export const poundsToPence = (pounds: number): number => Math.round(pounds * 100);
