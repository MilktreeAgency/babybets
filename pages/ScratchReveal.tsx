import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Frown, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScratchReveal = () => {
  const { purchasedTickets, revealTicket } = useStore();
  const navigate = useNavigate();

  // Filter for unrevealed instant win tickets
  const unrevealedTickets = purchasedTickets.filter(t => t.instantWin && !t.isRevealed);
  
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

  const handleScratch = () => {
     if (isRevealing) return;
     setIsRevealing(true);
     
     // Simulate scratch animation delay
     setTimeout(() => {
        setIsRevealing(false);
        revealTicket(currentTicket.id);
        setShowResult(true);
        
        if (currentTicket.isWinner) {
           confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
           });
        }
     }, 1500);
  };

  const handleNext = () => {
     setShowResult(false);
     if (currentTicketIndex >= unrevealedTickets.length - 1) {
        // If this was the last one in our local list (note: the list length changes as we reveal, so index 0 is always next)
        // Actually, since unrevealedTickets updates based on store state, we always take index 0 if we filter properly
     }
  };

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
             <h1 className="text-4xl font-bold text-teal-900 mb-2">Scratch to Win</h1>
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
                      
                      {/* Scratch Surface Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-peach-200 to-peach-300 z-20 flex flex-col items-center justify-center transition-opacity duration-700 ${isRevealing ? 'opacity-0 scale-150' : 'opacity-100'}`}>
                         <div className="w-20 h-20 bg-peach-400 rounded-full mb-4 flex items-center justify-center text-white shadow-lg">
                            <Zap size={40} />
                         </div>
                         <p className="font-bold text-teal-900 text-lg uppercase tracking-widest">Tap to Scratch</p>
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
                   className="bg-white rounded-[2rem] p-8 shadow-2xl relative aspect-[3/4] flex flex-col items-center justify-center text-center border-2 border-cream-200"
                >
                   {currentTicket.isWinner ? (
                      <>
                         <div className="w-32 h-32 bg-peach-100 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
                            <Trophy size={64} className="text-peach-500" />
                         </div>
                         <h2 className="text-4xl font-bold text-teal-900 mb-2">YOU WON!</h2>
                         <p className="text-stone-500 mb-6">Congratulations!</p>
                         <div className="bg-peach-50 px-6 py-4 rounded-xl border-2 border-peach-200 mb-8 shadow-sm">
                            <p className="text-xs uppercase font-bold text-peach-500 mb-1">Prize</p>
                            <p className="text-2xl font-bold text-teal-900">{currentTicket.winPrize}</p>
                         </div>
                      </>
                   ) : (
                      <>
                         <div className="w-32 h-32 bg-cream-100 rounded-full flex items-center justify-center mb-6">
                            <Frown size={64} className="text-stone-400" />
                         </div>
                         <h2 className="text-3xl font-bold text-teal-900 mb-2">Unlucky!</h2>
                         <p className="text-stone-500 mb-8">Better luck next time.</p>
                      </>
                   )}

                   <Button onClick={handleNext} className="w-full flex items-center justify-center gap-2">
                      Next Card <ArrowRight size={18} />
                   </Button>
                </motion.div>
             )}
          </AnimatePresence>

          <div className="mt-8 text-center text-stone-400 text-sm font-medium">
             {unrevealedTickets.length} card{unrevealedTickets.length !== 1 ? 's' : ''} remaining
          </div>
       </div>
    </div>
  );
};