import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button, Badge } from '../components/ui';
import { Ticket, CreditCard, User, LogOut, Zap, Trophy, Gift, X, CheckCircle, ArrowRight, Frown, Plus, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PurchasedTicket } from '../types';
import { WalletSection } from '../components/wallet';

interface GroupedCompetition {
  id: string;
  title: string;
  image: string;
  isInstant?: boolean;
  tickets: PurchasedTicket[];
}

// --- Scratch Game Overlay Component ---
const ScratchGameOverlay = ({ 
  tickets, 
  onClose, 
  onReveal 
}: { 
  tickets: PurchasedTicket[], 
  onClose: () => void, 
  onReveal: (id: string) => void 
}) => {
  // Use state to track the specific ticket being played/viewed
  // This prevents UI jumping to the next ticket's data while viewing the result of the current one
  const firstUnrevealed = tickets.find(t => !t.isRevealed);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(firstUnrevealed?.id || null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // If we haven't initialized a ticket ID yet, try to set it to the first unrevealed one
  useEffect(() => {
    if (!currentTicketId && firstUnrevealed) {
      setCurrentTicketId(firstUnrevealed.id);
    }
  }, [firstUnrevealed, currentTicketId]);

  // Derive the ticket object from the ID. 
  // IMPORTANT: We look it up in the 'tickets' prop which gets updated by the parent store.
  // Even if it becomes revealed in the store, we can still find it here to show the result.
  const activeTicket = tickets.find(t => t.id === currentTicketId);

  // If no active ticket is selected and there are no unrevealed tickets left, show summary
  const isFinished = !activeTicket && !firstUnrevealed;

  const handleScratch = () => {
     if (isRevealing || !activeTicket) return;
     setIsRevealing(true);
     
     // Simulate scratch effect
     setTimeout(() => {
        setIsRevealing(false);
        onReveal(activeTicket.id); // This triggers parent re-render -> new 'tickets' prop with isRevealed=true
        setShowResult(true);
        
        if (activeTicket.isWinner) {
           confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              zIndex: 9999
           });
        }
     }, 1200);
  };

  const handleNext = () => {
     // Find the next unrevealed ticket.
     // Note: activeTicket is now revealed (in the 'tickets' prop), so firstUnrevealed will be the next one
     if (firstUnrevealed) {
        setCurrentTicketId(firstUnrevealed.id);
        setShowResult(false);
     } else {
        // No more tickets
        setCurrentTicketId(null);
     }
  };

  // Summary State (All Done)
  if (isFinished) {
      const wonTickets = tickets.filter(t => t.isWinner);
      const totalWon = wonTickets.reduce((acc, t) => {
          // Extract amount if possible, simplified parsing
          const amount = t.winPrize?.match(/\d+/)?.[0] || '0';
          return acc + parseInt(amount);
      }, 0);

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 max-w-md w-full text-center relative mx-4 shadow-2xl"
        >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full text-stone-400">
               <X size={24} />
            </button>
            
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <CheckCircle size={40} />
            </div>
            
            <h2 className="text-3xl font-bold font-serif text-teal-900 mb-2">All Done!</h2>
            <p className="text-stone-500 mb-8">You've scratched all cards for this competition.</p>
            
            {wonTickets.length > 0 ? (
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                  <p className="text-stone-600 font-medium mb-1">Total Winnings</p>
                  <p className="text-3xl font-bold text-teal-900">£{totalWon}</p>
               </div>
            ) : (
               <p className="text-stone-400 text-sm mb-8">No wins this time, but you're still in the main draw!</p>
            )}
            
            <Button onClick={onClose} className="w-full">Return to Dashboard</Button>
        </motion.div>
      );
  }

  // Safety fallback if activeTicket is missing but we're not finished (shouldn't happen with effects)
  if (!activeTicket) return null;

  return (
    <div className="relative w-full max-w-sm mx-auto perspective-1000">
        {/* Header / Context */}
        <div className="text-center text-white mb-8">
            <Badge variant="urgent" className="mb-4 bg-yellow-400 text-teal-900 border-none shadow-lg animate-pulse">
                <Zap size={12} fill="currentColor" className="mr-1" /> Instant Win
            </Badge>
            <h3 className="text-2xl font-bold">{activeTicket.competitionTitle}</h3>
            <p className="text-teal-200 text-sm font-mono mt-1">Ticket #{activeTicket.ticketNumber}</p>
        </div>

        {/* Game Card */}
        <div className="relative aspect-[3/4]">
             <AnimatePresence mode="wait">
                 {!showResult ? (
                    <motion.div 
                       key="scratch-surface"
                       initial={{ rotateY: -90, opacity: 0 }}
                       animate={{ rotateY: 0, opacity: 1 }}
                       exit={{ rotateY: 90, opacity: 0 }}
                       transition={{ duration: 0.3 }}
                       className="absolute inset-0 bg-white rounded-[2rem] p-2 shadow-2xl cursor-pointer"
                       onClick={handleScratch}
                    >
                       <div className="h-full w-full rounded-[1.5rem] bg-stone-200 relative overflow-hidden flex flex-col items-center justify-center border-4 border-dashed border-stone-300 group hover:border-teal-400 transition-colors">
                          <div className={`absolute inset-0 bg-stone-300 z-20 flex flex-col items-center justify-center transition-all duration-700 ${isRevealing ? 'opacity-0 scale-150' : 'opacity-100'}`}>
                             <div className="w-20 h-20 bg-stone-400 rounded-full mb-4 flex items-center justify-center text-stone-200 shadow-inner">
                                <Zap size={40} />
                             </div>
                             <p className="font-bold text-stone-500 text-lg uppercase tracking-widest">Tap to Scratch</p>
                          </div>
                          <div className="text-center p-6">
                             <div className="font-bold text-stone-300 text-6xl mb-4">?</div>
                          </div>
                       </div>
                    </motion.div>
                 ) : (
                    <motion.div 
                       key="result-card"
                       initial={{ rotateY: 90, opacity: 0 }}
                       animate={{ rotateY: 0, opacity: 1 }}
                       className="absolute inset-0 bg-white rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center"
                    >
                       {activeTicket.isWinner ? (
                          <>
                             <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <Trophy size={48} className="text-yellow-500" />
                             </div>
                             <h2 className="text-3xl font-bold font-serif text-teal-900 mb-2">YOU WON!</h2>
                             <div className="bg-teal-50 px-6 py-3 rounded-xl border border-teal-100 mb-6 w-full">
                                <p className="text-[10px] uppercase font-bold text-teal-400 mb-1">Prize</p>
                                <p className="text-xl font-bold text-teal-900">{activeTicket.winPrize}</p>
                             </div>
                          </>
                       ) : (
                          <>
                             <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                                <Frown size={48} className="text-stone-400" />
                             </div>
                             <h2 className="text-2xl font-bold font-serif text-stone-800 mb-2">Unlucky!</h2>
                             <p className="text-stone-500 mb-6 text-sm">Better luck on the next one.</p>
                          </>
                       )}
                       
                       <Button onClick={handleNext} className="w-full">
                          Next Card <ArrowRight size={16} className="ml-2" />
                       </Button>
                    </motion.div>
                 )}
             </AnimatePresence>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="mt-8 flex items-center justify-center gap-2 text-white/50 hover:text-white mx-auto text-sm font-medium transition-colors"
        >
            <X size={16} /> Close Game
        </button>
    </div>
  );
};


export const Account = () => {
  const { purchasedTickets, revealTicket, walletCredits } = useStore();
  const [activeTab, setActiveTab] = useState<'tickets' | 'wallet' | 'details'>('tickets');
  const [scratchCompId, setScratchCompId] = useState<string | null>(null);

  // Group tickets logic
  const groupedTickets = purchasedTickets.reduce<Record<string, GroupedCompetition>>((acc, ticket) => {
    if (!acc[ticket.competitionId]) {
      acc[ticket.competitionId] = {
        id: ticket.competitionId,
        title: ticket.competitionTitle,
        image: ticket.image,
        isInstant: ticket.instantWin,
        tickets: []
      };
    }
    acc[ticket.competitionId].tickets.push(ticket);
    return acc;
  }, {});

  const handleOpenScratch = (compId: string) => {
     setScratchCompId(compId);
  };

  const handleCloseScratch = () => {
     setScratchCompId(null);
  };

  return (
    <div className="min-h-screen bg-cream-50 py-12 relative">
      
      {/* Scratch Game Modal Overlay */}
      <AnimatePresence>
        {scratchCompId && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-teal-900/95 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <ScratchGameOverlay 
                    tickets={groupedTickets[scratchCompId]?.tickets || []}
                    onClose={handleCloseScratch}
                    onReveal={revealTicket}
                />
            </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="col-span-1">
             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-cream-200 sticky top-24">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">
                      JD
                   </div>
                   <div>
                      <h3 className="font-bold text-teal-900">Jane Doe</h3>
                      <p className="text-xs text-stone-500">Member since 2023</p>
                   </div>
                </div>
                
                <nav className="space-y-2">
                   <button 
                     onClick={() => setActiveTab('tickets')}
                     className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition ${activeTab === 'tickets' ? 'bg-teal-50 text-teal-600' : 'text-stone-500 hover:bg-cream-50'}`}
                   >
                     <Ticket size={18} /> My Tickets
                   </button>
                   <button 
                     onClick={() => setActiveTab('wallet')}
                     className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition ${activeTab === 'wallet' ? 'bg-teal-50 text-teal-600' : 'text-stone-500 hover:bg-cream-50'}`}
                   >
                     <Wallet size={18} /> Wallet
                   </button>
                   <button 
                     onClick={() => setActiveTab('details')}
                     className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition ${activeTab === 'details' ? 'bg-teal-50 text-teal-600' : 'text-stone-500 hover:bg-cream-50'}`}
                   >
                     <User size={18} /> Account Details
                   </button>
                </nav>

                <div className="border-t border-cream-200 mt-8 pt-8">
                   <button className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold text-rose-400 hover:bg-rose-50 transition">
                      <LogOut size={18} /> Sign Out
                   </button>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3">
             {activeTab === 'tickets' && (
                <div>
                   <h2 className="text-3xl font-bold font-serif text-teal-900 mb-8">My Tickets</h2>
                   
                   {purchasedTickets.length === 0 ? (
                      <div className="bg-white rounded-[2rem] p-12 text-center border border-cream-200">
                         <div className="w-20 h-20 bg-cream-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                            <Ticket size={40} />
                         </div>
                         <h3 className="text-xl font-bold font-serif text-stone-600 mb-2">No tickets yet</h3>
                         <p className="text-stone-400 mb-8">You haven't entered any competitions yet.</p>
                         <Link to="/competitions">
                           <Button>Browse Prizes</Button>
                         </Link>
                      </div>
                   ) : (
                      <div className="space-y-6">
                         {Object.entries(groupedTickets).map(([compId, group]) => (
                            <div key={compId} className="bg-white rounded-3xl p-6 shadow-sm border border-cream-200">
                               <div className="flex flex-col md:flex-row gap-6">
                                  <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                                     <img src={group.image} alt={group.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-grow">
                                     <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold font-serif text-xl text-teal-900">{group.title}</h3>
                                        {group.isInstant && (
                                           <Badge variant="urgent" className="flex items-center gap-1 bg-yellow-100 text-teal-900 border-yellow-200">
                                              <Zap size={10} fill="currentColor" /> Instant Win
                                           </Badge>
                                        )}
                                     </div>
                                     <p className="text-stone-500 text-sm mb-6">Purchased on {new Date(group.tickets[0].purchaseDate).toLocaleDateString()}</p>
                                     
                                     <div className="bg-cream-50 rounded-xl p-4">
                                        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Your Ticket Numbers</div>
                                        <div className="flex flex-wrap gap-2">
                                           {group.tickets.map((t) => (
                                              <span 
                                                  key={t.id} 
                                                  className={`border font-mono font-bold px-3 py-1 rounded-lg text-sm shadow-sm flex items-center gap-1.5 ${t.isWinner 
                                                      ? 'bg-yellow-100 border-yellow-300 text-teal-900' 
                                                      : 'bg-white border-cream-200 text-teal-900'}`}
                                              >
                                                 {t.ticketNumber}
                                                 {t.isWinner && <Trophy size={12} className="text-yellow-600" />}
                                              </span>
                                           ))}
                                        </div>
                                     </div>

                                     {group.isInstant && (
                                        <div className="mt-6 flex justify-end">
                                            {group.tickets.some((t) => !t.isRevealed) ? (
                                              <Button 
                                                  onClick={() => handleOpenScratch(group.id)} 
                                                  variant="accent" 
                                                  className="bg-yellow-400 hover:bg-yellow-300 text-teal-900 shadow-md animate-pulse"
                                              >
                                                   <Zap size={18} fill="currentColor" className="mr-2" />
                                                   Scratch Cards Available!
                                              </Button>
                                            ) : (
                                              <Button variant="ghost" disabled className="opacity-50">
                                                 All Cards Revealed
                                              </Button>
                                            )}
                                        </div>
                                     )}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             )}

             {activeTab === 'wallet' && (
                <WalletSection
                  availableBalancePence={walletCredits.reduce((sum, c) => sum + (c.remainingGBP * 100), 0)}
                  expiringSoonPence={walletCredits
                    .filter(c => {
                      const daysLeft = Math.ceil((new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return daysLeft <= 7 && daysLeft > 0;
                    })
                    .reduce((sum, c) => sum + (c.remainingGBP * 100), 0)
                  }
                  nextExpiryDate={walletCredits.length > 0 
                    ? walletCredits.reduce((earliest, c) => 
                        new Date(c.expiresAt) < new Date(earliest) ? c.expiresAt : earliest, 
                        walletCredits[0].expiresAt
                      )
                    : undefined
                  }
                  credits={walletCredits.map(c => ({
                    id: c.id,
                    amount_pence: c.amountGBP * 100,
                    remaining_pence: c.remainingGBP * 100,
                    description: c.description,
                    expires_at: c.expiresAt,
                    source_type: 'instant_win',
                    created_at: c.issuedAt,
                  }))}
                  transactions={[]}
                  onRequestWithdrawal={async (amountPence) => {
                    // For now, just show a message - actual implementation needs backend
                    console.log('Withdrawal requested:', amountPence);
                    return { error: null };
                  }}
                />
             )}
             
             {activeTab === 'details' && (
                 <div className="bg-white rounded-[2rem] p-8 border border-cream-200">
                    <h2 className="text-3xl font-bold font-serif text-teal-900 mb-8">Account Details</h2>
                    <form className="space-y-6 max-w-lg">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-bold uppercase text-stone-400 mb-2">First Name</label>
                             <input type="text" defaultValue="Jane" className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Last Name</label>
                             <input type="text" defaultValue="Doe" className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Email Address</label>
                          <input type="email" defaultValue="jane@example.com" className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200" />
                       </div>
                       <Button>Save Changes</Button>
                    </form>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};