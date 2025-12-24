import React from 'react';
import { winners } from '../mockData';
import { SEO } from '../components/SEO';
import { getWinnerImageAlt } from '../utils/imageAlt';

export const Winners = () => {
  // Winners page schema
  const winnersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "BabyBets Recent Winners",
    "description": "Real families who have won amazing prizes with BabyBets UK competitions",
    "numberOfItems": winners.length,
    "itemListElement": winners.map((winner, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": `${winner.name} from ${winner.location}`,
      "description": `Won ${winner.prize} on ${winner.date}`
    }))
  };

  return (
    <div className="min-h-screen bg-cream-50 py-16">
      <SEO
        title="Recent Winners | Real People Winning Real Prizes | BabyBets UK"
        description="Meet our recent winners who've won Bugaboo prams, Disney holidays, cash prizes and more. Join 25,000+ families who've won with BabyBets. See proof of our legitimate prize draws."
        keywords="babybets winners, competition winners uk, baby competition winners, real prize winners, who won babybets, competition proof"
        canonical="https://babybets.co.uk/winners"
        schema={winnersSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
           <h1 className="text-5xl md:text-6xl font-bold font-serif text-teal-900 mb-6 tracking-tight">Our Winners</h1>
           <p className="text-stone-600 max-w-2xl mx-auto text-lg leading-relaxed">
             Transparency is our #1 priority. Every draw is live-streamed, and winners are contacted immediately. These are real families winning real prizes.
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.map((winner) => (
            <article key={winner.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-cream-100">
               <div className="h-72 overflow-hidden relative">
                 <img 
                   src={winner.image} 
                   alt={getWinnerImageAlt(winner)}
                   loading="lazy"
                   className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                 />
                 <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-teal-900 shadow-sm border border-cream-100">
                   Ticket: {winner.ticketNumber}
                 </div>
               </div>
               <div className="p-8">
                 <div className="flex justify-between items-start mb-3">
                   <h2 className="font-bold font-serif text-2xl text-teal-900">{winner.name}</h2>
                   <time className="text-stone-400 text-sm font-medium pt-1">{winner.date}</time>
                 </div>
                 <p className="text-teal-500 font-bold mb-6 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" aria-hidden="true"></span>
                    {winner.location}
                 </p>
                 <div className="bg-cream-50 p-5 rounded-2xl border border-cream-100">
                   <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-2">Prize Won</p>
                   <p className="text-xl font-bold text-teal-900">{winner.prize}</p>
                 </div>
               </div>
            </article>
          ))}
          
          {/* Filler content for visuals since mock data is small */}
          {[1,2,3].map(i => (
             <div key={i} className="bg-cream-50 rounded-[2rem] h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-cream-200 hover:border-teal-200 transition-colors cursor-pointer group">
                <div className="text-center p-8 opacity-60 group-hover:opacity-100 transition-opacity">
                  <p className="font-bold text-2xl mb-3 text-teal-900">Could be you!</p>
                  <p className="text-stone-500 font-medium">Enter a competition today.</p>
                </div>
             </div>
          ))}
        </div>
        
        {/* Trust Section */}
        <section className="mt-20 text-center bg-white p-12 rounded-[2rem] border border-cream-200">
          <h2 className="text-2xl font-bold font-serif text-teal-900 mb-4">Every Winner is Real</h2>
          <p className="text-stone-600 max-w-2xl mx-auto mb-6">
            All our draws are conducted live on Facebook. Winners are contacted immediately and prizes are delivered within 14 days. 
            We take photos with every winner and share their stories with permission.
          </p>
          <div className="flex justify-center gap-8 text-sm font-bold text-teal-600">
            <span>✓ Live Draws</span>
            <span>✓ Instant Contact</span>
            <span>✓ Free Delivery</span>
          </div>
        </section>
      </div>
    </div>
  );
};
