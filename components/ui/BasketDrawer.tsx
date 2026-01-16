import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { X, Trash2, ArrowRight, ShoppingBag, Zap } from 'lucide-react';
import { Button } from './index';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudDecor, HeartDecor } from '../illustrations';

// Local storage key for cart persistence
const CART_STORAGE_KEY = 'babybets_cart';

export const BasketDrawer = () => {
  const { isCartOpen, setCartOpen, cart, removeFromCart, cartTotal } = useStore();
  const navigate = useNavigate();

  // Persist cart to localStorage when it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  // Count total tickets
  const totalTickets = cart.reduce((sum, item) => sum + item.ticketCount, 0);

  // Check if any items are instant win
  const hasInstantWin = cart.some(item => item.instantWin);

  const handleContinueShopping = () => {
    setCartOpen(false);
    navigate('/competitions');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-stone-900 z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-stone-800">Your Basket</h2>
                {cart.length > 0 && (
                  <p className="text-sm text-stone-500 mt-1">
                    {cart.length} {cart.length === 1 ? 'competition' : 'competitions'} • {totalTickets} tickets
                  </p>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 relative">
                  {/* Elegant empty state illustration */}
                  <div className="relative inline-block mb-6">
                    <CloudDecor variant="small" className="w-32 h-32 opacity-50 mx-auto" />
                    <HeartDecor className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70" />
                  </div>
                  <p className="text-stone-400 mb-4 font-medium">Your basket is empty.</p>
                  <p className="text-xs text-stone-300 mb-6">Start adding prizes you'd love to win!</p>
                  <Button variant="outline" onClick={handleContinueShopping}>
                    <ShoppingBag size={16} className="mr-2" />
                    Browse Competitions
                  </Button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.competitionId}-${idx}`} className="flex gap-4">
                    <div className="relative">
                      <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-cream-100" alt="Prize" />
                      {item.instantWin && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 p-1 rounded-full">
                          <Zap size={10} fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm text-stone-800 line-clamp-2">{item.competitionTitle}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded">
                          {item.ticketCount} Tickets
                        </span>
                        {item.instantWin && (
                          <span className="text-xs text-yellow-700 font-medium bg-yellow-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <Zap size={10} fill="currentColor" /> Instant Win
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-teal-900">£{item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(item.competitionId)} 
                          className="text-stone-300 hover:text-red-400 transition p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
                {/* Instant Win Reminder */}
                {hasInstantWin && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Zap size={16} className="text-yellow-600" fill="currentColor" />
                    </div>
                    <p className="text-xs text-yellow-800 font-medium">
                      Scratch your tickets after purchase to win instantly!
                    </p>
                  </div>
                )}

                {/* Totals */}
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="text-2xl font-bold text-stone-800">£{cartTotal().toFixed(2)}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link to="/checkout" onClick={() => setCartOpen(false)} className="block">
                    <Button className="w-full justify-between group">
                      Secure Checkout
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContinueShopping}
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
