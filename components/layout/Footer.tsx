import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, ShieldCheck, Gift, MonitorPlay } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const Footer = () => {
  // Site-wide WebSite schema for search functionality
  const siteLinksSearchBoxSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BabyBets",
    "url": "https://babybets.co.uk",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://babybets.co.uk/competitions?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Local Business schema (optional - helps with local SEO)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BabyBets",
    "description": "Premium family prize competitions in the UK",
    "url": "https://babybets.co.uk",
    "logo": "https://babybets.co.uk/babybets-logo.png",
    "email": "hello@babybets.co.uk",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "priceRange": "£0.29 - £9.99",
    "openingHours": "Mo-Su 00:00-23:59",
    "sameAs": [
      "https://facebook.com/babybetsofficial",
      "https://instagram.com/babybetsofficial",
      "https://tiktok.com/@babybetsofficial"
    ]
  };

  return (
    <footer className="bg-teal-500 text-white pt-20 pb-10 rounded-t-[2.5rem] mt-12">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(siteLinksSearchBoxSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-6" aria-label="BabyBets Home">
              <img 
                src="/babybets-logo.png" 
                alt="BabyBets Logo - Premium Family Prize Competitions UK" 
                className="h-8 brightness-0 invert"
                style={{ filter: 'brightness(0) invert(1)' }}
                loading="lazy"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-teal-100/90 font-medium">
              The premium prize platform for modern families. 
              We make winning dream nursery gear and life-changing cash prizes transparent, fair, and fun.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.instagram.com/babybetsofficial/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-teal-600 rounded-full hover:bg-peach-300 hover:text-teal-900 transition"
                aria-label="Follow BabyBets on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.facebook.com/babybetsofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-teal-600 rounded-full hover:bg-peach-300 hover:text-teal-900 transition"
                aria-label="Follow BabyBets on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@babybetsofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-teal-600 rounded-full hover:bg-peach-300 hover:text-teal-900 transition"
                aria-label="Follow BabyBets on TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label="Competition categories">
            <h4 className="font-bold font-serif text-peach-300 mb-6 uppercase tracking-wider text-xs">Competitions</h4>
            <ul className="space-y-3 text-sm font-medium text-teal-50">
              <li><Link to="/competitions?cat=nursery" className="hover:text-peach-300 transition">Nursery & Gear</Link></li>
              <li><Link to="/competitions?cat=toys" className="hover:text-peach-300 transition">Tech & Toys</Link></li>
              <li><Link to="/competitions?cat=cash" className="hover:text-peach-300 transition">Tax Free Cash</Link></li>
              <li><Link to="/competitions?filter=instant" className="hover:text-peach-300 transition">Instant Wins</Link></li>
              {/* <li><Link to="/winners" className="hover:text-peach-300 transition">Previous Winners</Link></li> */}
              <li>
                <a 
                  href="https://www.facebook.com/babybetsofficial" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-peach-300 transition inline-flex items-center gap-2"
                >
                  <MonitorPlay size={16} aria-hidden="true" />
                  Watch Live Draws
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support and legal">
            <h4 className="font-bold font-serif text-peach-300 mb-6 uppercase tracking-wider text-xs">Support & Trust</h4>
            <ul className="space-y-3 text-sm font-medium text-teal-50">
              <li><Link to="/how-it-works" className="hover:text-peach-300 transition">How it Works</Link></li>
              <li><Link to="/partners" className="hover:text-peach-300 transition text-peach-300">Influencer Program</Link></li>
              <li><Link to="/faq" className="hover:text-peach-300 transition">FAQ</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-peach-300 transition">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-peach-300 transition">Terms & Conditions</Link></li>
              <li><Link to="/legal/terms" className="hover:text-peach-300 underline decoration-teal-300/50">Free Postal Entry</Link></li>
            </ul>
          </nav>

          <div>
            <h4 className="font-bold font-serif text-peach-300 mb-6 uppercase tracking-wider text-xs">Get in Touch</h4>
            <p className="text-sm text-teal-100 mb-4">Need help? Our parent support team is here Mon-Fri.</p>
            <a href="mailto:hello@babybets.co.uk" className="inline-flex items-center text-sm font-bold text-white hover:text-peach-300 transition">
              <Mail size={16} className="mr-2" aria-hidden="true" /> hello@babybets.co.uk
            </a>
            
            <div className="mt-8 pt-6 border-t border-teal-400/30">
              <div className="flex items-center gap-2 text-xs text-teal-100/80 font-medium">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-teal-400/30 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-teal-200">
          <p className="font-medium">&copy; {new Date().getFullYear()} BabyBets Ltd. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span>Registered in UK: 12345678</span>
             <Link to="/admin" className="opacity-40 hover:opacity-100 transition">Admin</Link>
          </div>
        </div>
        
        <div className="mt-8 text-center px-4">
             <p className="text-[10px] text-teal-200/60 max-w-2xl mx-auto leading-relaxed">
                 BabyBets allows you to enter competitions to win prizes. This is a prize draw site, not a lottery. Please play responsibly. 
                 <br/>Free postal entry method is available for all competitions. See terms for details. 18+ UK Residents Only.
             </p>
        </div>
      </div>
    </footer>
  );
};
