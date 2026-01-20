/**
 * Extended Competition Types for Instant Win + End Prize competitions
 */

import { InstantWinPrize, EndPrize } from './prizes';

/** Tiered pricing tier definition - all prices in pence for precision */
export interface TieredPricingTier {
  minQty: number;
  maxQty: number | null; // null means unlimited
  pricePerTicketPence: number;
}

/** Competition closing rules */
export interface ClosingRules {
  /** Competition ends at this date/time */
  endDateTime: string; // ISO string
  /** Or when all tickets sell out, whichever comes first */
  endsOnSellOut: boolean;
}

/** Ticket pool configuration */
export interface TicketPoolConfig {
  /** Total number of tickets in the pool */
  totalTickets: number;
  /** Length of generated ticket codes (6-8 digits) */
  codeLength: number;
  /** Whether the pool has been generated and locked */
  isLocked: boolean;
  /** When the pool was generated */
  generatedAt?: string; // ISO string
}

/** Competition type enum */
export type CompetitionType = 
  | 'standard'           // Regular draw only
  | 'instant_win'        // Instant wins only
  | 'instant_win_with_end_prize'; // Instant wins + end prize draw

/** Extended competition status including instant win states */
export type ExtendedCompetitionStatus = 
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'ending_soon'
  | 'sold_out'
  | 'closed'
  | 'drawing'
  | 'drawn'
  | 'completed'
  | 'cancelled';

/** Category for competitions */
export type CompetitionCategory = 'Toys' | 'Baby & Nursery' | 'Cash' | 'Instant Wins' | 'Other';

/** Base competition interface */
export interface BaseCompetition {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: CompetitionCategory;
  status: ExtendedCompetitionStatus;
  
  /** Start date/time */
  startDateTime: string; // ISO string
  /** End date/time */
  endDateTime: string; // ISO string
  
  /** Maximum tickets available */
  maxTickets: number;
  /** Current tickets sold */
  ticketsSold: number;
  /** Maximum tickets per user */
  maxTicketsPerUser: number;
  
  /** Base ticket price in GBP (before tiered discounts) */
  baseTicketPriceGBP: number;
  
  /** Total retail value of all prizes */
  totalValueGBP: number;
  
  /** Competition type */
  competitionType: CompetitionType;
  
  /** Whether this competition is featured on homepage */
  isFeatured?: boolean;
  
  /** Created timestamp */
  createdAt?: string;
  /** Updated timestamp */
  updatedAt?: string;
}

/** Instant Win Competition - includes instant win prizes and optional end prize */
export interface InstantWinCompetition extends BaseCompetition {
  competitionType: 'instant_win' | 'instant_win_with_end_prize';
  
  /** Tiered pricing configuration - prices in pence */
  tieredPricing: TieredPricingTier[];
  
  /** Instant win prizes available */
  instantWinPrizes: InstantWinPrize[];
  
  /** End prize (drawn at competition close) - optional */
  endPrize?: EndPrize;
  
  /** Closing rules */
  closingRules: ClosingRules;
  
  /** Ticket pool configuration */
  ticketPoolConfig: TicketPoolConfig;
}

/** Standard competition (backwards compatible with existing structure) */
export interface StandardCompetition extends BaseCompetition {
  competitionType: 'standard';
  
  /** Legacy bundle pricing */
  bundles: TicketBundle[];
  
  /** Draw date/time (same as endDateTime for standard comps) */
  drawDateTime: string;
  
  /** Retail value in GBP */
  retailValueGBP: number;
  
  /** Ticket price in GBP */
  ticketPriceGBP: number;
  
  /** Optional instant win flag for backwards compatibility */
  instantWin?: boolean;
}

/** Legacy ticket bundle (for backwards compatibility) */
export interface TicketBundle {
  quantity: number;
  price: number;
  label?: string;
}

/** Union type for all competition types */
export type Competition = InstantWinCompetition | StandardCompetition;

/** Type guard to check if competition is instant win */
export function isInstantWinCompetition(comp: Competition): comp is InstantWinCompetition {
  return comp.competitionType === 'instant_win' || comp.competitionType === 'instant_win_with_end_prize';
}

/** Type guard to check if competition is standard */
export function isStandardCompetition(comp: Competition): comp is StandardCompetition {
  return comp.competitionType === 'standard';
}

/** Quick-select ticket options for UI */
export interface QuickSelectOption {
  quantity: number;
  totalPricePence: number;
  savingsPence: number;
  label?: string;
}
