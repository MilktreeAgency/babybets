/**
 * Tiered Pricing Utilities
 * 
 * All calculations are done in pence (integer) for precision.
 * Conversion to pounds happens only at display time.
 */

import { TieredPricingTier } from '../types';

/**
 * iCandy Mega Mum Bundle default tiers
 * Base price: £2.00 (200p) per ticket
 */
export const ICANDY_PRICING_TIERS: TieredPricingTier[] = [
  { minQty: 1, maxQty: 9, pricePerTicketPence: 200 },
  { minQty: 10, maxQty: 19, pricePerTicketPence: 190 },
  { minQty: 20, maxQty: 39, pricePerTicketPence: 185 },
  { minQty: 40, maxQty: 59, pricePerTicketPence: 180 },
  { minQty: 60, maxQty: null, pricePerTicketPence: 170 },
];

/**
 * Get the applicable tier for a given quantity
 */
export function getTierForQuantity(quantity: number, tiers: TieredPricingTier[]): TieredPricingTier | null {
  // Sort tiers by minQty descending to find the highest applicable tier
  const sortedTiers = [...tiers].sort((a, b) => b.minQty - a.minQty);
  
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQty) {
      // Check if quantity is within max (or max is null for unlimited)
      if (tier.maxQty === null || quantity <= tier.maxQty) {
        return tier;
      }
      // If quantity exceeds maxQty, this tier doesn't apply
      // But we should still return it if no higher tier applies
      if (tier.maxQty !== null && quantity > tier.maxQty) {
        continue;
      }
    }
  }
  
  // Fallback to lowest tier
  const lowestTier = tiers.reduce((min, tier) => 
    tier.minQty < min.minQty ? tier : min
  , tiers[0]);
  
  return lowestTier;
}

/**
 * Calculate total price in pence for a given quantity
 * Tiered pricing applies to the ENTIRE basket once threshold is reached
 */
export function calculateTieredPricePence(quantity: number, tiers: TieredPricingTier[]): number {
  if (quantity <= 0) return 0;
  
  const tier = getTierForQuantity(quantity, tiers);
  if (!tier) return 0;
  
  return quantity * tier.pricePerTicketPence;
}

/**
 * Calculate savings in pence compared to base price
 */
export function calculateSavingsPence(
  quantity: number, 
  basePricePence: number, 
  actualPricePence: number
): number {
  const fullPrice = quantity * basePricePence;
  return fullPrice - actualPricePence;
}

/**
 * Convert pence to pounds with proper rounding
 * Rounds to nearest penny
 */
export function penceToPounds(pence: number): number {
  return Math.round(pence) / 100;
}

/**
 * Format price in pounds for display
 */
export function formatPrice(pence: number): string {
  const pounds = penceToPounds(pence);
  return `£${pounds.toFixed(2)}`;
}

/**
 * Format price per ticket for display
 */
export function formatPricePerTicket(pence: number): string {
  const pounds = penceToPounds(pence);
  return `£${pounds.toFixed(2)}`;
}

/**
 * Calculate all pricing details for a given quantity
 */
export interface PricingDetails {
  quantity: number;
  totalPricePence: number;
  totalPriceGBP: number;
  pricePerTicketPence: number;
  pricePerTicketGBP: number;
  savingsPence: number;
  savingsGBP: number;
  basePricePence: number;
  fullPricePence: number;
  tier: TieredPricingTier | null;
}

export function calculatePricingDetails(
  quantity: number,
  tiers: TieredPricingTier[],
  basePricePence: number = 200 // Default £2.00
): PricingDetails {
  const tier = getTierForQuantity(quantity, tiers);
  const totalPricePence = calculateTieredPricePence(quantity, tiers);
  const fullPricePence = quantity * basePricePence;
  const savingsPence = calculateSavingsPence(quantity, basePricePence, totalPricePence);
  
  return {
    quantity,
    totalPricePence,
    totalPriceGBP: penceToPounds(totalPricePence),
    pricePerTicketPence: tier?.pricePerTicketPence ?? basePricePence,
    pricePerTicketGBP: penceToPounds(tier?.pricePerTicketPence ?? basePricePence),
    savingsPence,
    savingsGBP: penceToPounds(savingsPence),
    basePricePence,
    fullPricePence,
    tier,
  };
}

/**
 * Quick-select button options for the iCandy competition
 */
export interface QuickSelectOption {
  quantity: number;
  totalPricePence: number;
  totalPriceGBP: number;
  savingsPence: number;
  savingsGBP: number;
  label?: string;
}

export function generateQuickSelectOptions(
  quantities: number[],
  tiers: TieredPricingTier[],
  basePricePence: number = 200
): QuickSelectOption[] {
  return quantities.map(quantity => {
    const details = calculatePricingDetails(quantity, tiers, basePricePence);
    return {
      quantity,
      totalPricePence: details.totalPricePence,
      totalPriceGBP: details.totalPriceGBP,
      savingsPence: details.savingsPence,
      savingsGBP: details.savingsGBP,
    };
  });
}

/**
 * Default quick-select options for iCandy Mega Mum Bundle
 * 10, 20, 40, 60 tickets as specified
 */
export const ICANDY_QUICK_SELECT = generateQuickSelectOptions(
  [10, 20, 40, 60],
  ICANDY_PRICING_TIERS,
  200
);

// Validation: these should match the spec
// 10 tickets: £19.00 (Save £1.00) - 10 * 190p = 1900p, saves 2000p - 1900p = 100p
// 20 tickets: £37.00 (Save £3.00) - 20 * 185p = 3700p, saves 4000p - 3700p = 300p
// 40 tickets: £72.00 (Save £8.00) - 40 * 180p = 7200p, saves 8000p - 7200p = 800p
// 60 tickets: £102.00 (Save £18.00) - 60 * 170p = 10200p, saves 12000p - 10200p = 1800p

/**
 * Calculate postal entries based on ticket price
 * Formula: floor(0.87 / ticketPriceGBP), minimum 1 entry
 * Uses BASE ticket price per PRD Section 7
 */
export function calculatePostalEntries(ticketPriceGBP: number): number {
  if (ticketPriceGBP <= 0) return 1;
  return Math.max(1, Math.floor(0.87 / ticketPriceGBP));
}
