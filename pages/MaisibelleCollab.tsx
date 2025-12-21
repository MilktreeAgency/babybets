import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowRight, Heart, Sparkles, Mail, Star } from 'lucide-react';
import { competitions } from '../mockData';
import { CompetitionCard } from '../components/ui/CompetitionCard';
import { Button, Badge } from '../components/ui';

// Custom TikTok Icon since Lucide doesn't have it standard in this version
const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
  </svg>
);

export const MaisibelleCollab = () => {
  // Curate specific items for Maisie's picks
  // IDs based on mockData: Bugaboo(n1), Snoo(n2), Disney(h1), 10k Cash(c1), Thermomix(e3), HelloFresh(e5)
  const maisiePicksIds = ['n1', 'n2', 'h1', 'c1', 'e3', 'e5'];
  const curatedCompetitions = competitions.filter(c => maisiePicksIds.includes(c.id));
  
  // Fallback if mockData IDs change, just take first 6
  const finalCuratedList = curatedCompetitions.length === 6 ? curatedCompetitions : competitions.slice(0, 6);

  // Ending soon for bottom section
  const endingSoon = competitions
    .filter(c => c.status === 'ending_soon' && !maisiePicksIds.includes(c.id))
    .slice(0, 3);

  return (
    <div className="bg-cream-50 min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-[#faf5f0]"> {/* Slightly warmer cream for this page */}
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-peach-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            
            {/* Text Side */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white border border-peach-200 rounded-full px-4 py-1.5 shadow-sm mb-6"
              >
                <Sparkles size={14} className="text-peach-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-600">Exclusive Collaboration</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-teal-900 leading-[1.1] mb-6 tracking-tight"
              >
                Maisibelle <span className="text-peach-400 font-serif italic">x</span> BabyBets
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-stone-600 mb-8 leading-relaxed"
              >
                "I've teamed up with BabyBets to curate my absolute dream wishlist. From the nursery essentials I swear by, to the holidays we're all dreaming of. Good luck mamas!"
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
              >
                <a 
                  href="#collection" 
                  onClick={(e) => { e.preventDefault(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                    <Button size="lg" className="bg-teal-900 text-white hover:bg-teal-800 shadow-xl shadow-teal-900/10 px-8 rounded-full">
                    Shop My Edit <ArrowRight size={18} className="ml-2" />
                    </Button>
                </a>
                <a href="https://www.tiktok.com/@maisiebellex9" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="rounded-full border-stone-300 bg-white hover:bg-stone-50 text-stone-600">
                    <TikTokIcon className="mr-2" /> @maisiebellex9
                    </Button>
                </a>
              </motion.div>
            </div>

            {/* Image Side */}
            <div className="w-full md:w-1/2 relative">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.2 }}
                 className="relative z-10"
               >
                 {/* Decorative Frame */}
                 <div className="absolute inset-0 border-[3px] border-peach-300 rounded-[3rem] translate-x-4 translate-y-4 -z-10"></div>
                 
                 <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                   <img 
                      src="/maisibelle.jpg" 
                      alt="Maisibelle" 
                      className="w-full h-full object-cover"
                   />
                    
                    {/* Floating Social Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-3">
                       <div className="bg-black text-white p-2 rounded-full">
                          <TikTokIcon size={16} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase text-stone-400">Follow on TikTok</p>
                          <p className="text-sm font-bold text-teal-900">@maisiebellex9</p>
                       </div>
                    </div>
                 </div>
               </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CURATED COLLECTION GRID --- */}
      <section id="collection" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
           <div className="text-center mb-16">
              <div className="inline-block p-3 bg-peach-50 rounded-full mb-4 text-peach-500">
                 <Heart fill="currentColor" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-teal-900 mb-4 tracking-tight">The Maisie Edit</h2>
              <p className="text-stone-500 text-lg max-w-2xl mx-auto">
                 Six hand-picked prizes chosen specifically for modern families. <br/>Limited tickets available for this collection.
              </p>
           </div>

           {/* 
              GRID LAYOUT:
              Desktop: 3 columns (2 rows) -> grid-cols-3
              Mobile: 2 columns (3 rows) -> grid-cols-2
           */}
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {finalCuratedList.map((comp) => (
                 <CompetitionCard key={comp.id} comp={comp} />
              ))}
           </div>

        </div>
      </section>

      {/* --- OTHER ENDING SOON --- */}
      <section className="py-20 bg-cream-100 border-t border-cream-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-2xl font-bold text-teal-900">More Ending Soon</h3>
                  <p className="text-stone-500 text-sm">Don't miss out on these other favourites</p>
               </div>
               <Button variant="ghost" className="hidden sm:flex">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {endingSoon.map((comp) => (
                  <CompetitionCard key={comp.id} comp={comp} variant="compact" />
               ))}
            </div>
         </div>
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="bg-teal-900 py-24 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pattern-dots text-white"></div>
         {/* Glow effects */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-[150px] opacity-30"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-peach-500 rounded-full blur-[150px] opacity-20"></div>

         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
               <Mail size={16} className="text-peach-300" />
               <span className="text-sm font-bold tracking-wide">VIP Access</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Stay in the Loop</h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto leading-relaxed">
               Join the subscriber list to get notified when Maisie's next edit drops, plus get exclusive discounts on your first ticket.
            </p>

            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="Enter your email address" 
                 className="flex-grow px-6 py-4 rounded-xl text-teal-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-peach-500/50"
               />
               <Button variant="peach" size="lg" className="shadow-xl shadow-peach-900/20">
                  Subscribe
               </Button>
            </form>
            <p className="mt-6 text-sm text-teal-300/60">No spam, just winning chances. Unsubscribe anytime.</p>
         </div>
      </section>

    </div>
  );
};