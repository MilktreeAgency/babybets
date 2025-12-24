import React from 'react';
import { useStore } from '../../store';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { Button } from './index';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudDecor, HeartDecor } from '../illustrations';

export const BasketDrawer = () => {
  const { isCartOpen, setCartOpen, cart, removeFromCart, cartTotal } = useStore();

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
              <h2 className="text-xl font-bold text-stone-800">Your Basket</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
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
                  <Button variant="outline" onClick={() => setCartOpen(false)}>Browse Competitions</Button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.competitionId}-${idx}`} className="flex gap-4">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt="Prize" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm text-stone-800 line-clamp-2">{item.competitionTitle}</h4>
                      <p className="text-xs text-stone-500 mt-1">{item.ticketCount} Tickets</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-sage-600">£{item.price.toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.competitionId)} className="text-stone-300 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="text-2xl font-bold text-stone-800">£{cartTotal().toFixed(2)}</span>
                </div>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full justify-between group">
                    Secure Checkout
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
