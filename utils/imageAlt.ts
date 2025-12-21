import { Competition, Winner } from '../types';

/**
 * Generate SEO-optimized alt text for competition images
 */
export const getCompetitionImageAlt = (competition: Competition): string => {
  const category = competition.category.toLowerCase();
  
  const altTexts: { [key: string]: string } = {
    'nursery': `${competition.title} - Premium nursery prize worth £${competition.retailValueGBP.toLocaleString()} - UK competition`,
    'prams': `${competition.title} - Luxury pram competition prize worth £${competition.retailValueGBP.toLocaleString()}`,
    'toys': `${competition.title} - Kids toy and tech prize competition`,
    'holidays': `${competition.title} - Family holiday prize competition worth £${competition.retailValueGBP.toLocaleString()}`,
    'cash': `Win £${competition.retailValueGBP.toLocaleString()} tax-free cash prize`
  };

  return altTexts[category] || `${competition.title} competition prize worth £${competition.retailValueGBP.toLocaleString()}`;
};

/**
 * Generate SEO-optimized alt text for winner images
 */
export const getWinnerImageAlt = (winner: Winner): string => {
  return `${winner.name} from ${winner.location} - winner of ${winner.prize} on BabyBets UK competition`;
};

/**
 * Generate image alt text for category pages
 */
export const getCategoryImageAlt = (category: string): string => {
  const categoryAlts: { [key: string]: string } = {
    'Toys': 'Win toys and tech prizes for kids - BabyBets UK competitions',
    'Nursery': 'Win nursery furniture and baby essentials - BabyBets UK',
    'Prams': 'Win luxury prams and pushchairs - BabyBets UK competitions',
    'Holidays': 'Win family holidays and travel prizes - BabyBets UK',
    'Cash': 'Win tax-free cash prizes - BabyBets UK competitions',
    'Instant Wins': 'Instant win prizes - Win immediately on BabyBets'
  };

  return categoryAlts[category] || `${category} prizes - BabyBets UK competitions`;
};

