/**
 * Promo Codes Hook
 * 
 * Manages promo code validation and admin operations
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { penceToPounds } from '../lib/constants';
import type { Tables } from '../types/database';

type PromoCode = Tables<'promo_codes'>;

interface PromoCodeValidation {
  isValid: boolean;
  code: PromoCode | null;
  discountPence: number;
  discountDisplay: string;
  error: string | null;
}

/**
 * Hook to validate a promo code
 */
export function usePromoCodeValidation(
  code: string,
  basketTotalPence: number,
  userId?: string
): {
  validation: PromoCodeValidation;
  isValidating: boolean;
  validate: () => Promise<PromoCodeValidation>;
} {
  const [validation, setValidation] = useState<PromoCodeValidation>({
    isValid: false,
    code: null,
    discountPence: 0,
    discountDisplay: '',
    error: null,
  });
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (): Promise<PromoCodeValidation> => {
    if (!code || code.trim().length === 0) {
      const result: PromoCodeValidation = {
        isValid: false,
        code: null,
        discountPence: 0,
        discountDisplay: '',
        error: null,
      };
      setValidation(result);
      return result;
    }

    setIsValidating(true);

    try {
      // Fetch the promo code
      const { data: promoData, error: fetchError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .eq('is_active', true)
        .single();

      if (fetchError || !promoData) {
        const result: PromoCodeValidation = {
          isValid: false,
          code: null,
          discountPence: 0,
          discountDisplay: '',
          error: 'Invalid promo code',
        };
        setValidation(result);
        return result;
      }

      // Check validity dates
      const now = new Date();
      const validFrom = new Date(promoData.valid_from);
      const validUntil = promoData.valid_until ? new Date(promoData.valid_until) : null;

      if (now < validFrom) {
        const result: PromoCodeValidation = {
          isValid: false,
          code: null,
          discountPence: 0,
          discountDisplay: '',
          error: 'This code is not yet active',
        };
        setValidation(result);
        return result;
      }

      if (validUntil && now > validUntil) {
        const result: PromoCodeValidation = {
          isValid: false,
          code: null,
          discountPence: 0,
          discountDisplay: '',
          error: 'This code has expired',
        };
        setValidation(result);
        return result;
      }

      // Check max uses
      if (promoData.max_uses && promoData.current_uses >= promoData.max_uses) {
        const result: PromoCodeValidation = {
          isValid: false,
          code: null,
          discountPence: 0,
          discountDisplay: '',
          error: 'This code has reached its usage limit',
        };
        setValidation(result);
        return result;
      }

      // Check minimum order
      if (basketTotalPence < promoData.min_order_pence) {
        const result: PromoCodeValidation = {
          isValid: false,
          code: null,
          discountPence: 0,
          discountDisplay: '',
          error: `Minimum order £${penceToPounds(promoData.min_order_pence).toFixed(2)} required`,
        };
        setValidation(result);
        return result;
      }

      // Calculate discount
      let discountPence = 0;
      let discountDisplay = '';

      switch (promoData.type) {
        case 'percentage':
          discountPence = Math.floor(basketTotalPence * (promoData.value / 100));
          discountDisplay = `${promoData.value}% off`;
          break;
        case 'fixed_value':
          discountPence = Math.min(promoData.value, basketTotalPence);
          discountDisplay = `£${penceToPounds(promoData.value).toFixed(2)} off`;
          break;
        case 'free_tickets':
          // Handle free tickets separately in checkout
          discountDisplay = `${promoData.value} free tickets`;
          break;
      }

      const result: PromoCodeValidation = {
        isValid: true,
        code: promoData,
        discountPence,
        discountDisplay,
        error: null,
      };
      setValidation(result);
      return result;
    } catch (err) {
      console.error('Error validating promo code:', err);
      const result: PromoCodeValidation = {
        isValid: false,
        code: null,
        discountPence: 0,
        discountDisplay: '',
        error: 'Error validating code',
      };
      setValidation(result);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, [code, basketTotalPence]);

  return {
    validation,
    isValidating,
    validate,
  };
}

/**
 * Hook for admin promo code management
 */
export function useAdminPromoCodes(): {
  promoCodes: PromoCode[];
  isLoading: boolean;
  error: Error | null;
  createPromoCode: (data: Partial<PromoCode>) => Promise<{ error: Error | null }>;
  updatePromoCode: (id: string, data: Partial<PromoCode>) => Promise<{ error: Error | null }>;
  deletePromoCode: (id: string) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
} {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPromoCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      setPromoCodes(data || []);
    } catch (err) {
      console.error('Error fetching promo codes:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  const createPromoCode = async (data: Partial<PromoCode>) => {
    try {
      const { error: insertError } = await supabase
        .from('promo_codes')
        .insert(data as any);

      if (insertError) throw insertError;

      await fetchPromoCodes();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updatePromoCode = async (id: string, data: Partial<PromoCode>) => {
    try {
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchPromoCodes();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchPromoCodes();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    promoCodes,
    isLoading,
    error,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    refetch: fetchPromoCodes,
  };
}

export default usePromoCodeValidation;
