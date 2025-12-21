import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Gift, User, Zap } from 'lucide-react';
import { useStore } from '../../store';
import { Button } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartTotal = useStore(state => state.cart.length);
  const setCartOpen = useStore(state => state.setCartOpen);
  const location = useLocation();

  const navLinks = [
    { name: 'Competitions', path: '/competitions' },
    { name: 'Winners', path: '/winners' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Maisibelle Edit', path: '/maisibelle-x-babybets' },
    { name: 'Partners', path: '/partners' },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) {
        return location.pathname + location.search === path;
    }
    return location.pathname === path;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/babybets-logo.png" 
                alt="BabyBets Logo" 
                className="h-10 group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold transition-colors flex items-center group ${
                    isActive(link.path) 
                      ? 'text-teal-600' 
                      : 'text-stone-500 hover:text-teal-700'
                  }`}
                >
                  {link.name}
                  {link.name === 'Maisibelle Edit' && (
                    <span className="ml-1.5 flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-peach-500"></span>
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/account">
                <Button variant="ghost" size="sm" className="hidden lg:flex font-bold">
                  <User size={18} className="mr-2" />
                  Log In
                </Button>
              </Link>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setCartOpen(true)}
                className="relative bg-teal-600 hover:bg-teal-700"
              >
                <ShoppingBag size={18} className="mr-2" />
                Basket
                {cartTotal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-peach-300 text-teal-900 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                    {cartTotal}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-teal-800"
              >
                <ShoppingBag size={24} />
                {cartTotal > 0 && (
                  <span className="absolute top-1 right-1 bg-peach-300 text-teal-900 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {cartTotal}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-teal-800"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-20 z-40 bg-white"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-bold text-teal-900 py-3 border-b border-cream-100 flex items-center gap-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8">
                 <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button variant="secondary" className="w-full mb-4">Log In / Register</Button>
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};