/**
 * iCandy Mega Mum Bundle Competition Data
 * 
 * First competition with Instant Win + End Prize
 * Total Value: £8,770
 */

import { Competition, InstantWinPrizeSummary, TieredPricingTier } from '../../types';
import { ICANDY_PRICING_TIERS } from '../../utils/pricing';

/**
 * Tiered pricing for this competition
 * Base price: £2.00 per ticket
 */
export const icandyTieredPricing: TieredPricingTier[] = ICANDY_PRICING_TIERS;

/**
 * All instant win prizes (12 types, 1905 total units)
 */
export const icandyInstantWinPrizes: InstantWinPrizeSummary[] = [
  // PR-001: iCandy Peach 7 Bundle
  {
    id: 'PR-001',
    name: 'iCandy Peach 7 (Biscotti Bundle + Cocoon Car Seat & ISOFIX Base)',
    shortName: 'iCandy Peach 7',
    type: 'Physical',
    valueGBP: 1598,
    cashAlternativeGBP: 1400,
    totalQuantity: 2,
    remainingQuantity: 2,
    description: `The iCandy Peach 7 Biscotti Bundle is a complete luxury travel system designed to take your baby from newborn to toddler in comfort and style. With soft Biscotti fabrics, a refined champagne chassis, and premium detailing, the Peach 7 delivers exceptional quality with effortless functionality.

This bundle includes the matching iCandy Cocoon Car Seat and ISOFIX Base, allowing you to create a seamless travel solution from car to stroller with ease.`,
    image: '/images/competitions/PRIZE 1 ICANDY PEACH 7.png',
  },
  
  // PR-002: iCandy Cocoon Car Seat
  {
    id: 'PR-002',
    name: 'iCandy Cocoon Swivel car seat + ISOFIX base',
    shortName: 'iCandy Cocoon',
    type: 'Physical',
    valueGBP: 349,
    cashAlternativeGBP: 300,
    totalQuantity: 4,
    remainingQuantity: 4,
    description: `Introducing the iCandy Cocoon car seat - the car seat ADAC-rated for top safety and is suitable for both seat belt and ISOFIX installation with the bases included. It is designed for babies from birth to 15 months with a unique handle design for a secure connection. The seat comes with UV-resistant SPF 50+ fabrics and a multi-position canopy for sunny-day protection.`,
    image: '/images/competitions/PRIZE 2 ICANDY COOON.png',
  },
  
  // PR-003: iCandy Pip Pushchair
  {
    id: 'PR-003',
    name: 'iCandy Pip Pushchair',
    shortName: 'iCandy Pip',
    type: 'Physical',
    valueGBP: 364,
    cashAlternativeGBP: 300,
    totalQuantity: 2,
    remainingQuantity: 2,
    description: `Reach new heights with iCandy Pip. The highly anticipated compact fold pushchair, crafted for the modern family that won't compromise on convenience, style or practicality, Pip offers the perfect solution. Tailored for urban living and seamless travel, Pip is easy to store and transport, ensuring joyful, hassle-free outings. With the largest seat, wheels, and best-in-class suspension, it surpasses competitors by delivering the smoothest, most agile ride on city streets. It's also IATA cabin-approved*, making it the ultimate travel companion for globetrotting families. Weighing just 7kg, Pip is lightweight yet robust, with a smooth one-hand fold mechanism for effortless use.`,
    image: '/images/competitions/PRIZE 3 ICANDY PIP PUSHCHAIR.png',
    notes: 'Choice of colours available',
  },
  
  // PR-004: Smyths Toy Voucher
  {
    id: 'PR-004',
    name: 'Smyths Toy Gift Voucher',
    shortName: 'Smyths Toy Voucher',
    type: 'Voucher',
    valueGBP: 100,
    cashAlternativeGBP: 90,
    totalQuantity: 5,
    remainingQuantity: 5,
    description: `Treat yourself (or the kids) to a £100 Smyths Toys voucher to spend on whatever you need most right now.

Perfect for:
• toys and games
• nursery essentials
• baby gear and travel items
• gifts, treats, and little extras

Whether you're stocking up for a new arrival or grabbing something fun for the weekend, this one is a great win because you can choose exactly what you want.`,
    image: '/images/competitions/PRIZE 4 SMYTHS TOY VOUCHER.png',
  },
  
  // PR-005: Rockit Baby Rocker
  {
    id: 'PR-005',
    name: 'Rockit Baby Rocker',
    shortName: 'Rockit Rocker',
    type: 'Physical',
    valueGBP: 40,
    cashAlternativeGBP: 30,
    totalQuantity: 10,
    remainingQuantity: 10,
    description: `The Rockit Rocker Rechargeable - Portable Baby Rocker

Now rechargeable with a rotatable bracket. Created to help parents on the go, this handy must-have accessory keeps babies moving and snoozing. Simply attach to a pram or stroller, push the button, and adjust the speed to gently rock baby. The Rockit uses a gentle rocking motion to safely soothe baby. Scientific tests show the vibration level closely mimics the normal hand rocking of a pushchair and the soothing movement is gentler than a pushchair moving over paving stones.

Product features:
• USB rechargeable - lithium battery
• 60-minute shut-down timer
• New Bracket - easier to fit and remove with new thumb-wheel system
• Fits all makes of strollers and prams
• Can be fitted on the side bar or the top handle
• Rotates so the Rockit can always be vertical
• Quiet motor with adjustable speed
• One charge lasts approx. 12-20 hours
• Showerproof - use inside and out
• Safe to use from birth`,
    image: '/images/competitions/PRIZE 5 ROCKIT BABY ROCKER.png',
  },
  
  // PR-006: £50 Cash
  {
    id: 'PR-006',
    name: '£50 Cash',
    shortName: '£50 Cash',
    type: 'Cash',
    valueGBP: 50,
    totalQuantity: 2,
    remainingQuantity: 2,
    description: '£50 Cash to spend on whatever you like',
    image: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?auto=format&fit=crop&q=80&w=600',
  },
  
  // PR-007: £20 Cash
  {
    id: 'PR-007',
    name: '£20 Cash',
    shortName: '£20 Cash',
    type: 'Cash',
    valueGBP: 20,
    totalQuantity: 10,
    remainingQuantity: 10,
    description: '£20 Cash to spend on whatever you like',
    image: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&q=80&w=600',
  },
  
  // PR-008: £10 Cash
  {
    id: 'PR-008',
    name: '£10 Cash',
    shortName: '£10 Cash',
    type: 'Cash',
    valueGBP: 10,
    totalQuantity: 20,
    remainingQuantity: 20,
    description: '£10 Cash to spend on whatever you like',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=600',
  },
  
  // PR-009: £5 Site Credit
  {
    id: 'PR-009',
    name: '£5 Site Credit',
    shortName: '£5 Credit',
    type: 'SiteCredit',
    valueGBP: 5,
    totalQuantity: 100,
    remainingQuantity: 100,
    description: '£5 site credit to use on future BabyBets competitions',
    image: 'site-credit-5', // Styled component reference
  },
  
  // PR-010: £2 Site Credit
  {
    id: 'PR-010',
    name: '£2 Site Credit',
    shortName: '£2 Credit',
    type: 'SiteCredit',
    valueGBP: 2,
    totalQuantity: 250,
    remainingQuantity: 250,
    description: '£2 site credit to use on future BabyBets competitions',
    image: 'site-credit-2', // Styled component reference
  },
  
  // PR-011: £1 Site Credit
  {
    id: 'PR-011',
    name: '£1 Site Credit',
    shortName: '£1 Credit',
    type: 'SiteCredit',
    valueGBP: 1,
    totalQuantity: 500,
    remainingQuantity: 500,
    description: '£1 site credit to use on future BabyBets competitions',
    image: 'site-credit-1', // Styled component reference
  },
  
  // PR-012: 50p Site Credit
  {
    id: 'PR-012',
    name: '50p Site Credit',
    shortName: '50p Credit',
    type: 'SiteCredit',
    valueGBP: 0.5,
    totalQuantity: 1000,
    remainingQuantity: 1000,
    description: '50p site credit to use on future BabyBets competitions',
    image: 'site-credit-50p', // Styled component reference
  },
];

/**
 * Calculate total instant win prize units
 */
export const totalInstantWinUnits = icandyInstantWinPrizes.reduce(
  (sum, prize) => sum + prize.totalQuantity,
  0
);
// Expected: 2 + 4 + 2 + 5 + 10 + 2 + 10 + 20 + 100 + 250 + 500 + 1000 = 1905

/**
 * Calculate total instant win prize value
 */
export const totalInstantWinValue = icandyInstantWinPrizes.reduce(
  (sum, prize) => sum + (prize.valueGBP * prize.totalQuantity),
  0
);

/**
 * The iCandy Mega Mum Bundle Competition
 */
export const icandyMegaMumCompetition: Competition = {
  id: 'icandy-mega-mum-2026',
  slug: 'icandy-mega-mum-bundle',
  title: 'iCandy Mega Mum Bundle',
  description: `Win the iCandy Mega Mum Bundle

This competition is stacked with premium iCandy prizes, plus cash wins and £100 Smyths Toys vouchers as instant wins throughout.

It's not just one prize at the end. You can win instantly while the competition is live, with over 1,900 instant win prizes available, and every entry also goes into the end prize draw for £50 cash.

What you can win:

Instant win prizes include:
• 2 x iCandy Peach 7 travel system bundles (with Cocoon car seat + ISOFIX base)
• 4 x iCandy Cocoon swivel car seats + ISOFIX bases
• 2 x iCandy Pip compact pushchairs
• 5 x £100 Smyths Toys gift vouchers
• 10 x Rockit portable baby rockers
• Cash prizes including £50, £20 and £10 wins

Plus Babybets site credit instant wins:
• £5, £2, £1 and 50p site credit prizes to use on future competitions

This competition includes £8,770 worth of prizes in total.

Enter now to win some amazing prizes.`,
  image: '/images/competitions/PRIZE 1 ICANDY PEACH 7.png',
  retailValueGBP: 8770,
  totalValueGBP: 8770,
  ticketPriceGBP: 2.00,
  baseTicketPriceGBP: 2.00,
  maxTickets: 10000,
  ticketsSold: 0,
  maxTicketsPerUser: 500,
  startDateTime: '2026-01-05T00:00:00Z',
  drawDateTime: '2026-02-28T23:59:59Z',
  category: 'Prams',
  status: 'active',
  
  // Competition type
  competitionType: 'instant_win_with_end_prize',
  
  // Tiered pricing
  tieredPricing: icandyTieredPricing,
  
  // Legacy bundles for backwards compat (quick-select options)
  bundles: [
    { quantity: 10, price: 19.00, label: 'Save £1' },
    { quantity: 20, price: 37.00, label: 'Save £3' },
    { quantity: 40, price: 72.00, label: 'Save £8' },
    { quantity: 60, price: 102.00, label: 'Best Value' },
  ],
  
  // Instant win prizes
  instantWinPrizes: icandyInstantWinPrizes,
  
  // End prize (£50 cash draw)
  endPrize: {
    type: 'Cash',
    valueGBP: 50,
    quantity: 1,
  },
  
  // Mark as instant win for backwards compat
  instantWin: true,
};

/**
 * Competition summary for listings
 */
export const icandyCompetitionSummary = {
  id: icandyMegaMumCompetition.id,
  slug: icandyMegaMumCompetition.slug,
  title: icandyMegaMumCompetition.title,
  image: icandyMegaMumCompetition.image,
  totalValue: icandyMegaMumCompetition.totalValueGBP,
  ticketPrice: icandyMegaMumCompetition.ticketPriceGBP,
  maxTickets: icandyMegaMumCompetition.maxTickets,
  ticketsSold: icandyMegaMumCompetition.ticketsSold,
  endDate: icandyMegaMumCompetition.drawDateTime,
  category: icandyMegaMumCompetition.category,
  instantWin: true,
  instantWinCount: totalInstantWinUnits,
  endPrize: '£50 Cash',
  status: icandyMegaMumCompetition.status,
};

export default icandyMegaMumCompetition;
