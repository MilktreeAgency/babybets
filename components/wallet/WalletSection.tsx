/**
 * Wallet Section Component
 * 
 * Full wallet management including balance, transactions, and withdrawals
 */

import React, { useState } from 'react';
import { Wallet, Clock, ArrowDownCircle, ArrowUpCircle, AlertTriangle, Banknote, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '../ui';
import { formatCurrency, penceToPounds, WALLET_RULES } from '../../lib/constants';

// Types for wallet data (works with both mock and real data)
interface WalletCredit {
  id: string;
  amount_pence: number;
  remaining_pence: number;
  description: string;
  expires_at: string;
  source_type: string;
  created_at: string;
}

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'expiry' | 'withdrawal';
  amount_pence: number;
  description: string;
  created_at: string;
}

interface WalletSectionProps {
  availableBalancePence: number;
  expiringSoonPence: number;
  nextExpiryDate?: string;
  credits: WalletCredit[];
  transactions: WalletTransaction[];
  isLoading?: boolean;
  onRequestWithdrawal?: (amountPence: number) => Promise<{ error: Error | null }>;
}

export const WalletSection: React.FC<WalletSectionProps> = ({
  availableBalancePence,
  expiringSoonPence,
  nextExpiryDate,
  credits,
  transactions,
  isLoading = false,
  onRequestWithdrawal,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'balance' | 'history'>('balance');

  const handleWithdraw = async () => {
    if (!onRequestWithdrawal) return;

    const amountPence = Math.round(parseFloat(withdrawAmount) * 100);
    
    if (isNaN(amountPence) || amountPence <= 0) {
      setWithdrawError('Please enter a valid amount');
      return;
    }

    if (amountPence < WALLET_RULES.minWithdrawalPence) {
      setWithdrawError(`Minimum withdrawal is £${penceToPounds(WALLET_RULES.minWithdrawalPence).toFixed(2)}`);
      return;
    }

    if (amountPence > availableBalancePence) {
      setWithdrawError('Insufficient balance');
      return;
    }

    setIsWithdrawing(true);
    const { error } = await onRequestWithdrawal(amountPence);
    setIsWithdrawing(false);

    if (error) {
      setWithdrawError(error.message);
    } else {
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawError('');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-cream-100 rounded-2xl"></div>
        <div className="h-20 bg-cream-100 rounded-xl"></div>
        <div className="h-20 bg-cream-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold font-serif text-teal-900 mb-8">Wallet</h2>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-[2rem] p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-peach-300/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-teal-200 text-sm font-medium">Available Balance</p>
              <p className="text-4xl font-bold">{formatCurrency(availableBalancePence)}</p>
            </div>
          </div>

          {expiringSoonPence > 0 && nextExpiryDate && (
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle size={20} className="text-yellow-300 shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-100">
                  {formatCurrency(expiringSoonPence)} expiring soon
                </p>
                <p className="text-xs text-yellow-200/70">
                  Next expiry: {formatDate(nextExpiryDate)} ({getDaysUntilExpiry(nextExpiryDate)} days)
                </p>
              </div>
            </div>
          )}

          {WALLET_RULES.isWithdrawable && availableBalancePence >= WALLET_RULES.minWithdrawalPence && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 flex items-center justify-center gap-2 font-medium transition"
            >
              <Banknote size={18} />
              Withdraw Cash
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveSubTab('balance')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            activeSubTab === 'balance'
              ? 'bg-teal-100 text-teal-800'
              : 'bg-cream-50 text-stone-500 hover:bg-cream-100'
          }`}
        >
          Credit Breakdown
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            activeSubTab === 'history'
              ? 'bg-teal-100 text-teal-800'
              : 'bg-cream-50 text-stone-500 hover:bg-cream-100'
          }`}
        >
          Transaction History
        </button>
      </div>

      {activeSubTab === 'balance' && (
        <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
          {credits.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={24} className="text-stone-300" />
              </div>
              <p className="text-stone-500 font-medium">No active credits</p>
              <p className="text-sm text-stone-400 mt-1">Win instant prizes to earn site credit!</p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {credits.map((credit) => {
                const daysLeft = getDaysUntilExpiry(credit.expires_at);
                const isExpiringSoon = daysLeft <= 7;
                
                return (
                  <div key={credit.id} className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        credit.source_type === 'instant_win' 
                          ? 'bg-yellow-100 text-yellow-600'
                          : credit.source_type === 'promo'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-teal-100 text-teal-600'
                      }`}>
                        {credit.source_type === 'instant_win' ? '🎉' : '💰'}
                      </div>
                      <div>
                        <p className="font-medium text-teal-900">{credit.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className={isExpiringSoon ? 'text-yellow-500' : 'text-stone-400'} />
                          <span className={`text-xs ${isExpiringSoon ? 'text-yellow-600 font-medium' : 'text-stone-400'}`}>
                            Expires {formatDate(credit.expires_at)} ({daysLeft} days)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-900">{formatCurrency(credit.remaining_pence)}</p>
                      {credit.remaining_pence < credit.amount_pence && (
                        <p className="text-xs text-stone-400">
                          of {formatCurrency(credit.amount_pence)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-stone-300" />
              </div>
              <p className="text-stone-500 font-medium">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' 
                        ? 'bg-green-100 text-green-600'
                        : tx.type === 'debit'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-stone-100 text-stone-500'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownCircle size={20} />
                      ) : (
                        <ArrowUpCircle size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-teal-900">{tx.description}</p>
                      <p className="text-xs text-stone-400 mt-1">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.amount_pence >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount_pence >= 0 ? '+' : ''}{formatCurrency(tx.amount_pence)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-cream-50 rounded-xl border border-cream-200">
        <p className="text-sm text-stone-600">
          <strong className="text-teal-900">How it works:</strong> Site credit can be used to pay up to 50% of your basket. 
          Credits expire after 60 days. {WALLET_RULES.isWithdrawable ? `You can withdraw cash balances over £${penceToPounds(WALLET_RULES.minWithdrawalPence).toFixed(0)}.` : ''}
        </p>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-teal-900">Withdraw Cash</h3>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 hover:bg-cream-50 rounded-lg transition"
                >
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-stone-500 mb-4">
                  Available balance: <span className="font-bold text-teal-900">{formatCurrency(availableBalancePence)}</span>
                </p>

                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">£</span>
                  <input
                    type="number"
                    step="0.01"
                    min={penceToPounds(WALLET_RULES.minWithdrawalPence)}
                    max={penceToPounds(availableBalancePence)}
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value);
                      setWithdrawError('');
                    }}
                    placeholder="0.00"
                    className="w-full p-4 pl-8 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                  />
                </div>
                {withdrawError && (
                  <p className="text-red-500 text-sm mt-2">{withdrawError}</p>
                )}
              </div>

              <div className="bg-cream-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-stone-500">
                  Withdrawals are processed within 3-5 business days. 
                  You'll receive the funds via bank transfer.
                </p>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing || !withdrawAmount}
                className="w-full"
              >
                {isWithdrawing ? 'Processing...' : 'Request Withdrawal'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletSection;
