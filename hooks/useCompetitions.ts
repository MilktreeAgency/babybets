/**
 * Competitions Hook
 * 
 * Manages competition data fetching and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables, Views } from '../types/database';

type Competition = Tables<'competitions'>;
type InstantWinPrize = Tables<'instant_win_prizes'>;
type ActiveCompetitionView = Views<'active_competitions_view'>;

interface CompetitionWithPrizes extends Competition {
  instant_win_prizes?: InstantWinPrize[];
}

interface UseCompetitionsOptions {
  category?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
}

interface UseCompetitionsReturn {
  competitions: ActiveCompetitionView[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch active competitions
 */
export function useCompetitions(options: UseCompetitionsOptions = {}): UseCompetitionsReturn {
  const [competitions, setCompetitions] = useState<ActiveCompetitionView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompetitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('active_competitions_view')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('end_datetime', { ascending: true });

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.featured !== undefined) {
        query = query.eq('is_featured', options.featured);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setCompetitions(data || []);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.status, options.featured, options.limit]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  return {
    competitions,
    isLoading,
    error,
    refetch: fetchCompetitions,
  };
}

/**
 * Hook to fetch a single competition by slug
 */
export function useCompetition(slug: string): {
  competition: CompetitionWithPrizes | null;
  prizes: InstantWinPrize[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [competition, setCompetition] = useState<CompetitionWithPrizes | null>(null);
  const [prizes, setPrizes] = useState<InstantWinPrize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompetition = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch competition
      const { data: compData, error: compError } = await supabase
        .from('competitions')
        .select('*')
        .eq('slug', slug)
        .single();

      if (compError) throw compError;

      setCompetition(compData);

      // Fetch prizes if it's an instant win competition
      if (compData && compData.competition_type !== 'standard') {
        const { data: prizesData, error: prizesError } = await supabase
          .from('instant_win_prizes')
          .select('*')
          .eq('competition_id', compData.id)
          .order('tier', { ascending: true })
          .order('value_gbp', { ascending: false });

        if (prizesError) throw prizesError;

        setPrizes(prizesData || []);
      }
    } catch (err) {
      console.error('Error fetching competition:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  return {
    competition,
    prizes,
    isLoading,
    error,
    refetch: fetchCompetition,
  };
}

/**
 * Hook for admin competition management
 */
export function useAdminCompetitions(): {
  competitions: Competition[];
  isLoading: boolean;
  error: Error | null;
  createCompetition: (data: Partial<Competition>) => Promise<{ data: Competition | null; error: Error | null }>;
  updateCompetition: (id: string, data: Partial<Competition>) => Promise<{ error: Error | null }>;
  deleteCompetition: (id: string) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
} {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompetitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      setCompetitions(data || []);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const createCompetition = async (data: Partial<Competition>) => {
    try {
      const { data: newComp, error: createError } = await supabase
        .from('competitions')
        .insert(data as any)
        .select()
        .single();

      if (createError) throw createError;

      await fetchCompetitions();
      return { data: newComp, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const updateCompetition = async (id: string, data: Partial<Competition>) => {
    try {
      const { error: updateError } = await supabase
        .from('competitions')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchCompetitions();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteCompetition = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('competitions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchCompetitions();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    competitions,
    isLoading,
    error,
    createCompetition,
    updateCompetition,
    deleteCompetition,
    refetch: fetchCompetitions,
  };
}

export default useCompetitions;
