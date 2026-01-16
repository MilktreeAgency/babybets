/**
 * £50 Cash Prize Competition
 * 
 * Simple example competition for Meta RMG licence approval
 * Features: Simple instant wins (site credit) + end prize draw
 */

import { Competition, InstantWinPrizeSummary, TieredPricingTier } from '../../types';

/**
 * Simple flat pricing - £1 per ticket
 * No tiered discounts for this simple competition
 */
export const CASH_50_PRICING_TIERS: TieredPricingTier[] = [
  { minQty: 1, maxQty: null, pricePerTicketPence: 100 }, // £1.00 flat
];

/**
 * Simple instant win prizes - site credit only
 * Total: 170 instant win prizes
 */
export const cash50InstantWinPrizes: InstantWinPrizeSummary[] = [
  // £2 Site Credit
  {
    id: 'C50-001',
    name: '£2 Site Credit',
    shortName: '£2 Credit',
    type: 'SiteCredit',
    valueGBP: 2,
    totalQuantity: 20,
    remainingQuantity: 20,
    description: '£2 site credit to use on future BabyBets competitions',
    image: 'site-credit-2',
  },
  
  // £1 Site Credit
  {
    id: 'C50-002',
    name: '£1 Site Credit',
    shortName: '£1 Credit',
    type: 'SiteCredit',
    valueGBP: 1,
    totalQuantity: 50,
    remainingQuantity: 50,
    description: '£1 site credit to use on future BabyBets competitions',
    image: 'site-credit-1',
  },
  
  // 50p Site Credit
  {
    id: 'C50-003',
    name: '50p Site Credit',
    shortName: '50p Credit',
    type: 'SiteCredit',
    valueGBP: 0.5,
    totalQuantity: 100,
    remainingQuantity: 100,
    description: '50p site credit to use on future BabyBets competitions',
    image: 'site-credit-50p',
  },
];

/**
 * Calculate total instant win units
 */
export const totalCash50InstantWinUnits = cash50InstantWinPrizes.reduce(
  (sum, prize) => sum + prize.totalQuantity,
  0
);
// Expected: 20 + 50 + 100 = 170

/**
 * Calculate total instant win value
 */
export const totalCash50InstantWinValue = cash50InstantWinPrizes.reduce(
  (sum, prize) => sum + (prize.valueGBP * prize.totalQuantity),
  0
);
// Expected: (2*20) + (1*50) + (0.5*100) = 40 + 50 + 50 = £140

/**
 * The £50 Cash Prize Competition
 */
export const cash50Competition: Competition = {
  id: 'cash-50-example-2026',
  slug: 'win-50-cash',
  title: '£50 Cash Prize',
  description: `Win £50 Tax-Free Cash!

This is a simple cash prize competition with instant win site credit throughout.

Every ticket you buy gives you a chance to win instantly, plus enters you into the end prize draw for the £50 cash prize.

What you can win:

Instant win prizes include:
• 20 x £2 Site Credit
• 50 x £1 Site Credit
• 100 x 50p Site Credit

End prize:
• 1 x £50 Tax-Free Cash

Enter now for just £1 per ticket!`,
  image: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?auto=format&fit=crop&q=80&w=800',
  retailValueGBP: 190, // £50 end prize + £140 instant wins
  totalValueGBP: 190,
  ticketPriceGBP: 1.00,
  baseTicketPriceGBP: 1.00,
  maxTickets: 500,
  ticketsSold: 0,
  maxTicketsPerUser: 50,
  startDateTime: '2026-01-16T00:00:00Z',
  drawDateTime: '2026-02-13T23:59:59Z', // ~4 weeks from now
  category: 'Cash',
  status: 'active',
  
  // Competition type
  competitionType: 'instant_win_with_end_prize',
  
  // Flat pricing
  tieredPricing: CASH_50_PRICING_TIERS,
  
  // Legacy bundles for quick-select options
  bundles: [
    { quantity: 5, price: 5.00, label: '5 Tickets' },
    { quantity: 10, price: 10.00, label: '10 Tickets' },
    { quantity: 20, price: 20.00, label: '20 Tickets' },
    { quantity: 50, price: 50.00, label: 'Max Bundle' },
  ],
  
  // Instant win prizes
  instantWinPrizes: cash50InstantWinPrizes,
  
  // End prize (£50 cash draw)
  endPrize: {
    type: 'Cash',
    valueGBP: 50,
    quantity: 1,
  },
  
  // Mark as instant win
  instantWin: true,
};

export default cash50Competition;
