import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from './Footer';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Helper to map DB category and job title/description to clean UI categories
function mapJobCategory(job) {
  const rawCat = String(job.category || '').trim();
  const title = String(job.title || '').toLowerCase();
  const desc = String(job.description || '').toLowerCase();
  const text = `${title} ${desc}`;

  // 1. Check explicit non-generic category strings first
  if (rawCat && rawCat.toLowerCase() !== 'private job' && rawCat.toLowerCase() !== 'general') {
    const c = rawCat.toLowerCase();
    if (c.includes('ai') || c.includes('automation')) return 'AI & Automation';
    if (c.includes('tech') || c.includes('software') || c.includes('it') || c.includes('data') || c.includes('infosec') || c.includes('engineer')) return 'Tech & Engineering';
    if (c.includes('design') || c.includes('ui') || c.includes('ux') || c.includes('creative')) return 'Design';
    if (c.includes('marketing') || c.includes('growth')) return 'Marketing';
    if (c.includes('sales') || c.includes('business dev')) return 'Sales';
    if (c.includes('support') || c.includes('customer')) return 'Customer Support';
    if (c.includes('admin') || c.includes('office') || c.includes('exec') || c.includes('operations')) return 'Admin and Office';
  }

  // 2. Fallback to title & description classification
  if (/\b(ai|a\.i\.|llm|prompt engineer|machine learning|automation|data annotation|annotator)\b/i.test(text)) {
    return 'AI & Automation';
  }
  if (/\b(software|developer|frontend|backend|full stack|fullstack|devops|react|node|python|java|javascript|data analyst|data scientist|cybersecurity|cloud|qa engineer|web developer|mobile developer|it support|system admin)\b/i.test(text)) {
    return 'Tech & Engineering';
  }
  if (/\b(designer|ui\/ux|ux|ui|graphic|video editor|illustrator|animator|creative director|product design|motion)\b/i.test(text)) {
    return 'Design';
  }
  if (/\b(marketing|social media|seo|content writer|copywriter|brand|communications|community manager|digital marketer|media buyer|pr )\b/i.test(text)) {
    return 'Marketing';
  }
  if (/\b(sales|business development|account executive|lead generation|bdm|account manager|outreach|telesales|closer)\b/i.test(text)) {
    return 'Sales';
  }
  if (/\b(customer support|customer service|client support|call center|customer success|technical support|chat support|helpdesk)\b/i.test(text)) {
    return 'Customer Support';
  }
  if (/\b(virtual assistant|admin|executive assistant|data entry|operations|hr|human resources|recruiter|secretary|project coordinator|project manager|accountant|bookkeeper|finance|clerk|office)\b/i.test(text)) {
    return 'Admin and Office';
  }

  return 'Other';
}

// Helper: "Posted X days ago"
function formatPostedAgo(createdAt) {
  if (!createdAt) return null;
  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return null;

  const now = new Date();
  const diffMs = now - created;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Posted today';
  if (diffDays === 1) return 'Posted 1 day ago';
  return `Posted ${diffDays} days ago`;
}

// Helper: "Closes DD Mon"
function formatClosingDate(deadlineStr) {
  if (!deadlineStr) return null;
  const date = new Date(deadlineStr);
  if (isNaN(date.getTime())) return null;

  const day = date.getUTCDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getUTCMonth()];
  return `Closes ${day} ${month}`;
}

const ORDERED_CATEGORIES = [
  { id: 'All', label: 'All Jobs', icon: '🌐' },
  { id: 'AI & Automation', label: 'AI & Automation', icon: '⚡' },
  { id: 'Tech & Engineering', label: 'Tech & Engineering', icon: '💻' },
  { id: 'Design', label: 'Design', icon: '🎨' },
  { id: 'Marketing', label: 'Marketing', icon: '📣' },
  { id: 'Sales', label: 'Sales', icon: '🤝' },
  { id: 'Customer Support', label: 'Customer Support', icon: '🎧' },
  { id: 'Admin and Office', label: 'Admin and Office', icon: '📋' },
  { id: 'Other', label: 'Other', icon: '💼' }
];

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [localQuery, setLocalQuery] = useState(query);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getSalaryDisplay = (jobVal) => {
    if (!jobVal) return null;
    if (jobVal.salary && String(jobVal.salary).trim() !== '') {
      return String(jobVal.salary).trim();
    }
    return null;
  };

  useEffect(() => {
    document.title = 'GenusJob: Verified Jobs and Free Resume Builder';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Verified remote and international jobs across tech, marketing, sales, customer support, and more—checked by GenusJob with a free resume builder.'
      );
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        let queryBuilder = supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (query) {
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,company.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`);
        }

        const { data: supabaseJobs, error } = await queryBuilder;
        if (error) throw error;

        const todayStr = new Date().toISOString().split('T')[0];

        // Keep only published and non-expired jobs
        const activeJobs = (supabaseJobs || []).filter(job => {
          if (job.status && job.status !== 'published') return false;
          if (job.deadline && String(job.deadline) < todayStr) return false;
          return true;
        });

        const normalizedResults = activeJobs.map(job => {
          const rawCompany = typeof job.company === 'object' ? job.company?.display_name || job.company?.name : job.company;
          const cleanCompany = (rawCompany && String(rawCompany).trim() !== '' && String(rawCompany).trim().toLowerCase() !== 'hiring company')
            ? String(rawCompany).trim()
            : null;

          const rawLoc = typeof job.location === 'object' ? job.location?.display_name || job.location?.name : job.location;
          const cleanLoc = (rawLoc && String(rawLoc).trim() !== '' && String(rawLoc).trim().toLowerCase() !== 'n/a')
            ? String(rawLoc).trim()
            : null;

          const rawType = job.job_type || null;
          const cleanJobType = (rawType && String(rawType).trim() !== '' && String(rawType).trim().toLowerCase() !== 'n/a')
            ? String(rawType).trim()
            : null;

          const uiCategory = mapJobCategory(job);

          return {
            ...job,
            id: job.job_id || job.id,
            cleanCompany,
            cleanLoc,
            cleanJobType,
            uiCategory
          };
        });

        setJobs(normalizedResults);
      } catch (err) {
        console.error('Error loading jobs from Supabase:', err);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Compute which categories have at least 1 job
  const activeCategories = ORDERED_CATEGORIES.filter(cat => {
    if (cat.id === 'All') return true;
    return jobs.some(j => j.uiCategory === cat.id);
  });

  // Filter jobs by selectedCategory
  const displayedJobs = jobs.filter(job => {
    return selectedCategory === 'All' || job.uiCategory === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="px-4 py-3 flex justify-between items-center max-w-7xl mx-auto">
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
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-[#10B981] transition-colors">
              Jobs
            </Link>
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link to="/post-job" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Post a Job
            </Link>
            <Link to="/" className="bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition shadow-lg shadow-emerald-500/10">
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
              className="text-xs font-black uppercase tracking-widest text-[#10B981] py-1 transition-colors"
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
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1 transition-colors"
            >
              About
            </Link>
            <Link
              to="/post-job"
              onClick={() => setIsMenuOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1 transition-colors"
            >
              Post a Job
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

      {/* HERO SECTION */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-16 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black tracking-[0.2em] text-[#10B981] uppercase mb-5">
            Verified Remote &amp; International Opportunities
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-4">
            Find Verified Jobs Worldwide
          </h1>
          <p className="text-sm md:text-base font-medium text-slate-600 leading-relaxed">
            Verified remote and international jobs, checked by GenusJob.
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="mb-10 max-w-4xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-1.5 md:col-span-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block px-1 text-left">Search Keywords</label>
              <input 
                type="text" 
                value={localQuery} 
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Job title, skill, company, or location (e.g. Remote, Lagos)..." 
                className="w-full bg-white border border-slate-200 text-[#1F2937] placeholder-slate-400 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
              />
            </div>
            <div className="flex items-end md:col-span-1">
              <button 
                type="submit" 
                className="w-full bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer text-center"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* JOB CARDS & FILTERS */}
        <div className="space-y-6">
          {/* COMMUNITY CTA BANNER */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 text-left relative overflow-hidden shadow-sm">
            <div className="space-y-2 flex-1 relative z-10">
              <h4 className="text-base md:text-lg font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                🚀 Join the GenusJob Community Hub!
              </h4>
              <p className="text-xs sm:text-sm text-slate-650 font-medium leading-relaxed max-w-2xl">
                Get instant alerts on verified remote and international job openings, application deadlines, and resume tips directly on WhatsApp.
              </p>
            </div>
            <div className="w-full md:w-auto shrink-0 relative z-10">
              <a 
                href="https://chat.whatsapp.com/F5e5bSS9rk5DTrTuWWt2jc?s=sw&p=i&mlu=2&amv=2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs py-3.5 px-6 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer text-center border-0 no-underline"
              >
                Join WhatsApp Group
              </a>
            </div>
          </div>

          {/* CATEGORY FILTER CHIPS */}
          <div className="pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {activeCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    type="button"
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 text-left">
                Verified Listings ({displayedJobs.length})
              </h3>
            </div>
            {(selectedCategory !== 'All' || query) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setLocalQuery('');
                  setSearchParams({});
                }}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Verified Job Listings...</p>
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="p-12 sm:p-16 border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">No jobs match this filter</p>
              <p className="text-slate-500 text-xs mt-2 font-medium max-w-md">
                Try selecting another category or reset your search filters to view all available positions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {displayedJobs.map((job) => {
                const jobTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, '') || '';
                const jobDesc = job.description?.replace(/<\/?[^>]+(>|$)/g, '') || '';
                const cleanId = job.id;
                const salaryDisplay = getSalaryDisplay(job);
                const postedAgo = formatPostedAgo(job.created_at);
                const closesText = formatClosingDate(job.deadline);

                return (
                  <div 
                    key={cleanId} 
                    className="p-5 sm:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-sm hover:shadow-md transition-all group border bg-white border-slate-100 hover:border-slate-200"
                  >
                    <div className="space-y-3 flex-1 text-left w-full">
                      {/* TOP BADGES ROW */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black bg-emerald-500/10 text-[#10B981] px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/15">
                          {job.uiCategory}
                        </span>

                        {salaryDisplay && (
                          <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                            💰 {salaryDisplay}
                          </span>
                        )}

                        {postedAgo && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                            🕒 {postedAgo}
                          </span>
                        )}

                        {closesText && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                            ⏳ {closesText}
                          </span>
                        )}
                      </div>
                      
                      {/* TITLE */}
                      <h4 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors leading-snug">
                        {jobTitle}
                      </h4>
                      
                      {/* COMPANY, LOCATION, JOB TYPE */}
                      {(job.cleanCompany || job.cleanLoc || job.cleanJobType) && (
                        <div className="flex items-center gap-x-4 gap-y-1.5 text-xs font-bold text-slate-500 flex-wrap">
                          {job.cleanCompany && (
                            <span className="text-slate-700">🏢 {job.cleanCompany}</span>
                          )}
                          {job.cleanLoc && (
                            <span className="text-[#10B981] font-extrabold">📍 {job.cleanLoc}</span>
                          )}
                          {job.cleanJobType && (
                            <span className="text-blue-600 font-bold">💼 {job.cleanJobType}</span>
                          )}
                        </div>
                      )}

                      {/* DESCRIPTION SNIPPET */}
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-4xl line-clamp-2">
                        {jobDesc}
                      </p>
                    </div>

                    <div className="shrink-0 w-full md:w-auto pt-2 md:pt-0">
                      <Link 
                        to={`/jobs/${cleanId}-${slugify(jobTitle)}`}
                        className="w-full md:w-auto block bg-slate-900 hover:bg-slate-800 text-white hover:text-emerald-400 font-black text-xs uppercase tracking-widest px-7 py-3.5 rounded-full text-center transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        View Position
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CONTEXTUAL GENERAL CTA BANNER */}
        <div className="mt-16 p-8 sm:p-10 bg-slate-50 border border-slate-200/80 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
              Need a strong resume for your application?
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              Use our free resume builder to create, edit, and download a clean, ATS-friendly CV tailored to the job you want.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link 
              to="/"
              className="w-full md:w-auto block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-8 py-4 rounded-2xl text-center transition-all shadow-md hover:shadow-emerald-500/20 tracking-widest uppercase cursor-pointer"
            >
              Build Free Resume
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
