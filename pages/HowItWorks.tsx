import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Ticket, CreditCard, Trophy, Gift, Facebook, ShieldCheck, CheckCircle, HelpCircle } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { SEO } from '../components/SEO';
import { CloudDecor, SparkleDecor } from '../components/illustrations';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Ticket,
      title: "1. Buy Tickets",
      desc: "Choose how many tickets you want. The more you buy, the cheaper per ticket - from just £1.70 each at 60+ tickets.",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: CreditCard,
      title: "2. Secure Checkout",
      desc: "Pay securely using our encrypted checkout. We accept all major cards. No subscription required.",
      color: "bg-peach-100 text-peach-600"
    },
    {
      icon: Zap,
      title: "3. Scratch & Reveal",
      desc: "After purchase, scratch your virtual tickets to instantly reveal if you've won one of over 1,900 prizes!",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Trophy,
      title: "4. Claim Your Prize",
      desc: "Won something? Choose between the prize or cash alternative. We deliver free. Plus, every ticket enters the £50 end prize draw.",
      color: "bg-green-100 text-green-600"
    }
  ];

  // HowTo Schema for rich snippets
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Enter BabyBets Instant Win Competitions",
    "description": "Learn how to enter BabyBets instant win competitions in 4 simple steps. Buy tickets, scratch to reveal, and win prizes instantly.",
    "totalTime": "PT5M",
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title.replace(/^\d+\.\s*/, ''),
      "text": step.desc
    }))
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <SEO
        title="How It Works | Instant Win Competitions | BabyBets"
        description="Enter BabyBets instant win competitions and find out if you've won immediately! Buy tickets, scratch to reveal prizes, and claim your winnings. Over 1,900 prizes available."
        keywords="instant win competitions, how to win baby prizes, scratch card competitions, instant win uk, babybets guide"
        canonical="https://babybets.co.uk/how-it-works"
        schema={howToSchema}
      />

      {/* Hero */}
      <section className="bg-teal-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-800/30 pattern-dots" />
        
        {/* Subtle decorative elements */}
        <CloudDecor className="absolute top-8 right-16 w-32 h-32 opacity-20 animate-float hidden lg:block" />
        <CloudDecor variant="small" className="absolute bottom-8 left-20 w-24 h-24 opacity-15 animate-float-reverse hidden md:block" />
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <Badge variant="peach" className="mb-6">Instant Win</Badge>
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6 tracking-tight">How It Works</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Enter our instant win competition and discover if you've won straight away. Over 1,900 prizes available to win instantly!
          </p>
        </div>
      </section>

      {/* Steps Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 relative overflow-hidden">
        {/* Elegant sparkle accents */}
        <SparkleDecor className="absolute top-12 right-8 w-16 h-16 opacity-40 animate-gentle-spin hidden xl:block" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
           {/* Connector Line (Desktop) */}
           <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-stone-200 -z-10 mx-16 border-t-2 border-dashed border-stone-300" aria-hidden="true"></div>

           {steps.map((step, i) => (
             <article key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-cream-200 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-6 bg-teal-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-cream-50 z-20" aria-hidden="true">
                  {i + 1}
                </div>
                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                   <step.icon size={32} strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold font-serif text-teal-900 mb-3">{step.title}</h2>
                <p className="text-stone-500 leading-relaxed text-sm">{step.desc}</p>
             </article>
           ))}
        </div>
        
        <div className="text-center mt-12">
           <Link to="/competitions">
             <Button size="lg" className="px-10 shadow-xl shadow-teal-100">Start Winning Today</Button>
           </Link>
        </div>
      </section>

      {/* Trust & Fairness */}
      <section className="py-20 bg-white border-y border-cream-200">
         <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-4xl font-bold font-serif text-teal-900 mb-6">Fairness Guaranteed</h2>
                  <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                    Our instant win system is completely fair and transparent. Winning ticket codes are pre-assigned before the competition goes live, so every ticket has a genuine chance to win.
                  </p>
                  
                  <ul className="space-y-4">
                     {[
                       "Winning codes pre-assigned before competition starts",
                       "Instant reveal - find out immediately if you've won",
                       "Choose between prize or cash alternative",
                       "End prize draw for all ticket holders",
                       "Free postal entry route available"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-teal-800 font-medium">
                          <CheckCircle className="text-peach-500 shrink-0" size={20} aria-hidden="true" />
                          {item}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="relative">
                  <div className="bg-cream-100 rounded-[3rem] p-8 aspect-square relative z-0" aria-hidden="true"></div>
                  <img 
                    src="/images/competitions/PRIZE 1 ICANDY PEACH 7.png" 
                    className="absolute inset-0 w-full h-full object-contain rounded-[3rem] -translate-x-6 -translate-y-6 shadow-2xl z-10 bg-white p-4" 
                    alt="iCandy Peach 7 - top instant win prize at BabyBets" 
                    loading="lazy"
                  />
                  <div className="absolute bottom-10 right-0 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><Zap size={20} /></div>
                        <span className="font-bold text-teal-900">Instant Wins</span>
                     </div>
                     <p className="text-xs text-stone-500">Over 1,900 prizes to be won instantly including iCandy prams, car seats, and cash!</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-20 text-center">
         <div className="max-w-2xl mx-auto px-4">
            <HelpCircle className="mx-auto text-peach-400 mb-4" size={48} aria-hidden="true" />
            <h2 className="text-3xl font-bold font-serif text-teal-900 mb-4">Still have questions?</h2>
            <p className="text-stone-500 mb-8">
               Check out our Frequently Asked Questions for more details on tickets, odds, and claiming prizes.
            </p>
            <Link to="/faq">
               <Button variant="outline">Visit FAQ Page</Button>
            </Link>
         </div>
      </section>
    </div>
  );
};
