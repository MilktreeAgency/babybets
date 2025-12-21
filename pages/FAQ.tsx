import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-cream-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-teal-600' : 'text-teal-900 group-hover:text-teal-600'}`}>
          {question}
        </span>
        <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-teal-100 text-teal-600' : 'bg-cream-100 text-stone-400 group-hover:bg-teal-50 group-hover:text-teal-600'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-stone-600 leading-relaxed pb-6 pr-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const faqs = [
    {
      q: "Are BabyBets competitions legitimate?",
      a: "Yes, BabyBets is fully regulated and transparent. All draws are live-streamed on Facebook and winners are announced publicly. We've awarded over £10 million in prizes to 25,000+ families since 2021. We are a registered UK company and comply with all applicable regulations."
    },
    {
      q: "How do I enter a competition?",
      a: "Simply browse our active competitions, select the prize you want to win, and choose your ticket quantity. You can pick your own numbers or use the lucky dip. Proceed to checkout to complete your entry. You can also enter for free via our postal entry route."
    },
    {
      q: "How are winners chosen?",
      a: "We use a 100% random number generator (Google Random Number Generator) during our live draws on Facebook. This ensures every draw is completely fair and transparent. All draws are recorded and available to watch afterwards."
    },
    {
      q: "When does the draw take place?",
      a: "Each competition has a set draw date and time shown on the competition page. If a competition sells out early, we may bring the draw date forward, but we never extend it. Winners are contacted immediately after the draw."
    },
    {
      q: "What if the competition doesn't sell out?",
      a: "The draw goes ahead regardless of ticket sales! We guarantee to draw the prize on the specified date, even if we only sell 10% of the tickets. This is our guarantee to all entrants."
    },
    {
      q: "Is there a free entry method?",
      a: "Yes, we offer a free postal entry route for all our competitions in compliance with UK law. Please see our Terms & Conditions for full details on how to enter by post. You can send a postcard with your details to enter any active competition."
    },
    {
      q: "What are instant win competitions?",
      a: "Instant win competitions have special lucky ticket numbers hidden in the draw. If you purchase a lucky number, you win instantly without waiting for the draw date! Look for the yellow 'Instant Win' badge on qualifying competitions."
    },
    {
      q: "How do I know if I've won?",
      a: "We will contact you immediately by phone and email if you win. We also publish all results on our Winners page and social media channels within 24 hours of the draw. Make sure your contact details are up to date in your account."
    },
    {
      q: "How do I receive my prize?",
      a: "Winners are contacted immediately by phone and email. Prizes are delivered free of charge to your door within 14 days. Cash prizes are transferred via bank transfer within 48 hours. We handle all delivery and logistics."
    },
    {
      q: "Can I buy multiple tickets?",
      a: "Yes! You can purchase multiple tickets to increase your chances of winning. We offer bundle discounts - the more tickets you buy, the cheaper the per-ticket price. There's no maximum limit on how many tickets you can buy."
    }
  ];

  // FAQ Schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="bg-cream-50 min-h-screen py-20">
      <SEO
        title="Frequently Asked Questions | BabyBets UK Prize Competitions"
        description="Get answers to common questions about BabyBets competitions. Learn how to enter, how winners are selected, prize delivery, free postal entry and more. Safe, transparent, regulated prize draws."
        keywords="babybets faq, competition questions, how to enter competitions, are competitions safe, how are winners chosen, free postal entry, instant win explained"
        canonical="https://babybets.co.uk/faq"
        schema={faqSchema}
      />

      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-bold text-teal-900 mb-4">Frequently Asked Questions</h1>
           <p className="text-stone-500 text-lg">Everything you need to know about entering BabyBets competitions.</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-cream-200">
           {faqs.map((faq, i) => (
             <FAQItem key={i} question={faq.q} answer={faq.a} />
           ))}
        </div>
        
        {/* Additional Help Section */}
        <div className="mt-12 text-center">
          <p className="text-stone-600 mb-4">Still have questions? We're here to help!</p>
          <a 
            href="mailto:hello@babybets.com" 
            className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-800 transition"
          >
            Contact us at hello@babybets.com
          </a>
        </div>
      </div>
    </div>
  );
};
