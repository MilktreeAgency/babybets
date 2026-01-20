import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { competitions } from '../mockData';
import { useStore } from '../store';
import { Button, Badge, ProgressBar } from '../components/ui';
import { Check, Info, Clock, Share2, HelpCircle, ShieldCheck, Ticket, Plus, Minus, Zap, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Competition, TicketBundle, TieredPricingTier } from '../types';
import { calculatePricingDetails, penceToPounds, formatPrice } from '../utils/pricing';
import { PrizeTiersSection, PostalEntrySection } from '../components/competitions';

// Helper to calculate best price based on bundles (legacy)
const calculateBestPrice = (qty: number, bundles: TicketBundle[], unitPrice: number): number => {
  if (qty <= 0) return 0;
  
  // Sort bundles by quantity descending to apply largest discounts first
  // Filter out any bundles larger than current qty to prevent negative remaining
  const sortedBundles = [...bundles]
    .filter(b => b.quantity <= qty)
    .sort((a, b) => b.quantity - a.quantity);

  let remaining = qty;
  let total = 0;

  // Greedy approach: take as many of the largest bundle as possible
  for (const bundle of sortedBundles) {
    if (remaining >= bundle.quantity) {
      const count = Math.floor(remaining / bundle.quantity);
      total += count * bundle.price;
      remaining %= bundle.quantity;
    }
  }

  // If there's still remainder (and no bundle of 1 covers it better than unit price), add unit price
  if (remaining > 0) {
    total += remaining * unitPrice;
  }

  return total;
};

// Check if competition uses tiered pricing
const usesTieredPricing = (competition: Competition): boolean => {
  return !!(competition.tieredPricing && competition.tieredPricing.length > 0);
};

// Helper to generate competition schema
const generateCompetitionSchema = (competition: Competition) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": competition.title,
  "image": competition.image,
  "description": competition.description,
  "brand": {
    "@type": "Brand",
    "name": "BabyBets"
  },
  "offers": {
    "@type": "Offer",
    "price": competition.ticketPriceGBP.toFixed(2),
    "priceCurrency": "GBP",
    "availability": competition.ticketsSold < competition.maxTickets 
      ? "https://schema.org/InStock" 
      : "https://schema.org/SoldOut",
    "url": `https://babybets.co.uk/competitions/${competition.slug}`,
    "priceValidUntil": competition.drawDateTime
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "7800"
  }
});

// Helper to generate breadcrumb schema
const generateBreadcrumbSchema = (competition: Competition) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://babybets.co.uk"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Competitions",
      "item": "https://babybets.co.uk/competitions"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": competition.category,
      "item": `https://babybets.co.uk/competitions?cat=${competition.category.toLowerCase()}`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": competition.title,
      "item": `https://babybets.co.uk/competitions/${competition.slug}`
    }
  ]
});

export const CompetitionDetail = () => {
  const { slug } = useParams();
  const competition = competitions.find(c => c.slug === slug) || competitions[0];
  const { addToCart } = useStore();
  
  // Check if this competition uses tiered pricing
  const hasTieredPricing = usesTieredPricing(competition);
  const basePricePence = (competition.baseTicketPriceGBP || competition.ticketPriceGBP) * 100;
  
  // Initialize with 10 for tiered pricing competitions, otherwise first bundle
  const [quantity, setQuantity] = useState(hasTieredPricing ? 10 : (competition.bundles[0]?.quantity || 1));
  const [totalPrice, setTotalPrice] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [pricePerTicket, setPricePerTicket] = useState(0);
  const [shareText, setShareText] = useState('Share');

  // Available tickets logic - use maxTicketsPerUser for tiered pricing comps
  const ticketsLeft = competition.maxTickets - competition.ticketsSold;
  const maxPurchase = hasTieredPricing 
    ? Math.min(ticketsLeft, competition.maxTicketsPerUser || 500)
    : Math.min(ticketsLeft, 100);

  // Fallback bundles
  const bundles = competition.bundles.length > 0 ? competition.bundles : [{ quantity: 1, price: competition.ticketPriceGBP }];

  // Quick-select options for tiered pricing
  const quickSelectOptions = useMemo(() => {
    if (!hasTieredPricing || !competition.tieredPricing) return [];
    
    return [10, 20, 40, 60].map(qty => {
      const details = calculatePricingDetails(qty, competition.tieredPricing!, basePricePence);
      return {
        quantity: qty,
        totalPrice: details.totalPriceGBP,
        savings: details.savingsGBP,
        label: qty === 60 ? 'Best Value' : (details.savingsGBP > 0 ? `Save £${details.savingsGBP.toFixed(0)}` : undefined),
      };
    });
  }, [hasTieredPricing, competition.tieredPricing, basePricePence]);

  // Recalculate price when quantity changes
  useEffect(() => {
    if (hasTieredPricing && competition.tieredPricing) {
      // Use tiered pricing
      const details = calculatePricingDetails(quantity, competition.tieredPricing, basePricePence);
      setTotalPrice(details.totalPriceGBP);
      setSavingsAmount(details.savingsGBP);
      setPricePerTicket(details.pricePerTicketGBP);
    } else {
      // Use legacy bundle pricing
      const price = calculateBestPrice(quantity, bundles, competition.ticketPriceGBP);
      setTotalPrice(price);
      setSavingsAmount(0);
      setPricePerTicket(price / quantity);
    }
  }, [quantity, bundles, competition.ticketPriceGBP, hasTieredPricing, competition.tieredPricing, basePricePence]);

  // Count instant win prizes
  const instantWinCount = useMemo(() => {
    if (!competition.instantWinPrizes) return 0;
    return competition.instantWinPrizes.reduce((sum, p) => sum + p.totalQuantity, 0);
  }, [competition.instantWinPrizes]);

  const handleAddToCart = () => {
    addToCart({
      competitionId: competition.id,
      competitionTitle: competition.title,
      image: competition.image,
      ticketCount: quantity,
      price: totalPrice,
      instantWin: competition.instantWin
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) setQuantity(Math.min(Math.max(1, val), maxPurchase));
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.min(Math.max(1, prev + delta), maxPurchase));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Win ${competition.title} on BabyBets`,
          text: `Check out this amazing prize: ${competition.title}. Enter now!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareText('Copied Link!');
      setTimeout(() => setShareText('Share'), 2000);
    }
  };

  // Generate SEO meta description
  const metaDescription = `Enter to win ${competition.title} from just £${competition.ticketPriceGBP}. Worth £${competition.retailValueGBP.toLocaleString()}. ${competition.description} Draw date: ${new Date(competition.drawDateTime).toLocaleDateString('en-GB')}.`;

  // Combine schemas
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      generateCompetitionSchema(competition),
      generateBreadcrumbSchema(competition)
    ]
  };

  return (
    <div className="bg-cream-50 min-h-screen pb-20 font-sans">
      <SEO
        title={`Win ${competition.title} Worth £${competition.retailValueGBP.toLocaleString()} | From £${competition.ticketPriceGBP}`}
        description={metaDescription}
        keywords={`win ${competition.title.toLowerCase()}, ${competition.title.toLowerCase()} competition uk, win ${competition.category.toLowerCase()} prizes, cheap ${competition.category.toLowerCase()} competition`}
        canonical={`https://babybets.co.uk/competitions/${competition.slug}`}
        ogImage={competition.image}
        ogType="product"
        schema={combinedSchema}
      />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-cream-200 py-4" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 text-xs font-bold text-stone-400">
          <Link to="/" className="hover:text-teal-600">Home</Link> / 
          <Link to="/competitions" className="hover:text-teal-600 ml-1">Competitions</Link> / 
          <span className="ml-1 text-teal-900">{competition.title}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Gallery */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] overflow-hidden shadow-2xl shadow-teal-900/5 aspect-square relative border border-white"
            >
              <img 
                src={competition.image} 
                alt={`Win ${competition.title} - ${competition.category} prize competition worth £${competition.retailValueGBP.toLocaleString()}`}
                loading="eager"
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-6 left-6">
                <Badge variant="urgent" className="text-sm px-3 py-1.5 shadow-sm">Draws {new Date(competition.drawDateTime).toLocaleDateString()}</Badge>
              </div>
            </motion.div>
            
            <div className="p-6 md:p-8 bg-white rounded-3xl border border-cream-200 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
                   <Info className="text-white" size={20} />
                 </div>
                 <h2 className="font-bold font-serif text-teal-900 text-xl md:text-2xl">Prize Description</h2>
               </div>
               
               {/* Format description with proper spacing and bullets if it contains line breaks or list items */}
               <div className="text-stone-700 leading-relaxed space-y-4">
                 {competition.description.split('\n').map((paragraph, idx) => {
                   // Check if paragraph looks like a list item
                   const isListItem = paragraph.trim().match(/^[-•*]\s/) || paragraph.trim().match(/^\d+\.\s/);
                   
                   if (isListItem) {
                     return (
                       <div key={idx} className="flex items-start gap-3 pl-2">
                         <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 shrink-0"></div>
                         <p className="flex-1 text-base">{paragraph.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '')}</p>
                       </div>
                     );
                   }
                   
                   return paragraph.trim() ? (
                     <p key={idx} className="text-base">{paragraph}</p>
                   ) : null;
                 })}
               </div>
               
               {/* Value Highlight */}
               <div className="mt-6 p-4 bg-gradient-to-br from-peach-50 to-peach-100 rounded-2xl border border-peach-200">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium text-stone-600">Total Prize Value</span>
                   <span className="text-2xl font-bold text-teal-900">£{competition.retailValueGBP.toLocaleString()}</span>
                 </div>
               </div>
               
               {/* Guarantee Badge */}
               <div className="mt-6 flex items-start gap-3 p-4 bg-gradient-to-br from-teal-50 to-cream-50 rounded-xl border border-teal-100">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-teal-900 text-sm mb-1">Quality Guarantee</p>
                    <p className="text-sm text-stone-600 leading-relaxed">All prizes are brand new, genuine UK stock and come with full manufacturer warranty where applicable.</p>
                  </div>
               </div>
            </div>
            
            {/* Prize Tiers Section - for instant win competitions */}
            {competition.instantWin && competition.instantWinPrizes && competition.instantWinPrizes.length > 0 && (
              <PrizeTiersSection 
                prizes={competition.instantWinPrizes.map(p => ({
                  id: p.id,
                  name: p.name,
                  short_name: p.shortName,
                  type: p.type,
                  value_gbp: p.valueGBP,
                  cash_alternative_gbp: p.cashAlternativeGBP,
                  total_quantity: p.totalQuantity,
                  remaining_quantity: p.remainingQuantity,
                  description: p.description,
                  image_url: p.image,
                  tier: p.type === 'Physical' ? 1 : p.type === 'Voucher' ? 2 : p.type === 'Cash' ? 3 : 4,
                }))}
              />
            )}
          </div>

          {/* Right: Actions */}
          <div>
             <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">{competition.category}</span>
                {competition.instantWin && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} fill="currentColor" /> Instant Win
                  </span>
                )}
                {competition.status === 'ending_soon' && <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Ending Soon</span>}
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold font-serif text-teal-900 mb-6 tracking-tight leading-tight">Win {competition.title}</h1>
             
             {/* Instant Win Banner */}
             {competition.instantWin && instantWinCount > 0 && (
               <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-peach-50 rounded-2xl border border-yellow-200">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                     <Zap className="text-yellow-600" size={24} fill="currentColor" />
                   </div>
                   <div>
                     <p className="font-bold text-teal-900">Over {instantWinCount.toLocaleString()} Instant Win Prizes!</p>
                     <p className="text-sm text-stone-600">Win instantly when you scratch + every ticket enters the end prize draw</p>
                   </div>
                 </div>
                 {competition.endPrize && (
                   <div className="mt-3 pt-3 border-t border-yellow-200 flex items-center gap-2 text-sm">
                     <Gift size={16} className="text-teal-600" />
                     <span className="text-stone-600">End prize draw: <span className="font-bold text-teal-900">£{competition.endPrize.valueGBP} Cash</span></span>
                   </div>
                 )}
               </div>
             )}
             
             <div className="flex items-center gap-6 mb-10 p-6 bg-white rounded-2xl border border-cream-200 shadow-sm">
               <div>
                 <p className="text-xs font-bold text-stone-400 uppercase mb-1">
                   {hasTieredPricing ? 'From' : 'Ticket Price'}
                 </p>
                 <div className="text-4xl font-bold text-teal-500">
                   £{hasTieredPricing ? '1.70' : competition.ticketPriceGBP.toFixed(2)}
                 </div>
                 {hasTieredPricing && (
                   <p className="text-xs text-stone-400 mt-1">per ticket (60+ tickets)</p>
                 )}
               </div>
               <div className="h-10 w-px bg-cream-200"></div>
               <div>
                 <p className="text-xs font-bold text-stone-400 uppercase mb-1">Total Prize Value</p>
                 <div className="text-xl font-bold text-teal-900">£{(competition.totalValueGBP || competition.retailValueGBP).toLocaleString()}</div>
               </div>
             </div>

             {/* Progress */}
             <div className="bg-white border border-cream-200 p-6 rounded-2xl shadow-sm mb-10">
                <div className="flex justify-between text-sm font-bold text-teal-900 mb-2">
                   <span>Tickets Sold</span>
                   <span>{competition.ticketsSold} / {competition.maxTickets}</span>
                </div>
                <ProgressBar value={competition.ticketsSold} max={competition.maxTickets} className="h-3" />
                <p className="text-xs text-stone-400 mt-3 text-center font-medium">Guaranteed draw regardless of sell out</p>
             </div>

             {/* Ticket Selector Area */}
             <div className="mb-10">
                <h3 className="font-bold font-serif text-teal-900 mb-4 flex items-center gap-2 text-lg">
                   {hasTieredPricing ? 'Choose Your Tickets' : 'Select Entry Bundle'}
                </h3>
                
                {/* Tiered Pricing Quick Select */}
                {hasTieredPricing && quickSelectOptions.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {quickSelectOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuantity(option.quantity)}
                        className={`relative p-5 rounded-2xl border-2 transition-all text-left ${
                          quantity === option.quantity 
                            ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                            : 'border-cream-200 bg-white hover:border-teal-200'
                        }`}
                      >
                        {option.label && (
                          <span className={`absolute -top-3 right-4 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                            option.label === 'Best Value' 
                              ? 'bg-peach-300 text-teal-900' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {option.label}
                          </span>
                        )}
                        <div className="font-bold text-2xl text-teal-900 mb-1">
                          {option.quantity} <span className="text-sm font-bold text-teal-400 uppercase">tickets</span>
                        </div>
                        <div className="text-stone-500 font-medium text-sm">
                          £{option.totalPrice.toFixed(2)} total
                        </div>
                        {option.savings > 0 && (
                          <div className="text-green-600 font-bold text-xs mt-1">
                            You save £{option.savings.toFixed(2)}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Legacy Bundles Grid */
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {bundles.map((bundle, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuantity(bundle.quantity)}
                        className={`relative p-5 rounded-2xl border-2 transition-all text-left ${
                          quantity === bundle.quantity 
                            ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                            : 'border-cream-200 bg-white hover:border-teal-200'
                        }`}
                      >
                        {bundle.label && (
                          <span className="absolute -top-3 right-4 bg-peach-300 text-teal-900 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {bundle.label}
                          </span>
                        )}
                        <div className="font-bold text-2xl text-teal-900 mb-1">{bundle.quantity} <span className="text-sm font-bold text-teal-400 uppercase">tickets</span></div>
                        <div className="text-stone-500 font-medium text-sm">£{bundle.price.toFixed(2)} total</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom Amount Slider */}
                <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-teal-900 text-lg">Custom Amount</span>
                      <div className="flex items-center gap-3">
                         <button 
                           onClick={() => adjustQuantity(-1)}
                           className="w-8 h-8 rounded-full bg-cream-100 text-teal-900 flex items-center justify-center hover:bg-peach-300 transition"
                           disabled={quantity <= 1}
                           aria-label="Decrease quantity"
                         >
                           <Minus size={16} />
                         </button>
                         <div className="bg-cream-50 border border-cream-200 rounded-lg px-4 py-2 font-bold text-xl text-teal-900 min-w-[3.5rem] text-center">
                           {quantity}
                         </div>
                         <button 
                           onClick={() => adjustQuantity(1)}
                           className="w-8 h-8 rounded-full bg-cream-100 text-teal-900 flex items-center justify-center hover:bg-peach-300 transition"
                           disabled={quantity >= maxPurchase}
                           aria-label="Increase quantity"
                         >
                           <Plus size={16} />
                         </button>
                      </div>
                   </div>
                   
                   <div className="relative h-6 mb-2 flex items-center">
                      <input 
                        type="range" 
                        min="1" 
                        max={maxPurchase} 
                        value={quantity}
                        onChange={handleSliderChange}
                        aria-label="Select number of tickets"
                        className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      />
                   </div>
                   <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-wide">
                      <span>1 Ticket</span>
                      <span>{maxPurchase} Tickets</span>
                   </div>
                </div>
             </div>

             {/* Total and CTA */}
             <div className="sticky bottom-4 lg:static z-20">
                <div className="bg-teal-900 text-white p-6 rounded-[2rem] shadow-2xl flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-teal-700 pb-4">
                     <div>
                       <span className="text-teal-200 font-medium block">Total Price</span>
                       {savingsAmount > 0 && (
                         <span className="text-green-400 text-sm font-bold">You save £{savingsAmount.toFixed(2)}</span>
                       )}
                     </div>
                     <div className="text-right">
                       <span className="block text-3xl font-bold">£{totalPrice.toFixed(2)}</span>
                       {quantity > 1 && (
                         <span className="text-xs text-teal-300 font-medium">£{pricePerTicket.toFixed(2)} per ticket</span>
                       )}
                     </div>
                  </div>
                  <Button onClick={handleAddToCart} variant="peach" size="lg" className="w-full text-lg shadow-none py-5">
                     {competition.instantWin ? 'Enter & Win Instantly' : 'Enter Competition'}
                  </Button>
                  <p className="text-[10px] text-teal-300/60 text-center leading-tight">
                    By entering, you agree to our Terms & Conditions. <br/>
                    <Link to="/legal/terms" className="underline hover:text-white">Free Postal Entry Available</Link>
                  </p>
                </div>
             </div>

             {/* Postal Entry Section - Compliance Requirement */}
             <PostalEntrySection
               ticketPriceGBP={competition.baseTicketPriceGBP || competition.ticketPriceGBP}
               competitionTitle={competition.title}
               competitionEndDate={competition.drawDateTime}
             />

             {/* Secondary Actions */}
             <div className="mt-8 flex justify-center gap-8 text-sm font-bold text-stone-400">
               <button onClick={handleShare} className="flex items-center gap-2 hover:text-teal-600 transition">
                  <Share2 size={18} /> {shareText}
               </button>
               <Link to="/how-it-works" className="flex items-center gap-2 hover:text-teal-600 transition">
                  <HelpCircle size={18} /> How it Works
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
