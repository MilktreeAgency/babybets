import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { Competition } from '../../types';
import { getCompetitionImageAlt } from '../../utils/imageAlt';

interface CompetitionCardProps {
  comp: Competition;
  variant?: 'default' | 'compact' | 'instant';
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ comp, variant = 'default' }) => {
  const percentSold = (comp.ticketsSold / comp.maxTickets) * 100;
  const isEndingSoon = comp.status === 'ending_soon';
  const isInstant = comp.instantWin;
  
  return (
    <Link to={`/competitions/${comp.slug}`} className="group h-full block">
      <article className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative ${variant === 'instant' ? 'bg-teal-900 border border-teal-800' : 'bg-white border border-stone-100'}`}>
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 items-start">
          {isInstant && (
            <div className="bg-yellow-400 text-teal-900 text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide flex items-center gap-1 animate-pulse">
              <Zap size={12} fill="currentColor" aria-hidden="true" />
              <span>Instant Win</span>
            </div>
          )}
          {isEndingSoon && (
            <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide flex items-center gap-1">
              <Clock size={12} aria-hidden="true" />
              <span>Closes {new Date(comp.drawDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          )}
          {comp.status === 'new' && !isInstant && (
             <div className="bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide">
               Just Launched
             </div>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-50">
          <img 
            src={comp.image} 
            alt={getCompetitionImageAlt(comp)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay Price */}
           <div className={`absolute bottom-3 left-3 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-lg shadow-sm ${variant === 'instant' ? 'bg-teal-900/90 text-white border border-teal-700' : 'bg-white/95 text-teal-900 border border-cream-100'}`}>
             £{comp.ticketPriceGBP.toFixed(2)}
           </div>
           <div className="absolute bottom-3 right-3">
             <div className={`rounded-full p-2 shadow-lg transition-colors ${variant === 'instant' ? 'bg-yellow-400 text-teal-900 group-hover:bg-yellow-300' : 'bg-peach-300 text-teal-900 group-hover:bg-peach-400'}`} aria-hidden="true">
               <ArrowRight size={16} />
             </div>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className={`font-bold font-serif mb-2 line-clamp-2 leading-tight min-h-[2.5rem] text-sm md:text-base ${variant === 'instant' ? 'text-white' : 'text-teal-900'}`}>
            Win {comp.title}
          </h3>
          
          <div className="mt-auto space-y-3">
            {/* Progress */}
            <div>
              <div className={`flex justify-between text-[10px] font-bold mb-1 ${variant === 'instant' ? 'text-teal-300' : 'text-stone-500'}`}>
                <span>{percentSold.toFixed(0)}% Sold</span>
              </div>
              <div 
                className={`w-full rounded-full h-2 overflow-hidden ${variant === 'instant' ? 'bg-teal-800' : 'bg-cream-200'}`}
                role="progressbar"
                aria-valuenow={percentSold}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${percentSold.toFixed(0)}% of tickets sold`}
              >
                <div 
                   style={{ width: `${percentSold}%` }}
                   className={`h-full rounded-full ${isEndingSoon ? 'bg-rose-400' : (variant === 'instant' ? 'bg-yellow-400' : 'bg-teal-500')}`}
                />
              </div>
            </div>
            
            {/* Value Check */}
            {variant === 'default' && (
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                 <span>Worth £{comp.retailValueGBP.toLocaleString()}</span>
                 <span className="text-teal-600 font-bold">Tax Free</span>
              </div>
            )}
             {variant === 'instant' && (
              <div className="pt-3 border-t border-teal-800 flex items-center justify-between text-xs text-teal-300">
                 <span>Worth £{comp.retailValueGBP.toLocaleString()}</span>
                 <span className="text-yellow-400 font-bold flex items-center gap-1"><Zap size={10} fill="currentColor" aria-hidden="true" /> Instant</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};
