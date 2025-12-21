import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, TrendingUp, Users, Gift, ArrowRight, Star, Instagram, Youtube, Facebook, Calculator, DollarSign, Target, Rocket, ShieldCheck, Ticket } from 'lucide-react';
import { Button, Badge, PartnerApplicationModal } from '../components/ui';
import { Link } from 'react-router-dom';

export const Partners = () => {
  const [salesVolume, setSalesVolume] = useState(2500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dynamic calculation logic
  const getCommissionRate = (vol: number) => {
    if (vol < 1000) return 0.10;
    if (vol < 5000) return 0.15;
    return 0.20;
  };
  
  const rate = getCommissionRate(salesVolume);
  const earnings = salesVolume * rate;

  return (
    <div className="bg-cream-50 min-h-screen font-sans overflow-x-hidden">
      
      {/* Partner Application Modal */}
      <PartnerApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-24">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach-200/40 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-[80px] -z-10 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center">
          <Badge variant="peach" className="mb-6 px-4 py-1.5 text-xs tracking-widest bg-peach-300 text-teal-900 shadow-sm border-none">MUM CREATOR PROGRAM</Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-teal-900 mb-6 tracking-tight leading-[1.1]">
            Earn More & Grow Faster<br /> With <span className="text-teal-500 relative inline-block">BabyBets<span className="absolute bottom-2 left-0 w-full h-3 bg-peach-300/30 -z-10 rounded-full"></span></span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            The partnership program paying more than TikTok Shop. Join the UK's fastest growing family prize platform and turn your content into cash.
          </p>

          <p className="text-rose-500 font-bold text-sm uppercase tracking-widest mb-4 animate-pulse">Limited Spaces Available for Q1 2026</p>

          {/* Vimeo Video */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-teal-900/10 border-[6px] border-white aspect-video max-w-4xl mx-auto bg-stone-900">
            <iframe 
              src="https://player.vimeo.com/video/1138594596?badge=0&autopause=0&player_id=0&app_id=58479"
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title="BabyBets Partnership Video"
            />
          </div>
        </div>
      </section>

      {/* --- SPOTS TRACKER --- */}
      <section className="py-8 bg-white border-y border-cream-200">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-teal-900 uppercase tracking-wide">Brand Ambassador Spots</span>
            <span className="text-sm font-bold text-peach-600">30 / 50 Taken</span>
          </div>
          <div className="w-full h-4 bg-cream-100 rounded-full overflow-hidden border border-cream-200">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '60%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-peach-300 to-peach-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}></div>
            </motion.div>
          </div>
          <div className="mt-2 text-right">
             <span className="text-[10px] font-bold text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span> Filling fast
             </span>
          </div>
          
          <div className="mt-8 text-center">
             <Button 
               size="lg" 
               variant="peach" 
               className="px-12 py-4 text-lg shadow-xl shadow-peach-200 hover:shadow-peach-300 transform hover:-translate-y-1"
               onClick={() => setIsModalOpen(true)}
             >
               Apply Now
             </Button>
          </div>
        </div>
      </section>

      {/* --- INTRO TEXT --- */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-6 tracking-tight">BabyBets Influencer & Creator Partnership</h2>
        <p className="text-stone-600 text-lg leading-relaxed mb-8">
          BabyBets is a brand-new UK competition and raffle platform created specifically for mums and families. 
          We give away the prizes parents actually want — pram bundles, nursery makeovers, car seats, toys, spa breaks, family holidays and more.
        </p>
        <p className="text-teal-700 font-medium mb-10">We are building a partnership network of mum creators, influencers and everyday mums who want to:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
           {[
             "Earn from home",
             "Support other mums",
             "Be part of something new and exciting",
             "Grow with us as we scale",
             "Get rewarded for creating authentic content"
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-cream-200">
               <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>
               <span className="font-bold text-teal-900 text-sm">{item}</span>
             </div>
           ))}
        </div>
      </section>

      {/* --- STATS GRID --- */}
      <section className="py-20 bg-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-800/30 pattern-dots" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
           <div className="inline-flex items-center gap-2 bg-peach-300 text-teal-900 px-4 py-1 rounded-full text-sm font-bold mb-6">
             <Ticket size={16} /> Affiliate Program
           </div>
           <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">Earn £££ from Every Ticket Sale</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Creators Registered", val: "774", icon: Users },
                { label: "Average Commission Paid", val: "£652", icon: DollarSign },
                { label: "Live Competitions", val: "19", icon: Gift },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 hover:bg-white/10 transition duration-300">
                   <div className="text-peach-300 mb-4 flex justify-center">
                     <stat.icon size={40} strokeWidth={1.5} />
                   </div>
                   <div className="text-5xl font-bold mb-2">{stat.val}</div>
                   <div className="text-teal-200 font-medium text-lg">{stat.label}</div>
                </div>
              ))}
           </div>
           
           <p className="mt-12 text-teal-200 text-lg">Come & Join The BabyBets Brand - Start Earning Today From Your Existing Content</p>
        </div>
      </section>

      {/* --- CALCULATOR --- */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-[3rem] shadow-xl border border-cream-200 p-8 md:p-16 text-center">
            <h2 className="text-3xl font-bold text-teal-900 mb-2">Calculate Your Earnings</h2>
            <p className="text-stone-500 mb-12">See what you could earn with BabyBets</p>
            
            <div className="bg-cream-50 rounded-3xl p-8 mb-10 border border-cream-100">
               <div className="mb-8">
                 <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Monthly sales through your links</p>
                 <p className="text-4xl font-bold text-teal-900">£{salesVolume.toLocaleString()}</p>
               </div>
               
               <div className="relative mb-6 pt-6">
                 <input 
                   type="range" 
                   min="100" 
                   max="10000" 
                   step="100" 
                   value={salesVolume}
                   onChange={(e) => setSalesVolume(parseInt(e.target.value))}
                   className="w-full h-3 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-peach-500 hover:accent-peach-400 transition-all"
                 />
                 <div className="flex justify-between text-xs font-bold text-stone-400 mt-4">
                   <span>£100</span>
                   <span>£10,000</span>
                 </div>
               </div>
               
               <div className="border-t border-cream-200 pt-8">
                  <p className="text-5xl font-bold text-peach-500 mb-2">£{earnings.toLocaleString()}</p>
                  <p className="text-xs text-stone-400">Your monthly earnings at {(rate * 100).toFixed(1)}% average commission</p>
                  <p className="text-[10px] text-stone-300 mt-2 italic">Actual commission rates vary by product and tier.</p>
               </div>
            </div>
            
               <div className="rounded-2xl overflow-hidden relative h-64 md:h-80">
               <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Mum and baby" />
               <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent flex items-end justify-center pb-8">
                  <Button variant="peach" size="lg" className="shadow-lg" onClick={() => setIsModalOpen(true)}>Start Earning Now</Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARISON TIERS --- */}
      <section className="py-20 bg-teal-50">
         <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
               
               {/* Brand Ambassador */}
               <div className="bg-peach-100 rounded-[2.5rem] p-8 md:p-12 border-2 border-peach-200 relative overflow-hidden order-1 md:order-2">
                  <div className="absolute top-0 right-0 bg-peach-300 text-teal-900 text-xs font-bold px-4 py-2 rounded-bl-2xl">RECOMMENDED</div>
                  <h3 className="text-2xl font-bold text-teal-900 mb-2">Brand Ambassador</h3>
                  <p className="text-stone-600 mb-8 text-sm">For established creators with larger, highly engaged audiences.</p>
                  
                  <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
                     <div className="text-4xl font-bold text-teal-900 mb-1">20–25%</div>
                     <p className="text-xs text-stone-500 font-medium">+ £1 CPM on approved videos over 5,000 views (capped per video)</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                     {[
                       { icon: Star, text: "Highest earning potential with tiered commission up to 25%." },
                       { icon: Gift, text: "Priority access to our biggest prize drops for your audience." },
                       { icon: Users, text: "Closer support from our team on launches, collabs & campaigns." },
                       { icon: TrendingUp, text: "Extra £1 per 1,000 views on approved videos (5k+ views)." }
                     ].map((item, i) => (
                       <li key={i} className="flex gap-3 text-sm text-stone-700">
                         <div className="text-peach-500 shrink-0"><item.icon size={18} fill="currentColor" className="text-peach-200" /></div>
                         <span>{item.text}</span>
                       </li>
                     ))}
                  </ul>

                  <div className="bg-white/50 rounded-xl p-4 text-xs text-stone-600 mb-8">
                     <p className="font-bold mb-2 uppercase tracking-wide opacity-50">Requirements</p>
                     <ul className="list-disc pl-4 space-y-1">
                        <li>Typically 10k+ followers across main platforms</li>
                        <li>Consistent engagement & quality content</li>
                        <li>UK-based audience</li>
                     </ul>
                  </div>
                  
                  <Button className="w-full bg-teal-900 text-white hover:bg-teal-800 py-4" onClick={() => setIsModalOpen(true)}>Apply for Ambassador</Button>
               </div>

               {/* Affiliate */}
               <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-cream-200 order-2 md:order-1">
                  <h3 className="text-2xl font-bold text-teal-900 mb-2">Affiliate Programme</h3>
                  <p className="text-stone-500 mb-8 text-sm">For growing creators who want to start earning by sharing our competitions.</p>
                  
                  <div className="bg-cream-50 rounded-2xl p-6 mb-8 border border-cream-100">
                     <div className="text-4xl font-bold text-teal-900 mb-1">10–15%</div>
                     <p className="text-xs text-stone-500 font-medium">Tiered by monthly ticket value – the more you sell, the higher your rate.</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                     {[
                       { icon: Rocket, text: "Strong commission on every ticket sold through your custom link." },
                       { icon: Target, text: "Ready-to-use content ideas, captions, scripts & assets." },
                       { icon: TrendingUp, text: "Tracking dashboard so you can see clicks, sales & payouts." },
                       { icon: ShieldCheck, text: "Clear pathway to Brand Ambassador status as you grow." }
                     ].map((item, i) => (
                       <li key={i} className="flex gap-3 text-sm text-stone-600">
                         <div className="text-teal-500 shrink-0"><item.icon size={18} /></div>
                         <span>{item.text}</span>
                       </li>
                     ))}
                  </ul>
                  
                  <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-500 mb-8">
                     <p className="font-bold mb-2 uppercase tracking-wide opacity-50">Requirements</p>
                     <ul className="list-disc pl-4 space-y-1">
                        <li>1,000+ followers on any platform</li>
                        <li>Active & engaged UK audience</li>
                        <li>Genuine passion for helping mums</li>
                     </ul>
                  </div>

                  <Button variant="outline" className="w-full py-4" onClick={() => setIsModalOpen(true)}>Join Affiliate Program</Button>
               </div>
            </div>
         </div>
      </section>
      
      {/* --- AS SEEN IN --- */}
      <section className="py-16 text-center border-t border-cream-200 bg-white">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-8">As Seen In</p>
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholders for logos using text styling for now */}
           <span className="text-2xl font-serif font-bold text-stone-800">Mama</span>
           <span className="text-xl font-bold text-rose-500 tracking-tight">netmums</span>
           <span className="text-lg font-serif italic text-stone-600">MadeForMums</span>
           <span className="text-xl font-black text-stone-900 uppercase">DAILY EXPRESS</span>
           <span className="text-xl font-bold text-sky-600">FamilyFirst</span>
        </div>
      </section>

      <section className="py-12 bg-cream-100 text-center">
         <Link to="/contact">
           <p className="text-teal-600 font-bold hover:underline">Have questions? Contact our partnership team.</p>
         </Link>
      </section>

    </div>
  );
};