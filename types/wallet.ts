/**
 * Wallet/Site Credit Types
 */

/** Credit status */
export type CreditStatus = 'active' | 'spent' | 'expired' | 'revoked';

/** Wallet credit entry */
export interface WalletCredit {
  /** Unique ID */
  id: string;
  
  /** User ID */
  userId: string;
  
  /** Credit amount in GBP */
  amountGBP: number;
  
  /** Remaining balance in GBP */
  remainingGBP: number;
  
  /** Credit status */
  status: CreditStatus;
  
  /** When the credit was issued */
  issuedAt: string; // ISO string
  
  /** When the credit expires */
  expiresAt: string; // ISO string
  
  /** Source competition ID */
  sourceCompetitionId: string;
  
  /** Source order ID (if from purchase) */
  sourceOrderId?: string;
  
  /** Source ticket ID (if from instant win) */
  sourceTicketId?: string;
  
  /** Prize ID that awarded this credit */
  sourcePrizeId?: string;
  
  /** Description for user */
  description: string;
  
  /** Created timestamp */
  createdAt: string;
  
  /** Updated timestamp */
  updatedAt: string;
}

/** Wallet transaction type */
export type WalletTransactionType = 'credit' | 'debit' | 'expiry' | 'revocation';

/** Wallet transaction record */
export interface WalletTransaction {
  /** Unique ID */
  id: string;
  
  /** User ID */
  userId: string;
  
  /** Credit ID this transaction affects */
  creditId: string;
  
  /** Transaction type */
  type: WalletTransactionType;
  
  /** Amount in GBP (positive for credit, negative for debit) */
  amountGBP: number;
  
  /** Balance after transaction */
  balanceAfterGBP: number;
  
  /** Order ID (if debit from purchase) */
  orderId?: string;
  
  /** Description */
  description: string;
  
  /** Created timestamp */
  createdAt: string;
}

/** Wallet summary for display */
export interface WalletSummary {
  /** Total available balance */
  availableBalanceGBP: number;
  
  /** Credits expiring soon (within 7 days) */
  expiringSoonGBP: number;
  
  /** Next expiry date */
  nextExpiryDate?: string;
  
  /** Total credits (all statuses) */
  totalCreditsCount: number;
  
  /** Active credits */
  activeCredits: WalletCredit[];
}

/** Credit application at checkout */
export interface CreditApplication {
  /** Order ID */
  orderId: string;
  
  /** Credits being applied */
  creditsApplied: {
    creditId: string;
    amountGBP: number;
  }[];
  
  /** Total amount applied */
  totalAppliedGBP: number;
  
  /** Maximum allowed (50% of basket) */
  maxAllowedGBP: number;
  
  /** Remaining to pay after credit */
  remainingToPayGBP: number;
}

/** Wallet rules configuration */
export interface WalletRules {
  /** Maximum percentage of basket payable with credit */
  maxBasketPercentage: number; // 0.5 = 50%
  
  /** Credit expiry period in days */
  expiryDays: number; // 60 days
  
  /** Whether credit can be withdrawn as cash */
  isWithdrawable: boolean; // false
  
  /** Whether credit can be exchanged for cash */
  isExchangeable: boolean; // false
  
  /** Minimum order amount to use credit */
  minOrderAmountGBP?: number;
}

/** Default wallet rules for BabyBets */
export const DEFAULT_WALLET_RULES: WalletRules = {
  maxBasketPercentage: 0.5, // 50%
  expiryDays: 60,
  isWithdrawable: false,
  isExchangeable: false,
};
