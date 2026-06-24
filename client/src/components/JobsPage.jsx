import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';


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

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

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

  useEffect(() => {
    document.title = 'Remote & International Career Opportunities - Genusjob Resume AI';
    
    // Set meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find global remote tech, design, and marketing positions open to West African talents. Tailor your resume in one click.');
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

        if (!supabaseJobs || supabaseJobs.length === 0) {
          throw new Error('No jobs returned from Supabase');
        }

        const normalizedResults = supabaseJobs.map(job => {
          let loc = job.location || 'Remote';
          if (loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('worldwide')) {
            loc = 'Worldwide (Remote)';
          }
          return {
            ...job,
            id: job.job_id || job.id,
            company: { display_name: job.company || 'Hiring Company' },
            location: { display_name: loc },
            category: { label: job.category || 'Technology' },
            salary_min: null,
            salary_max: null
          };
        });

        setJobs(normalizedResults);
        setIsMock(false);
      } catch (err) {
        console.warn('Supabase jobs fetch failed, loading mock jobs fallback:', err);
        const filteredMock = MOCK_JOBS.filter(job => {
          const matchQuery = !query || 
            job.title.toLowerCase().includes(query.toLowerCase()) || 
            job.description.toLowerCase().includes(query.toLowerCase());
          return matchQuery;
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
          <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-8">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                Latest Listings {isMock && '(Preview Mode)'}
              </h3>
              <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                {query ? `Showing ${jobs.length} jobs available matches` : 'RECOMMENDED REMOTE TECH OPPORTUNITIES'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Job Listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-16 border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No job matches found.</p>
              <p className="text-slate-500 text-xs mt-2 font-medium">Try broadening your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => {
                const jobTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, '') || '';
                const jobDesc = job.description?.replace(/<\/?[^>]+(>|$)/g, '') || '';
                const cleanId = job.id || `mock_${Math.random().toString(36).substr(2, 9)}`;

                return (
                  <div 
                    key={cleanId} 
                    className="p-8 bg-white border border-slate-100 hover:border-slate-200 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="space-y-3 flex-1 text-left">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[9px] font-black bg-emerald-500/10 text-[#10B981] px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/15">
                          {job.category?.label || 'General'}
                        </span>
                        {job.salary_min && (
                          <span className="text-[9px] font-black bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest border border-slate-100">
                            {formatMonthlySalary(job.salary_min, job.salary_max)}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase group-hover:text-emerald-500 transition-colors">
                        {jobTitle}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="text-slate-500">🏢 {job.company?.display_name || 'Hiring Company'}</span>
                        <span className="text-[#10B981] font-extrabold">📍 {job.location?.display_name || 'Remote'}</span>
                      </div>

                      <p className="text-sm text-slate-650 font-medium leading-relaxed max-w-4xl line-clamp-2">
                        {jobDesc}
                      </p>
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                      <Link 
                        to={`/jobs/${cleanId}`}
                        className="w-full md:w-auto block bg-slate-900 hover:bg-slate-800 text-white hover:text-emerald-400 border border-slate-950 font-black text-sm uppercase tracking-widest px-8 py-3.5 rounded-full text-center transition-all shadow-sm active:scale-95 cursor-pointer"
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
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6 md:px-12 mt-20 text-center">
        <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
          © 2026 Genusjob Resume AI. Built by career builders.
        </p>
      </footer>
    </div>
  );
}
