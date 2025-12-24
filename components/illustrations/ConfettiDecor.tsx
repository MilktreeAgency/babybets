import React from 'react';

interface ConfettiDecorProps {
  className?: string;
}

export const ConfettiDecor: React.FC<ConfettiDecorProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30 L25 20 L30 30 Z" stroke="#e86e40" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M50 15 L56 5 L62 15 Z" stroke="#e86e40" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M75 25 L80 17 L85 25 Z" stroke="#e86e40" strokeWidth="1.5" fill="none" opacity="0.6" />
    <path d="M60 45 L64 38 L68 45 Z" stroke="#e86e40" strokeWidth="1.5" fill="none" opacity="0.3" />
  </svg>
);



