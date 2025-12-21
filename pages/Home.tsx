import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, ArrowUpRight, Check, Ticket, Trophy, Smartphone, Gift, MonitorPlay, Zap, Mail } from 'lucide-react';
import { competitions, winners } from '../mockData';
import { Button, Badge, ProgressBar, TrustItem } from '../components/ui';
import { CompetitionCard } from '../components/ui/CompetitionCard';
import { SEO } from '../components/SEO';

// --- COMPONENTS ---

const CategoryTile: React.FC<{ title: string; image: string; link: string }> = ({ title, image, link }) => (
  <Link to={link} className="group relative block aspect-[16/9] md:aspect-[3/2] overflow-hidden rounded-2xl bg-teal-900">
    <img 
      src={image} 
      alt={`${title} competitions - Win ${title.toLowerCase()} prizes on BabyBets UK`}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-60"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-transparent to-transparent" />
    
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">{title}</h3>
        <div className="bg-peach-300 text-teal-900 p-2 rounded-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-peach-400 shadow-lg">
           <ArrowUpRight size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  </Link>
);

// --- SECTIONS ---

const HeroSection = () => (
  <section className="bg-cream-100 border-b border-cream-200 relative overflow-hidden">
     {/* Decorative circles */}
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-peach-100/50 rounded-full blur-3xl -z-10" />
    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-teal-100/50 rounded-full blur-3xl -z-10" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-5/12 text-left z-10">
           <Badge variant="peach" className="mb-6 px-3 py-1.5 text-xs">New Prizes Added Weekly</Badge>
           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-teal-900 tracking-tight leading-[1.1] mb-6">
             Win Baby Prizes & Family Holidays from <span className="text-teal-500 relative inline-block">49p<span className="absolute bottom-2 left-0 w-full h-3 bg-peach-300/40 -z-10 rounded-full"></span></span>
           </h1>
           <p className="text-stone-600 text-lg mb-8 font-medium max-w-lg leading-relaxed">
             Win your dream nursery, family holidays, and tax-free cash at a fraction of the cost. Join 25,000+ parents winning today.
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/competitions">
               <Button size="lg" className="w-full sm:w-auto text-lg py-4 px-8 shadow-teal-200 shadow-xl">
                 View Competitions
               </Button>
             </Link>
             <Link to="/winners">
               <Button variant="outline" size="lg" className="w-full sm:w-auto">
                 See Winners
               </Button>
             </Link>
           </div>
           
           {/* Brand Logos Section */}
           <div className="mt-10">
             <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-4">Win prizes from top brands</p>
             <div className="flex flex-wrap items-center gap-6 opacity-60">
               <div className="text-stone-600 font-bold text-xl">LEGO</div>
               <div className="text-stone-600 font-bold text-xl">Bugaboo</div>
               <div className="text-stone-600 font-bold text-xl">Stokke</div>
               <div className="text-stone-600 font-bold text-xl">Disney</div>
               <div className="text-stone-600 font-bold text-xl">Apple</div>
             </div>
           </div>
           
           <div className="mt-8 flex items-center gap-3">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-10 h-10 rounded-full border-2 border-cream-100" alt={`BabyBets winner ${i}`} loading="lazy" />
               ))}
             </div>
             <div>
               <div className="flex text-peach-500 gap-0.5 mb-0.5">
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
               </div>
               <span className="text-xs text-stone-500 font-bold">4.9/5 from 7,800+ reviews</span>
             </div>
           </div>
        </div>
        
        <div className="w-full md:w-7/12 relative">
           <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-900/10 border-[6px] border-white">
             <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" alt="Win family holidays and luxury prizes with BabyBets UK competitions" loading="eager" className="w-full h-auto object-cover" />
             
             {/* Floating Badge */}
             <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-[200px] animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex gap-3 items-center mb-2">
                   <div className="bg-peach-100 p-2 rounded-full text-peach-600">
                     <Trophy size={18} />
                   </div>
                   <div className="text-xs font-bold text-stone-400 uppercase">Just Won</div>
                </div>
                <div className="text-sm font-bold text-teal-900 leading-tight">Sarah from Leeds won a Disney Holiday!</div>
             </div>

             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-900/90 to-transparent p-8 pt-24 text-white flex justify-between items-end">
               <div>
                 <div className="text-xs font-bold uppercase mb-1 text-peach-300">Ending Tonight</div>
                 <div className="text-2xl font-bold">Win this Family Holiday + £5,000</div>
               </div>
               <div className="bg-white text-teal-900 rounded-full p-3 hover:scale-110 transition-transform cursor-pointer">
                 <ArrowRight size={20} />
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
    
    {/* Trust Stats - Desktop Grid / Mobile Slider */}
    <TrustStatsSection />
  </section>
);

const TrustStatsSection = () => {
  const trustItems = [
    { icon: Gift, title: "£10M+ Prizes", desc: "Awarded to families since 2021" },
    { icon: Trophy, title: "25k+ Winners", desc: "Real people, real life-changing wins" },
    { icon: Check, title: "Guaranteed", desc: "Draws take place regardless of sales" },
    { icon: MonitorPlay, title: "Live Draws", desc: "Watch transparently on Facebook" },
  ];

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...trustItems, ...trustItems, ...trustItems];

  return (
    <>
      {/* Desktop - Grid Layout */}
      <div className="hidden md:block bg-white py-8 border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between gap-8 md:gap-12">
          {trustItems.map((item, index) => (
            <div key={index}>
              <TrustItem icon={item.icon} title={item.title} desc={item.desc} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile - Continuous Scrolling Carousel */}
      <div className="md:hidden bg-white py-8 border-t border-cream-200 overflow-hidden">
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex animate-scroll">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-[280px] px-4">
              <TrustItem icon={item.icon} title={item.title} desc={item.desc} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const InstantWinsSection = () => {
  const instants = competitions.filter(c => c.instantWin === true);
  
  if (instants.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-peach-50 via-cream-50 to-teal-50 relative overflow-hidden border-y border-cream-200">
       {/* Background bling */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-peach-200 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-peach-100 rounded-full blur-[150px]"></div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
             <div>
                <div className="inline-flex items-center gap-2 bg-peach-300 text-teal-900 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider shadow-sm border-2 border-peach-400">
                  <Zap size={14} fill="currentColor" /> Flash Prizes
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-teal-900">Instant Wins</h2>
                <p className="text-stone-600 mt-2 max-w-xl font-medium">Find a lucky ticket number and win these prizes instantly. No need to wait for the draw date!</p>
             </div>
             <Link to="/competitions?filter=instant">
               <Button variant="outline" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                 View All Instant Wins
               </Button>
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {instants.slice(0, 4).map(comp => (
               <CompetitionCard key={comp.id} comp={comp} variant="instant" />
             ))}
          </div>
       </div>
    </section>
  );
};

const DrawingSoonSection = () => {
  const endingSoon = competitions
    .filter(c => c.status === 'ending_soon')
    .slice(0, 4);

  return (
    <section className="py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-teal-900 tracking-tight">Drawing Soon</h2>
          <div className="h-px bg-cream-300 flex-grow"></div>
          <Link to="/competitions" className="text-sm font-bold text-teal-600 uppercase hover:text-teal-800">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {endingSoon.map(comp => (
            <CompetitionCard key={comp.id} comp={comp} />
          ))}
        </div>
      </div>
    </section>
  );
};

const MaisibelleTeaserSection = () => (
  <section className="py-20 bg-peach-50 border-y border-peach-100 overflow-hidden relative">
    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-peach-200/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        {/* Image/Visual */}
        <div className="w-full md:w-1/2 order-2 md:order-1">
           <div className="relative">
              <div className="absolute inset-0 bg-teal-900 rounded-[2.5rem] rotate-3 transform translate-x-2 translate-y-2"></div>
              <img 
                src="/maisibelle.jpg" 
                alt="Maisibelle x BabyBets collaboration - Exclusive family prize competitions" 
                loading="lazy"
                className="relative rounded-[2.5rem] w-full aspect-[4/3] object-cover border-4 border-white shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                 <div className="bg-black text-white p-2 rounded-full">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg>
                 </div>
                 <div className="text-xs">
                    <p className="font-bold text-teal-900">@maisiebellex9</p>
                    <p className="text-stone-400">Official Partner</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 order-1 md:order-2 text-center md:text-left">
           <Badge variant="peach" className="mb-6 bg-peach-200 text-teal-900 border-peach-300">New Collaboration</Badge>
           <h2 className="text-4xl md:text-5xl font-bold text-teal-900 mb-6 tracking-tight leading-tight">
             The <span className="text-peach-500 font-serif italic">Maisibelle</span> Edit is Live
           </h2>
           <p className="text-lg text-stone-600 mb-8 leading-relaxed">
             We've teamed up with everyone's favourite mumfluencer Maisie to curate the ultimate family wishlist. Win her hand-picked nursery must-haves and dream holidays.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/maisibelle-x-babybets">
                 <Button size="lg" className="bg-teal-900 text-white hover:bg-teal-800 shadow-xl shadow-teal-900/10 w-full sm:w-auto">
                    Shop The Edit <ArrowRight size={18} className="ml-2" />
                 </Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  </section>
);

const CategoriesSection = () => {
  // Aligned with mockData Categories: 'Toys' | 'Nursery' | 'Prams' | 'Holidays' | 'Cash'
  // Added "Experiences" as a special category for holiday/experience-based competitions
  const categories = [
    { title: 'Toys', image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=600', link: '/competitions?cat=toys' },
    { title: 'Nursery', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600', link: '/competitions?cat=nursery' },
    { title: 'Prams', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600', link: '/competitions?cat=prams' },
    { title: 'Holidays', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600', link: '/competitions?cat=holidays' },
    { title: 'Cash', image: 'https://images.unsplash.com/photo-1554672723-b208dc2d7197?auto=format&fit=crop&q=80&w=600', link: '/competitions?cat=cash' },
    { title: 'Experiences', image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=600', link: '/competitions?cat=holidays' },
  ];

  return (
    <section className="py-8 bg-cream-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-teal-900 tracking-tight mb-8 text-center">Browse Prize Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
             <CategoryTile key={i} title={cat.title} image={cat.image} link={cat.link} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => (
  <section className="py-20 bg-teal-500 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-teal-600/20 pattern-dots" /> {/* abstract pattern placeholder */}
    <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
      <Badge variant="peach" className="mb-4 bg-peach-300 text-teal-900">Simple & Fair</Badge>
      <h2 className="text-4xl font-bold mb-4 tracking-tight">How It Works</h2>
      <p className="text-teal-100 mb-16 max-w-xl mx-auto text-lg">We've made entering simpler than ever. Win your dream prizes in 4 easy steps.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-teal-400/30 -z-10 mx-16"></div>

        {[
          { icon: Gift, title: "Choose Prize", text: "Find a prize you'd love to win from our current competitions." },
          { icon: Ticket, title: "Get Tickets", text: "Select your lucky numbers. The more you buy, the cheaper they are!" },
          { icon: MonitorPlay, title: "Watch Live", text: "Tune in to our Facebook Live draw to see if you've won." },
          { icon: Trophy, title: "Guaranteed Winners", text: "We call you immediately if you win. Prizes delivered free." },
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center group">
             <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-xl group-hover:bg-peach-300 transition-colors duration-300">
               <div className="text-peach-300 group-hover:text-teal-900 transition-colors duration-300">
                 <step.icon size={36} strokeWidth={1.5} />
               </div>
             </div>
             <h3 className="font-bold text-xl mb-3">{step.title}</h3>
             <p className="text-teal-100/80 text-sm leading-relaxed px-4">{step.text}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-16">
        <Link to="/how-it-works">
           <Button className="bg-white text-teal-900 hover:bg-peach-300 font-bold border-none shadow-lg">Learn More</Button>
        </Link>
      </div>
    </div>
  </section>
);

const JustLaunchedSection = () => {
  const newComps = competitions.filter(c => c.status === 'new' || c.status === 'active').slice(0, 4);
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
           <div className="bg-teal-500 text-white p-1.5 rounded-lg shadow-sm">
             <Star size={20} fill="white" />
           </div>
           <h2 className="text-3xl font-bold text-teal-900 tracking-tight">Just Launched</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newComps.map(comp => (
             <CompetitionCard key={comp.id} comp={comp} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => (
  <section className="py-20 bg-cream-100 border-y border-cream-200">
     <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-16 items-center">
           <div className="w-full md:w-1/3">
              <div className="flex text-peach-500 mb-6 gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={24} />)}
              </div>
              <h2 className="text-4xl font-bold text-teal-900 mb-6 tracking-tight">Don't just take our word for it.</h2>
              <p className="text-stone-600 mb-8 text-lg leading-relaxed">We have over 7,000 5-star reviews on Trustpilot. We pride ourselves on being the most transparent, family-friendly prize site in the UK.</p>
              <Button variant="outline" className="border-teal-900 text-teal-900 hover:bg-teal-900 hover:text-white">Read All Reviews</Button>
           </div>
           
           <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                 { name: "Jason John", img: winners[0].image, quote: "Lovely to meet the team today guys and having photos done with my family of the prize. Kids loved it!" },
                 { name: "Stuart Plant", img: winners[1].image, quote: "Wow wow wow I got the call whilst on holiday I really though it was a wind up but no it was real!" }
              ].map((review, i) => (
                 <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200 hover:shadow-md transition-shadow">
                    <div className="flex gap-1 text-peach-500 mb-4"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                    <p className="text-stone-700 mb-6 italic text-lg">"{review.quote}"</p>
                    <div className="flex items-center gap-4">
                       <img src={review.img} className="w-12 h-12 rounded-full object-cover border-2 border-cream-100" alt={`${review.name} - BabyBets winner review`} loading="lazy" />
                       <span className="font-bold text-teal-900">{review.name}</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  </section>
);

const NewsletterSection = () => (
  <section className="relative bg-peach-300 overflow-hidden mt-12 md:mt-24">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 text-center">
       <div className="inline-flex items-center gap-2 border border-teal-900/10 rounded-full px-4 py-1.5 text-sm font-bold mb-8 bg-white/40 text-teal-900">
         <Mail size={16} /> Join the Club
       </div>
       <h2 className="text-4xl md:text-5xl font-bold text-teal-900 tracking-tight leading-none mb-6">
         Never Miss a Draw
       </h2>
       <p className="text-teal-900/80 text-lg mb-10 max-w-xl mx-auto font-medium">
         Subscribe to get exclusive discounts, flash draw alerts, and winner announcements sent straight to your inbox.
       </p>
       
       <form className="max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow px-6 py-4 rounded-xl border-2 border-transparent focus:border-teal-500 focus:outline-none"
          />
          <Button variant="secondary" size="lg" className="px-8 shadow-xl">Subscribe</Button>
       </form>
       <p className="text-xs text-teal-900/50 mt-4">We respect your privacy. Unsubscribe at any time.</p>
    </div>
  </section>
);

export const Home = () => {
  // Organization Schema for Homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBets",
    "url": "https://babybets.co.uk",
    "logo": "https://babybets.co.uk/babybets-logo.png",
    "description": "Premium family prize competitions in the UK. Win baby prizes, nursery furniture, family holidays and tax-free cash from 49p entry.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://facebook.com/babybetsofficial",
      "https://instagram.com/babybetsofficial",
      "https://tiktok.com/@babybetsofficial"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "7800",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans">
      <SEO
        title="Win Baby Prizes, Nursery Furniture & Family Holidays UK | BabyBets"
        description="Enter to win premium baby prizes from £0.49. Bugaboo prams, SNOO sleepers, Disney holidays & tax-free cash. Join 25,000+ parents winning with BabyBets UK."
        keywords="baby competitions uk, win nursery furniture, family prize draws, win prams uk, baby giveaways, instant win competitions, mum competitions"
        canonical="https://babybets.co.uk/"
        schema={organizationSchema}
      />
      
      <HeroSection />
      <DrawingSoonSection />
      <MaisibelleTeaserSection />
      <CategoriesSection />
      <HowItWorksSection />
      <InstantWinsSection />
      <JustLaunchedSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};
