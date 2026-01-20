/**
 * Partner/Influencer Page
 * 
 * Auto-generated page for influencers at /partner/:slug
 * - Full-width hero with background image
 * - Bio and social proof
 * - Featured competition grid
 * - Track all sales via slug / UTM
 */

import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Instagram, Users, ArrowRight, Star, ExternalLink, Heart, Sparkles, Play, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { competitions } from '../mockData';
import { CompetitionCard } from '../components/ui/CompetitionCard';
import { Button, Badge } from '../components/ui';
import { SEO } from '../components/SEO';
import { useStore } from '../store';

// Influencer data - in production this would come from Supabase
interface InfluencerData {
  slug: string;
  displayName: string;
  tagline: string;
  bio: string;
  longBio?: string;
  heroImage: string;
  profileImage?: string;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  followers: string;
  isAmbassador: boolean;
  stats?: {
    label: string;
    value: string;
  }[];
  testimonial?: string;
}

const mockInfluencers: Record<string, InfluencerData> = {
  'shelleyxnick': {
    slug: 'shelleyxnick',
    displayName: 'Shelley x Nick',
    tagline: 'Parenting, family life & finding the best for our little ones',
    bio: "We're Shelley & Nick - parents, partners, and prize competition enthusiasts! We've partnered with BabyBets to bring you the best chances to win amazing baby and family prizes.",
    longBio: "As parents ourselves, we know how expensive it can be to give your little ones the best start in life. That's why we love BabyBets - real prizes, real winners, and real chances to win premium baby gear without breaking the bank. We've personally vetted this platform and are proud to partner with them. Every entry through our page supports our family while giving you the chance to win incredible prizes!",
    heroImage: '/ShelleyxNick-hero-image.jpg',
    profileImage: '/ShelleyxNick-hero-image.jpg',
    socialLinks: {
      instagram: 'https://instagram.com/shelleyxnick',
      tiktok: 'https://tiktok.com/@shelleyxnick',
    },
    followers: '250K+',
    isAmbassador: true,
    stats: [
      { label: 'Combined Followers', value: '250K+' },
      { label: 'Years Parenting', value: '5+' },
      { label: 'Prizes Won', value: '12' },
    ],
    testimonial: "BabyBets is genuinely one of the best competition sites we have come across. Transparent draws, amazing prizes, and we have seen real people win. We are so excited to partner with them!",
  },
  'sarah-mum-life': {
    slug: 'sarah-mum-life',
    displayName: 'Sarah - Mum Life',
    tagline: 'Mum of 2 sharing our parenting journey',
    bio: 'Mum of 2 sharing our journey through parenthood. Lover of baby gear, family adventures, and finding the best deals for families.',
    heroImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    socialLinks: {
      instagram: 'https://instagram.com/sarahmumlife',
      tiktok: 'https://tiktok.com/@sarahmumlife',
    },
    followers: '45K',
    isAmbassador: true,
  },
  'the-baby-club': {
    slug: 'the-baby-club',
    displayName: 'The Baby Club',
    tagline: 'Your go-to for baby product reviews',
    bio: 'Your go-to resource for baby product reviews, parenting tips, and exclusive deals. Join our community of amazing parents!',
    heroImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1200',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    socialLinks: {
      instagram: 'https://instagram.com/thebabyclub',
      youtube: 'https://youtube.com/@thebabyclub',
    },
    followers: '120K',
    isAmbassador: true,
  },
  'demo': {
    slug: 'demo',
    displayName: 'Demo Partner',
    tagline: 'Demo partner page',
    bio: 'This is a demo partner page to show how influencer pages work on BabyBets.',
    heroImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1200',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    socialLinks: {
      instagram: 'https://instagram.com/demo',
    },
    followers: '10K',
    isAmbassador: false,
  },
};

export const PartnerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setAffiliateCode } = useStore();
  
  // Get influencer data
  const influencer = slug ? mockInfluencers[slug] : null;

  // Set affiliate code on page load for tracking
  useEffect(() => {
    if (slug) {
      setAffiliateCode(slug);
    }
  }, [slug, setAffiliateCode]);

  // Filter active competitions
  const activeCompetitions = useMemo(() => {
    return competitions.filter(c => c.status === 'active' || c.status === 'new' || c.status === 'ending_soon');
  }, []);

  // Separate instant wins
  const instantWins = useMemo(() => {
    return activeCompetitions.filter(c => c.instantWin === true);
  }, [activeCompetitions]);

  const regularComps = useMemo(() => {
    return activeCompetitions.filter(c => c.instantWin !== true);
  }, [activeCompetitions]);

  // 404 state if influencer not found
  if (!influencer) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-serif text-teal-900 mb-4">Partner Not Found</h1>
          <p className="text-stone-500 mb-8">We couldn't find this partner page. It may have been removed or the link is incorrect.</p>
          <Link to="/competitions">
            <Button>View All Competitions</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <SEO
        title={`${influencer.displayName} | BabyBets Partner`}
        description={influencer.bio}
        canonical={`https://babybets.co.uk/partner/${influencer.slug}`}
        ogImage={influencer.heroImage}
      />

      {/* Full-Width Hero Section with Background Image */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={influencer.heroImage} 
            alt={influencer.displayName}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full pb-12 md:pb-20 pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              {/* Ambassador Badge */}
              {influencer.isAmbassador && (
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
                  <Star size={16} fill="currentColor" />
                  Official BabyBets Ambassador
                </div>
              )}

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-4 leading-tight">
                {influencer.displayName}
              </h1>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-peach-200 font-medium mb-6">
                {influencer.tagline}
              </p>

              {/* Bio */}
              <p className="text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
                {influencer.bio}
              </p>

              {/* Social Stats & Links */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Follower Count */}
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                  <Users size={22} className="text-peach-300" />
                  <div>
                    <div className="font-bold text-white text-lg">{influencer.followers}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Followers</div>
                  </div>
                </div>

                {/* Social Links */}
                {influencer.socialLinks.instagram && (
                  <a 
                    href={influencer.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 px-5 py-3 rounded-xl transition-all border border-white/20 group"
                  >
                    <Instagram size={22} className="text-pink-400" />
                    <span className="font-bold text-white">Instagram</span>
                    <ExternalLink size={14} className="text-white/50 group-hover:text-white transition-colors" />
                  </a>
                )}
                {influencer.socialLinks.tiktok && (
                  <a 
                    href={influencer.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 px-5 py-3 rounded-xl transition-all border border-white/20 group"
                  >
                    <Play size={22} className="text-cyan-400" />
                    <span className="font-bold text-white">TikTok</span>
                    <ExternalLink size={14} className="text-white/50 group-hover:text-white transition-colors" />
                  </a>
                )}
              </div>

              {/* CTA Button */}
              <Link to="/competitions">
                <Button size="lg" className="text-lg px-8 py-6 shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all">
                  <Sparkles size={20} className="mr-2" />
                  Enter Competitions Now
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Only show if influencer has stats */}
      {influencer.stats && influencer.stats.length > 0 && (
        <section className="bg-teal-800 py-8 border-b border-teal-700">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8">
              {influencer.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-teal-200 uppercase tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section - Only show if influencer has testimonial */}
      {influencer.testimonial && (
        <section className="py-12 bg-gradient-to-br from-peach-50 to-cream-50 border-b border-cream-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Heart className="mx-auto mb-4 text-peach-400" size={32} />
            <blockquote className="text-xl md:text-2xl text-teal-900 font-serif italic leading-relaxed mb-4">
              "{influencer.testimonial}"
            </blockquote>
            <cite className="text-stone-500 font-medium not-italic">— {influencer.displayName}</cite>
          </div>
        </section>
      )}

      {/* About Section - Only show if influencer has longBio */}
      {influencer.longBio && (
        <section className="py-16 bg-white border-b border-cream-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Users size={24} className="text-teal-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal-900">
                About {influencer.displayName}
              </h2>
            </div>
            <p className="text-lg text-stone-600 leading-relaxed">
              {influencer.longBio}
            </p>
          </div>
        </section>
      )}

      {/* Instant Wins Section */}
      {instantWins.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-peach-50 via-cream-50 to-teal-50 border-b border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                  <Sparkles size={14} />
                  Instant Win
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal-900">
                  Win Prizes Instantly
                </h2>
                <p className="text-stone-500 mt-1">Tap to reveal if you're an instant winner!</p>
              </div>
              <Badge variant="peach" className="hidden sm:flex">
                {instantWins.length} Available
              </Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {instantWins.slice(0, 4).map(comp => (
                <CompetitionCard 
                  key={comp.id} 
                  comp={comp} 
                  variant="instant"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Competitions Section */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                <TrendingUp size={14} />
                Featured
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-teal-900">
                {influencer.displayName}'s Top Picks
              </h2>
              <p className="text-stone-500 mt-1">Hand-picked competitions we think you'll love</p>
            </div>
            <Badge variant="peach" className="hidden sm:flex">
              {activeCompetitions.length} Live
            </Badge>
          </div>

          {/* Competition Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {activeCompetitions.map(comp => (
              <CompetitionCard 
                key={comp.id} 
                comp={comp} 
                variant={comp.instantWin ? 'instant' : 'default'}
              />
            ))}
          </div>

          {activeCompetitions.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-cream-200">
              <p className="text-stone-500">No active competitions at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-white border-y border-cream-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">25,000+</div>
              <div className="text-sm text-stone-500">Happy Winners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">£10M+</div>
              <div className="text-sm text-stone-500">Prizes Awarded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">4.9/5</div>
              <div className="text-sm text-stone-500">Trustpilot Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">Live</div>
              <div className="text-sm text-stone-500">Streamed Draws</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-teal-800 to-teal-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-peach-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <Sparkles className="mx-auto mb-4 text-peach-300" size={40} />
          <h3 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
            Ready to Win?
          </h3>
          <p className="text-xl text-teal-100 mb-8">
            Enter through {influencer.displayName}'s link and get your chance to win amazing prizes for your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/competitions">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-peach-400 hover:bg-peach-500 text-teal-900">
                View All Competitions
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-12 bg-cream-50 border-t border-cream-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold font-serif text-teal-900 mb-2">
            Want to become a BabyBets Partner?
          </h3>
          <p className="text-stone-500 mb-6">
            Earn up to 25% commission on every ticket sold through your unique link.
          </p>
          <Link to="/partners">
            <Button variant="outline" size="sm">
              Apply Now
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;
