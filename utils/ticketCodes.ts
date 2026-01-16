/**
 * Ticket Code Generation and Prize Allocation Utilities
 * 
 * Generates random-looking numeric ticket codes and assigns instant win prizes
 * to a subset of those codes before the competition goes live.
 */

import { InstantWinPrizeSummary } from '../types';

/**
 * Generate a single random numeric code of specified length
 * Codes are 6-8 digits, random-looking (not sequential)
 */
function generateRandomCode(length: number = 7): string {
  // Generate a random number with the specified number of digits
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  return code.toString();
}

/**
 * Generate a pool of unique ticket codes for a competition
 * 
 * @param count - Number of codes to generate (e.g., 10000)
 * @param codeLength - Length of each code (default 7 digits)
 * @returns Array of unique ticket codes
 */
export function generateTicketPool(count: number, codeLength: number = 7): string[] {
  const codes = new Set<string>();
  
  // Generate codes until we have enough unique ones
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops
  
  while (codes.size < count && attempts < maxAttempts) {
    codes.add(generateRandomCode(codeLength));
    attempts++;
  }
  
  if (codes.size < count) {
    console.warn(`Only generated ${codes.size} unique codes out of ${count} requested`);
  }
  
  // Convert to array and shuffle for extra randomness
  const codeArray = Array.from(codes);
  return shuffleArray(codeArray);
}

/**
 * Fisher-Yates shuffle algorithm for arrays
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Prize allocation mapping
 */
export interface TicketPrizeAllocation {
  ticketCode: string;
  prizeId: string;
  prizeName: string;
  prizeType: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit';
  prizeValueGBP: number;
  cashAlternativeGBP?: number;
}

/**
 * Ticket pool with prize allocations
 */
export interface TicketPoolWithAllocations {
  competitionId: string;
  totalCodes: number;
  codes: string[];
  prizeAllocations: TicketPrizeAllocation[];
  generatedAt: string;
  isLocked: boolean;
}

/**
 * Assign instant win prizes to a subset of ticket codes
 * 
 * Each prize unit maps to exactly one ticket code.
 * The allocation is random but deterministic once generated.
 * 
 * @param codes - The pool of ticket codes
 * @param prizes - The instant win prizes with quantities
 * @returns Array of prize allocations
 */
export function assignPrizesToCodes(
  codes: string[],
  prizes: InstantWinPrizeSummary[]
): TicketPrizeAllocation[] {
  const allocations: TicketPrizeAllocation[] = [];
  
  // Create a list of all prize "units" (one entry per quantity)
  const prizeUnits: { prize: InstantWinPrizeSummary; unitIndex: number }[] = [];
  
  for (const prize of prizes) {
    for (let i = 0; i < prize.totalQuantity; i++) {
      prizeUnits.push({ prize, unitIndex: i });
    }
  }
  
  // Shuffle prize units to randomize which codes get which prizes
  const shuffledUnits = shuffleArray(prizeUnits);
  
  // Shuffle the codes to pick random winners
  const shuffledCodes = shuffleArray([...codes]);
  
  // Validate we have enough codes for all prizes
  if (shuffledUnits.length > shuffledCodes.length) {
    throw new Error(
      `Not enough ticket codes (${shuffledCodes.length}) for all prizes (${shuffledUnits.length})`
    );
  }
  
  // Assign each prize unit to a unique code
  for (let i = 0; i < shuffledUnits.length; i++) {
    const { prize } = shuffledUnits[i];
    const code = shuffledCodes[i];
    
    allocations.push({
      ticketCode: code,
      prizeId: prize.id,
      prizeName: prize.name,
      prizeType: prize.type,
      prizeValueGBP: prize.valueGBP,
      cashAlternativeGBP: prize.cashAlternativeGBP,
    });
  }
  
  return allocations;
}

/**
 * Generate a complete ticket pool with prize allocations for a competition
 */
export function generateCompetitionTicketPool(
  competitionId: string,
  totalTickets: number,
  prizes: InstantWinPrizeSummary[],
  codeLength: number = 7
): TicketPoolWithAllocations {
  // Generate the codes
  const codes = generateTicketPool(totalTickets, codeLength);
  
  // Assign prizes to random codes
  const prizeAllocations = assignPrizesToCodes(codes, prizes);
  
  return {
    competitionId,
    totalCodes: codes.length,
    codes,
    prizeAllocations,
    generatedAt: new Date().toISOString(),
    isLocked: true, // Lock immediately after generation
  };
}

/**
 * Check if a ticket code is a winner
 * 
 * @param code - The ticket code to check
 * @param allocations - The prize allocations for the competition
 * @returns The prize allocation if winner, null otherwise
 */
export function checkTicketCodeWinner(
  code: string,
  allocations: TicketPrizeAllocation[]
): TicketPrizeAllocation | null {
  return allocations.find(a => a.ticketCode === code) || null;
}

/**
 * Get remaining available codes (not yet purchased)
 * 
 * @param allCodes - All codes in the pool
 * @param purchasedCodes - Codes that have been purchased
 * @returns Available codes
 */
export function getAvailableCodes(
  allCodes: string[],
  purchasedCodes: Set<string>
): string[] {
  return allCodes.filter(code => !purchasedCodes.has(code));
}

/**
 * Allocate codes from the pool for a purchase
 * 
 * @param availableCodes - Codes still available
 * @param count - Number of codes to allocate
 * @returns Allocated codes
 */
export function allocateCodesForPurchase(
  availableCodes: string[],
  count: number
): string[] {
  if (count > availableCodes.length) {
    throw new Error(
      `Not enough available codes (${availableCodes.length}) for purchase (${count})`
    );
  }
  
  // Shuffle and take the first N codes
  const shuffled = shuffleArray([...availableCodes]);
  return shuffled.slice(0, count);
}

/**
 * Format a ticket code for display (e.g., with dashes)
 * 7-digit code: XXX-XXXX
 * 8-digit code: XXXX-XXXX
 */
export function formatTicketCode(code: string): string {
  if (code.length <= 4) {
    return code;
  } else if (code.length <= 6) {
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  } else if (code.length === 7) {
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  } else {
    return `${code.slice(0, 4)}-${code.slice(4)}`;
  }
}

/**
 * Summary of prize distribution in a pool
 */
export interface PoolPrizeSummary {
  totalCodes: number;
  winningCodes: number;
  losingCodes: number;
  winRate: number; // e.g., 0.1905 = 19.05%
  prizesByType: {
    type: string;
    count: number;
    totalValue: number;
  }[];
  totalPrizeValue: number;
}

/**
 * Get summary statistics for a ticket pool
 */
export function getPoolSummary(pool: TicketPoolWithAllocations): PoolPrizeSummary {
  const prizesByType: Record<string, { count: number; totalValue: number }> = {};
  let totalPrizeValue = 0;
  
  for (const allocation of pool.prizeAllocations) {
    if (!prizesByType[allocation.prizeType]) {
      prizesByType[allocation.prizeType] = { count: 0, totalValue: 0 };
    }
    prizesByType[allocation.prizeType].count++;
    prizesByType[allocation.prizeType].totalValue += allocation.prizeValueGBP;
    totalPrizeValue += allocation.prizeValueGBP;
  }
  
  return {
    totalCodes: pool.totalCodes,
    winningCodes: pool.prizeAllocations.length,
    losingCodes: pool.totalCodes - pool.prizeAllocations.length,
    winRate: pool.prizeAllocations.length / pool.totalCodes,
    prizesByType: Object.entries(prizesByType).map(([type, data]) => ({
      type,
      ...data,
    })),
    totalPrizeValue,
  };
}
