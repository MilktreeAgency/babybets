/**
 * Prize Types for Instant Win Competitions
 */

/** Prize type categories */
export type PrizeType = 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit';

/** Prize fulfillment status */
export type FulfillmentStatus = 
  | 'pending'           // Awaiting winner's choice (for prizes with cash alternatives)
  | 'prize_selected'    // Winner chose the prize
  | 'cash_selected'     // Winner chose cash alternative
  | 'processing'        // Being processed for delivery
  | 'dispatched'        // Prize shipped
  | 'delivered'         // Confirmed delivered
  | 'completed'         // Fully completed (for cash/credit)
  | 'expired'           // Winner didn't respond in time

/** Instant win prize definition */
export interface InstantWinPrize {
  /** Unique prize ID (e.g., PR-001) */
  id: string;
  
  /** Full prize name */
  name: string;
  
  /** Short display name (optional) */
  shortName?: string;
  
  /** Prize type */
  type: PrizeType;
  
  /** Prize value in GBP */
  valueGBP: number;
  
  /** Cash alternative value in GBP (if applicable) */
  cashAlternativeGBP?: number;
  
  /** Total quantity available */
  totalQuantity: number;
  
  /** Remaining quantity */
  remainingQuantity: number;
  
  /** Prize description */
  description: string;
  
  /** Image URL or path */
  image: string;
  
  /** Additional notes (e.g., "Choice of colours available") */
  notes?: string;
}

/** End prize definition (drawn at competition close) */
export interface EndPrize {
  /** Prize type */
  type: PrizeType;
  
  /** Prize name */
  name: string;
  
  /** Prize value in GBP */
  valueGBP: number;
  
  /** Quantity (usually 1) */
  quantity: number;
  
  /** Description */
  description?: string;
}

/** Prize allocation - maps a ticket code to a prize */
export interface PrizeAllocation {
  /** Ticket code */
  ticketCode: string;
  
  /** Prize ID */
  prizeId: string;
  
  /** Competition ID */
  competitionId: string;
  
  /** Whether this allocation has been claimed */
  isClaimed: boolean;
  
  /** When claimed */
  claimedAt?: string;
  
  /** User ID who claimed it */
  claimedByUserId?: string;
}

/** Winner's choice between prize and cash alternative */
export interface CashAlternativeChoice {
  /** Unique ID */
  id: string;
  
  /** Ticket ID */
  ticketId: string;
  
  /** Prize ID */
  prizeId: string;
  
  /** User ID */
  userId: string;
  
  /** The choice made */
  choice: 'prize' | 'cash';
  
  /** Cash amount if cash chosen */
  cashAmount?: number;
  
  /** When the choice was made */
  chosenAt?: string;
  
  /** Deadline for making choice */
  deadline: string; // ISO string
  
  /** Whether choice was auto-defaulted (7 days) */
  wasAutoDefaulted: boolean;
}

/** Winner fulfillment tracking */
export interface WinnerFulfillment {
  /** Unique ID */
  id: string;
  
  /** Ticket ID */
  ticketId: string;
  
  /** Prize ID */
  prizeId: string;
  
  /** User ID */
  userId: string;
  
  /** Competition ID */
  competitionId: string;
  
  /** Current fulfillment status */
  status: FulfillmentStatus;
  
  /** Prize or cash choice (if applicable) */
  choice?: 'prize' | 'cash';
  
  /** Value being fulfilled */
  valueGBP: number;
  
  /** Deadline for prize claim/choice */
  claimDeadline: string; // ISO string
  
  /** When winner was notified */
  notifiedAt?: string;
  
  /** When winner responded */
  respondedAt?: string;
  
  /** When prize was dispatched */
  dispatchedAt?: string;
  
  /** Tracking number (for physical prizes) */
  trackingNumber?: string;
  
  /** Delivery address (for physical prizes) */
  deliveryAddress?: {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
  };
  
  /** Notes */
  notes?: string;
  
  /** Created timestamp */
  createdAt: string;
  
  /** Updated timestamp */
  updatedAt: string;
}

/** Revealed instant win result */
export interface InstantWinResult {
  /** Ticket ID */
  ticketId: string;
  
  /** Ticket code/number */
  ticketCode: string;
  
  /** Whether it's a winner */
  isWinner: boolean;
  
  /** Prize details if winner */
  prize?: {
    id: string;
    name: string;
    type: PrizeType;
    valueGBP: number;
    cashAlternativeGBP?: number;
    image: string;
  };
  
  /** When revealed */
  revealedAt: string;
}
