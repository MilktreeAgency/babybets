import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BasketDrawer } from './components/ui/BasketDrawer';
import { SpinWheelModal } from './components/ui/SpinWheelModal';
import { useStore } from './store';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Competitions = lazy(() => import('./pages/Competitions').then(module => ({ default: module.Competitions })));
const CompetitionDetail = lazy(() => import('./pages/CompetitionDetail').then(module => ({ default: module.CompetitionDetail })));
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const Winners = lazy(() => import('./pages/Winners').then(module => ({ default: module.Winners })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const Partners = lazy(() => import('./pages/Partners').then(module => ({ default: module.Partners })));
const Account = lazy(() => import('./pages/Account').then(module => ({ default: module.Account })));
const HowItWorks = lazy(() => import('./pages/HowItWorks').then(module => ({ default: module.HowItWorks })));
const FAQ = lazy(() => import('./pages/FAQ').then(module => ({ default: module.FAQ })));
const Legal = lazy(() => import('./pages/Legal').then(module => ({ default: module.Legal })));
const MaisibelleCollab = lazy(() => import('./pages/MaisibelleCollab').then(module => ({ default: module.MaisibelleCollab })));

// Loading component with branded styling
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] bg-cream-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-teal-900 font-bold text-sm">Loading...</p>
    </div>
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const { setAffiliateCode } = useStore();
  const [showWheel, setShowWheel] = useState(false);

  useEffect(() => {
    // Basic affiliate simulation
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('utm_source');
    if (ref) {
      setAffiliateCode(ref);
    }
  }, [setAffiliateCode]);

  // Spin Wheel Timer Logic
  useEffect(() => {
    // Check if user has already seen the wheel or completed an action to dismiss it permanently
    const hasSeenWheel = localStorage.getItem('babybets_seen_wheel');

    if (!hasSeenWheel) {
      // Reduced to 10 seconds (10000ms) for better UX engagement
      const timer = setTimeout(() => {
        setShowWheel(true);
        localStorage.setItem('babybets_seen_wheel', 'true');
      }, 10000); 

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="font-sans antialiased text-stone-800 bg-stone-50 min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <BasketDrawer />
      <SpinWheelModal isOpen={showWheel} onClose={() => setShowWheel(false)} />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/:slug" element={<CompetitionDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/legal/:type" element={<Legal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/affiliates" element={<Partners />} />
            <Route path="/account" element={<Account />} />
            <Route path="/maisibelle-x-babybets" element={<MaisibelleCollab />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
