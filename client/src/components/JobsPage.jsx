import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from './Footer';

const ADZUNA_APP_ID = '80388a5b';
const ADZUNA_APP_KEY = '734f6394a33847dd19195ed41ab7fa1d';

const MOCK_JOBS = [
  {
    id: 'mock_job_1',
    title: 'Senior Full Stack Engineer',
    company: { display_name: 'TechFlow' },
    location: { display_name: 'Worldwide (Remote)' },
    description: 'We are looking for a Senior Full Stack Engineer with strong experience in React, Node.js, and cloud systems to help build our scalable SaaS platform. Fully remote position open internationally.',
    salary_min: 130000,
    salary_max: 170000,
    created: '2026-06-18T12:00:00Z',
    category: { label: 'IT Jobs' }
  },
  {
    id: 'mock_job_2',
    title: 'Product UI/UX Designer',
    company: { display_name: 'DesignWave' },
    location: { display_name: 'Remote (Worldwide)' },
    description: 'Join our creative team to lead the visual and interaction design of our mobile and desktop web applications. Open to remote talents globally.',
    salary_min: 95000,
    salary_max: 125000,
    created: '2026-06-17T09:30:00Z',
    category: { label: 'Design Jobs' }
  },
  {
    id: 'mock_job_3',
    title: 'AI Product Specialist',
    company: { display_name: 'Brainwave AI' },
    location: { display_name: 'Worldwide (Remote)' },
    description: 'Looking for a product specialist with experience in Large Language Model (LLM) fine-tuning, prompt engineering, and model validation frameworks. Work from anywhere.',
    salary_min: 140000,
    salary_max: 190000,
    created: '2026-06-19T08:15:00Z',
    category: { label: 'IT Jobs' }
  },
  {
    id: 'mock_job_4',
    title: 'Lead Frontend Developer',
    company: { display_name: 'WebFlow Studio' },
    location: { display_name: 'Remote (Worldwide)' },
    description: 'We are seeking an experienced Frontend Developer with expert knowledge of Next.js, TailwindCSS, and visual graphics interfaces. 100% remote job.',
    salary_min: 110000,
    salary_max: 145000,
    created: '2026-06-15T14:45:00Z',
    category: { label: 'IT Jobs' }
  },
  {
    id: 'mock_job_5',
    title: 'DevOps & Infrastructure Architect',
    company: { display_name: 'CloudScale Corp' },
    location: { display_name: 'Worldwide (Remote)' },
    description: 'Manage our global AWS container clusters. Deep expertise in Terraform, Kubernetes, and automated deployment pipelines is highly preferred. Fully remote.',
    salary_min: 150000,
    salary_max: 195000,
    created: '2026-06-16T11:20:00Z',
    category: { label: 'IT Jobs' }
  },
  {
    id: 'mock_job_6',
    title: 'Growth Marketing Manager',
    company: { display_name: 'BrandGrowth Co' },
    location: { display_name: 'Remote (Worldwide)' },
    description: 'Lead our organic search SEO campaigns and paid user acquisition initiatives. Experience scaling early stage software applications is required.',
    salary_min: 80000,
    salary_max: 105000,
    created: '2026-06-14T10:00:00Z',
    category: { label: 'Marketing Jobs' }
  }
];

function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function detectAiRole(title = '', description = '') {
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  const keywords = [
    'artificial intelligence', 'machine learning', 'llm', 'large language model',
    'prompt engineer', 'prompt engineering', 'data annotation', 'ai ops', 'ai operations',
    'generative ai', 'deep learning', 'nlp', 'natural language processing',
    'neural network', 'chatgpt', 'openai', 'anthropic', 'langchain', 'computer vision',
    'automation engineer', 'ai specialist', 'ai developer', 'ai researcher'
  ];

  if (/\b(ai|a\.i\.)\b/i.test(text)) return true;
  if (/\b(prompt|automation)\b/i.test(text)) return true;

  return keywords.some(kw => text.includes(kw));
}

const MOCK_JOBS_LIST = [
  {
    id: 'mock_job_ai_1',
    title: 'Senior LLM & AI Operations Engineer',
    company: { display_name: 'Anthropic Ecosystems' },
    location: { display_name: 'Worldwide (Remote)' },
    description: 'Join our AI infrastructure team to deploy scalable LLM agents, automate data annotation loops, and fine-tune open-weights models for enterprise deployment. Fully remote position.',
    salary_min: 160000,
    salary_max: 210000,
    created: '2026-06-25T10:00:00Z',
    category: { label: 'AI & Automation' }
  },
  ...MOCK_JOBS
];

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [localQuery, setLocalQuery] = useState(query);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatMonthlySalary = (salaryMin, salaryMax) => {
    if (!salaryMin) return 'Competitive Salary / Negotiable';
    
    let monthlyMin = Math.round(salaryMin / 12);
    let monthlyMax = Math.round((salaryMax || salaryMin) / 12);
    
    if (monthlyMin < 1000) monthlyMin = 1000;
    if (monthlyMin > 5000) monthlyMin = 5000;
    
    if (monthlyMax < 1000) monthlyMax = 1000;
    if (monthlyMax > 5000) monthlyMax = 5000;
    
    if (monthlyMax < monthlyMin) {
      monthlyMax = monthlyMin;
    }
    
    if (monthlyMin === monthlyMax) {
      return `$${monthlyMin.toLocaleString()} / month`;
    }
    return `$${monthlyMin.toLocaleString()} — $${monthlyMax.toLocaleString()} / month`;
  };

  const getSalaryDisplay = (jobVal) => {
    if (!jobVal) return null;
    if (jobVal.salary && String(jobVal.salary).trim() !== '') {
      return String(jobVal.salary).trim();
    }
    if (jobVal.salary_min) {
      return formatMonthlySalary(jobVal.salary_min, jobVal.salary_max);
    }
    return null;
  };

  useEffect(() => {
    document.title = 'Remote AI & Tech Jobs - Genusjob Resume AI';
    
    // Set meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find global remote AI, LLM, automation, tech, design, and marketing positions open to applicants worldwide.');
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        let queryBuilder = supabase
          .from('jobs')
          .select('*');

        if (query) {
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,company.ilike.%${query}%,description.ilike.%${query}%`);
        }

        // Pagination
        const from = (parseInt(page) - 1) * 15;
        const to = from + 14;
        queryBuilder = queryBuilder.order('created_at', { ascending: false }).range(from, to);

        const { data: supabaseJobs, error } = await queryBuilder;

        if (error) throw error;

const EXCLUDED_KEYWORDS = [
  'driver', 'teacher', 'maintenance', 'cleaner', 'janitor', 'cook', 'school',
  'academy', 'security guard', 'tutor', 'housekeeper', 'nanny', 'chef',
  'receptionist', 'driver/', 'bus driver', 'truck driver', 'classroom'
];

function isExcludedRole(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  return EXCLUDED_KEYWORDS.some(kw => {
    const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'i');
    return regex.test(text) || text.includes(kw.toLowerCase());
  });
}

        const filteredJobs = (supabaseJobs || []).filter(j => !isExcludedRole(j.title, j.description));

        const normalizedResults = filteredJobs.map(job => {
          const rawCompany = typeof job.company === 'object' ? job.company?.display_name || job.company?.name : job.company;
          const cleanCompany = (rawCompany && String(rawCompany).trim() !== '' && String(rawCompany).trim().toLowerCase() !== 'hiring company') ? String(rawCompany).trim() : null;

          const rawLoc = typeof job.location === 'object' ? job.location?.display_name || job.location?.name : job.location;
          const cleanLoc = (rawLoc && String(rawLoc).trim() !== '' && String(rawLoc).trim().toLowerCase() !== 'n/a') ? String(rawLoc).trim() : null;

          const rawType = job.job_type || job.employment_type || null;
          const cleanJobType = (rawType && String(rawType).trim() !== '' && String(rawType).trim().toLowerCase() !== 'n/a') ? String(rawType).trim() : null;

          const isAi = detectAiRole(job.title, job.description) || (job.category && String(job.category).toLowerCase().includes('ai'));
          return {
            ...job,
            id: job.job_id || job.id,
            company: cleanCompany ? { display_name: cleanCompany } : null,
            location: cleanLoc ? { display_name: cleanLoc } : null,
            job_type: cleanJobType,
            category: { label: isAi ? 'AI & Automation' : (job.category || 'Technology') },
            salary_min: null,
            salary_max: null
          };
        });

        // Prioritize AI & Automation positions to the top of the feed
        normalizedResults.sort((a, b) => {
          const aIsAi = (a.category?.label === 'AI & Automation' || detectAiRole(a.title, a.description)) ? 1 : 0;
          const bIsAi = (b.category?.label === 'AI & Automation' || detectAiRole(b.title, b.description)) ? 1 : 0;
          return bIsAi - aIsAi;
        });

        setJobs(normalizedResults);
        setIsMock(false);
      } catch (err) {
        console.warn('Supabase jobs fetch failed, loading mock jobs fallback:', err);
        const filteredMock = MOCK_JOBS_LIST.filter(job => {
          const matchQuery = !query || 
            job.title.toLowerCase().includes(query.toLowerCase()) || 
            job.description.toLowerCase().includes(query.toLowerCase());
          return matchQuery;
        });
        filteredMock.sort((a, b) => {
          const aIsAi = (a.category?.label === 'AI & Automation' || detectAiRole(a.title, a.description)) ? 1 : 0;
          const bIsAi = (b.category?.label === 'AI & Automation' || detectAiRole(b.title, b.description)) ? 1 : 0;
          return bIsAi - aIsAi;
        });
        setJobs(filteredMock);
        setIsMock(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [query, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: localQuery, page: '1' });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

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
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              About
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
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1 transition-colors"
            >
              About
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
      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-16 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black tracking-[0.25em] text-[#10B981] uppercase mb-6">
            Remote & International Career Opportunities for West African Talents
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-6">
            Find Global Remote Jobs
          </h1>
          <p className="text-sm md:text-base font-medium text-slate-700 leading-relaxed">
            Discover international tech, creative, and marketing positions open to applicants globally. Build and tailor your resume in one click with our integrated resume builder.
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="mb-16 max-w-4xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-1.5 md:col-span-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block px-1">Search Keywords</label>
              <input 
                type="text" 
                value={localQuery} 
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Software Engineer, UI/UX Designer, Marketing Manager..." 
                className="w-full bg-white border border-slate-200 text-[#1F2937] placeholder-slate-400 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
              />
            </div>
            <div className="flex items-end md:col-span-1">
              <button 
                type="submit" 
                className="w-full bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm py-4 rounded-2xl transition duration-205 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer text-center"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* JOB CARDS LIST */}
        <div className="space-y-6">
          {/* COMMUNITY CTA BANNER */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left relative overflow-hidden shadow-sm mt-2 mb-4">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 flex-1 relative z-10">
              <h4 className="text-lg font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                🚀 Join the GenusJob Tech Community Hub!
              </h4>
              <p className="text-sm text-slate-650 font-medium leading-relaxed max-w-2xl">
                Get real-time remote tech alerts, application deadlines, and free ATS resume optimization tips directly on your phone.
              </p>
            </div>
            <div className="w-full md:w-auto shrink-0 relative z-10">
              <a 
                href="https://chat.whatsapp.com/F5e5bSS9rk5DTrTuWWt2jc?s=sw&p=i&mlu=2&amv=2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs py-4.5 px-7 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer text-center border-0 no-underline"
              >
                Join WhatsApp Group
              </a>
            </div>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {[
              { id: 'All', label: 'All Jobs', icon: '🌐' },
              { id: 'AI & Automation', label: 'AI & Automation', icon: '⚡', featured: true },
              { id: 'Technology', label: 'Tech & Engineering', icon: '💻' },
              { id: 'Design', label: 'Design & Product', icon: '🎨' },
              { id: 'Growth & Operations', label: 'Growth & Operations', icon: '📈' }
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? cat.featured
                        ? 'bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : cat.featured
                      ? 'bg-emerald-500/10 text-[#10B981] border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-8">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                Latest Listings {isMock && '(Preview Mode)'}
              </h3>
              <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                {query ? `Showing ${jobs.length} jobs available matches` : 'RECOMMENDED REMOTE TECH & AI OPPORTUNITIES'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Job Listings...</p>
            </div>
          ) : (() => {
            const displayedJobs = jobs.filter((job) => {
              if (selectedCategory === 'All') return true;
              const catLabel = (job.category?.label || job.category || '').toLowerCase();
              const jobTitle = (job.title || '').toLowerCase();
              const jobDesc = (job.description || '').toLowerCase();
              
              if (selectedCategory === 'AI & Automation') {
                return catLabel.includes('ai') || catLabel.includes('automation') || detectAiRole(jobTitle, jobDesc);
              }
              if (selectedCategory === 'Technology') {
                return catLabel.includes('tech') || catLabel.includes('it') || catLabel.includes('software');
              }
              if (selectedCategory === 'Design') {
                return catLabel.includes('design') || catLabel.includes('ui') || catLabel.includes('ux');
              }
              if (selectedCategory === 'Growth & Operations') {
                return catLabel.includes('marketing') || catLabel.includes('growth') || catLabel.includes('operation');
              }
              return true;
            });

            if (displayedJobs.length === 0) {
              return (
                <div className="p-16 border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50">
                  <span className="text-4xl mb-4">🤖</span>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No jobs match this filter.</p>
                  <p className="text-slate-500 text-xs mt-2 font-medium">Try selecting another category tab or broadening your query.</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 gap-6">
                {displayedJobs.map((job) => {
                  const jobTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, '') || '';
                  const jobDesc = job.description?.replace(/<\/?[^>]+(>|$)/g, '') || '';
                  const cleanId = job.id || `mock_${Math.random().toString(36).substr(2, 9)}`;
                  const isAiRole = (job.category?.label === 'AI & Automation') || detectAiRole(jobTitle, jobDesc);

                  return (
                    <div 
                      key={cleanId} 
                      className={`p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all group border ${
                        isAiRole 
                          ? 'bg-gradient-to-r from-emerald-500/[0.03] via-white to-white border-emerald-500/30 hover:border-emerald-500/60' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="space-y-3 flex-1 text-left">
                        <div className="flex items-center gap-3 flex-wrap">
                          {isAiRole ? (
                            <span className="text-[9px] font-black bg-[#10B981] text-white px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm border border-emerald-400">
                              ⚡ AI &amp; AUTOMATION
                            </span>
                          ) : (
                            <span className="text-[9px] font-black bg-emerald-500/10 text-[#10B981] px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/15">
                              {job.category?.label || 'General'}
                            </span>
                          )}
                        {getSalaryDisplay(job) && (
                          <span className="text-[9px] font-black bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest border border-slate-100">
                            {getSalaryDisplay(job)}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase group-hover:text-emerald-500 transition-colors">
                        {jobTitle}
                      </h4>
                      
                      {(() => {
                        const compStr = (typeof job.company === 'object' ? job.company?.display_name || job.company?.name : job.company) || '';
                        const cleanComp = (compStr && compStr.trim() !== '' && compStr.trim().toLowerCase() !== 'hiring company') ? compStr.trim() : null;
                        
                        const locStr = (typeof job.location === 'object' ? job.location?.display_name || job.location?.name : job.location) || '';
                        const cleanLoc = (locStr && locStr.trim() !== '' && locStr.trim().toLowerCase() !== 'n/a') ? locStr.trim() : null;
                        
                        const typeStr = job.job_type || job.employment_type || '';
                        const cleanType = (typeStr && String(typeStr).trim() !== '' && String(typeStr).trim().toLowerCase() !== 'n/a') ? String(typeStr).trim() : null;

                        if (!cleanComp && !cleanLoc && !cleanType) return null;

                        return (
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-wrap">
                            {cleanComp && (
                              <span className="text-slate-500">🏢 {cleanComp}</span>
                            )}
                            {cleanLoc && (
                              <span className="text-[#10B981] font-extrabold">📍 {cleanLoc}</span>
                            )}
                            {cleanType && (
                              <span className="text-blue-600 font-extrabold">💼 {cleanType}</span>
                            )}
                          </div>
                        );
                      })()}

                      <p className="text-sm text-slate-650 font-medium leading-relaxed max-w-4xl line-clamp-2">
                        {jobDesc}
                      </p>
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                      <Link 
                        to={`/jobs/${cleanId}-${slugify(jobTitle)}`}
                        className="w-full md:w-auto block bg-slate-900 hover:bg-slate-800 text-white hover:text-emerald-400 border border-slate-950 font-black text-sm uppercase tracking-widest px-8 py-3.5 rounded-full text-center transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        View Position
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
        </div>

        {/* CONTEXTUAL GENERAL CTA BANNER */}
        <div className="mt-20 p-10 bg-slate-50 border border-slate-150 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/[0.03] via-transparent to-transparent pointer-events-none" />
          <div className="space-y-4 max-w-2xl text-left">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Ready to submit your application?
            </h3>
            <p className="text-sm font-medium text-slate-650 leading-relaxed">
              Create an AI-powered resume optimized specifically for the latest roles. Use Genusjob Resume AI to dynamically inject target keywords and pass recruiter ATS systems instantly.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link 
              to="/"
              className="w-full md:w-auto block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm px-10 py-4.5 rounded-2xl text-center transition-all shadow-md hover:shadow-emerald-500/20 tracking-widest uppercase cursor-pointer"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
