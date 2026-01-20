/**
 * Winner Ticker Component
 * 
 * Scrolling banner showing recent winners for social proof
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Gift, Wallet, Banknote } from 'lucide-react';

interface Winner {
  id: string;
  display_name: string;
  location?: string | null;
  prize_name: string;
  prize_value_gbp?: number | null;
  won_at: string;
}

interface WinnerTickerProps {
  winners?: Winner[];
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

// Mock winners for demo
const mockWinners: Winner[] = [
  { id: '1', display_name: 'Sarah J.', location: 'Manchester', prize_name: '£50 Site Credit', prize_value_gbp: 50, won_at: new Date().toISOString() },
  { id: '2', display_name: 'David M.', location: 'Essex', prize_name: 'iCandy Cocoon', prize_value_gbp: 349, won_at: new Date().toISOString() },
  { id: '3', display_name: 'Emma W.', location: 'Bristol', prize_name: '£20 Cash', prize_value_gbp: 20, won_at: new Date().toISOString() },
  { id: '4', display_name: 'James P.', location: 'Leeds', prize_name: 'Rockit Baby Rocker', prize_value_gbp: 40, won_at: new Date().toISOString() },
  { id: '5', display_name: 'Lisa T.', location: 'London', prize_name: '£5 Site Credit', prize_value_gbp: 5, won_at: new Date().toISOString() },
  { id: '6', display_name: 'Michael R.', location: 'Birmingham', prize_name: 'Smyths Voucher', prize_value_gbp: 100, won_at: new Date().toISOString() },
  { id: '7', display_name: 'Sophie B.', location: 'Glasgow', prize_name: '£10 Cash', prize_value_gbp: 10, won_at: new Date().toISOString() },
  { id: '8', display_name: 'Chris K.', location: 'Newcastle', prize_name: '£2 Site Credit', prize_value_gbp: 2, won_at: new Date().toISOString() },
];

const getPrizeIcon = (prizeName: string) => {
  const lower = prizeName.toLowerCase();
  if (lower.includes('credit')) return <Wallet size={14} className="text-teal-500" />;
  if (lower.includes('cash')) return <Banknote size={14} className="text-green-500" />;
  if (lower.includes('voucher')) return <Gift size={14} className="text-blue-500" />;
  return <Trophy size={14} className="text-yellow-500" />;
};

const getTimeAgo = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const WinnerTicker: React.FC<WinnerTickerProps> = ({
  winners = mockWinners,
  speed = 'normal',
  className = '',
}) => {
  const [animationDuration, setAnimationDuration] = useState(15);

  useEffect(() => {
    switch (speed) {
      case 'slow':
        setAnimationDuration(12);
        break;
      case 'fast':
        setAnimationDuration(4);
        break;
      default:
        setAnimationDuration(8);
    }
  }, [speed]);

  // Render content - create single winner item component
  const WinnerItem = ({ winner, idx }: { winner: Winner; idx: number }) => (
    <div
      key={`${winner.id}-${idx}`}
      className="flex items-center gap-3 px-6 shrink-0"
    >
      <div className="flex items-center gap-2">
        {getPrizeIcon(winner.prize_name)}
        <span className="font-bold text-teal-900 whitespace-nowrap">
          {winner.display_name}
        </span>
        {winner.location && (
          <span className="text-stone-400 text-sm whitespace-nowrap">
            from {winner.location}
          </span>
        )}
      </div>
      <span className="text-stone-400">won</span>
      <span className="font-bold text-teal-600 whitespace-nowrap">
        {winner.prize_name}
      </span>
      {winner.prize_value_gbp && winner.prize_value_gbp >= 50 && (
        <span className="text-xs bg-peach-100 text-peach-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
          £{winner.prize_value_gbp}
        </span>
      )}
      <span className="text-xs text-stone-400 whitespace-nowrap">
        {getTimeAgo(winner.won_at)}
      </span>
      <span className="text-stone-200 mx-4">•</span>
    </div>
  );

  return (
    <div className={`overflow-hidden bg-cream-50 border-y border-cream-200 py-3 ${className}`}>
      <style>{`
        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .ticker-wrapper {
          display: flex;
          animation: ticker-scroll ${animationDuration}s linear infinite;
        }
        .ticker-wrapper:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-wrapper">
        {/* First set */}
        <div className="flex shrink-0">
          {winners.map((winner, idx) => (
            <WinnerItem key={`set1-${winner.id}-${idx}`} winner={winner} idx={idx} />
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex shrink-0">
          {winners.map((winner, idx) => (
            <WinnerItem key={`set2-${winner.id}-${idx}`} winner={winner} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Compact ticker for mobile/small spaces
 */
export const WinnerTickerCompact: React.FC<WinnerTickerProps> = ({
  winners = mockWinners,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % winners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [winners.length]);

  const current = winners[currentIndex];

  return (
    <div className={`bg-teal-900 text-white py-2 px-4 ${className}`}>
      <div className="flex items-center justify-center gap-2 text-sm">
        <Trophy size={14} className="text-yellow-400" />
        <span className="font-bold">{current.display_name}</span>
        <span className="text-teal-200">just won</span>
        <span className="font-bold text-peach-300">{current.prize_name}</span>
      </div>
    </div>
  );
};

export default WinnerTicker;
