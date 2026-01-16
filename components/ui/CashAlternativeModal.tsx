import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Banknote, Clock, CheckCircle } from 'lucide-react';
import { Button } from './index';

interface CashAlternativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoice: (choice: 'prize' | 'cash') => void;
  prizeName: string;
  prizeImage: string;
  prizeValue: number;
  cashAlternative: number;
  deadline?: string; // ISO string
}

export const CashAlternativeModal: React.FC<CashAlternativeModalProps> = ({
  isOpen,
  onClose,
  onChoice,
  prizeName,
  prizeImage,
  prizeValue,
  cashAlternative,
  deadline,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<'prize' | 'cash' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    if (!selectedChoice) return;
    setIsConfirming(true);
    
    // Simulate API call
    setTimeout(() => {
      onChoice(selectedChoice);
      setIsConfirming(false);
      onClose();
    }, 500);
  };

  // Calculate days remaining if deadline provided
  const daysRemaining = deadline 
    ? Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 7;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={24} className="text-peach-300" />
              <h2 className="text-xl font-bold">Congratulations!</h2>
            </div>
            <p className="text-teal-100">You've won! Now choose how to claim your prize.</p>
          </div>

          {/* Prize Info */}
          <div className="p-6 border-b border-cream-200">
            <div className="flex gap-4 items-center">
              {prizeImage && !prizeImage.startsWith('site-credit') && (
                <img 
                  src={prizeImage} 
                  alt={prizeName}
                  className="w-20 h-20 object-cover rounded-xl border border-cream-200"
                />
              )}
              <div>
                <p className="text-sm text-stone-500 font-medium">Your Prize</p>
                <h3 className="text-lg font-bold text-teal-900">{prizeName}</h3>
                <p className="text-sm text-stone-400">Worth £{prizeValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Choice Section */}
          <div className="p-6 space-y-4">
            <h4 className="font-bold text-teal-900 mb-4">Choose your reward:</h4>
            
            {/* Prize Option */}
            <button
              onClick={() => setSelectedChoice('prize')}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                selectedChoice === 'prize'
                  ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                  : 'border-cream-200 bg-white hover:border-teal-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedChoice === 'prize' ? 'bg-teal-500 text-white' : 'bg-cream-100 text-teal-700'
                }`}>
                  <Gift size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-teal-900">Take the Prize</p>
                  <p className="text-sm text-stone-500">
                    Receive {prizeName} (worth £{prizeValue})
                  </p>
                </div>
                {selectedChoice === 'prize' && (
                  <CheckCircle className="text-teal-500" size={24} />
                )}
              </div>
            </button>

            {/* Cash Option */}
            <button
              onClick={() => setSelectedChoice('cash')}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                selectedChoice === 'cash'
                  ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                  : 'border-cream-200 bg-white hover:border-teal-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedChoice === 'cash' ? 'bg-teal-500 text-white' : 'bg-cream-100 text-teal-700'
                }`}>
                  <Banknote size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-teal-900">Take Cash Instead</p>
                  <p className="text-sm text-stone-500">
                    Receive £{cashAlternative} cash
                  </p>
                </div>
                {selectedChoice === 'cash' && (
                  <CheckCircle className="text-teal-500" size={24} />
                )}
              </div>
            </button>
          </div>

          {/* Deadline Warning */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 text-sm text-stone-500 bg-cream-50 rounded-xl p-3">
              <Clock size={16} className="text-stone-400" />
              <span>
                {daysRemaining > 0 
                  ? `You have ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} to choose. After that, cash alternative will be selected automatically.`
                  : 'Please make your choice now.'
                }
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Decide Later
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedChoice || isConfirming}
              className="flex-1"
            >
              {isConfirming ? 'Confirming...' : 'Confirm Choice'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CashAlternativeModal;
