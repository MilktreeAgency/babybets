import React from 'react';

interface CloudDecorProps {
  className?: string;
  variant?: 'default' | 'small';
}

export const CloudDecor: React.FC<CloudDecorProps> = ({ className = "", variant = 'default' }) => {
  if (variant === 'small') {
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M30 45c0-7 6-12 13-12 2 0 4 0 5 1 3-5 8-8 14-8 8 0 15 7 15 15 0 1 0 1 0 2 4 1 7 5 7 9 0 6-5 10-10 10H35c-7 0-12-4-12-10 0-4 3-8 7-9 0-1 0-2 0-3z"
          fill="#9DB4B8"
          opacity="0.4"
        />
        <path
          d="M25 65 Q30 62 35 65 M45 65 Q50 62 55 65 M65 65 Q70 62 75 65 M85 65 Q90 62 95 65"
          stroke="#496B71"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M50 70c0-11 9-20 20-20 3 0 6 1 8 2 4-8 12-13 22-13 13 0 24 11 24 24 0 1 0 2 0 3 7 2 12 8 12 15 0 9-7 16-16 16H54c-11 0-20-7-20-16 0-7 5-13 12-15-1-2-1-4-1-6z"
        fill="#9DB4B8"
        opacity="0.3"
      />
      <path
        d="M40 110 Q48 105 56 110 M70 110 Q78 105 86 110 M100 110 Q108 105 116 110 M130 110 Q138 105 146 110"
        stroke="#496B71"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
};




