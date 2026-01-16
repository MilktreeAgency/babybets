import React from 'react';

interface HeartDecorProps {
  className?: string;
}

export const HeartDecor: React.FC<HeartDecorProps> = ({ className = "" }) => (
  <svg viewBox="0 0 60 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30 48c-1.2-1-12-9.5-12-17.5 0-4.8 3.2-8 7.2-8 2.4 0 4 0.8 4.8 2.4 0.8-1.6 2.4-2.4 4.8-2.4 4 0 7.2 3.2 7.2 8 0 8-10.8 16.5-12 17.5z"
      fill="#FED0B9"
      opacity="0.6"
    />
  </svg>
);




