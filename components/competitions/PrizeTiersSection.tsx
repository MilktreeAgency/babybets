/**
 * Prize Tiers Section Component
 * 
 * Displays expandable list of instant win prizes for a competition
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Gift, Banknote, Ticket, Wallet, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteCreditCard } from '../ui/SiteCreditCard';

interface Prize {
  id: string;
  name: string;
  short_name?: string | null;
  type: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit';
  value_gbp: number;
  cash_alternative_gbp?: number | null;
  total_quantity: number;
  remaining_quantity: number;
  description?: string | null;
  image_url?: string | null;
  tier?: number;
}

interface PrizeTiersSectionProps {
  prizes: Prize[];
  isLoading?: boolean;
}

const PrizeIcon = ({ type }: { type: Prize['type'] }) => {
  switch (type) {
    case 'Physical':
      return <Gift size={18} />;
    case 'Voucher':
      return <Ticket size={18} />;
    case 'Cash':
      return <Banknote size={18} />;
    case 'SiteCredit':
      return <Wallet size={18} />;
    default:
      return <Gift size={18} />;
  }
};

const PrizeTypeLabel = ({ type }: { type: Prize['type'] }) => {
  const labels: Record<Prize['type'], { label: string; color: string }> = {
    Physical: { label: 'Physical Prize', color: 'bg-purple-100 text-purple-700' },
    Voucher: { label: 'Voucher', color: 'bg-blue-100 text-blue-700' },
    Cash: { label: 'Cash', color: 'bg-green-100 text-green-700' },
    SiteCredit: { label: 'Site Credit', color: 'bg-teal-100 text-teal-700' },
  };

  const { label, color } = labels[type];
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${color}`}>
      {label}
    </span>
  );
};

export const PrizeTiersSection: React.FC<PrizeTiersSectionProps> = ({
  prizes,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedPrize, setExpandedPrize] = useState<string | null>(null);

  // Group prizes by tier
  const groupedPrizes = prizes.reduce((acc, prize) => {
    const tier = prize.tier || 1;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(prize);
    return acc;
  }, {} as Record<number, Prize[]>);

  const tierLabels: Record<number, string> = {
    1: 'Top Prizes',
    2: 'Great Prizes',
    3: 'Cash Prizes',
    4: 'Site Credit',
  };

  // Calculate stats
  const totalPrizes = prizes.reduce((sum, p) => sum + p.total_quantity, 0);
  const remainingPrizes = prizes.reduce((sum, p) => sum + p.remaining_quantity, 0);
  const wonPrizes = totalPrizes - remainingPrizes;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-cream-200 p-6 animate-pulse">
        <div className="h-8 bg-cream-100 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-cream-100 rounded-xl"></div>
          <div className="h-20 bg-cream-100 rounded-xl"></div>
          <div className="h-20 bg-cream-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (prizes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-cream-50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Gift size={24} className="text-yellow-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-teal-900">Instant Win Prizes</h3>
            <p className="text-sm text-stone-500">
              {remainingPrizes.toLocaleString()} of {totalPrizes.toLocaleString()} prizes remaining
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <Check size={14} />
              {remainingPrizes} available
            </div>
            {wonPrizes > 0 && (
              <div className="flex items-center gap-1.5 bg-stone-100 text-stone-500 px-3 py-1 rounded-full text-sm font-medium">
                {wonPrizes} won
              </div>
            )}
          </div>
          {isExpanded ? <ChevronUp size={24} className="text-stone-400" /> : <ChevronDown size={24} className="text-stone-400" />}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {Object.entries(groupedPrizes).map(([tier, tierPrizes]) => (
                <div key={tier}>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">
                    {tierLabels[Number(tier)] || `Tier ${tier}`}
                  </h4>
                  <div className="space-y-3">
                    {tierPrizes.map((prize) => {
                      const isExpanded = expandedPrize === prize.id;
                      const isSoldOut = prize.remaining_quantity === 0;
                      const isSiteCredit = prize.type === 'SiteCredit';

                      return (
                        <div
                          key={prize.id}
                          className={`rounded-xl border transition ${
                            isSoldOut 
                              ? 'bg-stone-50 border-stone-200 opacity-60' 
                              : 'bg-cream-50 border-cream-200 hover:border-teal-200'
                          }`}
                        >
                          <button
                            onClick={() => setExpandedPrize(isExpanded ? null : prize.id)}
                            className="w-full p-4 flex items-center gap-4 text-left"
                            disabled={isSoldOut && !prize.description}
                          >
                            {/* Prize Image/Icon */}
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-cream-200 flex-shrink-0 flex items-center justify-center">
                              {isSiteCredit ? (
                                <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                  £{prize.value_gbp}
                                </div>
                              ) : prize.image_url ? (
                                <img
                                  src={prize.image_url}
                                  alt={prize.short_name || prize.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-stone-300">
                                  <PrizeIcon type={prize.type} />
                                </div>
                              )}
                            </div>

                            {/* Prize Info */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className={`font-bold truncate ${isSoldOut ? 'text-stone-500' : 'text-teal-900'}`}>
                                  {prize.short_name || prize.name}
                                </h5>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <PrizeTypeLabel type={prize.type} />
                                {prize.cash_alternative_gbp && (
                                  <span className="text-xs text-stone-400">
                                    or £{prize.cash_alternative_gbp} cash
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity & Value */}
                            <div className="text-right flex-shrink-0">
                              <p className={`font-bold ${isSoldOut ? 'text-stone-400' : 'text-teal-900'}`}>
                                £{prize.value_gbp}
                              </p>
                              <p className={`text-sm ${
                                isSoldOut 
                                  ? 'text-red-500 font-medium' 
                                  : 'text-stone-500'
                              }`}>
                                {isSoldOut ? 'Sold out' : `${prize.remaining_quantity} left`}
                              </p>
                            </div>

                            {/* Expand indicator */}
                            {prize.description && (
                              <ChevronDown
                                size={18}
                                className={`text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            )}
                          </button>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && prize.description && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-0">
                                  <div className="bg-white rounded-lg p-4 border border-cream-200">
                                    <p className="text-sm text-stone-600 whitespace-pre-line">
                                      {prize.description}
                                    </p>
                                    {prize.cash_alternative_gbp && (
                                      <div className="mt-3 pt-3 border-t border-cream-100 flex items-center gap-2 text-sm text-stone-500">
                                        <Banknote size={14} className="text-green-500" />
                                        <span>
                                          Cash alternative available: <strong className="text-green-600">£{prize.cash_alternative_gbp}</strong>
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Info Note */}
              <div className="bg-cream-50 rounded-xl p-4 border border-cream-200 flex items-start gap-3">
                <AlertCircle size={18} className="text-teal-500 shrink-0 mt-0.5" />
                <p className="text-sm text-stone-600">
                  Instant win prizes are randomly allocated to ticket numbers. When you scratch your ticket after purchase, you'll find out immediately if you've won one of these prizes. Every ticket also enters the end prize draw.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrizeTiersSection;
