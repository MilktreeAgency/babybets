import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check, Ticket, Trophy } from 'lucide-react';
import { Button } from './index';
import confetti from 'canvas-confetti';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 8 Segments = 45 degrees each
const SEGMENTS = [
  { label: '10% OFF', color: '#496B71', value: 'BABY10', textColor: '#ffffff' },       // Teal -> White Text
  { label: 'Free Entry', color: '#FED0B9', value: 'FREETICKET', textColor: '#151e20' }, // Peach -> Teal Dark Text
  { label: '£10 Credit', color: '#e7e5e4', value: 'CREDIT10', textColor: '#151e20' },  // Stone -> Dark Text
  { label: '15% OFF', color: '#496B71', value: 'BABY15', textColor: '#ffffff' },       // Teal -> White Text
  { label: 'Tech Bundle', color: '#FED0B9', value: 'TECHWIN', textColor: '#151e20' },  // Peach -> Teal Dark Text
  { label: '20% OFF', color: '#496B71', value: 'BABY20', textColor: '#ffffff' },       // Teal -> White Text
  { label: 'Nursery Set', color: '#e7e5e4', value: 'NURSERY', textColor: '#151e20' },  // Stone -> Dark Text
  { label: 'Mystery', color: '#FED0B9', value: 'MYSTERY', textColor: '#151e20' },     // Peach -> Teal Dark Text
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ label: string; value: string | null } | null>(null);
  const [copied, setCopied] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // Logic to ensure they win for the demo
    const minSpins = 5;
    const maxSpins = 8;
    const fullRotations = Math.floor(Math.random() * (maxSpins - minSpins + 1) + minSpins) * 360;
    
    // Weighted probabilities
    const possibleWinners = [0, 1, 2, 3, 4, 0, 5, 2, 3, 7]; 
    const winnerIndex = possibleWinners[Math.floor(Math.random() * possibleWinners.length)];
    
    const segmentCount = SEGMENTS.length;
    const segmentSize = 360 / segmentCount; // 45 degrees
    
    // Random jitter inside the wedge (keep it away from edges)
    const randomOffset = Math.floor(Math.random() * (segmentSize - 10)) + 5; 
    
    // Calculate stop angle
    const stopAngle = fullRotations + (360 - (winnerIndex * segmentSize)) + randomOffset;

    setRotation(stopAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      setResult(SEGMENTS[winnerIndex]);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 99999
      });
    }, 4000); // 4s spin time
  };

  const copyCode = () => {
    if (result?.value) {
      navigator.clipboard.writeText(result.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-teal-950 z-[90] backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: "-50%", y: "-40%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0.8, opacity: 0, x: "-50%", y: "-40%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 w-[90%] max-w-[360px] md:max-w-[420px] bg-white rounded-3xl shadow-2xl z-[100] overflow-hidden border-4 border-peach-200 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-teal-500 p-5 md:p-6 text-center relative flex-shrink-0">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pattern-dots"></div>
               <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 text-teal-200 hover:text-white transition p-2 rounded-full hover:bg-white/10">
                 <X size={20} />
               </button>
               <h2 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">Wait! Feeling Lucky?</h2>
               <p className="text-teal-100 text-xs md:text-sm">Spin to win prizes, discounts & free entries!</p>
            </div>

            <div className="p-5 md:p-8 bg-cream-50 flex flex-col items-center overflow-y-auto no-scrollbar">
              
              {!hasSpun ? (
                <>
                  <div className="relative w-full max-w-[280px] aspect-square mb-6 md:mb-8">
                    {/* Pointer */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-peach-500 filter drop-shadow-md">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22L12 2M12 22L7 12M12 22L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 2L9 7H15L12 2Z" />
                      </svg>
                    </div>

                    {/* Wheel */}
                    <div 
                      ref={wheelRef}
                      className="w-full h-full rounded-full border-[6px] border-white shadow-xl relative overflow-hidden transition-transform cubic-bezier(0.25, 0.1, 0.25, 1)"
                      style={{ 
                        transform: `rotate(${rotation}deg)`,
                        transitionDuration: '4s',
                        background: `conic-gradient(
                          ${SEGMENTS[0].color} 0deg 45deg,
                          ${SEGMENTS[1].color} 45deg 90deg,
                          ${SEGMENTS[2].color} 90deg 135deg,
                          ${SEGMENTS[3].color} 135deg 180deg,
                          ${SEGMENTS[4].color} 180deg 225deg,
                          ${SEGMENTS[5].color} 225deg 270deg,
                          ${SEGMENTS[6].color} 270deg 315deg,
                          ${SEGMENTS[7].color} 315deg 360deg
                        )`
                      }}
                    >
                      {/* Labels - Radiating from center to outside */}
                      {SEGMENTS.map((seg, i) => (
                         <div 
                           key={i}
                           className="absolute top-1/2 left-1/2 w-[50%] h-[20px] origin-left flex items-center justify-start pl-8 md:pl-10 pr-2"
                           style={{ 
                             transform: `translateY(-50%) rotate(${i * 45 + 22.5 - 90}deg)`, 
                             zIndex: 10
                           }}
                         >
                            <span 
                              className="font-bold uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap truncate"
                              style={{ 
                                color: seg.textColor,
                                textShadow: '0 1px 1px rgba(0,0,0,0.05)'
                              }}
                            >
                              {seg.label}
                            </span>
                         </div>
                      ))}
                    </div>
                    
                    {/* Center Pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-teal-50 z-10">
                       <div className="w-8 h-8 md:w-9 md:h-9 bg-peach-400 rounded-full animate-pulse shadow-inner"></div>
                    </div>
                  </div>

                  <Button 
                    onClick={spin} 
                    disabled={isSpinning} 
                    size="lg" 
                    className="w-full shadow-xl shadow-teal-200 py-4 text-base md:text-lg"
                  >
                    {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                  </Button>
                </>
              ) : (
                <div className="text-center w-full py-2">
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-peach-500 animate-bounce">
                      {result?.label.includes('Credit') || result?.label.includes('Entry') || result?.label.includes('Bundle') ? (
                          <Trophy size={32} className="md:w-10 md:h-10" />
                      ) : (
                          <Gift size={32} className="md:w-10 md:h-10" />
                      )}
                   </div>
                   
                   <h3 className="text-xl md:text-2xl font-bold text-teal-900 mb-2">
                     You Won!
                   </h3>
                   
                   <p className="text-sm md:text-base text-stone-500 mb-6">
                     You've unlocked <strong>{result?.label}</strong>. Use the code below at checkout.
                   </p>

                   {result?.value && (
                     <div className="bg-white p-3 md:p-4 rounded-xl border-2 border-dashed border-teal-200 mb-6 flex items-center justify-between gap-2 shadow-inner">
                        <div className="flex flex-col items-start">
                           <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Promo Code</span>
                           <code className="text-lg md:text-xl font-bold text-teal-900 font-mono tracking-widest">{result.value}</code>
                        </div>
                        <button 
                          onClick={copyCode}
                          className="p-3 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                     </div>
                   )}

                   <Button onClick={onClose} className="w-full shadow-lg shadow-teal-200/50">
                     Start Shopping
                   </Button>
                   
                   {result?.value && (
                     <p className="text-[10px] md:text-xs text-stone-400 mt-4">Code expires in 15 minutes.</p>
                   )}
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};