import React from 'react';

interface SparkleDecorProps {
  className?: string;
}

export const SparkleDecor: React.FC<SparkleDecorProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M30 30 L32 25 L34 30 L39 32 L34 34 L32 39 L30 34 L25 32 Z" 
      fill="#FED0B9" 
      opacity="0.5"
    />
    <path 
      d="M60 20 L61 17 L62 20 L65 21 L62 22 L61 25 L60 22 L57 21 Z" 
      fill="#9DB4B8" 
      opacity="0.6"
    />
    <path 
      d="M75 50 L77 45 L79 50 L84 52 L79 54 L77 59 L75 54 L70 52 Z" 
      fill="#FED0B9" 
      opacity="0.4"
    />
  </svg>
);




