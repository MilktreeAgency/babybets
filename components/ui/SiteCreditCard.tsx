import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Sparkles } from 'lucide-react';

interface SiteCreditCardProps {
  amount: number | string; // e.g., 5, 2, 1, 0.5 or "50p"
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

/**
 * Styled site credit card component for displaying credit prize images
 * Uses BabyBets brand colors (teal/peach/cream)
 */
export const SiteCreditCard: React.FC<SiteCreditCardProps> = ({
  amount,
  size = 'md',
  className = '',
  animated = true,
}) => {
  // Format amount for display
  const displayAmount = typeof amount === 'number'
    ? amount >= 1 
      ? `£${amount}` 
      : `${Math.round(amount * 100)}p`
    : amount;

  const sizeClasses = {
    sm: 'w-24 h-16',
    md: 'w-40 h-28',
    lg: 'w-56 h-40',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const labelSizes = {
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const CardWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.02 },
  } : {};

  return (
    <CardWrapper
      {...animationProps}
      className={`
        ${sizeClasses[size]}
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
        shadow-lg
        ${className}
      `}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-peach-300 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Sparkle decorations */}
      <Sparkles 
        className="absolute top-2 right-2 text-peach-200 opacity-60" 
        size={size === 'lg' ? 20 : size === 'md' ? 14 : 10} 
      />
      <Sparkles 
        className="absolute bottom-3 left-3 text-peach-200 opacity-40" 
        size={size === 'lg' ? 16 : size === 'md' ? 12 : 8} 
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white p-2">
        {/* Logo/Icon area */}
        <div className="flex items-center gap-1 mb-1">
          <Wallet 
            size={size === 'lg' ? 20 : size === 'md' ? 14 : 10} 
            className="text-peach-200" 
          />
          <span className={`${labelSizes[size]} font-bold text-peach-200 uppercase tracking-wider`}>
            BabyBets
          </span>
        </div>

        {/* Amount */}
        <div className={`${textSizes[size]} font-bold tracking-tight`}>
          {displayAmount}
        </div>

        {/* Label */}
        <div className={`${labelSizes[size]} font-medium text-teal-100 uppercase tracking-widest mt-0.5`}>
          Site Credit
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-peach-300 via-peach-400 to-peach-300" />
    </CardWrapper>
  );
};

/**
 * Get site credit card as an image-like component for prize displays
 */
export const getSiteCreditImage = (amount: number): React.ReactNode => {
  return <SiteCreditCard amount={amount} size="lg" />;
};

/**
 * Check if an image path is a site credit reference
 */
export const isSiteCreditImage = (imagePath: string): boolean => {
  return imagePath.startsWith('site-credit-');
};

/**
 * Parse site credit amount from image path
 * e.g., "site-credit-5" -> 5, "site-credit-50p" -> 0.5
 */
export const parseSiteCreditAmount = (imagePath: string): number => {
  const match = imagePath.match(/site-credit-(\d+(?:p)?)/);
  if (!match) return 0;
  
  const value = match[1];
  if (value.endsWith('p')) {
    return parseInt(value.slice(0, -1)) / 100;
  }
  return parseInt(value);
};

/**
 * Render site credit card or regular image based on path
 */
export const PrizeImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  if (isSiteCreditImage(src)) {
    const amount = parseSiteCreditAmount(src);
    return (
      <div className={`flex items-center justify-center bg-cream-50 rounded-xl ${className}`}>
        <SiteCreditCard amount={amount} size="md" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`object-cover ${className}`}
    />
  );
};

export default SiteCreditCard;
