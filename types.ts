export interface Competition {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  retailValueGBP: number;
  ticketPriceGBP: number;
  maxTickets: number;
  ticketsSold: number;
  drawDateTime: string; // ISO string
  category: 'Toys' | 'Nursery' | 'Prams' | 'Holidays' | 'Cash';
  status: 'active' | 'ending_soon' | 'sold_out' | 'closed' | 'new';
  bundles: TicketBundle[];
  instantWin?: boolean;
}

export interface TicketBundle {
  quantity: number;
  price: number;
  label?: string; // e.g., "Most Popular"
}

export interface Winner {
  id: string;
  name: string;
  location: string;
  prize: string;
  date: string;
  image: string;
  ticketNumber: string;
}

export interface CartItem {
  competitionId: string;
  competitionTitle: string;
  ticketCount: number;
  price: number;
  image: string;
  instantWin?: boolean;
}

export interface PurchasedTicket {
  id: string;
  competitionId: string;
  competitionTitle: string;
  ticketNumber: string;
  purchaseDate: string;
  image: string;
  instantWin?: boolean;
  isRevealed?: boolean; // For scratch cards
  isWinner?: boolean;   // For scratch cards
  winPrize?: string;    // If they won
}

export interface Affiliate {
  code: string;
  clicks: number;
  sales: number;
}