import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { competitions } from '../mockData';
import { CompetitionCard } from '../components/ui/CompetitionCard';
import { Button } from '../components/ui';
import { Filter, ChevronDown, Search, X, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';

const CATEGORIES = ['All', 'Toys', 'Baby & Nursery', 'Cash', 'Instant Wins', 'Other'];
const SORTS = [
  { label: 'Ending Soon', value: 'ending_soon' },
  { label: 'Newest Added', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_low' },
  { label: 'Price: High to Low', value: 'price_high' },
];

export const Competitions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('ending_soon');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with URL params on mount/update
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      // Capitalize first letter to match CATEGORIES
      const fmtCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      if (CATEGORIES.includes(fmtCat)) {
        setActiveCategory(fmtCat);
      }
    }
    
    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);

    const filter = searchParams.get('filter');
    if (filter === 'instant') {
      // Special handle for instant win filter if we treat it as a category or separate toggle
      // For this UI, let's keep it simple, but we could add a checkbox
    }

  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    searchParams.set('sort', val);
    setSearchParams(searchParams);
  };

  // Filter Logic
  const filteredCompetitions = competitions
    .filter(comp => {
      // 1. Category Filter - "Instant Wins" category filters by instantWin flag
      if (activeCategory === 'Instant Wins') {
        if (!comp.instantWin) return false;
      } else if (activeCategory !== 'All') {
        // For other categories, match by category field
        // Handle legacy categories by mapping them
        const compCategory = comp.category === 'Nursery' || comp.category === 'Prams' 
          ? 'Baby & Nursery' 
          : comp.category === 'Holidays' || comp.category === 'Essentials'
          ? 'Other'
          : comp.category;
        if (compCategory !== activeCategory) return false;
      }
      
      // 2. Search Filter
      if (searchQuery && !comp.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // 3. Instant Win Filter via URL (legacy support)
      if (searchParams.get('filter') === 'instant' && !comp.instantWin) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ending_soon':
          return new Date(a.drawDateTime).getTime() - new Date(b.drawDateTime).getTime();
        case 'newest':
          // Mocking newness by ID or status, or just reverse draw date for now
          return b.id.localeCompare(a.id); 
        case 'price_low':
          return a.ticketPriceGBP - b.ticketPriceGBP;
        case 'price_high':
          return b.ticketPriceGBP - a.ticketPriceGBP;
        default:
          return 0;
      }
    });

  // Dynamic SEO based on filters
  const getDynamicSEO = () => {
    const isInstantWin = searchParams.get('filter') === 'instant' || activeCategory === 'Instant Wins';
    
    if (isInstantWin) {
      return {
        title: 'Instant Win Competitions UK | Win Baby Prizes Instantly | BabyBets',
        description: 'Find instant win competitions with lucky ticket numbers. Win baby prizes, nursery items and cash prizes instantly - no waiting for draws! From 49p entry.',
        keywords: 'instant win competitions uk, instant win baby prizes, quick win competitions, flash competitions uk'
      };
    }

    if (activeCategory !== 'All') {
      const categoryDescriptions: { [key: string]: string } = {
        'Baby & Nursery': 'Win premium baby gear, nursery furniture and essentials including prams, pushchairs, cot beds, car seats and more. Enter from 49p.',
        'Toys': 'Win amazing toys and tech for kids including LEGO bundles, PlayStation 5, iPads and ride-on cars. Fun prize competitions from 29p.',
        'Cash': 'Win tax-free cash prizes from £500 to £50,000. Clear your mortgage, pay bills or save for the future. Cash competitions from 79p.',
        'Other': 'Win family holidays, vouchers, experiences and more. Dream prizes and unique competitions from 99p entry.'
      };

      return {
        title: `Win ${activeCategory} Prizes UK | Best ${activeCategory} Competitions 2026 | BabyBets`,
        description: categoryDescriptions[activeCategory] || `Browse ${activeCategory.toLowerCase()} competitions and win premium prizes.`,
        keywords: `win ${activeCategory.toLowerCase()} uk, ${activeCategory.toLowerCase()} competitions, ${activeCategory.toLowerCase()} prize draws, ${activeCategory.toLowerCase()} giveaways`
      };
    }

    return {
      title: 'All Baby & Family Competitions UK | Win Premium Prizes | BabyBets',
      description: 'Browse 30+ live baby and family competitions. Win prams, nursery furniture, holidays and cash prizes from 49p entry. Guaranteed draws, transparent results, 25,000+ winners.',
      keywords: 'baby competitions uk, family competitions, win baby prizes, uk prize draws, mum competitions'
    };
  };

  const seoData = getDynamicSEO();

  // ItemList Schema for competition listings
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": seoData.title,
    "description": seoData.description,
    "numberOfItems": filteredCompetitions.length,
    "itemListElement": filteredCompetitions.slice(0, 10).map((comp, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://babybets.co.uk/competitions/${comp.slug}`,
      "name": comp.title,
      "image": comp.image
    }))
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-8 pb-20">
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={`https://babybets.co.uk/competitions${activeCategory !== 'All' ? `?cat=${activeCategory.toLowerCase()}` : ''}`}
        schema={itemListSchema}
      />

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
             <div>
                <h1 className="text-4xl md:text-5xl font-bold font-serif text-teal-900 tracking-tight mb-4">
                  {searchParams.get('filter') === 'instant' 
                    ? 'Instant Win Competitions'
                    : activeCategory === 'All' 
                      ? 'All Competitions' 
                      : `${activeCategory} Prizes`
                  }
                </h1>
                <p className="text-stone-500 max-w-2xl">
                   Enter our instant win competition for a chance to win premium iCandy prams, car seats, vouchers and cash prizes. Over 1,900 instant wins available!
                </p>
             </div>
             
             {/* Mobile Filter Toggle */}
             <div className="md:hidden w-full">
                <Button variant="outline" className="w-full flex justify-between" onClick={() => setShowFilters(!showFilters)}>
                   <span>Filters & Sort</span>
                   <ChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
             </div>
          </div>

          {/* Controls Bar */}
          <div className={`flex-col md:flex-row gap-6 mb-10 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
             
             {/* Search */}
             <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search prizes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search competitions"
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-teal-900"
                />
             </div>

             {/* Categories (Desktop Horizontal) - Instant Wins is now a category */}
             <nav className="flex-grow overflow-x-auto no-scrollbar py-1" aria-label="Competition categories">
                <div className="flex gap-2">
                   {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        aria-pressed={activeCategory === cat}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                          activeCategory === cat 
                            ? cat === 'Instant Wins' 
                              ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/30'
                              : 'bg-teal-900 text-white' 
                            : 'bg-white border border-cream-200 text-stone-500 hover:bg-cream-100 hover:text-teal-900'
                        }`}
                      >
                        {cat === 'Instant Wins' && <Zap size={14} className={activeCategory === cat ? 'fill-current' : ''} />}
                        {cat}
                      </button>
                   ))}
                </div>
             </nav>

             {/* Sort */}
             <div className="min-w-[180px]">
                <div className="relative">
                   <select 
                      value={sortBy}
                      onChange={handleSortChange}
                      aria-label="Sort competitions by"
                      className="w-full appearance-none bg-white border border-cream-200 text-teal-900 py-3 pl-4 pr-10 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                   >
                      {SORTS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
                </div>
             </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || searchParams.get('filter') === 'instant') && (
             <div className="flex gap-2 mb-8" role="list" aria-label="Active filters">
                {searchQuery && (
                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')} aria-label="Clear search filter"><X size={12} /></button>
                   </span>
                )}
                {searchParams.get('filter') === 'instant' && (
                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                      Instant Wins Only
                      <button onClick={() => {
                         searchParams.delete('filter');
                         setSearchParams(searchParams);
                      }} aria-label="Clear instant win filter"><X size={12} /></button>
                   </span>
                )}
             </div>
          )}

          {/* Results Grid - 2 columns on mobile (industry standard) */}
          {filteredCompetitions.length > 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
             >
                {filteredCompetitions.map(comp => (
                   <CompetitionCard key={comp.id} comp={comp} variant={comp.instantWin ? 'instant' : 'default'} />
                ))}
             </motion.div>
          ) : (
             <div className="text-center py-24 bg-white rounded-[2rem] border border-cream-200">
                <div className="inline-block p-4 bg-cream-50 rounded-full mb-4 text-stone-300">
                   <Filter size={32} />
                </div>
                <h2 className="text-xl font-bold font-serif text-teal-900 mb-2">No competitions found</h2>
                <p className="text-stone-500 mb-6">Try adjusting your filters or search terms.</p>
                <Button onClick={() => {
                   setSearchQuery('');
                   setActiveCategory('All');
                   setSearchParams({});
                }}>Clear All Filters</Button>
             </div>
          )}

          {/* Postal Entry Link */}
          <div className="mt-16 flex flex-col items-center justify-center py-10 px-4 border-t border-cream-200">
             <div className="flex items-center gap-2 text-stone-400 mb-2">
                <Mail size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Postal Entry</span>
             </div>
             <p className="text-stone-500 text-sm text-center max-w-md mb-6">
                Prefer to enter by post? We offer a free postal entry route for all competitions. See our terms for details on how to enter.
             </p>
             <Link to="/legal/terms">
                <Button variant="outline" className="border-cream-300 text-stone-600 hover:text-teal-900 hover:border-teal-500 bg-white">
                   View Postal Entry Instructions
                </Button>
             </Link>
          </div>

       </div>
    </div>
  );
};
