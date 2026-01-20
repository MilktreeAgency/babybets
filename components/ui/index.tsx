import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button Component
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'peach';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm hover:shadow-md border-transparent',
      secondary: 'bg-teal-900 text-white hover:bg-teal-800 shadow-sm border-transparent',
      outline: 'bg-transparent border-2 border-teal-500 text-teal-700 hover:bg-teal-50',
      ghost: 'bg-transparent hover:bg-cream-200 text-teal-700',
      accent: 'bg-peach-300 text-teal-900 hover:bg-peach-400 shadow-sm border-transparent font-bold',
      peach: 'bg-peach-300 text-teal-900 hover:bg-peach-400 shadow-sm border-transparent',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-bold',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

// Badge Component
export const Badge = ({ children, className, variant = 'default' }: { children?: React.ReactNode, className?: string, variant?: 'default' | 'urgent' | 'success' | 'peach' }) => {
  const styles = {
    default: 'bg-teal-50 text-teal-700 border border-teal-100',
    urgent: 'bg-rose-50 text-rose-600 border border-rose-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    peach: 'bg-peach-100 text-teal-800 border border-peach-200'
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider', styles[variant], className)}>
      {children}
    </span>
  );
};

// Progress Bar
export const ProgressBar = ({ value, max, className }: { value: number, max: number, className?: string }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full bg-cream-200 rounded-full h-2.5 overflow-hidden", className)}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("h-full rounded-full", percentage > 85 ? 'bg-peach-500' : 'bg-teal-500')}
      />
    </div>
  );
};

// Trust Item
export const TrustItem = ({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="bg-cream-100 p-4 rounded-full mb-4 text-teal-600">
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h4 className="font-bold text-teal-900 text-lg mb-2">{title}</h4>
    <p className="text-sm text-stone-500 leading-relaxed max-w-[220px]">{desc}</p>
  </div>
);

// Export Modal Components
export { PartnerApplicationModal } from './PartnerApplicationModal';
export { CashAlternativeModal } from './CashAlternativeModal';
export { PrizeClaimModal } from './PrizeClaimModal';

// Export Prize Image Components
export { 
  SiteCreditCard, 
  PrizeImage, 
  isSiteCreditImage, 
  parseSiteCreditAmount 
} from './SiteCreditCard';