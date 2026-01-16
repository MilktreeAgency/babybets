/**
 * Tickets Hook
 * 
 * Manages user tickets and reveal functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

type TicketAllocation = Tables<'ticket_allocations'>;
type InstantWinPrize = Tables<'instant_win_prizes'>;
type Competition = Tables<'competitions'>;

interface TicketWithDetails extends TicketAllocation {
  competition?: Competition;
  prize?: InstantWinPrize;
}

interface GroupedTickets {
  competitionId: string;
  competitionTitle: string;
  competitionImage: string;
  isInstantWin: boolean;
  tickets: TicketWithDetails[];
  unrevealedCount: number;
  wonCount: number;
}

interface UseTicketsReturn {
  tickets: TicketWithDetails[];
  groupedTickets: GroupedTickets[];
  unrevealedTickets: TicketWithDetails[];
  isLoading: boolean;
  error: Error | null;
  revealTicket: (ticketId: string) => Promise<{
    isWinner: boolean;
    prize: InstantWinPrize | null;
    error: Error | null;
  }>;
  refetch: () => Promise<void>;
}

export function useTickets(userId: string | undefined): UseTicketsReturn {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user's tickets with competition and prize details
  const fetchTickets = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch tickets with related data
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('ticket_allocations')
        .select(`
          *,
          competition:competitions(*),
          prize:instant_win_prizes(*)
        `)
        .eq('sold_to_user_id', userId)
        .eq('is_sold', true)
        .order('sold_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      setTickets(ticketsData || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Group tickets by competition
  const groupedTickets: GroupedTickets[] = tickets.reduce((acc, ticket) => {
    const compId = ticket.competition_id;
    const existing = acc.find(g => g.competitionId === compId);

    if (existing) {
      existing.tickets.push(ticket);
      if (!ticket.is_revealed) existing.unrevealedCount++;
      if (ticket.prize_id && ticket.is_revealed) existing.wonCount++;
    } else {
      const competition = ticket.competition as Competition | undefined;
      acc.push({
        competitionId: compId,
        competitionTitle: competition?.title || 'Competition',
        competitionImage: competition?.image_url || '',
        isInstantWin: competition?.competition_type !== 'standard',
        tickets: [ticket],
        unrevealedCount: ticket.is_revealed ? 0 : 1,
        wonCount: ticket.prize_id && ticket.is_revealed ? 1 : 0,
      });
    }

    return acc;
  }, [] as GroupedTickets[]);

  // Get unrevealed tickets for instant win
  const unrevealedTickets = tickets.filter(
    t => !t.is_revealed && t.competition?.competition_type !== 'standard'
  );

  // Reveal a ticket
  const revealTicket = async (ticketId: string): Promise<{
    isWinner: boolean;
    prize: InstantWinPrize | null;
    error: Error | null;
  }> => {
    try {
      // Get the ticket
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      if (ticket.is_revealed) {
        throw new Error('Ticket already revealed');
      }

      // Update ticket as revealed
      const { error: updateError } = await supabase
        .from('ticket_allocations')
        .update({
          is_revealed: true,
          revealed_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (updateError) throw updateError;

      // Check if ticket has a prize
      const isWinner = !!ticket.prize_id;
      let prize: InstantWinPrize | null = null;

      if (isWinner && ticket.prize_id) {
        // Fetch prize details
        const { data: prizeData, error: prizeError } = await supabase
          .from('instant_win_prizes')
          .select('*')
          .eq('id', ticket.prize_id)
          .single();

        if (prizeError) throw prizeError;
        prize = prizeData;

        // If it's a site credit prize, add to wallet
        if (prize && prize.type === 'SiteCredit') {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 60); // 60 day expiry

          const { error: creditError } = await supabase
            .from('wallet_credits')
            .insert({
              user_id: userId!,
              amount_pence: Math.round(prize.value_gbp * 100),
              remaining_pence: Math.round(prize.value_gbp * 100),
              status: 'active',
              source_type: 'instant_win',
              source_competition_id: ticket.competition_id,
              source_ticket_id: ticketId,
              source_prize_id: prize.id,
              description: `Won ${prize.name} from instant win`,
              expires_at: expiryDate.toISOString(),
            });

          if (creditError) {
            console.error('Error adding wallet credit:', creditError);
          }
        }

        // Decrement remaining quantity
        const { error: decrementError } = await supabase
          .from('instant_win_prizes')
          .update({
            remaining_quantity: prize.remaining_quantity - 1,
          })
          .eq('id', prize.id);

        if (decrementError) {
          console.error('Error decrementing prize quantity:', decrementError);
        }

        // Add to winners table for social proof
        const { error: winnerError } = await supabase
          .from('winners')
          .insert({
            user_id: userId,
            display_name: 'Lucky Winner', // Would come from profile in production
            prize_name: prize.name,
            prize_value_gbp: prize.value_gbp,
            prize_image_url: prize.image_url,
            competition_id: ticket.competition_id,
            ticket_id: ticketId,
            win_type: 'instant_win',
            is_public: true,
            show_in_ticker: true,
          });

        if (winnerError) {
          console.error('Error adding winner:', winnerError);
        }
      }

      // Refetch tickets
      await fetchTickets();

      return { isWinner, prize, error: null };
    } catch (err) {
      console.error('Error revealing ticket:', err);
      return { isWinner: false, prize: null, error: err as Error };
    }
  };

  return {
    tickets,
    groupedTickets,
    unrevealedTickets,
    isLoading,
    error,
    revealTicket,
    refetch: fetchTickets,
  };
}

export default useTickets;
