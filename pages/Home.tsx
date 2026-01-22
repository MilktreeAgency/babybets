import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, ArrowUpRight, Check, Ticket, Trophy, Smartphone, Gift, MonitorPlay, Zap, Mail, Heart, Sparkles, Instagram } from 'lucide-react';
import { competitions, winners } from '../mockData';
import { Button, Badge, ProgressBar, TrustItem } from '../components/ui';
import { CompetitionCard } from '../components/ui/CompetitionCard';
import { SEO } from '../components/SEO';
import { CloudDecor, HeartDecor, SparkleDecor, ConfettiDecor } from '../components/illustrations';
import { WinnerTicker } from '../components/social-proof';

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
        <h3 className="text-2xl font-bold font-serif text-white tracking-tight drop-shadow-md">{title}</h3>
        <div className="bg-peach-300 text-teal-900 p-2 rounded-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-peach-400 shadow-lg">
           <ArrowUpRight size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  </Link>
);

// --- SECTIONS ---

const HeroSection = () => (
  <section className="bg-gradient-to-br from-cream-50 via-cream-100 to-peach-50/30 border-b border-cream-200 relative overflow-hidden">
     {/* Enhanced decorative circles */}
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-peach-200/40 rounded-full blur-3xl -z-10" />
    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[700px] h-[700px] bg-teal-100/40 rounded-full blur-3xl -z-10" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach-100/20 rounded-full blur-3xl -z-10" />
    
    {/* Elegant floating illustrations */}
    <CloudDecor className="absolute top-20 right-24 w-32 h-32 opacity-40 animate-float hidden lg:block" />
    <CloudDecor variant="small" className="absolute bottom-40 left-20 w-24 h-24 opacity-30 animate-float-reverse hidden md:block" />
    <SparkleDecor className="absolute top-1/3 left-1/4 w-16 h-16 opacity-50 animate-gentle-spin hidden xl:block" />
    <HeartDecor className="absolute bottom-1/4 right-1/3 w-14 h-14 opacity-30 animate-float hidden xl:block" />

    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-28 lg:py-32">
      {/* Mobile: Image first (flex-col-reverse), Desktop: Text first (lg:flex-row) */}
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-20 items-center">
        {/* Left Column - Text content */}
        <div className="w-full lg:w-[55%] text-left z-10 space-y-6 lg:space-y-8">
           {/* Badge */}
           <div>
             <Badge variant="peach" className="mb-0 px-4 py-2 text-sm font-bold shadow-sm">
               ⚡ Instant Win Competitions Live
             </Badge>
           </div>
           
           {/* Headline */}
           <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-serif text-teal-900 tracking-tight leading-[1.05] mb-0">
             Win Premium Baby Gear{' '}
             <span className="text-teal-500 relative inline-block">
               Instantly
               <span className="absolute bottom-3 left-0 w-full h-4 bg-peach-300/40 -z-10 rounded-full"></span>
             </span>
           </h1>
           
           {/* Subheadline */}
           <p className="text-stone-600 text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl">
             Enter our instant win competitions for a chance to win iCandy prams, car seats, and cash prizes. Over <span className="text-teal-700 font-bold">1,900 instant wins</span> available now.
           </p>
           
           {/* CTA Buttons */}
           <div className="flex flex-col sm:flex-row gap-4 pt-2">
             <Link to="/competitions" className="flex-shrink-0">
               <Button size="lg" className="w-full sm:w-auto text-lg py-6 px-10 shadow-teal-300 shadow-2xl hover:shadow-teal-400 hover:shadow-xl transition-all duration-300 font-bold">
                 View Competitions
                 <ArrowRight size={20} className="ml-2" />
               </Button>
             </Link>
             <Link to="/how-it-works" className="flex-shrink-0">
               <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg py-6 px-10 border-2 border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white font-bold transition-all duration-300">
                 How It Works
               </Button>
             </Link>
           </div>
           
           {/* Social Proof - Reviews */}
           <div className="flex items-center gap-4 pt-4">
             <div className="flex -space-x-3">
               {[1,2,3,4,5].map(i => (
                 <img 
                   key={i} 
                   src={`https://i.pravatar.cc/100?img=${i+20}`} 
                   className="w-12 h-12 rounded-full border-3 border-white shadow-md" 
                   alt={`BabyBets winner ${i}`} 
                   loading="lazy" 
                 />
               ))}
             </div>
             <div>
               <div className="flex text-peach-500 gap-0.5 mb-1">
                 <Star size={18} fill="currentColor" />
                 <Star size={18} fill="currentColor" />
                 <Star size={18} fill="currentColor" />
                 <Star size={18} fill="currentColor" />
                 <Star size={18} fill="currentColor" />
               </div>
               <span className="text-sm text-stone-600 font-bold">4.9/5 from 200+ reviews</span>
             </div>
           </div>
        </div>
        
        {/* Right Column - Hero Image */}
        <div className="w-full lg:w-[45%] relative">
           <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-900/20 border-[8px] border-white">
             <img 
               src="/images/competitions/PRIZE 1 ICANDY PEACH 7.png" 
               alt="Win iCandy Peach 7 and premium baby gear with BabyBets instant win competitions" 
               loading="eager" 
               className="w-full h-auto object-cover aspect-[4/5] bg-cream-100" 
             />
             
             {/* Floating Winner Badge */}
             <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl max-w-[220px] animate-bounce border border-cream-100" style={{ animationDuration: '4s' }}>
                <div className="flex gap-3 items-center mb-2">
                   <div className="bg-yellow-100 p-2.5 rounded-full text-yellow-600">
                     <Zap size={20} />
                   </div>
                   <div className="text-xs font-bold text-stone-400 uppercase tracking-wide">Instant Win</div>
                </div>
                <div className="text-base font-bold text-teal-900 leading-tight">1,900+ prizes to be won instantly!</div>
             </div>

             {/* Bottom CTA Overlay */}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-900/95 via-teal-900/80 to-transparent p-6 sm:p-8 pt-32 text-white">
               <div className="flex justify-between items-end gap-4">
                 <div className="flex-grow">
                   <div className="text-xs font-bold uppercase mb-2 text-peach-300 tracking-wider">Live Now</div>
                   <div className="text-xl sm:text-2xl font-bold leading-tight">iCandy Mega Mum Bundle - £8,770</div>
                 </div>
                 <Link to="/competitions/icandy-mega-mum-bundle" className="flex-shrink-0">
                   <div className="bg-white text-teal-900 rounded-full p-3 sm:p-4 hover:scale-110 hover:bg-peach-300 transition-all duration-300 cursor-pointer shadow-lg">
                     <ArrowRight size={22} strokeWidth={2.5} />
                   </div>
                 </Link>
               </div>
             </div>
           </div>
           
           {/* Floating Stats Card */}
           <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl border border-cream-200 hidden lg:block animate-float" style={{ animationDuration: '5s' }}>
             <div className="flex items-center gap-4">
               <div className="bg-yellow-400 text-yellow-900 p-4 rounded-xl">
                 <Zap size={28} strokeWidth={2} />
               </div>
               <div>
                 <div className="text-3xl font-bold text-teal-900">1,905</div>
                 <div className="text-sm text-stone-600 font-medium">Instant Wins</div>
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
    { icon: Zap, title: "Instant Wins", desc: "Win prizes immediately when you enter" },
    { icon: Gift, title: "1,900+ Prizes", desc: "Available in our current competition" },
    { icon: Check, title: "Guaranteed Draw", desc: "End prize draw regardless of sales" },
    { icon: Trophy, title: "Real Winners", desc: "Prizes delivered free to your door" },
  ];

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
          @keyframes seamless-trust-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .trust-scroll-item {
            animation: seamless-trust-scroll 15s linear infinite;
          }
          .trust-scroll-item:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex">
          {/* First set */}
          <div className="flex trust-scroll-item shrink-0">
            {trustItems.map((item, index) => (
              <div key={`set1-${index}`} className="flex-shrink-0 w-[280px] px-4">
                <TrustItem icon={item.icon} title={item.title} desc={item.desc} />
              </div>
            ))}
          </div>
          {/* Second set for seamless loop */}
          <div className="flex trust-scroll-item shrink-0" aria-hidden="true">
            {trustItems.map((item, index) => (
              <div key={`set2-${index}`} className="flex-shrink-0 w-[280px] px-4">
                <TrustItem icon={item.icon} title={item.title} desc={item.desc} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const InstantWinsSection = () => {
  const instants = competitions.filter(c => c.instantWin === true);
  
  // Don't show this section separately if we only have one competition
  // (it's already featured above)
  if (instants.length === 0 || competitions.length <= 1) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-peach-50 via-cream-50 to-teal-50 relative overflow-hidden border-y border-cream-200">
       {/* Background bling */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-peach-200 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-peach-100 rounded-full blur-[150px]"></div>
       </div>
       
       {/* Subtle decorative elements */}
       <SparkleDecor className="absolute top-8 right-16 w-20 h-20 opacity-60 animate-gentle-spin hidden lg:block" />
       <ConfettiDecor className="absolute bottom-12 left-20 w-16 h-16 opacity-50 hidden md:block" />

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
             <div>
                <div className="inline-flex items-center gap-2 bg-peach-300 text-teal-900 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider shadow-sm border-2 border-peach-400">
                  <Zap size={14} fill="currentColor" /> Flash Prizes
                </div>
                <h2 className="text-4xl font-bold font-serif tracking-tight text-teal-900">Instant Wins</h2>
                <p className="text-stone-600 mt-2 max-w-xl font-medium">Find a lucky ticket number and win these prizes instantly. No need to wait for the draw date!</p>
             </div>
             <Link to="/competitions?filter=instant">
               <Button variant="outline" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                 View All Instant Wins
               </Button>
             </Link>
          </div>

          {/* 2-column grid on mobile, never collapses to single column */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
             {instants.slice(0, 4).map(comp => (
               <CompetitionCard key={comp.id} comp={comp} variant="instant" />
             ))}
          </div>
       </div>
    </section>
  );
};

// Featured Competitions Slider - horizontal swipeable on mobile
const FeaturedCompetitionsSlider = () => {
  // Filter featured competitions (or use first few if none marked featured)
  const featuredComps = competitions.filter(c => c.isFeatured === true);
  const displayComps = featuredComps.length > 0 ? featuredComps : competitions.slice(0, 4);
  
  if (displayComps.length === 0) return null;

  return (
    <section className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 text-yellow-900 p-2 rounded-lg shadow-sm">
              <Zap size={20} fill="currentColor" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal-900 tracking-tight">Featured Competitions</h2>
          </div>
          <Link to="/competitions" className="text-sm font-bold text-teal-600 uppercase hover:text-teal-800 hidden sm:block">
            View All
          </Link>
        </div>
        
        {/* Horizontal scrollable slider with snap */}
        <div className="relative -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {displayComps.map((comp) => (
              <div key={comp.id} className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start">
                <CompetitionCard comp={comp} variant={comp.instantWin ? 'instant' : 'default'} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile view all link */}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/competitions">
            <Button variant="outline" className="border-teal-500 text-teal-700">
              View All Competitions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const PrizeTypesSection = () => {
  // Prize types available in the current iCandy competition
  const prizeTypes = [
    { 
      title: 'iCandy Prams & Pushchairs', 
      desc: 'Premium travel systems including the Peach 7 and Pip pushchair',
      image: '/images/competitions/PRIZE 1 ICANDY PEACH 7.png',
      count: '6 prizes'
    },
    { 
      title: 'iCandy Car Seats', 
      desc: 'ADAC-rated Cocoon swivel car seats with ISOFIX bases',
      image: '/images/competitions/PRIZE 2 ICANDY COOON.png',
      count: '4 prizes'
    },
    { 
      title: 'Shopping Vouchers', 
      desc: '£100 Smyths Toys vouchers to spend on whatever you need',
      image: '/images/competitions/PRIZE 4 SMYTHS TOY VOUCHER.png',
      count: '5 prizes'
    },
    { 
      title: 'Baby Accessories', 
      desc: 'Rockit portable baby rockers - rechargeable and travel-friendly',
      image: '/images/competitions/PRIZE 5 ROCKIT BABY ROCKER.png',
      count: '10 prizes'
    },
    { 
      title: 'Cash Prizes', 
      desc: '£50, £20 and £10 cash wins - spend on whatever you like',
      image: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?auto=format&fit=crop&q=80&w=600',
      count: '32 prizes'
    },
    { 
      title: 'Site Credit', 
      desc: 'BabyBets credit from £5 down to 50p for future competitions',
      image: '/babybets-logo.png',
      count: '1,850 prizes'
    },
  ];

  return (
    <section className="py-16 bg-cream-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="peach" className="mb-4">Over 1,900 Prizes</Badge>
          <h2 className="text-3xl font-bold font-serif text-teal-900 tracking-tight mb-4">What You Can Win</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            From premium iCandy prams worth over £1,500 to instant cash wins. Every ticket gives you a chance to win something amazing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {prizeTypes.map((prize, i) => (
            <Link to="/competitions/icandy-mega-mum-bundle" key={i} className="group">
              <div className="bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden bg-cream-50">
                  <img 
                    src={prize.image} 
                    alt={prize.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-teal-900">{prize.title}</h3>
                    <span className="text-xs font-bold text-peach-600 bg-peach-50 px-2 py-1 rounded">{prize.count}</span>
                  </div>
                  <p className="text-sm text-stone-500">{prize.desc}</p>
                </div>
              </div>
            </Link>
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
      <Badge variant="peach" className="mb-4 bg-peach-300 text-teal-900">Instant Win</Badge>
      <h2 className="text-4xl font-bold font-serif mb-4 tracking-tight">How It Works</h2>
      <p className="text-teal-100 mb-16 max-w-xl mx-auto text-lg">Enter our instant win competition and discover if you've won straight away.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-teal-400/30 -z-10 mx-16"></div>

        {[
          { icon: Ticket, title: "Choose a Competition", text: "Browse our instant wins or scheduled draws. Pick your competition and enter." },
          { icon: Zap, title: "Tap to Reveal", text: "For instant wins, tap to reveal your result immediately after purchase." },
          { icon: Gift, title: "Claim Prize", text: "Won a prize? Choose the physical item, cash alternative, or withdraw to your bank." },
          { icon: Trophy, title: "Scheduled Draw", text: "Every ticket also enters the end prize draw at competition close." },
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center group">
             <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-xl group-hover:bg-peach-300 transition-colors duration-300">
               <div className="text-peach-300 group-hover:text-teal-900 transition-colors duration-300">
                 <step.icon size={36} strokeWidth={1.5} />
               </div>
             </div>
             <h3 className="font-bold font-serif text-xl mb-3">{step.title}</h3>
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
  
  // Don't show this section if there's only one competition (it's already featured)
  if (newComps.length <= 1) return null;
  
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8 md:mb-10">
           <div className="bg-teal-500 text-white p-1.5 rounded-lg shadow-sm">
             <Star size={20} fill="white" />
           </div>
           <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal-900 tracking-tight">Just Launched</h2>
        </div>
        
        {/* 2-column grid on mobile (industry standard) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {newComps.map(comp => (
             <CompetitionCard key={comp.id} comp={comp} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnerSpotlightSection = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach-300/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Content */}
          <div className="text-white order-2 lg:order-1">
            <Badge variant="peach" className="mb-4 bg-peach-300 text-teal-900">
              <Heart size={12} className="inline mr-1 fill-current" />
              Official Partner
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight mb-4">
              Meet Shelley & Nick
            </h2>
            
            <p className="text-teal-50 text-lg mb-6 leading-relaxed">
              Join our amazing partner family in their journey to win premium baby gear! Shelley & Nick are parents just like you, sharing their love for BabyBets competitions.
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-peach-300 p-2 rounded-lg">
                  <Sparkles size={20} className="text-teal-900" />
                </div>
                <div className="flex-1">
                  <p className="text-white italic leading-relaxed">
                    "BabyBets is genuinely one of the best competition sites we have come across. Transparent draws, amazing prizes, and real winners!"
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-peach-300">
                  <img 
                    src="/ShelleyxNick-hero-image.jpg" 
                    alt="Shelley and Nick"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-white">Shelley x Nick</div>
                  <div className="text-teal-200 text-sm">BabyBets Official Partners</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-2xl font-bold text-white mb-1">5+</div>
                <div className="text-xs text-teal-100">Years Parenting</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-xs text-teal-100">Prizes Won</div>
              </div>
            </div>

            <Link to="/partner/shelleyxnick">
              <Button className="bg-peach-300 text-teal-900 hover:bg-peach-400 font-bold border-none shadow-lg group">
                Visit Their Page
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2">
            <Link to="/partner/shelleyxnick" className="block group">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-peach-300/0 group-hover:bg-peach-300/10 transition-colors duration-300 z-10"></div>
                
                <img 
                  src="/ShelleyxNick-hero-image.jpg" 
                  alt="Shelley and Nick - BabyBets Official Partners"
                  className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating badge */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-peach-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-teal-900">Active Now</span>
                </div>

                {/* Instagram badge */}
                <div className="absolute bottom-6 right-6 bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                  <Instagram size={24} className="text-white" />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

const SocialProofSection = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  const mobileVideoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  
  const videoCards = [
    {
      video: "https://res.cloudinary.com/dkew5dwgo/video/upload/v1768531254/Untitled_design_jiwqlw.mp4",
      quote: "The instant win feature is amazing - I couldn't believe it when I won!",
      name: "Happy Winner",
      position: "BabyBets Member"
    },
    {
      video: "https://res.cloudinary.com/dkew5dwgo/video/upload/v1768531246/Untitled_design_1_g8expr.mp4",
      quote: "Such great prizes and the whole experience is so easy and fun.",
      name: "Delighted Parent",
      position: "BabyBets Member"
    },
    {
      video: "https://res.cloudinary.com/dkew5dwgo/video/upload/v1768530339/ugc-1_htgxzf.mp4",
      quote: "BabyBets is serving us so we can serve our little ones with the best gear.",
      name: "Sarah Dengate",
      position: "Mum of 2"
    },
    {
      video: "https://res.cloudinary.com/dkew5dwgo/video/upload/v1768530338/ugc-4_ix3qkq.mp4",
      quote: "It's a trusted platform that helps us afford premium nursery essentials.",
      name: "David Mitchell",
      position: "First-time Dad"
    },
    {
      video: "https://res.cloudinary.com/dkew5dwgo/video/upload/v1768530338/ugc-2_am7aws.mp4",
      quote: "BabyBets is the best thing I've discovered in the past two years of parenting.",
      name: "Emma Makielski",
      position: "Mum of 3"
    },
    {
      video: "https://res.cloudinary.com/dkew5dwgo/video/upload/v1768530339/ugc-3_qpxzs2.mp4",
      quote: "Absolutely love the quality of prizes and the instant win feature!",
      name: "Michael Thompson",
      position: "Dad of 1"
    }
  ];

  // For desktop: max slide position (show 4 at a time, so max is length - 4)
  const maxDesktopSlide = Math.max(0, videoCards.length - 4);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      // On mobile, loop through all videos
      // On desktop, loop back to 0 when we've shown all
      if (prev >= maxDesktopSlide) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return maxDesktopSlide;
      }
      return prev - 1;
    });
  };

  // Auto-slide effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= maxDesktopSlide) {
          return 0;
        }
        return prev + 1;
      });
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [maxDesktopSlide]);

  // Ensure videos play on mount and when component becomes visible
  React.useEffect(() => {
    const playAllVideos = () => {
      // Play desktop videos
      videoRefs.current.forEach((video) => {
        if (video) {
          video.play().catch(() => {
            // Autoplay was prevented, that's okay
          });
        }
      });
      // Play mobile videos
      mobileVideoRefs.current.forEach((video) => {
        if (video) {
          video.play().catch(() => {
            // Autoplay was prevented, that's okay
          });
        }
      });
    };

    // Play videos immediately
    playAllVideos();

    // Also play when page becomes visible (after navigation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playAllVideos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Play videos when user interacts with the page (helps with autoplay restrictions)
    const handleInteraction = () => {
      playAllVideos();
    };
    
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-teal-900 tracking-tight mb-6">
            Win amazing prizes<br />
            at unbeatable odds
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            Real families winning real prizes every week. Affordable entry prices with genuine chances to win premium baby gear.
          </p>
        </div>

        {/* Video Slider - Mobile: Render all videos but only show current */}
        <div className="md:hidden relative">
          <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl max-w-sm mx-auto">
            {videoCards.map((card, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Background Video */}
                <video 
                  ref={(el) => { mobileVideoRefs.current[index] = el; }}
                  src={card.video}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <p className="text-xl font-medium mb-8 leading-relaxed">
                    "{card.quote}"
                  </p>
                  
                  <div>
                    <p className="font-bold text-lg leading-tight">{card.name}</p>
                    <p className="text-white/70 text-sm font-medium">{card.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-teal-900 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-20"
            aria-label="Previous video"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-teal-900 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-20"
            aria-label="Next video"
          >
            <ArrowRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {videoCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-teal-500 w-8' : 'bg-stone-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Video Slider - Desktop */}
        <div className="hidden md:block relative">
          {/* Navigation Arrow - Left */}
          <button 
            onClick={prevSlide}
            className="absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm text-teal-900 p-4 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
            aria-label="Previous videos"
          >
            <ArrowRight size={24} className="rotate-180" />
          </button>

          {/* Videos Container */}
          <div className="overflow-hidden mx-8 lg:mx-12">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 4 + 1.5)}%)` }}
            >
              {videoCards.map((card, index) => (
                <div 
                  key={index} 
                  className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 w-[calc(25%-18px)]"
                >
                  {/* Background Video */}
                  <video 
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={card.video}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end text-white">
                    <p className="text-base lg:text-lg font-medium mb-6 leading-relaxed line-clamp-3">
                      "{card.quote}"
                    </p>
                    
                    <div>
                      <p className="font-bold text-base leading-tight">{card.name}</p>
                      <p className="text-white/70 text-sm font-medium">{card.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrow - Right */}
          <button 
            onClick={nextSlide}
            className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm text-teal-900 p-4 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
            aria-label="Next videos"
          >
            <ArrowRight size={24} />
          </button>

          {/* Dots Indicator - only show valid positions */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxDesktopSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-teal-500 w-10' : 'bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => (
  <section className="py-20 bg-cream-100 border-y border-cream-200 relative overflow-hidden">
     {/* Subtle heart decoration */}
     <HeartDecor className="absolute top-12 right-16 w-16 h-16 opacity-30 animate-float hidden lg:block" />
     
     <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-16 items-center">
           <div className="w-full md:w-1/3">
              <div className="flex text-peach-500 mb-6 gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={24} />)}
              </div>
              <h2 className="text-4xl font-bold font-serif text-teal-900 mb-6 tracking-tight">Don't just take our word for it.</h2>
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
    {/* Elegant decorative illustrations */}
    <CloudDecor className="absolute top-8 left-8 w-28 h-28 opacity-30 animate-float hidden md:block" />
    <CloudDecor variant="small" className="absolute bottom-8 right-12 w-24 h-24 opacity-25 animate-float-reverse hidden md:block" />
    <HeartDecor className="absolute top-1/2 right-20 w-12 h-12 opacity-40 animate-gentle-spin hidden lg:block" />
    <SparkleDecor className="absolute bottom-16 left-24 w-16 h-16 opacity-40 hidden lg:block" />
    
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 text-center">
       <div className="inline-flex items-center gap-2 border border-teal-900/10 rounded-full px-4 py-1.5 text-sm font-bold mb-8 bg-white/40 text-teal-900">
         <Mail size={16} /> Join the Club
       </div>
       <h2 className="text-4xl md:text-5xl font-bold font-serif text-teal-900 tracking-tight leading-none mb-6">
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
    "description": "Instant win baby prize competitions in the UK. Win iCandy prams, car seats, and cash prizes instantly.",
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
      "reviewCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <SEO
        title="Win iCandy Prams & Baby Prizes Instantly | BabyBets UK"
        description="Enter our instant win competition for iCandy Peach 7, Cocoon car seats, and cash prizes. Over 1,900 instant wins available. Tap to reveal your prize now!"
        keywords="instant win competitions uk, win iCandy pram, baby prize competitions, instant win baby prizes, instant reveal competitions"
        canonical="https://babybets.co.uk/"
        schema={organizationSchema}
      />
      
      <WinnerTicker speed="fast" />
      <HeroSection />
      <FeaturedCompetitionsSlider />
      <HowItWorksSection />
      <InstantWinsSection />
      <JustLaunchedSection />
      <PartnerSpotlightSection />
      <SocialProofSection />
      <NewsletterSection />
    </div>
  );
};
