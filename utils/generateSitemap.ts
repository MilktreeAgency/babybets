import { competitions } from '../mockData';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://babybets.co.uk';
  const today = new Date().toISOString().split('T')[0];

  const urls: SitemapURL[] = [
    // Homepage
    {
      loc: baseUrl,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0
    },
    // Main pages
    {
      loc: `${baseUrl}/competitions`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/winners`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/how-it-works`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/faq`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/partners`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6
    },
    // Category pages
    {
      loc: `${baseUrl}/competitions?cat=nursery`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85
    },
    {
      loc: `${baseUrl}/competitions?cat=prams`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85
    },
    {
      loc: `${baseUrl}/competitions?cat=toys`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85
    },
    {
      loc: `${baseUrl}/competitions?cat=holidays`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85
    },
    {
      loc: `${baseUrl}/competitions?cat=cash`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85
    },
    // Instant wins
    {
      loc: `${baseUrl}/competitions?filter=instant`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85
    },
    // Legal pages
    {
      loc: `${baseUrl}/legal/terms`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/legal/privacy`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5
    }
  ];

  // Add all competition pages
  competitions.forEach(comp => {
    urls.push({
      loc: `${baseUrl}/competitions/${comp.slug}`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

/**
 * Function to download sitemap (call this from browser console or create a utility page)
 */
export const downloadSitemap = () => {
  const xml = generateSitemap();
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

