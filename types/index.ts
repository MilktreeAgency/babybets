/**
 * Type exports for BabyBets
 * 
 * This file re-exports all types for convenient imports
 */

// Database types (Supabase generated)
export * from './database';

// Competition types
export * from './competition';

// Prize types
export * from './prizes';

// Wallet/Credit types
export * from './wallet';

// Re-export legacy types for backwards compatibility
export type {
  Winner,
  CartItem,
  PurchasedTicket,
  Affiliate,
} from '../types';

// Note: The base types.ts file at project root contains legacy types
// that are still used throughout the app. These will be gradually
// migrated to use the new type system.
