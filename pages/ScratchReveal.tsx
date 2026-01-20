import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button, CashAlternativeModal, SiteCreditCard } from '../components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Frown, ArrowRight, Zap, CheckCircle, Wallet, Gift, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PurchasedTicket } from '../types';

// Mock prize data for demo - in production this would come from backend
const getPrizeDetails = (ticket: PurchasedTicket) => {
  if (!ticket.isWinner || !ticket.winPrize) return null;
  
  // Map prize names to details
  const prizeMap: Record<string, { image: string; value: number; cashAlt?: number }> = {
    'iCandy Peach 7': { image: '/images/competitions/PRIZE 1 ICANDY PEACH 7.png', value: 1598, cashAlt: 1400 },
    'iCandy Cocoon': { image: '/images/competitions/PRIZE 2 ICANDY COOON.png', value: 349, cashAlt: 300 },
    'iCandy Pip': { image: '/images/competitions/PRIZE 3 ICANDY PIP PUSHCHAIR.png', value: 364, cashAlt: 300 },
    'Smyths Voucher': { image: '/images/competitions/PRIZE 4 SMYTHS TOY VOUCHER.png', value: 100, cashAlt: 90 },
    'Rockit Rocker': { image: '/images/competitions/PRIZE 5 ROCKIT BABY ROCKER.png', value: 40, cashAlt: 30 },
    '£50 Cash': { image: '', value: 50 },
    '£20 Cash': { image: '', value: 20 },
    '£10 Cash': { image: '', value: 10 },
    '£5 Site Credit': { image: 'site-credit-5', value: 5 },
    '£2 Site Credit': { image: 'site-credit-2', value: 2 },
    '£1 Site Credit': { image: 'site-credit-1', value: 1 },
    '50p Site Credit': { image: 'site-credit-50p', value: 0.5 },
  };
  
  return prizeMap[ticket.winPrize] || { image: '', value: 0 };
};

export const ScratchReveal = () => {
  const { purchasedTickets, revealTicket, addWalletCredit } = useStore();
  const navigate = useNavigate();

  // Filter for unrevealed instant win tickets
  const unrevealedTickets = purchasedTickets.filter(t => t.instantWin && !t.isRevealed);
  
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showCashAltModal, setShowCashAltModal] = useState(false);
  const [creditAdded, setCreditAdded] = useState(false);

  // If no tickets to reveal, show summary or redirect
  if (unrevealedTickets.length === 0 && purchasedTickets.some(t => t.instantWin)) {
      // Show summary of recently revealed
      return (
        <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4 relative overflow-hidden">
             {/* Soft background decoration */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-peach-100/40 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl"></div>
             
             <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full text-center relative z-10 shadow-xl border border-cream-200">
                 <div className="w-20 h-20 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-6 text-peach-500">
                    <CheckCircle size={40} />
                 </div>
                 <h2 className="text-3xl font-bold text-teal-900 mb-4">All Set!</h2>
                 <p className="text-stone-500 mb-8">You've scratched all your instant win cards. Check your account for any prizes won.</p>
                 <div className="flex gap-4 justify-center">
                    <Link to="/account">
                       <Button>Go to My Account</Button>
                    </Link>
                    <Link to="/">
                       <Button variant="ghost">Home</Button>
                    </Link>
                 </div>
             </div>
        </div>
      );
  } else if (purchasedTickets.length === 0 || !purchasedTickets.some(t => t.instantWin)) {
     return <div className="min-h-screen flex items-center justify-center">Redirecting... {setTimeout(() => navigate('/'), 1000) && ''}</div>
  }

  const currentTicket = unrevealedTickets[currentTicketIndex];

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate([30, 20, 30]);
          break;
        case 'success':
          navigator.vibrate([50, 30, 100, 30, 150]);
          break;
      }
    }
  };

  // Get prize tier label
  const getPrizeTier = (prizeType?: string, value?: number): { label: string; color: string } | null => {
    if (!prizeType) return null;
    
    if (prizeType === 'physical' || (value && value >= 100)) {
      return { label: 'TIER 1', color: 'bg-purple-500' };
    } else if (prizeType === 'voucher' || (value && value >= 20)) {
      return { label: 'TIER 2', color: 'bg-blue-500' };
    } else if (prizeType === 'cash') {
      return { label: 'TIER 3', color: 'bg-green-500' };
    } else if (prizeType === 'credit') {
      return { label: 'BONUS', color: 'bg-teal-500' };
    }
    return null;
  };

  const handleScratch = () => {
     if (isRevealing) return;
     setIsRevealing(true);
     setCreditAdded(false);
     
     // Haptic feedback on scratch start
     triggerHaptic('light');
     
     // Simulate scratch animation delay
     setTimeout(() => {
        setIsRevealing(false);
        revealTicket(currentTicket.id);
        setShowResult(true);
        
        if (currentTicket.isWinner) {
           // Strong haptic feedback on win
           triggerHaptic('success');
           
           confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
           });
           
           // If it's a site credit prize, automatically add it to wallet
           if (currentTicket.prizeType === 'credit' && currentTicket.prizeAmount) {
              addWalletCredit({
                amountGBP: currentTicket.prizeAmount,
                sourceCompetitionId: currentTicket.competitionId,
                sourceTicketId: currentTicket.id,
                description: `Won ${currentTicket.winPrize} from ${currentTicket.competitionTitle}`,
              });
              setCreditAdded(true);
           }
        }
     }, 1500);
  };

  const handleNext = () => {
     setShowResult(false);
     setCreditAdded(false);
     // The unrevealedTickets list updates automatically from the store
  };

  const handleCashAltChoice = (choice: 'prize' | 'cash') => {
    // In production, this would update the ticket's prizeChoice in the backend
    console.log(`User chose: ${choice} for ticket ${currentTicket.id}`);
    setShowCashAltModal(false);
  };

  // Get prize details for current ticket
  const prizeDetails = currentTicket ? getPrizeDetails(currentTicket) : null;
  const hasCashAlternative = currentTicket?.hasCashAlternative && prizeDetails?.cashAlt;

  return (
    <div className="min-h-screen bg-cream-100 py-12 flex flex-col items-center justify-center relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-peach-200/50 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-200/50 rounded-full blur-[150px]"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-peach-100/40 rounded-full blur-[120px]"></div>
       </div>

       <div className="relative z-10 max-w-md w-full px-4">
          <div className="text-center mb-8">
             <div className="inline-flex items-center gap-2 bg-peach-300 text-teal-900 px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-sm mb-4 shadow-lg animate-pulse border-2 border-peach-400">
                <Zap size={16} fill="currentColor" /> Instant Win Stage
             </div>
             <h1 className="text-4xl font-bold text-teal-900 mb-2">Tap to Reveal</h1>
             <p className="text-stone-500 font-medium">Ticket: {currentTicket.ticketNumber}</p>
          </div>

          <AnimatePresence mode="wait">
             {!showResult ? (
                <motion.div 
                   key="card"
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   className="bg-white rounded-[2rem] p-2 shadow-2xl relative aspect-[3/4] cursor-pointer border-2 border-cream-200"
                   onClick={handleScratch}
                >
                   <div className="h-full w-full rounded-[1.5rem] bg-cream-50 relative overflow-hidden flex flex-col items-center justify-center border-4 border-dashed border-peach-200 group hover:border-peach-400 transition-colors">
                      
                      {/* Reveal Surface Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-peach-200 to-peach-300 z-20 flex flex-col items-center justify-center transition-opacity duration-700 ${isRevealing ? 'opacity-0 scale-150' : 'opacity-100'}`}>
                         <div className="w-20 h-20 bg-peach-400 rounded-full mb-4 flex items-center justify-center text-white shadow-lg">
                            <Zap size={40} />
                         </div>
                         <p className="font-bold text-teal-900 text-lg uppercase tracking-widest">Tap to Reveal</p>
                      </div>

                      {/* Content Underneath (Visually hidden until revealed but we render it for structure) */}
                      <div className="text-center p-6">
                         <div className="font-bold text-peach-300 text-6xl mb-4">?</div>
                      </div>
                   </div>
                </motion.div>
             ) : (
                <motion.div 
                   key="result"
                   initial={{ rotateY: 90 }}
                   animate={{ rotateY: 0 }}
                   className="bg-white rounded-[2rem] p-8 shadow-2xl relative flex flex-col items-center justify-center text-center border-2 border-cream-200"
                   style={{ minHeight: '480px' }}
                >
                   {currentTicket.isWinner ? (
                      <>
                         {/* Tier Badge */}
                         {(() => {
                           const tier = getPrizeTier(currentTicket.prizeType, prizeDetails?.value);
                           return tier ? (
                             <div className={`${tier.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider`}>
                               {tier.label}
                             </div>
                           ) : null;
                         })()}
                         
                         {/* Prize Type Icon */}
                         <div className="w-24 h-24 bg-peach-100 rounded-full flex items-center justify-center mb-4 animate-bounce shadow-lg">
                            {currentTicket.prizeType === 'credit' ? (
                              <Wallet size={48} className="text-teal-500" />
                            ) : currentTicket.prizeType === 'cash' ? (
                              <Banknote size={48} className="text-green-500" />
                            ) : (
                              <Trophy size={48} className="text-peach-500" />
                            )}
                         </div>
                         
                         <h2 className="text-3xl font-bold text-teal-900 mb-2">YOU WON!</h2>
                         <p className="text-stone-500 mb-4">Congratulations!</p>
                         
                         {/* Prize Display */}
                         <div className="w-full mb-6">
                            {currentTicket.prizeType === 'credit' && currentTicket.prizeAmount ? (
                              <div className="flex flex-col items-center">
                                <SiteCreditCard amount={currentTicket.prizeAmount} size="md" />
                                {creditAdded && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 w-full"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Wallet size={20} className="text-green-600" />
                                      </div>
                                      <div className="text-left">
                                        <p className="font-bold text-green-800">Added to Wallet!</p>
                                        <p className="text-sm text-green-600">Available to use on your next purchase</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            ) : (
                              <div className="bg-peach-50 px-6 py-4 rounded-xl border-2 border-peach-200 shadow-sm">
                                <p className="text-xs uppercase font-bold text-peach-500 mb-1">Prize</p>
                                <p className="text-xl font-bold text-teal-900">{currentTicket.winPrize}</p>
                                {prizeDetails?.value && (
                                  <p className="text-sm text-stone-500 mt-1">Worth £{prizeDetails.value}</p>
                                )}
                              </div>
                            )}
                         </div>
                         
                         {/* Cash Alternative Option */}
                         {hasCashAlternative && prizeDetails?.cashAlt && (
                           <button
                             onClick={() => setShowCashAltModal(true)}
                             className="w-full mb-4 p-4 bg-cream-50 rounded-xl border border-cream-200 text-left hover:bg-cream-100 transition"
                           >
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                   <Banknote size={20} className="text-green-600" />
                                 </div>
                                 <div>
                                   <p className="font-medium text-teal-900">Cash Alternative Available</p>
                                   <p className="text-sm text-stone-500">Take £{prizeDetails.cashAlt} instead</p>
                                 </div>
                               </div>
                               <ArrowRight size={18} className="text-stone-400" />
                             </div>
                           </button>
                         )}
                         
                         <Button onClick={handleNext} className="w-full flex items-center justify-center gap-2">
                            {unrevealedTickets.length > 1 ? (
                              <>Next Card <ArrowRight size={18} /></>
                            ) : (
                              'Done'
                            )}
                         </Button>
                      </>
                   ) : (
                      <>
                         <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mb-6">
                            <Frown size={48} className="text-stone-400" />
                         </div>
                         <h2 className="text-3xl font-bold text-teal-900 mb-2">Unlucky!</h2>
                         <p className="text-stone-500 mb-4">Better luck next time.</p>
                         <p className="text-sm text-stone-400 mb-8">
                            Remember, you're still in the end prize draw!
                         </p>
                         
                         <Button onClick={handleNext} className="w-full flex items-center justify-center gap-2">
                            {unrevealedTickets.length > 1 ? (
                              <>Next Card <ArrowRight size={18} /></>
                            ) : (
                              'Done'
                            )}
                         </Button>
                      </>
                   )}
                </motion.div>
             )}
          </AnimatePresence>

          <div className="mt-8 text-center text-stone-400 text-sm font-medium">
             {unrevealedTickets.length} card{unrevealedTickets.length !== 1 ? 's' : ''} remaining
          </div>
       </div>
       
       {/* Cash Alternative Modal */}
       {currentTicket && prizeDetails && hasCashAlternative && (
         <CashAlternativeModal
           isOpen={showCashAltModal}
           onClose={() => setShowCashAltModal(false)}
           onChoice={handleCashAltChoice}
           prizeName={currentTicket.winPrize || ''}
           prizeImage={prizeDetails.image}
           prizeValue={prizeDetails.value}
           cashAlternative={prizeDetails.cashAlt || 0}
         />
       )}
    </div>
  );
};