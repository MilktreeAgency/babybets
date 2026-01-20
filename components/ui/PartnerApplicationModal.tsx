/**
 * Partner Application Modal - Simplified per PRD Section 9.1
 * 
 * Reduced friction with only essential fields:
 * - Name
 * - Email  
 * - Primary platform (Instagram, TikTok, YouTube)
 * - Social profile URL(s)
 * - Total followers
 * - Program interest (Affiliate / Brand Ambassador / Not sure)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Send, Loader2, Instagram } from 'lucide-react';
import { Button } from './index';

interface PartnerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerApplicationModal: React.FC<PartnerApplicationModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    // Required fields only per PRD
    firstName: '',
    lastName: '',
    email: '',
    primaryPlatform: '',
    socialUrls: '',
    totalFollowers: '',
    programInterest: '',
    agreeTerms: false,
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 300);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Convert formData to FormData for Formspree
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, String(value));
    });

    try {
      const response = await fetch('https://formspree.io/f/mpqarwwd', {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            primaryPlatform: '',
            socialUrls: '',
            totalFollowers: '',
            programInterest: '',
            agreeTerms: false,
          });
          onClose();
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.primaryPlatform !== '' &&
      formData.socialUrls.trim() !== '' &&
      formData.totalFollowers.trim() !== '' &&
      formData.programInterest !== '' &&
      formData.agreeTerms
    );
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden pointer-events-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <Instagram size={24} />
                  <h2 className="text-xl font-bold">Partner Application</h2>
                </div>
                <p className="text-teal-100 text-sm mt-1">Join the BabyBets creator program</p>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  
                  {submitStatus === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-full mb-4">
                        <Check size={32} strokeWidth={3} />
                      </div>
                      <h3 className="text-2xl font-bold text-teal-900 mb-2">Application Submitted!</h3>
                      <p className="text-stone-600">
                        We'll review your application and get back to you within 48 hours.
                      </p>
                    </motion.div>
                  ) : submitStatus === 'error' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-500 text-white rounded-full mb-4">
                        <X size={32} strokeWidth={3} />
                      </div>
                      <h3 className="text-2xl font-bold text-rose-900 mb-2">Something went wrong</h3>
                      <p className="text-stone-600 mb-4">
                        Please try again or contact us at partners@babybets.co.uk
                      </p>
                      <Button onClick={() => setSubmitStatus('idle')} variant="outline">
                        Try Again
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {/* Name */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase">
                            First Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-cream-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm"
                            placeholder="Jane"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase">
                            Last Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-cream-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm"
                            placeholder="Smith"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm"
                          placeholder="jane@example.com"
                        />
                      </div>

                      {/* Primary Platform */}
                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase">
                          Primary Platform <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="primaryPlatform"
                          required
                          value={formData.primaryPlatform}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm bg-white"
                        >
                          <option value="">Select platform</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                        </select>
                      </div>

                      {/* Social Profile URLs */}
                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase">
                          Social Profile URL(s) <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="socialUrls"
                          required
                          rows={2}
                          value={formData.socialUrls}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm resize-none"
                          placeholder="https://instagram.com/yourhandle&#10;https://tiktok.com/@yourhandle"
                        />
                      </div>

                      {/* Total Followers */}
                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase">
                          Total Followers (across all platforms) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="totalFollowers"
                          required
                          value={formData.totalFollowers}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm"
                          placeholder="e.g. 15,000"
                        />
                      </div>

                      {/* Program Interest */}
                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase">
                          Program Interest <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="programInterest"
                          required
                          value={formData.programInterest}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-cream-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm bg-white"
                        >
                          <option value="">Select program</option>
                          <option value="Affiliate">Affiliate Program (10-15%)</option>
                          <option value="Brand Ambassador">Brand Ambassador (20-25%)</option>
                          <option value="Not Sure">Not sure - help me decide</option>
                        </select>
                      </div>

                      {/* Terms Agreement */}
                      <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="agreeTerms"
                            required
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 rounded border-cream-300 text-teal-600 focus:ring-2 focus:ring-teal-200"
                          />
                          <span className="text-xs text-stone-600">
                            I confirm that all information is accurate and I agree to BabyBets' terms and conditions. <span className="text-rose-500">*</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {submitStatus === 'idle' && (
                  <div className="px-6 py-4 bg-cream-50 border-t border-cream-200">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isFormValid()}
                      className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={18} />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-stone-400 text-center mt-3">
                      We'll review your application within 48 hours
                    </p>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
