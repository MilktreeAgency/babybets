import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Gift, User, Zap, LogOut, ChevronDown } from 'lucide-react';
import { useStore } from '../../store';
import { Button } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthModal } from '../auth';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const cartTotal = useStore(state => state.cart.length);
  const setCartOpen = useStore(state => state.setCartOpen);
  const location = useLocation();
  
  const { user, profile, isLoading, signOut } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Close user menu on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const navLinks = [
    { name: 'Competitions', path: '/competitions' },
    // { name: 'Winners', path: '/winners' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Shelley x Nick', path: '/partner/shelleyxnick', isNew: true },
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
                  className={`text-sm font-bold transition-colors flex items-center gap-1.5 group ${
                    isActive(link.path) 
                      ? 'text-teal-600' 
                      : 'text-stone-500 hover:text-teal-700'
                  }`}
                >
                  {link.name}
                  {link.isNew && (
                    <span className="bg-peach-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoading ? (
                <div className="w-20 h-10 bg-cream-100 rounded-xl animate-pulse" />
              ) : user ? (
                // Logged in state
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream-50 transition-colors cursor-pointer"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm">
                      {getUserInitials()}
                    </div>
                    <span className="hidden lg:block font-bold text-teal-900 text-sm">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown size={16} className={`text-stone-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-cream-200 py-2 z-[60]"
                      >
                        <Link
                          to="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-cream-50 transition-colors"
                        >
                          <User size={16} />
                          My Account
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Logged out state
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden lg:flex font-bold"
                    onClick={() => openAuth('signin')}
                  >
                    <User size={18} className="mr-2" />
                    Log In
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="hidden lg:flex font-bold"
                    onClick={() => openAuth('signup')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
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
                  className="block text-2xl font-bold text-teal-900 py-3 border-b border-cream-100 flex items-center gap-3"
                >
                  {link.name}
                  {link.isNew && (
                    <span className="bg-peach-400 text-white text-xs px-2 py-1 rounded-full font-bold uppercase">
                      New
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-8">
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" className="w-full mb-4">
                        <User size={18} className="mr-2" />
                        My Account
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full text-rose-500"
                      onClick={handleSignOut}
                    >
                      <LogOut size={18} className="mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="primary" 
                      className="w-full mb-4"
                      onClick={() => openAuth('signup')}
                    >
                      Create Account
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => openAuth('signin')}
                    >
                      Log In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};