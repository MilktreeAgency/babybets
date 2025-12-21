import { create } from 'zustand';
import { CartItem, PurchasedTicket } from './types';

interface AppState {
  cart: CartItem[];
  purchasedTickets: PurchasedTicket[];
  isCartOpen: boolean;
  affiliateCode: string | null;
  
  // Discount Logic
  discount: number; // 0 to 1 (e.g. 0.1 for 10%)
  appliedPromoCode: string | null;
  
  addToCart: (item: CartItem) => void;
  removeFromCart: (competitionId: string) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  setAffiliateCode: (code: string) => void;
  
  // Actions
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  
  // Getters
  cartTotal: () => number;
  discountedTotal: () => number;
  
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

  cartTotal: () => get().cart.reduce((acc, item) => acc + item.price, 0),
  
  discountedTotal: () => {
    const total = get().cart.reduce((acc, item) => acc + item.price, 0);
    const discountAmount = total * get().discount;
    return Math.max(0, total - discountAmount);
  },
  
  completePurchase: () => set((state) => {
    const newTickets: PurchasedTicket[] = [];
    
    state.cart.forEach(item => {
      // Generate individual tickets based on count
      for (let i = 0; i < item.ticketCount; i++) {
        // Mock logic: 1 in 10 chance to win an instant prize for demo purposes
        const isWinner = item.instantWin && Math.random() > 0.8; 
        
        newTickets.push({
          id: Math.random().toString(36).substr(2, 9),
          competitionId: item.competitionId,
          competitionTitle: item.competitionTitle,
          ticketNumber: `${item.competitionTitle.substring(0,2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          purchaseDate: new Date().toISOString(),
          image: item.image,
          instantWin: item.instantWin,
          isRevealed: false,
          isWinner: isWinner,
          winPrize: isWinner ? '£50 Cash' : undefined // Simplified prize logic
        });
      }
    });

    return {
      purchasedTickets: [...newTickets, ...state.purchasedTickets],
      cart: [],
      discount: 0,
      appliedPromoCode: null
    };
  }),

  revealTicket: (ticketId) => set((state) => ({
    purchasedTickets: state.purchasedTickets.map(t => 
      t.id === ticketId ? { ...t, isRevealed: true } : t
    )
  })),
}));