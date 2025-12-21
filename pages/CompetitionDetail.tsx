import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { competitions } from '../mockData';
import { useStore } from '../store';
import { Button, Badge, ProgressBar } from '../components/ui';
import { Check, Info, Clock, Share2, HelpCircle, ShieldCheck, Ticket, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Competition, TicketBundle } from '../types';

// Helper to calculate best price based on bundles
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
  
  // Initialize with the quantity of the first bundle or 1
  const [quantity, setQuantity] = useState(competition.bundles[0]?.quantity || 1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shareText, setShareText] = useState('Share');

  // Available tickets logic
  const ticketsLeft = competition.maxTickets - competition.ticketsSold;
  const maxPurchase = Math.min(ticketsLeft, 100); // Cap slider at 100 or remaining tickets

  // Fallback bundles
  const bundles = competition.bundles.length > 0 ? competition.bundles : [{ quantity: 1, price: competition.ticketPriceGBP }];

  // Recalculate price when quantity changes
  useEffect(() => {
    const price = calculateBestPrice(quantity, bundles, competition.ticketPriceGBP);
    setTotalPrice(price);
  }, [quantity, bundles, competition.ticketPriceGBP]);

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
            
            <div className="p-8 bg-white rounded-3xl border border-cream-200 shadow-sm">
               <h2 className="font-bold text-teal-900 mb-4 text-lg">Prize Description</h2>
               <p className="text-stone-600 leading-relaxed text-base">{competition.description}</p>
               
               <div className="mt-6 flex items-start gap-3 p-4 bg-cream-50 rounded-xl text-sm text-stone-600">
                  <ShieldCheck className="text-teal-500 shrink-0" />
                  <p>All prizes are brand new, genuine UK stock and come with full manufacturer warranty where applicable.</p>
               </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div>
             <div className="mb-3 flex items-center gap-2">
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">{competition.category}</span>
                {competition.status === 'ending_soon' && <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Ending Soon</span>}
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold text-teal-900 mb-6 tracking-tight leading-tight">Win {competition.title}</h1>
             
             <div className="flex items-center gap-6 mb-10 p-6 bg-white rounded-2xl border border-cream-200 shadow-sm">
               <div>
                 <p className="text-xs font-bold text-stone-400 uppercase mb-1">Ticket Price</p>
                 <div className="text-4xl font-bold text-teal-500">£{competition.ticketPriceGBP}</div>
               </div>
               <div className="h-10 w-px bg-cream-200"></div>
               <div>
                 <p className="text-xs font-bold text-stone-400 uppercase mb-1">Prize Value</p>
                 <div className="text-xl font-bold text-teal-900">£{competition.retailValueGBP.toLocaleString()}</div>
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
                <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2 text-lg">
                   Select Entry Bundle
                </h3>
                
                {/* Bundles Grid */}
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
                     <span className="text-teal-200 font-medium">Total Price</span>
                     <div className="text-right">
                       <span className="block text-3xl font-bold">£{totalPrice.toFixed(2)}</span>
                       {quantity > 1 && (
                         <span className="text-xs text-teal-300 font-medium">£{(totalPrice / quantity).toFixed(2)} per ticket</span>
                       )}
                     </div>
                  </div>
                  <Button onClick={handleAddToCart} variant="peach" size="lg" className="w-full text-lg shadow-none py-5">
                     Enter Competition
                  </Button>
                  <p className="text-[10px] text-teal-300/60 text-center leading-tight">
                    By entering, you agree to our Terms & Conditions. <br/>
                    <Link to="/legal/terms" className="underline hover:text-white">Free Postal Entry Available</Link>
                  </p>
                </div>
             </div>

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
