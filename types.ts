/**
 * Legacy Competition type - kept for backwards compatibility
 * New competitions should use types from ./types/competition.ts
 */
export interface Competition {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  retailValueGBP: number;
  ticketPriceGBP: number;
  maxTickets: number;
  ticketsSold: number;
  drawDateTime: string; // ISO string
  category: 'Toys' | 'Nursery' | 'Prams' | 'Holidays' | 'Cash' | 'Essentials';
  status: 'active' | 'ending_soon' | 'sold_out' | 'closed' | 'new';
  bundles: TicketBundle[];
  instantWin?: boolean;
  
  // New fields for instant win competitions (optional for backwards compat)
  competitionType?: 'standard' | 'instant_win' | 'instant_win_with_end_prize';
  tieredPricing?: TieredPricingTier[];
  instantWinPrizes?: InstantWinPrizeSummary[];
  endPrize?: { type: string; valueGBP: number; quantity: number };
  maxTicketsPerUser?: number;
  startDateTime?: string;
  baseTicketPriceGBP?: number;
  totalValueGBP?: number;
}

export interface TicketBundle {
  quantity: number;
  price: number;
  label?: string; // e.g., "Most Popular"
}

/** Tiered pricing tier - prices in pence for precision */
export interface TieredPricingTier {
  minQty: number;
  maxQty: number | null; // null means unlimited
  pricePerTicketPence: number;
}

/** Instant win prize summary for competition listing */
export interface InstantWinPrizeSummary {
  id: string;
  name: string;
  shortName?: string;
  type: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit';
  valueGBP: number;
  cashAlternativeGBP?: number;
  totalQuantity: number;
  remainingQuantity: number;
  description: string;
  image: string;
  notes?: string;
}

export interface Winner {
  id: string;
  name: string;
  location: string;
  prize: string;
  date: string;
  image: string;
  ticketNumber: string;
}

export interface CartItem {
  competitionId: string;
  competitionTitle: string;
  ticketCount: number;
  price: number;
  image: string;
  instantWin?: boolean;
}

export interface PurchasedTicket {
  id: string;
  competitionId: string;
  competitionTitle: string;
  ticketNumber: string;
  purchaseDate: string;
  image: string;
  instantWin?: boolean;
  isRevealed?: boolean; // For scratch cards
  isWinner?: boolean;   // For scratch cards
  winPrize?: string;    // If they won - prize name
  
  // New fields for instant win handling
  prizeType?: 'cash' | 'credit' | 'physical' | 'voucher';
  prizeAmount?: number; // For cash/credit prizes
  prizeId?: string; // Reference to prize definition
  hasCashAlternative?: boolean; // Whether winner can choose cash
  cashAlternativeAmount?: number; // Cash alternative value
  prizeChoice?: 'prize' | 'cash'; // Winner's selection
  prizeChoiceDeadline?: string; // ISO string - 7 days after reveal
}

export interface Affiliate {
  code: string;
  clicks: number;
  sales: number;
}