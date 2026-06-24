import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    reading_time: '6 min read'
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
    reading_time: '8 min read'
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
    reading_time: '5 min read'
  }
];

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'SEO Career Blog & Resume Advice - Genusjob Resume AI';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Expert tips on writing high-scoring resumes, system design preparation, and career optimization strategies.');
    }
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          throw new Error(error ? error.message : 'No blog rows found');
        }

        const mapped = data.map(row => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          summary: row.summary || row.excerpt || 'Read this article to boost your career prospects.',
          cover_image: row.cover_image || row.image_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
          author_name: row.author_name || row.author || 'Editorial Team',
          author_avatar: row.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
          published_at: row.published_at || row.created_at,
          category: row.category || 'Career Advice',
          reading_time: row.reading_time || '5 min read'
        }));
        setArticles(mapped);
        setIsMock(false);
      } catch (err) {
        console.warn('Supabase blogs read failed, using fallback articles:', err);
        setArticles(MOCK_ARTICLES);
        setIsMock(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* GLOW BACKGROUND DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[130px] pointer-events-none" />

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
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Jobs
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

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-16 relative">
        
        {/* Intro */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black tracking-[0.25em] text-[#10B981] uppercase mb-6">
            Career Knowledge Engine
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-6">
            SEO Career Insights & Strategy
          </h1>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            Gain a strategic advantage in your career search. Read expert analyses on ATS formats, coding loops, and technical optimization checklists curated by recruiters.
          </p>
        </div>

        {isLoading ? (
          <div className="p-16 text-center">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Articles...</p>
          </div>
        ) : (
          <>
            {/* FEATURED POST */}
            {featuredArticle && (
              <div className="mb-20">
                <div className="p-1 border border-slate-100 bg-slate-50/50 rounded-[2.5rem] overflow-hidden hover:border-slate-200 transition-colors shadow-sm">
                  <div className="flex flex-col lg:flex-row items-center gap-10 p-8">
                    
                    {/* Featured Image */}
                    <div className="w-full lg:w-1/2 aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 shrink-0 relative">
                      <img 
                        src={featuredArticle.cover_image} 
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-6 left-6 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/15">
                        Featured / {featuredArticle.category}
                      </div>
                    </div>

                    {/* Featured Details */}
                    <div className="flex-1 space-y-6 text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        📅 {new Date(featuredArticle.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      
                      <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight hover:text-emerald-500 transition-colors">
                        <Link to={`/blog/${featuredArticle.slug}`}>
                          {featuredArticle.title}
                        </Link>
                      </h2>
                      
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {featuredArticle.summary}
                      </p>

                      <div className="flex items-center gap-4 border-t border-slate-150 pt-6">
                        <img 
                          src={featuredArticle.author_avatar} 
                          alt={featuredArticle.author_name} 
                          className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                        />
                        <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-700">{featuredArticle.author_name}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{featuredArticle.reading_time}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link 
                          to={`/blog/${featuredArticle.slug}`}
                          className="w-full sm:w-auto inline-block text-center bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
                        >
                          Read Article
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ARTICLES GRID */}
            {gridArticles.length > 0 && (
              <div className="space-y-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-200 pb-4 text-left">
                  More Insights & Strategy Guide
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {gridArticles.map((art) => (
                    <div 
                      key={art.slug} 
                      className="bg-white border border-slate-100 hover:border-slate-200 rounded-[2.5rem] p-6 space-y-6 flex flex-col hover:shadow-md transition-all group"
                    >
                      <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 relative">
                        <img 
                          src={art.cover_image} 
                          alt={art.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-slate-600 border border-slate-150">
                          {art.category}
                        </div>
                      </div>

                      <div className="space-y-3 text-left flex-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          📅 {new Date(art.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        
                        <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-500 transition-colors leading-tight">
                          <Link to={`/blog/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h4>

                        <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                          {art.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 border-t border-slate-150 pt-5">
                        <img 
                          src={art.author_avatar} 
                          alt={art.author_name} 
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                        <div className="text-left">
                          <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">{art.author_name}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{art.reading_time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* DYNAMIC FOOTER CTA */}
        <div className="mt-24 p-10 bg-slate-50 border border-slate-150 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/[0.02] via-transparent to-transparent pointer-events-none" />
          <div className="space-y-4 max-w-2xl text-left">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Prepare for your career jump today
            </h3>
            <p className="text-sm font-medium text-slate-650 leading-relaxed">
              Do not let outdated resume layouts stand in your way. Build a premium, ATS-proof resume in minutes matching standard hiring templates automatically.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link 
              to="/"
              className="w-full md:w-auto block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm px-10 py-4.5 rounded-2xl text-center transition-all shadow-md hover:shadow-emerald-500/20 tracking-widest uppercase cursor-pointer"
            >
              Tailor Resume Free
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
