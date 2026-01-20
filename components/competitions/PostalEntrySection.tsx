/**
 * Postal Entry Section Component
 * 
 * Displays free postal entry option with dynamic entry calculation
 * Per PRD Section 7 - Compliance requirement
 */

import React, { useState, useMemo } from 'react';
import { Mail, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculatePostalEntries } from '../../utils/pricing';

interface PostalEntrySectionProps {
  ticketPriceGBP: number;
  competitionTitle: string;
  competitionEndDate: string;
}

export const PostalEntrySection: React.FC<PostalEntrySectionProps> = ({
  ticketPriceGBP,
  competitionTitle,
  competitionEndDate,
}) => {
  const [activeTab, setActiveTab] = useState<'paid' | 'postal'>('paid');
  const [showInstructions, setShowInstructions] = useState(false);

  const postalEntries = useMemo(() => {
    return calculatePostalEntries(ticketPriceGBP);
  }, [ticketPriceGBP]);

  return (
    <div className="mt-8 bg-white rounded-2xl border border-cream-200 overflow-hidden">
      {/* Toggle Tabs */}
      <div className="flex border-b border-cream-200">
        <button
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-4 px-6 text-sm font-bold transition-colors ${
            activeTab === 'paid'
              ? 'bg-teal-50 text-teal-900 border-b-2 border-teal-500'
              : 'text-stone-500 hover:bg-cream-50'
          }`}
        >
          Paid Entry
        </button>
        <button
          onClick={() => setActiveTab('postal')}
          className={`flex-1 py-4 px-6 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'postal'
              ? 'bg-teal-50 text-teal-900 border-b-2 border-teal-500'
              : 'text-stone-500 hover:bg-cream-50'
          }`}
        >
          <Mail size={16} />
          Free Postal Entry
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'paid' ? (
          <div className="text-center text-stone-500">
            <p className="text-sm">
              Use the ticket selector above to enter via paid entry.
            </p>
          </div>
        ) : (
          <div>
            {/* Entry Count - Prominent Display */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="text-teal-600" size={20} />
                <span className="text-xs font-bold uppercase text-teal-600 tracking-wider">Free Postal Entry</span>
              </div>
              <div className="text-3xl font-bold text-teal-900 mb-1">
                {postalEntries} {postalEntries === 1 ? 'Entry' : 'Entries'}
              </div>
              <p className="text-sm text-teal-700">
                Based on ticket price of £{ticketPriceGBP.toFixed(2)}
              </p>
            </div>

            {/* Instructions Toggle */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-200 hover:border-cream-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-stone-400" />
                <span className="font-medium text-teal-900">How to Enter by Post</span>
              </div>
              {showInstructions ? (
                <ChevronUp size={18} className="text-stone-400" />
              ) : (
                <ChevronDown size={18} className="text-stone-400" />
              )}
            </button>

            {/* Instructions Content */}
            {showInstructions && (
              <div className="mt-4 p-5 bg-cream-50 rounded-xl border border-cream-200">
                <ol className="space-y-4 text-sm text-stone-600">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <span>
                      Write your full name, email address, and date of birth on a postcard or the back of a sealed envelope.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <span>
                      Include the competition name: <strong>"{competitionTitle}"</strong>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <span>
                      Post to: <strong>BabyBets Competitions, [Address to be provided]</strong>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xs">4</span>
                    <span>
                      Entries must arrive before the competition closes on{' '}
                      <strong>{new Date(competitionEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                    </span>
                  </li>
                </ol>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Each valid postal entry will receive {postalEntries} ticket{postalEntries !== 1 ? 's' : ''} in the draw. 
                    Limit of one postal entry per person per competition.
                  </p>
                </div>
              </div>
            )}

            {/* Terms Link */}
            <div className="mt-4 text-center">
              <Link 
                to="/Prize-Competition-Terms-and-Conditions" 
                className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 font-medium"
              >
                <ExternalLink size={14} />
                View Full Terms & Conditions
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostalEntrySection;
