/**
 * Winners Hook
 * 
 * Manages winners data for social proof
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, subscribeToTable } from '../lib/supabase';
import type { Views, Tables } from '../types/database';

type RecentWinner = Views<'recent_winners_view'>;
type Winner = Tables<'winners'>;

interface UseWinnersReturn {
  winners: RecentWinner[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch recent winners for social proof display
 */
export function useWinners(limit: number = 20): UseWinnersReturn {
  const [winners, setWinners] = useState<RecentWinner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWinners = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('recent_winners_view')
        .select('*')
        .limit(limit);

      if (queryError) throw queryError;

      setWinners(data || []);
    } catch (err) {
      console.error('Error fetching winners:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchWinners();

    // Subscribe to realtime updates
    const unsubscribe = subscribeToTable<Winner>('winners', (newWinner) => {
      if (newWinner.is_public && newWinner.show_in_ticker) {
        setWinners(prev => [
          {
            id: newWinner.id,
            display_name: newWinner.display_name,
            location: newWinner.location,
            prize_name: newWinner.prize_name,
            prize_value_gbp: newWinner.prize_value_gbp,
            prize_image_url: newWinner.prize_image_url,
            won_at: newWinner.won_at,
          },
          ...prev.slice(0, limit - 1),
        ]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchWinners, limit]);

  return {
    winners,
    isLoading,
    error,
    refetch: fetchWinners,
  };
}

/**
 * Hook for admin winners management
 */
export function useAdminWinners(): {
  winners: Winner[];
  isLoading: boolean;
  error: Error | null;
  createWinner: (data: Partial<Winner>) => Promise<{ error: Error | null }>;
  updateWinner: (id: string, data: Partial<Winner>) => Promise<{ error: Error | null }>;
  deleteWinner: (id: string) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
} {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWinners = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('winners')
        .select('*')
        .order('won_at', { ascending: false });

      if (queryError) throw queryError;

      setWinners(data || []);
    } catch (err) {
      console.error('Error fetching winners:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWinners();
  }, [fetchWinners]);

  const createWinner = async (data: Partial<Winner>) => {
    try {
      const { error: insertError } = await supabase
        .from('winners')
        .insert(data as any);

      if (insertError) throw insertError;

      await fetchWinners();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateWinner = async (id: string, data: Partial<Winner>) => {
    try {
      const { error: updateError } = await supabase
        .from('winners')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchWinners();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteWinner = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('winners')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchWinners();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    winners,
    isLoading,
    error,
    createWinner,
    updateWinner,
    deleteWinner,
    refetch: fetchWinners,
  };
}

export default useWinners;
