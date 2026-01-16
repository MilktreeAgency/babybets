/**
 * Wallet Hook
 * 
 * Manages wallet credits, transactions, and withdrawals
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { WALLET_RULES, penceToPounds } from '../lib/constants';
import type { Tables, Views } from '../types/database';

type WalletCredit = Tables<'wallet_credits'>;
type WalletTransaction = Tables<'wallet_transactions'>;
type WalletBalanceView = Views<'wallet_balance_view'>;

interface WalletState {
  credits: WalletCredit[];
  transactions: WalletTransaction[];
  balance: WalletBalanceView | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseWalletReturn extends WalletState {
  availableBalancePounds: number;
  expiringSoonPounds: number;
  getMaxCreditForBasket: (basketTotalPence: number) => number;
  applyCreditsToOrder: (
    orderTotalPence: number,
    orderId: string
  ) => Promise<{ appliedPence: number; error: Error | null }>;
  refetch: () => Promise<void>;
  requestWithdrawal: (amountPence: number) => Promise<{ error: Error | null }>;
}

export function useWallet(userId: string | undefined): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    credits: [],
    transactions: [],
    balance: null,
    isLoading: true,
    error: null,
  });

  // Fetch wallet data
  const fetchWalletData = useCallback(async () => {
    if (!userId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch active credits
      const { data: creditsData, error: creditsError } = await supabase
        .from('wallet_credits')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: true });

      if (creditsError) throw creditsError;

      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      // Fetch balance view
      const { data: balanceData, error: balanceError } = await supabase
        .from('wallet_balance_view')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Balance view might not have data if user has no credits
      if (balanceError && balanceError.code !== 'PGRST116') {
        throw balanceError;
      }

      setState({
        credits: creditsData || [],
        transactions: transactionsData || [],
        balance: balanceData || null,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err as Error,
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // Calculate available balance in pounds
  const availableBalancePounds = state.balance
    ? penceToPounds(state.balance.available_balance_pence || 0)
    : 0;

  // Calculate expiring soon balance in pounds
  const expiringSoonPounds = state.balance
    ? penceToPounds(state.balance.expiring_soon_pence || 0)
    : 0;

  // Calculate max credit that can be applied to a basket
  const getMaxCreditForBasket = (basketTotalPence: number): number => {
    const maxAllowedPence = Math.floor(basketTotalPence * WALLET_RULES.maxBasketPercentage);
    const availablePence = state.balance?.available_balance_pence || 0;
    return Math.min(maxAllowedPence, availablePence);
  };

  // Apply credits to an order (FIFO by expiry)
  const applyCreditsToOrder = async (
    amountToApplyPence: number,
    orderId: string
  ): Promise<{ appliedPence: number; error: Error | null }> => {
    if (!userId) {
      return { appliedPence: 0, error: new Error('Not authenticated') };
    }

    try {
      let remainingToApply = amountToApplyPence;
      let totalApplied = 0;

      // Process credits FIFO by expiry date
      for (const credit of state.credits) {
        if (remainingToApply <= 0) break;

        const toDeduct = Math.min(credit.remaining_pence, remainingToApply);

        // Update credit balance
        const newRemaining = credit.remaining_pence - toDeduct;
        const newStatus = newRemaining <= 0 ? 'spent' : 'active';

        const { error: updateError } = await supabase
          .from('wallet_credits')
          .update({
            remaining_pence: newRemaining,
            status: newStatus,
          })
          .eq('id', credit.id);

        if (updateError) throw updateError;

        // Create transaction record
        const { error: txError } = await supabase
          .from('wallet_transactions')
          .insert({
            user_id: userId,
            credit_id: credit.id,
            type: 'debit',
            amount_pence: -toDeduct,
            balance_after_pence: (state.balance?.available_balance_pence || 0) - totalApplied - toDeduct,
            order_id: orderId,
            description: `Applied £${penceToPounds(toDeduct).toFixed(2)} credit to order`,
          });

        if (txError) throw txError;

        remainingToApply -= toDeduct;
        totalApplied += toDeduct;
      }

      // Refetch wallet data
      await fetchWalletData();

      return { appliedPence: totalApplied, error: null };
    } catch (err) {
      console.error('Error applying credits:', err);
      return { appliedPence: 0, error: err as Error };
    }
  };

  // Request a withdrawal
  const requestWithdrawal = async (amountPence: number): Promise<{ error: Error | null }> => {
    if (!userId) {
      return { error: new Error('Not authenticated') };
    }

    if (!WALLET_RULES.isWithdrawable) {
      return { error: new Error('Withdrawals are not enabled') };
    }

    if (amountPence < WALLET_RULES.minWithdrawalPence) {
      return { error: new Error(`Minimum withdrawal is £${penceToPounds(WALLET_RULES.minWithdrawalPence).toFixed(2)}`) };
    }

    const availablePence = state.balance?.available_balance_pence || 0;
    if (amountPence > availablePence) {
      return { error: new Error('Insufficient balance') };
    }

    try {
      // Create withdrawal request
      const { error: insertError } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: userId,
          amount_pence: amountPence,
          status: 'pending',
        });

      if (insertError) throw insertError;

      return { error: null };
    } catch (err) {
      console.error('Error creating withdrawal request:', err);
      return { error: err as Error };
    }
  };

  return {
    ...state,
    availableBalancePounds,
    expiringSoonPounds,
    getMaxCreditForBasket,
    applyCreditsToOrder,
    requestWithdrawal,
    refetch: fetchWalletData,
  };
}

export default useWallet;
