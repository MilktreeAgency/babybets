import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Ticket, CreditCard, Trophy, Mail, Facebook, ShieldCheck, CheckCircle, HelpCircle } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { SEO } from '../components/SEO';
import { CloudDecor, SparkleDecor } from '../components/illustrations';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Choose Your Prize",
      desc: "Browse our competitions and select the prize you'd love to win. From luxury holidays to tax-free cash and nursery bundles.",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: Ticket,
      title: "2. Select Tickets",
      desc: "Choose your lucky numbers or use the lucky dip. The more tickets you buy, the bigger the discount.",
      color: "bg-peach-100 text-peach-600"
    },
    {
      icon: CreditCard,
      title: "3. Secure Checkout",
      desc: "Pay securely using our encrypted checkout. We accept all major cards. No subscription required.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Trophy,
      title: "4. Wait for the Draw",
      desc: "Watch the live draw on Facebook. If you win, we'll contact you immediately to arrange delivery!",
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  // HowTo Schema for rich snippets
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Enter BabyBets Competitions",
    "description": "Learn how to enter BabyBets prize competitions in 4 simple steps. Browse prizes, select tickets, checkout securely, and watch the live draw.",
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
        title="How It Works | Simple 4-Step Competition Entry | BabyBets"
        description="Entering BabyBets competitions is easy! Choose your prize, select tickets, watch the live draw, and win. Guaranteed draws, transparent results, free delivery. Learn how to enter now."
        keywords="how to enter competitions, how do competitions work, how to win baby prizes, competition entry guide, babybets guide"
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
          <Badge variant="peach" className="mb-6">Simple & Transparent</Badge>
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6 tracking-tight">How It Works</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Entering our competitions is easy, fair, and fun. Join thousands of parents winning life-changing prizes every week.
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
                    We pride ourselves on being the most transparent competition site in the UK. We use a random number generator for all draws, streamed live for everyone to see.
                  </p>
                  
                  <ul className="space-y-4">
                     {[
                       "Live draws on Facebook every week",
                       "Winners contacted immediately after draw",
                       "Guaranteed draws regardless of ticket sales",
                       "No extensions, ever",
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
                    src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=800" 
                    className="absolute inset-0 w-full h-full object-cover rounded-[3rem] -translate-x-6 -translate-y-6 shadow-2xl z-10" 
                    alt="Happy BabyBets competition winner celebrating their prize" 
                    loading="lazy"
                  />
                  <div className="absolute bottom-10 right-0 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="bg-teal-100 p-2 rounded-full text-teal-600"><Facebook size={20} /></div>
                        <span className="font-bold text-teal-900">Watch Live</span>
                     </div>
                     <p className="text-xs text-stone-500">Join 45,000+ others watching our draws live on Facebook every Wednesday & Sunday.</p>
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
