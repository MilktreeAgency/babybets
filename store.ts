import { create } from 'zustand';
import { CartItem, PurchasedTicket } from './types';

/** Wallet credit entry */
export interface WalletCredit {
  id: string;
  amountGBP: number;
  remainingGBP: number;
  status: 'active' | 'spent' | 'expired' | 'revoked';
  issuedAt: string;
  expiresAt: string;
  sourceCompetitionId: string;
  sourceTicketId?: string;
  description: string;
}

/** Wallet rules */
const WALLET_RULES = {
  maxBasketPercentage: 0.5, // 50% max payable with credit
  expiryDays: 60,
  isWithdrawable: false,
  isExchangeable: false,
};

interface AppState {
  cart: CartItem[];
  purchasedTickets: PurchasedTicket[];
  isCartOpen: boolean;
  affiliateCode: string | null;
  
  // Discount Logic
  discount: number; // 0 to 1 (e.g. 0.1 for 10%)
  appliedPromoCode: string | null;
  
  // Wallet/Site Credit
  walletCredits: WalletCredit[];
  appliedCreditAmount: number; // Amount of credit applied to current checkout
  
  addToCart: (item: CartItem) => void;
  removeFromCart: (competitionId: string) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  setAffiliateCode: (code: string) => void;
  
  // Actions
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  
  // Wallet Actions
  addWalletCredit: (credit: Omit<WalletCredit, 'id' | 'status' | 'issuedAt' | 'expiresAt' | 'remainingGBP'>) => void;
  getAvailableWalletBalance: () => number;
  getMaxCreditForBasket: () => number;
  applyWalletCredit: (amount: number) => boolean;
  removeWalletCredit: () => void;
  
  // Getters
  cartTotal: () => number;
  discountedTotal: () => number;
  finalTotal: () => number; // After promo and credit
  
  completePurchase: () => void;
  revealTicket: (ticketId: string) => void;
}

const VALID_CODES: Record<string, number> = {
  // Standard
  'BABY10': 0.10,
  'BABY15': 0.15,
  'BABY20': 0.20,
  'LUCKY5': 0.05,
  'WELCOME': 0.10,
  
  // Wheel Prizes
  'FREETICKET': 0.25, // Simulating a free ticket value (~25%)
  'CREDIT10': 0.10,   // Simulating £10 credit (~10%)
  'TECHWIN': 0.15,    // Tech bundle discount
  'HALFPRICE': 0.50,  // 50% Off
  'MYSTERY': 0.30,    // Mystery Prize
  'NURSERYWIN': 0.20, // Nursery Bundle discount
  'NURSERY': 0.20     // Fallback
};

export const useStore = create<AppState>((set, get) => ({
  cart: [],
  purchasedTickets: [
    {
      id: 'demo-ticket-1',
      competitionId: 'c3', 
      competitionTitle: '£500 Flash Cash Friday',
      ticketNumber: 'FC-1992',
      purchaseDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?auto=format&fit=crop&q=80&w=1000',
      instantWin: true,
      isRevealed: false,
      isWinner: true,
      winPrize: '£10 Site Credit'
    }
  ], 
  isCartOpen: false,
  affiliateCode: null,
  
  discount: 0,
  appliedPromoCode: null,
  
  // Wallet - start with demo credit
  walletCredits: [
    {
      id: 'demo-credit-1',
      amountGBP: 5,
      remainingGBP: 5,
      status: 'active',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      sourceCompetitionId: 'demo',
      description: 'Welcome bonus - £5 site credit'
    }
  ],
  appliedCreditAmount: 0,

  addToCart: (item) => set((state) => {
    const existing = state.cart.find(i => i.competitionId === item.competitionId);
    if (existing) {
      return {
        cart: state.cart.map(i => i.competitionId === item.competitionId ? item : i),
        isCartOpen: true
      };
    }
    return { cart: [...state.cart, item], isCartOpen: true };
  }),
  
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(i => i.competitionId !== id)
  })),
  
  clearCart: () => set({ cart: [], discount: 0, appliedPromoCode: null }),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setAffiliateCode: (code) => {
    localStorage.setItem('babybets_affiliate', code);
    set({ affiliateCode: code });
  },

  applyPromoCode: (code) => {
    const normalizedCode = code.toUpperCase().trim();
    if (VALID_CODES[normalizedCode]) {
      set({ 
        discount: VALID_CODES[normalizedCode],
        appliedPromoCode: normalizedCode
      });
      return true;
    }
    return false;
  },

  removePromoCode: () => set({ discount: 0, appliedPromoCode: null }),

  // Wallet Actions
  addWalletCredit: (creditData) => set((state) => {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + WALLET_RULES.expiryDays * 24 * 60 * 60 * 1000);
    
    const newCredit: WalletCredit = {
      id: `credit-${Math.random().toString(36).substr(2, 9)}`,
      amountGBP: creditData.amountGBP,
      remainingGBP: creditData.amountGBP,
      status: 'active',
      issuedAt: now.toISOString(),
      expiresAt: expiryDate.toISOString(),
      sourceCompetitionId: creditData.sourceCompetitionId,
      sourceTicketId: creditData.sourceTicketId,
      description: creditData.description,
    };
    
    return {
      walletCredits: [...state.walletCredits, newCredit]
    };
  }),

  getAvailableWalletBalance: () => {
    const now = new Date();
    return get().walletCredits
      .filter(c => c.status === 'active' && new Date(c.expiresAt) > now)
      .reduce((sum, c) => sum + c.remainingGBP, 0);
  },

  getMaxCreditForBasket: () => {
    const discountedTotal = get().discountedTotal();
    const maxAllowed = discountedTotal * WALLET_RULES.maxBasketPercentage;
    const available = get().getAvailableWalletBalance();
    return Math.min(maxAllowed, available);
  },

  applyWalletCredit: (amount) => {
    const maxAllowed = get().getMaxCreditForBasket();
    if (amount > maxAllowed) {
      return false;
    }
    set({ appliedCreditAmount: Math.min(amount, maxAllowed) });
    return true;
  },

  removeWalletCredit: () => set({ appliedCreditAmount: 0 }),

  cartTotal: () => get().cart.reduce((acc, item) => acc + item.price, 0),
  
  discountedTotal: () => {
    const total = get().cart.reduce((acc, item) => acc + item.price, 0);
    const discountAmount = total * get().discount;
    return Math.max(0, total - discountAmount);
  },

  finalTotal: () => {
    const discounted = get().discountedTotal();
    const creditApplied = get().appliedCreditAmount;
    return Math.max(0, discounted - creditApplied);
  },
  
  completePurchase: () => set((state) => {
    const newTickets: PurchasedTicket[] = [];
    const newCredits: WalletCredit[] = [];
    
    // Demo prizes for instant win
    const demoPrizes = [
      { prize: '£50 Cash', type: 'cash' },
      { prize: '£20 Cash', type: 'cash' },
      { prize: '£10 Cash', type: 'cash' },
      { prize: '£5 Site Credit', type: 'credit', amount: 5 },
      { prize: '£2 Site Credit', type: 'credit', amount: 2 },
      { prize: '£1 Site Credit', type: 'credit', amount: 1 },
      { prize: '50p Site Credit', type: 'credit', amount: 0.5 },
      { prize: 'iCandy Peach 7', type: 'physical' },
      { prize: 'Smyths Voucher', type: 'voucher' },
    ];
    
    state.cart.forEach(item => {
      // Generate individual tickets based on count
      for (let i = 0; i < item.ticketCount; i++) {
        // Mock logic: ~20% chance to win an instant prize for demo purposes
        const isWinner = item.instantWin && Math.random() > 0.8; 
        
        // Pick a random prize if winner
        const prizeData = isWinner 
          ? demoPrizes[Math.floor(Math.random() * demoPrizes.length)]
          : null;
        
        const ticketId = Math.random().toString(36).substr(2, 9);
        const ticketCode = `${Math.floor(1000000 + Math.random() * 9000000)}`; // 7-digit code
        
        newTickets.push({
          id: ticketId,
          competitionId: item.competitionId,
          competitionTitle: item.competitionTitle,
          ticketNumber: ticketCode,
          purchaseDate: new Date().toISOString(),
          image: item.image,
          instantWin: item.instantWin,
          isRevealed: false,
          isWinner: isWinner,
          winPrize: prizeData?.prize,
          // Store prize type for handling
          prizeType: prizeData?.type as any,
          prizeAmount: prizeData?.amount,
          hasCashAlternative: prizeData?.type === 'physical' || prizeData?.type === 'voucher',
        });
      }
    });
    
    // Deduct wallet credit if applied
    let updatedCredits = [...state.walletCredits];
    let remainingToDeduct = state.appliedCreditAmount;
    
    if (remainingToDeduct > 0) {
      // Sort by expiry date (use soonest to expire first)
      updatedCredits = updatedCredits
        .map(credit => {
          if (credit.status !== 'active' || remainingToDeduct <= 0) {
            return credit;
          }
          
          const deduction = Math.min(credit.remainingGBP, remainingToDeduct);
          remainingToDeduct -= deduction;
          
          const newRemaining = credit.remainingGBP - deduction;
          return {
            ...credit,
            remainingGBP: newRemaining,
            status: newRemaining <= 0 ? 'spent' as const : credit.status,
          };
        });
    }

    return {
      purchasedTickets: [...newTickets, ...state.purchasedTickets],
      walletCredits: [...updatedCredits, ...newCredits],
      cart: [],
      discount: 0,
      appliedPromoCode: null,
      appliedCreditAmount: 0,
    };
  }),

  revealTicket: (ticketId) => set((state) => ({
    purchasedTickets: state.purchasedTickets.map(t => 
      t.id === ticketId ? { ...t, isRevealed: true } : t
    )
  })),
}));