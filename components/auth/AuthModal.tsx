/**
 * Authentication Modal Component
 * 
 * Handles sign in and multi-step sign up with name, birthday, and email
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Cake, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

// Step configuration for signup
const SIGNUP_STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'name', title: 'Your Name', icon: User },
  { id: 'birthday', title: 'Birthday', icon: Cake },
  { id: 'account', title: 'Account', icon: Mail },
];

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [signupStep, setSignupStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  // Reset step when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setSignupStep(0);
    }
  }, [isOpen, mode]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setBirthDay('');
    setBirthMonth('');
    setBirthYear('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
    setSignupStep(0);
  };

  const handleModeSwitch = (newMode: 'signin' | 'signup' | 'forgot') => {
    resetForm();
    setMode(newMode);
  };

  // Validate current step before proceeding
  const validateStep = (): boolean => {
    setError(null);
    
    switch (signupStep) {
      case 0: // Welcome - always valid
        return true;
      case 1: // Name
        if (!firstName.trim()) {
          setError('Please enter your first name');
          return false;
        }
        if (!lastName.trim()) {
          setError('Please enter your last name');
          return false;
        }
        return true;
      case 2: // Birthday
        const day = parseInt(birthDay);
        const month = parseInt(birthMonth);
        const year = parseInt(birthYear);
        
        if (!birthDay || !birthMonth || !birthYear) {
          setError('Please enter your complete date of birth');
          return false;
        }
        if (day < 1 || day > 31) {
          setError('Please enter a valid day (1-31)');
          return false;
        }
        if (month < 1 || month > 12) {
          setError('Please enter a valid month (1-12)');
          return false;
        }
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
          setError('Please enter a valid year');
          return false;
        }
        // Check age (must be 18+)
        const birthDate = new Date(year, month - 1, day);
        const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 18) {
          setError('You must be 18 or older to create an account');
          return false;
        }
        return true;
      case 3: // Account
        if (!email.trim()) {
          setError('Please enter your email address');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      if (signupStep < SIGNUP_STEPS.length - 1) {
        setSignupStep(signupStep + 1);
        setError(null);
      }
    }
  };

  const handlePrevStep = () => {
    if (signupStep > 0) {
      setSignupStep(signupStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!validateStep()) {
          setIsLoading(false);
          return;
        }

        // Construct birthday string
        const birthday = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

        const { error } = await signUp(email, password, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          birthday,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created! Please check your email to verify your account.');
        }
      } else if (mode === 'signin') {
        const { error } = await signIn(email, password);

        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Password reset email sent! Check your inbox.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mode === 'signup' && signupStep < SIGNUP_STEPS.length - 1) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextStep();
      }
    }
  };

  if (!isOpen) return null;

  // Render signup step content
  const renderSignupStep = () => {
    const slideVariants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction: number) => ({
        x: direction < 0 ? 100 : -100,
        opacity: 0,
      }),
    };

    switch (signupStep) {
      case 0: // Welcome
        return (
          <motion.div
            key="welcome"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="text-center py-4"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-peach-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-teal-900 mb-3">
              Join the BabyBets Family
            </h3>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto">
              Create your account in just a few easy steps and start winning amazing prizes for your family.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-teal-500" />
                Instant Wins
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-teal-500" />
                Wallet Credits
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-teal-500" />
                Big Prizes
              </div>
            </div>
          </motion.div>
        );

      case 1: // Name
        return (
          <motion.div
            key="name"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={28} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-bold font-serif text-teal-900">What's your name?</h3>
              <p className="text-stone-500 text-sm mt-1">So we know what to call you</p>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full px-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-lg"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                className="w-full px-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-lg"
              />
            </div>
          </motion.div>
        );

      case 2: // Birthday
        return (
          <motion.div
            key="birthday"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cake size={28} className="text-peach-500" />
              </div>
              <h3 className="text-xl font-bold font-serif text-teal-900">When's your birthday?</h3>
              <p className="text-stone-500 text-sm mt-1">We'll send you a special birthday treat!</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                  Day
                </label>
                <input
                  type="number"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  placeholder="DD"
                  min="1"
                  max="31"
                  className="w-full px-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-lg text-center"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                  Month
                </label>
                <input
                  type="number"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  placeholder="MM"
                  min="1"
                  max="12"
                  className="w-full px-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-lg text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-lg text-center"
                />
              </div>
            </div>
            
            <p className="text-xs text-stone-400 text-center mt-2">
              You must be 18 or older to participate in competitions
            </p>
          </motion.div>
        );

      case 3: // Account
        return (
          <motion.div
            key="account"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-bold font-serif text-teal-900">Almost there, {firstName}!</h3>
              <p className="text-stone-500 text-sm mt-1">Create your login details</p>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-stone-400 mt-1">Minimum 8 characters</p>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  minLength={8}
                />
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Progress indicator for signup */}
          {mode === 'signup' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {SIGNUP_STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex-1 h-1 rounded-full mx-1 transition-colors ${
                      index <= signupStep ? 'bg-teal-500' : 'bg-cream-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-stone-400 text-center">
                Step {signupStep + 1} of {SIGNUP_STEPS.length}
              </p>
            </div>
          )}

          {/* Sign In Mode */}
          {mode === 'signin' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-teal-900">Welcome Back</h2>
                <p className="text-stone-500 mt-2">Sign in to access your tickets and wallet</p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-rose-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot')}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full py-4" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-stone-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => handleModeSwitch('signup')}
                    className="text-teal-600 hover:text-teal-700 font-bold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Forgot Password Mode */}
          {mode === 'forgot' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-teal-900">Reset Password</h2>
                <p className="text-stone-500 mt-2">Enter your email to receive a reset link</p>
              </div>

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-emerald-700 text-sm">{success}</p>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-rose-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-cream-50 rounded-xl border border-cream-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full py-4" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-stone-500">
                  Remember your password?{' '}
                  <button
                    onClick={() => handleModeSwitch('signin')}
                    className="text-teal-600 hover:text-teal-700 font-bold"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Sign Up Mode - Multi-step */}
          {mode === 'signup' && (
            <>
              {/* Success message */}
              {success ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-teal-900 mb-3">
                    Welcome to BabyBets!
                  </h3>
                  <p className="text-stone-500 mb-6">{success}</p>
                  <Button onClick={onClose} className="w-full">
                    Got it!
                  </Button>
                </div>
              ) : (
                <>
                  {/* Error message */}
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                      <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-rose-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Step content */}
                  <AnimatePresence mode="wait">
                    {renderSignupStep()}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex gap-3 mt-8">
                    {signupStep > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handlePrevStep}
                        className="flex-1"
                      >
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                      </Button>
                    )}
                    
                    {signupStep < SIGNUP_STEPS.length - 1 ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1"
                      >
                        Continue
                        <ArrowRight size={18} className="ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            Creating account...
                          </span>
                        ) : (
                          <>
                            Create Account
                            <Sparkles size={18} className="ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Mode switch */}
                  <div className="mt-6 text-center text-sm">
                    <p className="text-stone-500">
                      Already have an account?{' '}
                      <button
                        onClick={() => handleModeSwitch('signin')}
                        className="text-teal-600 hover:text-teal-700 font-bold"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>

                  {/* Terms - only on final step */}
                  {signupStep === SIGNUP_STEPS.length - 1 && (
                    <p className="mt-4 text-xs text-center text-stone-400">
                      By creating an account, you agree to our{' '}
                      <a href="/legal/terms" className="text-teal-600 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/legal/privacy" className="text-teal-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
