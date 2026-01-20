/**
 * Prize Claim Modal Component
 * 
 * Allows users to claim physical prizes or choose cash alternative
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Banknote, Truck, CheckCircle, MapPin } from 'lucide-react';
import { Button } from './index';
import { useStore } from '../../store';

interface PrizeClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: {
    id: string;
    name: string;
    valueGBP: number;
    cashAlternativeGBP?: number;
    image?: string;
    type: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit';
  };
  ticketId: string;
  competitionId: string;
}

export const PrizeClaimModal: React.FC<PrizeClaimModalProps> = ({
  isOpen,
  onClose,
  prize,
  ticketId,
  competitionId,
}) => {
  const { addWalletCredit } = useStore();
  const [choice, setChoice] = useState<'physical' | 'cash' | null>(null);
  const [step, setStep] = useState<'choice' | 'address' | 'success'>('choice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Address form state
  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postcode: '',
    phone: '',
  });

  const hasCashAlternative = prize.cashAlternativeGBP && prize.cashAlternativeGBP > 0;
  const cashAmount = prize.cashAlternativeGBP || prize.valueGBP;

  const handleChoiceSubmit = () => {
    if (choice === 'cash') {
      // Credit wallet automatically
      addWalletCredit({
        amountGBP: cashAmount,
        sourceCompetitionId: competitionId,
        sourceTicketId: ticketId,
        description: `Cash alternative for ${prize.name}`,
      });
      setStep('success');
    } else if (choice === 'physical') {
      setStep('address');
    }
  };

  const handleAddressSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call to create prize fulfillment record
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would call Supabase to create fulfillment record
    console.log('Prize claim submitted:', {
      prizeId: prize.id,
      ticketId,
      competitionId,
      choice: 'physical',
      address,
    });
    
    setIsSubmitting(false);
    setStep('success');
  };

  const handleClose = () => {
    setChoice(null);
    setStep('choice');
    setAddress({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      county: '',
      postcode: '',
      phone: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-cream-200 p-6 flex justify-between items-center rounded-t-[2rem]">
                <h2 className="text-xl font-bold text-teal-900">Claim Your Prize</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-cream-50 rounded-lg transition"
                >
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              <div className="p-6">
                {/* Prize Info */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-cream-50 rounded-xl border border-cream-200">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    {prize.image ? (
                      <img src={prize.image} alt={prize.name} className="w-full h-full object-cover" />
                    ) : (
                      <Gift size={32} className="text-teal-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-teal-900">{prize.name}</h3>
                    <p className="text-sm text-stone-500">Worth £{prize.valueGBP.toLocaleString()}</p>
                  </div>
                </div>

                {/* Step: Choice */}
                {step === 'choice' && (
                  <div className="space-y-4">
                    <p className="text-stone-600 mb-6">
                      How would you like to receive your prize?
                    </p>

                    {/* Physical Prize Option */}
                    <button
                      onClick={() => setChoice('physical')}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                        choice === 'physical'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-cream-200 hover:border-cream-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${choice === 'physical' ? 'bg-teal-100 text-teal-600' : 'bg-cream-100 text-stone-400'}`}>
                          <Truck size={24} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-teal-900 mb-1">Receive Physical Prize</h4>
                          <p className="text-sm text-stone-500">
                            We'll deliver {prize.name} to your door for free.
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          choice === 'physical' ? 'border-teal-500 bg-teal-500' : 'border-stone-300'
                        }`}>
                          {choice === 'physical' && <CheckCircle size={12} className="text-white" />}
                        </div>
                      </div>
                    </button>

                    {/* Cash Alternative Option */}
                    {hasCashAlternative && (
                      <button
                        onClick={() => setChoice('cash')}
                        className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                          choice === 'cash'
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-cream-200 hover:border-cream-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${choice === 'cash' ? 'bg-teal-100 text-teal-600' : 'bg-cream-100 text-stone-400'}`}>
                            <Banknote size={24} />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-teal-900 mb-1">Cash Alternative</h4>
                            <p className="text-sm text-stone-500">
                              Receive £{cashAmount.toLocaleString()} credited to your wallet instantly.
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            choice === 'cash' ? 'border-teal-500 bg-teal-500' : 'border-stone-300'
                          }`}>
                            {choice === 'cash' && <CheckCircle size={12} className="text-white" />}
                          </div>
                        </div>
                      </button>
                    )}

                    <Button
                      onClick={handleChoiceSubmit}
                      disabled={!choice}
                      className="w-full mt-6"
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Step: Address */}
                {step === 'address' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin size={20} className="text-teal-500" />
                      <p className="text-stone-600 font-medium">Enter your delivery address</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={address.addressLine1}
                        onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                        className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.addressLine2}
                        onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                        className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                        placeholder="Flat 2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                          placeholder="London"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                          County
                        </label>
                        <input
                          type="text"
                          value={address.county}
                          onChange={(e) => setAddress({ ...address, county: e.target.value })}
                          className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                          placeholder="Greater London"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={address.postcode}
                          onChange={(e) => setAddress({ ...address, postcode: e.target.value.toUpperCase() })}
                          className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                          placeholder="SW1A 1AA"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none"
                          placeholder="07XXX XXXXXX"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setStep('choice')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleAddressSubmit}
                        disabled={isSubmitting || !address.fullName || !address.addressLine1 || !address.city || !address.postcode}
                        className="flex-1"
                      >
                        {isSubmitting ? 'Submitting...' : 'Confirm Delivery'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step: Success */}
                {step === 'success' && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-teal-900 mb-3">
                      {choice === 'cash' ? 'Cash Credited!' : 'Claim Submitted!'}
                    </h3>
                    <p className="text-stone-600 mb-6">
                      {choice === 'cash'
                        ? `£${cashAmount.toLocaleString()} has been added to your wallet.`
                        : 'Your prize will be dispatched within 5-7 business days.'}
                    </p>
                    <Button onClick={handleClose} className="w-full">
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PrizeClaimModal;
