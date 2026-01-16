import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SEO } from '../components/SEO';

// Map routes to document files and page metadata
const legalPages: Record<string, { 
  title: string; 
  description: string;
  file: string;
  lastUpdated: string;
}> = {
  '/cookies': {
    title: 'Cookie Policy',
    description: 'Learn how BabyBets uses cookies and similar technologies on our website.',
    file: 'cookies.md',
    lastUpdated: 'January 2026'
  },
  '/Frequently-Asked-Questions': {
    title: 'Frequently Asked Questions',
    description: 'Get answers to common questions about BabyBets prize competitions, entries, and prizes.',
    file: 'DOC 1 Copy of PCTK_FAQs_30_May_24 (1).docx.md',
    lastUpdated: 'January 2026'
  },
  '/privacypolicy': {
    title: 'Privacy Policy',
    description: 'How ULaunch Ltd (trading as BabyBets) collects, uses, and protects your personal data.',
    file: 'DOC 2 Copy of PCTK_privacy_policy (1).docx.md',
    lastUpdated: 'January 2026'
  },
  '/acceptable-use-policy': {
    title: 'Acceptable Use Policy',
    description: 'Terms for acceptable use of the BabyBets website and services.',
    file: 'DOC 3 Copy of PCTK_Website_acceptible_use_policy (1).docx.md',
    lastUpdated: 'January 2026'
  },
  '/terms-of-use': {
    title: 'Website Terms of Use',
    description: 'Terms and conditions for using the BabyBets website.',
    file: 'DOC 4 Copy of PCTK_Website_terms_of_use_30_May_24 (1).docx.md',
    lastUpdated: 'January 2026'
  },
  '/Prize-Competition-Terms-and-Conditions': {
    title: 'Prize Competition Terms and Conditions',
    description: 'Full terms and conditions for entering BabyBets prize competitions.',
    file: 'DOC 5 Copy of Prize_Competition_Terms_and_Conditions_11_April_2025 (1).docx.md',
    lastUpdated: 'April 2025'
  }
};

// Also support legacy routes
const legacyRoutes: Record<string, string> = {
  '/legal/privacy': '/privacypolicy',
  '/legal/terms': '/Prize-Competition-Terms-and-Conditions'
};

export const Legal = () => {
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve legacy routes
  const currentPath = legacyRoutes[location.pathname] || location.pathname;
  const pageConfig = legalPages[currentPath];

  useEffect(() => {
    const loadContent = async () => {
      if (!pageConfig) {
        setError('Page not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/legal-documents/${pageConfig.file}`);
        if (!response.ok) {
          throw new Error('Failed to load document');
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError('Unable to load this document. Please try again later.');
        console.error('Error loading legal document:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pageConfig]);

  if (!pageConfig) {
    return (
      <div className="bg-cream-50 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif text-teal-900 mb-4">Page Not Found</h1>
          <p className="text-stone-500">The requested legal document could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen py-20">
      <SEO
        title={`${pageConfig.title} | BabyBets`}
        description={pageConfig.description}
        canonical={`https://babybets.co.uk${currentPath}`}
      />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-cream-200">
          <h1 className="text-4xl font-bold font-serif text-teal-900 mb-4">{pageConfig.title}</h1>
          <p className="text-stone-400 text-sm mb-12">Last Updated: {pageConfig.lastUpdated}</p>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-rose-500">{error}</p>
            </div>
          ) : (
            <div className="prose prose-stone prose-lg max-w-none 
              prose-headings:text-teal-900 prose-headings:font-serif 
              prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
              prose-p:text-stone-600 prose-p:leading-relaxed
              prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-teal-900 prose-strong:font-bold
              prose-ul:text-stone-600 prose-ol:text-stone-600
              prose-li:my-1
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-cream-100 prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:text-teal-900 prose-th:border prose-th:border-cream-200
              prose-td:p-3 prose-td:border prose-td:border-cream-200 prose-td:align-top
            ">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
