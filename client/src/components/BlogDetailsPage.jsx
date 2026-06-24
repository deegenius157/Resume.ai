import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'How to Write an ATS-Optimized Resume in 2026',
    slug: 'how-to-write-ats-optimized-resume',
    summary: 'Learn the key strategies to beat the Applicant Tracking Systems (ATS) and get your resume in front of actual recruiters. Discover keyword density, standard layouts, and common traps.',
    cover_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
    author_name: 'Sarah Jenkins',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    published_at: '2026-06-18T10:00:00Z',
    category: 'Resume Strategy',
    reading_time: '6 min read',
    content: `In 2026, over 95% of Fortune 500 companies and growing tech firms use Applicant Tracking Systems (ATS) to filter resume drafts before a human recruiter even sees them. If your resume format lacks optimization, you might be filtered out despite having the ideal skill credentials.

### 1. The Standard Single-Column Layout
Modern ATS algorithms scan documents from top-to-bottom and left-to-right. Complex multi-column templates, floating text boxes, and tables often throw off parser indexing, causing fields to overlap or disappear. Stick to a clean, structured single-column format or an established layout template (like the Classic Executive layout on Genusjob Resume AI) that secures clear structural boundaries.

### 2. Tailor Your Keywords & Skill Matrix
ATS scanners search for exact matches from the job listing description. If a job posting lists "React Native Mobile Development" as a core requirement, listing simply "Mobile React" will not score the matching points. Ensure you map the listing terms directly into your skillset matrix.

### 3. Font and Color Systems Compatibility
Use web-safe, modern typography such as Inter, Outfit, or standard sans-serif interfaces. Avoid constructing layout styles with advanced mathematical color definitions (like oklch) inside exported assets, as PDF parser engines can raise ReferenceError compilation warnings when scanning those sheets. Stick to hex code styling variables.

With Genusjob Resume AI, our compiler handles these complexities behind the scenes automatically, giving you a beautiful recruiter-ready template with no parsing friction.`
  },
  {
    id: 2,
    title: 'Cracking the System Design and Coding Interview',
    slug: 'cracking-technical-interviews-growth',
    summary: 'A step-by-step breakdown of how to prepare for technical interview loops at top software firms and scale your hiring chances. We discuss core components, scalability, and algorithms.',
    cover_image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop',
    author_name: 'Marcus Chen',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    published_at: '2026-06-17T14:30:00Z',
    category: 'Interview Prep',
    reading_time: '8 min read',
    content: `Technical hiring loops are demanding, requiring a balance of algorithmic puzzle-solving and deep architectural system planning. Here is the blueprint to direct your interview prep:

### 1. Master System Design Core Blocks
Recruiters evaluate how you handle scalability. You must display confidence mapping key blocks:
- **Load Balancers:** Nginx, HAProxy, and DNS round-robin routing.
- **Caching Tiers:** Redis or Memcached placement to shield primary DB clusters.
- **Storage Decisions:** SQL vs NoSQL, sharding practices, and replication lag considerations.
- **Message Queues:** Kafka or RabbitMQ integrations for asynchronous job dispatch.

### 2. Algorithmic Loops Optimization
When discussing coding loops, prioritize explaining space and time complexity upfront. Use clean, readable naming conventions, write test specs, and consider boundary limit edge cases before coding the layout.

### 3. Tie Achievements to Your Profile
 Hires are secured when engineering skills are tied to business growth metrics. Make sure your career resume highlights exact numbers, e.g., "Scaled server throughput by 40% and reduced query latency by 120ms."`
  },
  {
    id: 3,
    title: 'The Blueprint to Personal Branding for Tech Professionals',
    slug: 'essential-career-branding-guide',
    summary: 'How to design a premium career portfolio, coordinate your LinkedIn presence, and position yourself for high-ticket incoming roles without active application fatigue.',
    cover_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    author_name: 'Elena Rostova',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop',
    published_at: '2026-06-15T09:15:00Z',
    category: 'Career Growth',
    reading_time: '5 min read',
    content: `In a crowded tech ecosystem, sending HTML or print resumes is no longer the most efficient strategy. Scaling a premium personal brand helps attract recruiter outreach directly.

### 1. Build a Professional Online Identity
Your portfolio is the packaging of your product. Ensure it has:
- A clean, modern aesthetic with robust typography.
- Clear links to your codebases and live deployments.
- An interactive resume or career summary that users can download.

### 2. Optimizing Your LinkedIn Profile
Recruiters search LinkedIn using specific queries. To show up on top, write a descriptive headline outlining your expertise, publish brief tech logs regularly, and ensure your profile links to a clean document tailored by Genusjob Resume AI.

### 3. Share Your Technical Work
Writing brief posts about complex problems you solved or dev setups you configured displays technical authority. It builds trust before you even enter the interview room.`
  }
];

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          setArticle({
            id: data.id,
            title: data.title,
            slug: data.slug,
            summary: data.summary || data.excerpt || 'Career advice guide.',
            cover_image: data.cover_image || data.image_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
            author_name: data.author_name || data.author || 'Editorial Team',
            author_avatar: data.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
            published_at: data.published_at || data.created_at,
            category: data.category || 'Career Advice',
            reading_time: data.reading_time || '5 min read',
            content: data.content || 'Content coming soon.'
          });
        } else {
          throw new Error('Not found in Supabase');
        }
      } catch (err) {
        console.warn('Supabase article query failed, looking up mock list fallback:', err);
        const matchedMock = MOCK_ARTICLES.find(a => a.slug === slug);
        if (matchedMock) {
          setArticle(matchedMock);
        } else {
          const hashIndex = Math.abs(slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % MOCK_ARTICLES.length;
          setArticle({ ...MOCK_ARTICLES[hashIndex], slug });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!article) return;

    // 1. Client-side SEO Metadata update
    document.title = `${article.title} - genusjob.com`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.summary);
    }

    // 2. Client-side JSON-LD Schema injection (Article format)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title,
      'description': article.summary,
      'image': article.cover_image,
      'datePublished': article.published_at || new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': article.author_name
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'genusjob.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://genusjob.com/favicon.ico'
        }
      }
    };

    const scriptId = 'article-jsonld';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(jsonLd);

    return () => {
      const tag = document.getElementById(scriptId);
      if (tag) tag.remove();
    };
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Article Reader...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] flex flex-col items-center justify-center font-sans">
        <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Article not found.</p>
        <Link to="/blog" className="bg-slate-900 border border-slate-950 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:text-[#10B981] transition-all">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-85 transition">
            <div className="bg-[#10B981] p-1.5 rounded-lg shadow-lg shadow-emerald-500/10">
              <span className="text-white text-base">✨</span>
            </div>
            <span className="text-lg md:text-2xl font-black tracking-tight text-gray-900 font-sans">
              GENUSJOB.COM
            </span>
          </Link>

          {/* Desktop Navigation Links & Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <Link to="/" className="bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest px-4 py-2 rounded-full transition shadow-lg shadow-emerald-500/10">
              Build Resume
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block md:hidden p-1.5 text-slate-650 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Container */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-[#FFFFFF] px-4 py-4 flex flex-col gap-3.5 shadow-lg transition-all duration-200">
            <Link
              to="/jobs"
              onClick={() => setIsMenuOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1 transition-colors"
            >
              Jobs
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="bg-[#10B981] hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full text-center transition shadow-lg shadow-emerald-500/10"
            >
              Build Resume
            </Link>
          </div>
        )}
      </header>

      {/* ARTICLE LAYOUT READER VIEW */}
      <main className="max-w-4xl w-full mx-auto px-6 md:px-12 py-16 relative">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Link to="/blog" className="hover:text-emerald-500 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[200px]">{article.title}</span>
        </div>

        {/* Article Meta */}
        <article className="space-y-10">
          <div className="space-y-6 text-left">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-[#10B981] rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/15">
              {article.category}
            </span>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 border-b border-slate-200 pb-8 pt-4">
              <img 
                src={article.author_avatar} 
                alt={article.author_name} 
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wider text-slate-700">{article.author_name}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  📅 {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {article.reading_time}
                </p>
              </div>
            </div>
          </div>

          {/* Large cover image */}
          <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-slate-100 relative">
            <img 
              src={article.cover_image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article main body */}
          <div className="text-slate-700 font-medium text-sm leading-relaxed max-w-none text-left space-y-6 whitespace-pre-wrap px-2">
            {article.content}
          </div>

        </article>

        {/* HIGH-CONVERTING CONVERSION CTA BANNER */}
        <div className="mt-20 p-8 md:p-12 bg-slate-50 border border-slate-150 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-sm">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500/[0.02] via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Is your resume ready for your next career jump?
            </h3>
            <p className="text-sm font-medium text-slate-650 leading-relaxed">
              Don't let a poorly formatted resume hold you back. Use Genusjob Resume AI to build a recruiter-approved resume in minutes, tailored with matching keywords.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link 
              to="/"
              className="w-full md:w-auto block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm px-10 py-4.5 rounded-2xl text-center transition-all shadow-md hover:shadow-emerald-500/20 tracking-widest uppercase cursor-pointer"
            >
              Build Resume Now
            </Link>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6 md:px-12 mt-20 text-center">
        <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
          © 2026 Genusjob Resume AI. Built by career builders.
        </p>
      </footer>
    </div>
  );
}
