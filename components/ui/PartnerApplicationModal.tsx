import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Send, Loader2, User, Share2, Users, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from './index';

interface PartnerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerApplicationModal: React.FC<PartnerApplicationModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    
    // Step 2: Social Media
    primaryPlatform: '',
    instagramHandle: '',
    instagramFollowers: '',
    tiktokHandle: '',
    tiktokFollowers: '',
    youtubeChannel: '',
    youtubeSubscribers: '',
    otherPlatforms: '',
    
    // Step 3: Audience & Engagement
    engagementRate: '',
    audienceLocation: '',
    contentNiche: '',
    audienceDemographics: '',
    monthlyViews: '',
    
    // Step 4: Partnership Info
    programInterest: '',
    affiliateExperience: '',
    otherPrograms: '',
    whyPartner: '',
    contentStrategy: '',
    portfolioLinks: '',
    
    // Step 5: Additional
    additionalInfo: '',
    agreeTerms: false,
  });

  const totalSteps = 5;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
            firstName: '', lastName: '', email: '', phone: '', location: '',
            primaryPlatform: '', instagramHandle: '', instagramFollowers: '',
            tiktokHandle: '', tiktokFollowers: '', youtubeChannel: '',
            youtubeSubscribers: '', otherPlatforms: '', engagementRate: '',
            audienceLocation: '', contentNiche: '', audienceDemographics: '',
            monthlyViews: '', programInterest: '', affiliateExperience: '',
            otherPrograms: '', whyPartner: '', contentStrategy: '',
            portfolioLinks: '', additionalInfo: '', agreeTerms: false,
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

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return User;
      case 2: return Share2;
      case 3: return Users;
      case 4: return Briefcase;
      case 5: return MessageSquare;
      default: return User;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Social Media Platforms';
      case 3: return 'Audience & Engagement';
      case 4: return 'Partnership Details';
      case 5: return 'Final Details';
      default: return '';
    }
  };

  const renderStepContent = () => {
    if (submitStatus === 'success') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 text-white rounded-full mb-6">
            <Check size={40} strokeWidth={3} />
          </div>
          <h3 className="text-3xl font-bold text-emerald-900 mb-3">Application Submitted!</h3>
          <p className="text-lg text-emerald-700 mb-2">
            Thank you for applying to partner with BabyBets!
          </p>
          <p className="text-stone-600">
            We'll review your application and get back to you within 48 hours.
          </p>
        </motion.div>
      );
    }

    if (submitStatus === 'error') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500 text-white rounded-full mb-6">
            <X size={40} strokeWidth={3} />
          </div>
          <h3 className="text-3xl font-bold text-rose-900 mb-3">Oops! Something went wrong</h3>
          <p className="text-stone-600 mb-6">
            Please try again or contact us directly at partners@babybets.co.uk
          </p>
          <Button onClick={() => setSubmitStatus('idle')} variant="outline">
            Try Again
          </Button>
        </motion.div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-stone-700 mb-2">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  placeholder="Jane"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-stone-700 mb-2">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-2">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-stone-700 mb-2">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                placeholder="07XXX XXXXXX"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-bold text-stone-700 mb-2">
                Location (City/Region, UK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                placeholder="e.g. London, Manchester, Edinburgh"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="primaryPlatform" className="block text-sm font-bold text-stone-700 mb-2">
                Primary Platform <span className="text-rose-500">*</span>
              </label>
              <select
                id="primaryPlatform"
                name="primaryPlatform"
                required
                value={formData.primaryPlatform}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="">Select your main platform</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="Pinterest">Pinterest</option>
                <option value="Blog/Website">Blog/Website</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Conditionally show fields based on selected platform */}
            {formData.primaryPlatform === 'Instagram' && (
              <div className="bg-cream-50 rounded-xl p-6 border border-cream-200">
                <h4 className="font-bold text-teal-900 mb-4 text-base flex items-center gap-2">
                  📸 Instagram Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="instagramHandle" className="block text-sm font-bold text-stone-700 mb-2">
                      Instagram Handle <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="instagramHandle"
                      name="instagramHandle"
                      required
                      value={formData.instagramHandle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="@yourhandle"
                    />
                  </div>
                  <div>
                    <label htmlFor="instagramFollowers" className="block text-sm font-bold text-stone-700 mb-2">
                      Follower Count <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="instagramFollowers"
                      name="instagramFollowers"
                      required
                      value={formData.instagramFollowers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.primaryPlatform === 'TikTok' && (
              <div className="bg-cream-50 rounded-xl p-6 border border-cream-200">
                <h4 className="font-bold text-teal-900 mb-4 text-base flex items-center gap-2">
                  🎵 TikTok Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tiktokHandle" className="block text-sm font-bold text-stone-700 mb-2">
                      TikTok Handle <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="tiktokHandle"
                      name="tiktokHandle"
                      required
                      value={formData.tiktokHandle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="@yourhandle"
                    />
                  </div>
                  <div>
                    <label htmlFor="tiktokFollowers" className="block text-sm font-bold text-stone-700 mb-2">
                      Follower Count <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="tiktokFollowers"
                      name="tiktokFollowers"
                      required
                      value={formData.tiktokFollowers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="e.g. 10000"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.primaryPlatform === 'YouTube' && (
              <div className="bg-cream-50 rounded-xl p-6 border border-cream-200">
                <h4 className="font-bold text-teal-900 mb-4 text-base flex items-center gap-2">
                  📺 YouTube Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="youtubeChannel" className="block text-sm font-bold text-stone-700 mb-2">
                      Channel Name/URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="youtubeChannel"
                      name="youtubeChannel"
                      required
                      value={formData.youtubeChannel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="Channel name or URL"
                    />
                  </div>
                  <div>
                    <label htmlFor="youtubeSubscribers" className="block text-sm font-bold text-stone-700 mb-2">
                      Subscriber Count <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="youtubeSubscribers"
                      name="youtubeSubscribers"
                      required
                      value={formData.youtubeSubscribers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.primaryPlatform === 'Facebook' && (
              <div className="bg-cream-50 rounded-xl p-6 border border-cream-200">
                <h4 className="font-bold text-teal-900 mb-4 text-base flex items-center gap-2">
                  👍 Facebook Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="otherPlatforms" className="block text-sm font-bold text-stone-700 mb-2">
                      Facebook Page/Profile <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="otherPlatforms"
                      name="otherPlatforms"
                      required
                      value={formData.otherPlatforms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="Page name or URL"
                    />
                  </div>
                  <div>
                    <label htmlFor="monthlyViews" className="block text-sm font-bold text-stone-700 mb-2">
                      Followers/Likes <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="monthlyViews"
                      name="monthlyViews"
                      required
                      value={formData.monthlyViews}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>
              </div>
            )}

            {(formData.primaryPlatform === 'Twitter/X' || formData.primaryPlatform === 'Pinterest' || formData.primaryPlatform === 'Blog/Website' || formData.primaryPlatform === 'Other') && formData.primaryPlatform !== '' && (
              <div className="bg-cream-50 rounded-xl p-6 border border-cream-200">
                <h4 className="font-bold text-teal-900 mb-4 text-base">
                  {formData.primaryPlatform} Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="otherPlatforms" className="block text-sm font-bold text-stone-700 mb-2">
                      Profile/Page URL or Handle <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="otherPlatforms"
                      name="otherPlatforms"
                      required
                      value={formData.otherPlatforms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="@handle or URL"
                    />
                  </div>
                  <div>
                    <label htmlFor="monthlyViews" className="block text-sm font-bold text-stone-700 mb-2">
                      Followers/Subscribers <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="monthlyViews"
                      name="monthlyViews"
                      required
                      value={formData.monthlyViews}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="e.g. 5000 or estimate"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.primaryPlatform && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="text-sm text-teal-900">
                  <strong>💡 Tip:</strong> You'll have a chance to add additional platforms and portfolio links in a later step!
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="contentNiche" className="block text-sm font-bold text-stone-700 mb-2">
                Content Niche/Focus <span className="text-rose-500">*</span>
              </label>
              <select
                id="contentNiche"
                name="contentNiche"
                required
                value={formData.contentNiche}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="">Select your niche</option>
                <option value="Parenting/Motherhood">Parenting/Motherhood</option>
                <option value="Pregnancy">Pregnancy</option>
                <option value="Lifestyle (Family)">Lifestyle (Family)</option>
                <option value="Baby/Toddler Content">Baby/Toddler Content</option>
                <option value="Family Vlogs">Family Vlogs</option>
                <option value="Home/Interior (Family)">Home/Interior (Family)</option>
                <option value="Budget/Money Saving">Budget/Money Saving</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="engagementRate" className="block text-sm font-bold text-stone-700 mb-2">
                Average Engagement Rate <span className="text-rose-500">*</span>
              </label>
              <select
                id="engagementRate"
                name="engagementRate"
                required
                value={formData.engagementRate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="">Select engagement rate</option>
                <option value="Under 1%">Under 1%</option>
                <option value="1-3%">1-3%</option>
                <option value="3-5%">3-5%</option>
                <option value="5-8%">5-8%</option>
                <option value="8-10%">8-10%</option>
                <option value="Over 10%">Over 10%</option>
                <option value="Not Sure">Not Sure</option>
              </select>
              <p className="text-xs text-stone-500 mt-2">
                💡 Engagement = (likes + comments + shares) ÷ followers
              </p>
            </div>

            <div>
              <label htmlFor="audienceLocation" className="block text-sm font-bold text-stone-700 mb-2">
                What % of your audience is UK-based? <span className="text-rose-500">*</span>
              </label>
              <select
                id="audienceLocation"
                name="audienceLocation"
                required
                value={formData.audienceLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="">Select percentage</option>
                <option value="90-100%">90-100% UK-based</option>
                <option value="70-90%">70-90% UK-based</option>
                <option value="50-70%">50-70% UK-based</option>
                <option value="Under 50%">Under 50% UK-based</option>
                <option value="Not Sure">Not Sure</option>
              </select>
            </div>

            <div>
              <label htmlFor="audienceDemographics" className="block text-sm font-bold text-stone-700 mb-2">
                Tell us about your audience <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="audienceDemographics"
                name="audienceDemographics"
                required
                rows={4}
                value={formData.audienceDemographics}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                placeholder="E.g. Mostly mums aged 25-35, interested in parenting tips and baby products..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="programInterest" className="block text-sm font-bold text-stone-700 mb-2">
                Which Program Are You Interested In? <span className="text-rose-500">*</span>
              </label>
              <select
                id="programInterest"
                name="programInterest"
                required
                value={formData.programInterest}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="">Select a program</option>
                <option value="Brand Ambassador">Brand Ambassador (20-25% + CPM)</option>
                <option value="Affiliate">Affiliate Program (10-15%)</option>
                <option value="Not Sure">Not Sure - Help me decide</option>
              </select>
            </div>

            <div>
              <label htmlFor="whyPartner" className="block text-sm font-bold text-stone-700 mb-2">
                Why do you want to partner with BabyBets? <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="whyPartner"
                name="whyPartner"
                required
                rows={5}
                value={formData.whyPartner}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                placeholder="Tell us what excites you about BabyBets and how you'd promote our competitions to your audience..."
              />
            </div>

            <div>
              <label htmlFor="affiliateExperience" className="block text-sm font-bold text-stone-700 mb-2">
                Have you worked with affiliate programs before?
              </label>
              <select
                id="affiliateExperience"
                name="affiliateExperience"
                value={formData.affiliateExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              >
                <option value="">Select an option</option>
                <option value="Yes, extensive experience">Yes, I do this regularly</option>
                <option value="Yes, some experience">Yes, a few times</option>
                <option value="No, but eager to learn">No, but I'm excited to learn</option>
                <option value="No experience">No experience</option>
              </select>
            </div>

            <div>
              <label htmlFor="portfolioLinks" className="block text-sm font-bold text-stone-700 mb-2">
                Share your best content or media kit (optional)
              </label>
              <textarea
                id="portfolioLinks"
                name="portfolioLinks"
                rows={3}
                value={formData.portfolioLinks}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                placeholder="Links to your best posts, videos, or media kit..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-teal-50 to-peach-50 rounded-2xl p-6 border-2 border-teal-200 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-teal-900 mb-2">Almost There!</h3>
              <p className="text-stone-600">
                Just a couple more quick questions and you're all set.
              </p>
            </div>

            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-bold text-stone-700 mb-2">
                Anything else you'd like us to know? (optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={4}
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                placeholder="Any special skills, achievements, or questions for our team..."
              />
            </div>

            <div className="bg-cream-50 rounded-xl p-5 border border-cream-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-cream-300 text-teal-600 focus:ring-2 focus:ring-teal-200 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-sm text-stone-700 font-medium cursor-pointer">
                  I confirm that all information provided is accurate and I agree to BabyBets' terms and conditions. <span className="text-rose-500">*</span>
                </label>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-center">
              <p className="text-sm text-teal-900 font-medium mb-1">
                📧 <strong>We'll review your application within 48 hours</strong>
              </p>
              <p className="text-xs text-teal-700">
                You'll receive an email at the address you provided with next steps.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
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
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  {React.createElement(getStepIcon(currentStep), { size: 28 })}
                  <h2 className="text-2xl font-bold">Partner Application</h2>
                </div>
                
                {/* Progress Steps */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                            step <= currentStep ? 'bg-peach-300' : 'bg-teal-800'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-teal-100 text-sm mt-3 font-medium">
                  Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
                </p>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit}>
                <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer */}
                {submitStatus === 'idle' && (
                  <div className="px-8 py-6 bg-cream-50 border-t border-cream-200 flex items-center justify-between gap-4">
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft size={18} />
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 ml-auto"
                      >
                        Next
                        <ChevronRight size={18} />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.agreeTerms}
                        className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <Send size={18} />
                          </>
                        )}
                      </Button>
                    )}
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

