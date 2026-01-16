import { Competition, Winner } from './types';
import { icandyMegaMumCompetition } from './data/competitions/icandy-mega-mum';
import { cash50Competition } from './data/competitions/cash-50';

/**
 * All competitions
 * - iCandy Mega Mum Bundle (main competition)
 * - £50 Cash Prize (simple example for Meta RMG approval)
 */
export const competitions: Competition[] = [
  icandyMegaMumCompetition,
  cash50Competition,
];

/**
 * Previous winners for social proof
 */
export const winners: Winner[] = [
  {
    id: 'w1',
    name: 'Sarah J.',
    location: 'Manchester',
    prize: 'Bugaboo Fox 5',
    date: '2 Oct 2023',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=400',
    ticketNumber: 'BF-4921'
  },
  {
    id: 'w2',
    name: 'David M.',
    location: 'Essex',
    prize: '£2,000 Cash',
    date: '28 Sep 2023',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    ticketNumber: 'CH-9921'
  },
  {
    id: 'w3',
    name: 'Emma W.',
    location: 'Bristol',
    prize: 'Nursery Makeover',
    date: '15 Sep 2023',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    ticketNumber: 'NM-1022'
  },
  {
    id: 'w4',
    name: 'James P.',
    location: 'Leeds',
    prize: 'Disney Holiday',
    date: '10 Sep 2023',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    ticketNumber: 'DH-5511'
  }
];
