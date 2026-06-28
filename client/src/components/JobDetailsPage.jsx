import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logMetric } from '../lib/firebase';


const ADZUNA_APP_ID = '80388a5b';
const ADZUNA_APP_KEY = '734f6394a33847dd19195ed41ab7fa1d';

const MOCK_JOBS = [
  {
    id: 'mock_job_1',
    title: 'Senior Full Stack Engineer',
    company: { display_name: 'TechFlow' },
    location: { display_name: 'Worldwide (Remote)' },
    description: 'We are looking for a Senior Full Stack Engineer with strong experience in React, Node.js, and cloud systems to help build our scalable SaaS platform. You will design, build and deploy production grade services, scale frontend architectures, and coordinate cloud infrastructures on AWS.',
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
    description: 'Join our creative team to lead the visual and interaction design of our mobile and desktop web applications. Strong portfolio with micro-interactions is required. Collaborating closely with engineers and product managers, you will craft premium layouts, design clean components, and refine experiences.',
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
    description: 'Looking for a product specialist with experience in Large Language Model (LLM) fine-tuning, prompt engineering, and model validation frameworks. You will research, iterate, and integrate generative models into business tools and customer-facing interfaces.',
    salary_min: 140000,
    salary_max: 190000,
    created: '2026-06-19T08:15:00Z',
    category: { label: 'IT Jobs' }
  },
  {
    id: 'mock_job_4',
    title: 'Lead Frontend Developer',
    company: { display_name: 'WebFlow Studio' },
    location: { display_name: 'Worldwide (Remote)' },
    description: 'We are seeking an experienced Frontend Developer with expert knowledge of Next.js, TailwindCSS, and visual graphics interfaces. Build premium user interfaces, configure responsive layouts, optimize speeds, and deliver a visual presentation.',
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
    description: 'Manage our global AWS container clusters. Deep expertise in Terraform, Kubernetes, and automated deployment pipelines is highly preferred. Run infrastructure scaling checks and optimize security barriers.',
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
    description: 'Lead our organic search SEO campaigns and paid user acquisition initiatives. Experience scaling early stage software applications is required. Direct outreach frameworks and define marketing metrics.',
    salary_min: 80000,
    salary_max: 105000,
    created: '2026-06-14T10:00:00Z',
    category: { label: 'Marketing Jobs' }
  }
];

function formatParsedText(text) {
  if (!text) return null;

  // 1. Decode HTML entities cleanly
  let cleanText = text
    .replace(/&amp;/g, '&')
    .replace(/&bull;/g, '•')
    .replace(/&nbsp;/g, ' ')
    .replace(/&middot;/g, '·');

  // 2. If it contains raw HTML elements, render them natively
  const hasHtml = /<[a-z][\s\S]*>/i.test(cleanText);
  if (hasHtml) {
    return <div className="raw-html-content" dangerouslySetInnerHTML={{ __html: cleanText }} />;
  }

  // 3. Otherwise, use the line-splitting plain text rendering algorithm
  const lines = cleanText.split('\n');
  const elements = [];
  let currentList = [];
  let inList = false;

  const renderList = (key) => {
    if (currentList.length === 0) return null;
    const listItems = currentList.map((item, idx) => (
      <li key={idx} className="list-disc pl-2 ml-4 mb-2 leading-relaxed text-slate-700 font-medium">
        {item}
      </li>
    ));
    currentList = [];
    return <ul key={key} className="space-y-1 my-3 text-sm">{listItems}</ul>;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (inList) {
        elements.push(renderList(`list-${i}`));
        inList = false;
      }
      continue;
    }

    const bulletMatch = line.match(/^[-*•]\s*(.*)/);
    const numberedMatch = line.match(/^\d+\.\s*(.*)/);

    if (bulletMatch || numberedMatch) {
      inList = true;
      currentList.push(bulletMatch ? bulletMatch[1] : numberedMatch[1]);
    } else {
      if (inList) {
        elements.push(renderList(`list-${i}`));
        inList = false;
      }

      const isHeader = (line.length < 60 && line.endsWith(':')) || (line.length < 40 && line === line.toUpperCase() && /[A-Z]/.test(line));
      if (isHeader) {
        elements.push(
          <h4 key={`h-${i}`} className="text-xs font-black uppercase tracking-wider text-slate-800 mt-6 mb-3 first:mt-2">
            {line.replace(/:$/, '')}
          </h4>
        );
      } else {
        elements.push(
          <p key={`p-${i}`} className="text-sm text-slate-700 leading-relaxed font-medium mb-4">
            {line}
          </p>
        );
      }
    }
  }

  if (inList) {
    elements.push(renderList(`list-final`));
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [subjectCopied, setSubjectCopied] = useState(false);

  // Inline auth modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } else if (type === 'subject') {
        setSubjectCopied(true);
        setTimeout(() => setSubjectCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    logMetric('click_apply_intercept', { job_id: job.job_id || job.id, title: jobTitle });
    setShowEmailInstructions(false);
    setEmailCopied(false);
    setSubjectCopied(false);
    setShowOptimizeModal(true);
  };

  const handleOptimizeCv = async () => {
    logMetric('convert_to_ai_cv', { job_id: job.job_id || job.id, title: jobTitle });
    setShowOptimizeModal(false);

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      localStorage.setItem('redirect_to_workspace', 'true');
      navigate('/');
    } else {
      setAuthEmail('');
      setAuthPassword('');
      setAuthFullName('');
      setAuthError('');
      setAuthLoading(false);
      setAuthTab('login');
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authTab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword
        });
        if (error) throw error;
        
        localStorage.setItem('redirect_to_workspace', 'true');
        setShowAuthModal(false);
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
          options: {
            data: {
              full_name: authFullName.trim()
            }
          }
        });
        if (error) throw error;
        
        alert("Account created successfully! Welcome to Genusjob.");
        localStorage.setItem('redirect_to_workspace', 'true');
        setShowAuthModal(false);
        navigate('/');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleApplyDirectly = () => {
    logMetric('proceed_to_external_apply', { job_id: job.job_id || job.id, title: jobTitle });
    if (job.redirect_url) {
      const isEmail = job.redirect_url.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(job.redirect_url);
      if (isEmail) {
        setShowEmailInstructions(true);
      } else {
        setShowOptimizeModal(false);
        window.open(job.redirect_url, '_blank', 'noopener,noreferrer');
      }
    }
  };

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
    const fetchJob = async () => {
      setIsLoading(true);
      if (!id) return;

      if (id.startsWith('mock_job_')) {
        const matchedMock = MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];
        setJob({
          ...matchedMock,
          source_url: 'https://genusjob.com',
          redirect_url: 'https://genusjob.com',
          requirements: 'Standard requirements apply.',
          benefits: 'Standard company benefits.',
          deadline: '30 days from now'
        });
        setIsLoading(false);
        return;
      }

      try {
        const { data: dbJob, error } = await supabase
          .from('jobs')
          .select('*')
          .or(`job_id.eq.${id},id.eq.${id}`)
          .maybeSingle();

        if (error) throw error;

        if (dbJob) {
          let loc = dbJob.location || 'Remote';
          if (loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('worldwide')) {
            loc = 'Worldwide (Remote)';
          }
          const normalizedJob = {
            ...dbJob,
            redirect_url: dbJob.source_url || dbJob.url,
            location: {
              display_name: loc
            },
            company: {
              display_name: dbJob.company || 'Hiring Company'
            },
            category: {
              label: dbJob.category || 'Technology'
            }
          };
          setJob(normalizedJob);
        } else {
          throw new Error('Not found in database');
        }
      } catch (err) {
        console.warn('Supabase details fetch failed, loading mock fallback:', err);
        const hashIndex = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % MOCK_JOBS.length;
        setJob({
          ...MOCK_JOBS[hashIndex],
          id,
          source_url: 'https://genusjob.com',
          redirect_url: 'https://genusjob.com',
          requirements: 'Relevant qualifications required.',
          benefits: 'Industry standard package.',
          deadline: '30 days from now'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!job) return;

    const jobTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, '') || '';
    const jobDesc = job.description?.replace(/<\/?[^>]+(>|$)/g, '') || '';
    const company = job.company?.display_name || 'Hiring Company';
    const location = job.location?.display_name || 'Remote';

    // 1. Client-side SEO Metadata update
    document.title = `${jobTitle} at ${company} - genusjob.com`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Apply for ${jobTitle} at ${company}. Learn more and tailor your resume for this position.`);
    }

    // 2. Client-side JSON-LD Schema injection
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': jobTitle,
      'description': jobDesc,
      'datePosted': job.created || new Date().toISOString(),
      'hiringOrganization': {
        '@type': 'Organization',
        'name': company
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': location,
          'addressCountry': 'US'
        }
      },
      ...(job.salary_min && {
        'baseSalary': {
          '@type': 'MonetaryAmount',
          'currency': 'USD',
          'value': {
            '@type': 'QuantitativeValue',
            'minValue': job.salary_min,
            'maxValue': job.salary_max || job.salary_min,
            'unitText': 'YEAR'
          }
        }
      })
    };

    const scriptId = 'jobposting-jsonld';
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
  }, [job]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Position Details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] flex flex-col items-center justify-center font-sans">
        <p className="text-sm font-black uppercase tracking-widest text-slate-450 mb-6">Position not found.</p>
        <Link to="/jobs" className="bg-slate-900 border border-slate-950 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:text-[#10B981] transition-all">Back to Jobs</Link>
      </div>
    );
  }

  const jobTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, '') || '';
  const jobDesc = job.description?.replace(/<\/?[^>]+(>|$)/g, '') || '';
  const company = job.company?.display_name || 'Hiring Company';
  const location = job.location?.display_name || 'Remote';
  const salaryRange = formatMonthlySalary(job.salary_min, job.salary_max);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
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

      {/* BODY CONTENT CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-16">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Link to="/jobs" className="hover:text-emerald-500 transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[200px]">{jobTitle}</span>
        </div>

        {/* Flex layout grid */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-start">
          
          {/* Main position description layout (left) */}
          <div className="flex-1 space-y-12">
            <div className="bg-slate-50 border border-slate-200 p-8 md:p-12 rounded-[2.5rem] space-y-6">
              
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black bg-emerald-500/10 text-[#10B981] px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/15">
                  {job.category?.label || 'General'}
                </span>
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
                  Full Time
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight leading-tight">
                {jobTitle}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-sm font-bold text-slate-650 uppercase tracking-widest">
                <span>🏢 Company: <strong className="text-slate-800">{company}</strong></span>
                <span>📍 Location: <strong className="text-emerald-600 font-extrabold">{location}</strong></span>
                <span>💰 Salary: <strong className="text-[#10B981]">{salaryRange}</strong></span>
              </div>

              {job.redirect_url && (
                <div className="pt-2 text-left">
                  <button 
                    onClick={handleApplyClick}
                    className="w-full sm:w-auto inline-block text-center bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm px-8 py-3.5 rounded-xl uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer border-0"
                  >
                    Apply on Source Platform
                  </button>
                </div>
              )}

            </div>

            <div className="space-y-6 px-4 text-left">
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-800 border-b border-slate-200 pb-3">
                Role Description
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed font-medium">
                {formatParsedText(jobDesc)}
              </div>
            </div>

            {job.requirements && (
              <div className="space-y-6 px-4 text-left">
                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-800 border-b border-slate-200 pb-3">
                  Qualifications & Requirements
                </h3>
                <div className="text-sm text-slate-700 leading-relaxed font-medium">
                  {formatParsedText(job.requirements)}
                </div>
              </div>
            )}

            {job.benefits && (
              <div className="space-y-6 px-4 text-left">
                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-800 border-b border-slate-200 pb-3">
                  Benefits & Offer
                </h3>
                <div className="text-sm text-slate-700 leading-relaxed font-medium">
                  {formatParsedText(job.benefits)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA widgets (right) */}
          <div className="w-full lg:w-96 shrink-0 space-y-8 sticky top-32">
            
            {/* CONVERSION INTEGRATION CARD */}
            <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm relative overflow-hidden text-center space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mx-auto shadow-inner text-[#10B981] shadow-emerald-500/5">
                📝
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  Tailor Your Resume
                </h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Optimize your profile metadata and experiences to fit this specific role's ATS keywords instantly.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                {job.redirect_url && (
                  <button 
                    onClick={handleApplyClick}
                    className="w-full block bg-slate-900 hover:bg-slate-800 text-white font-black text-sm py-4.5 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md cursor-pointer border-0 text-center"
                  >
                    Apply on Source Platform
                  </button>
                )}
                <button 
                  onClick={handleOptimizeCv}
                  className="w-full block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm py-4.5 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer border-0 text-center"
                >
                  Optimize Resume Now
                </button>
              </div>
              
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                No credit card required. Free tier access.
              </p>
            </div>

            {/* Quick stats panel */}
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Position Summary</h4>
              
              <div className="space-y-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <div className="flex justify-between">
                  <span>Job Type:</span>
                  <span className="text-slate-700">Full-Time</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Area:</span>
                  <span className="text-emerald-600 font-extrabold">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salary Limit:</span>
                  <span className="text-[#10B981]">{salaryRange}</span>
                </div>
                <div className="flex justify-between">
                  <span>Posted on:</span>
                  <span className="text-slate-700">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : (job.created ? new Date(job.created).toLocaleDateString() : 'Recent')}
                  </span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <span>Deadline:</span>
                    <span className="text-rose-600 font-extrabold">
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
        
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6 md:px-12 mt-20 text-center">
        <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
          © 2026 Genusjob Resume AI. Built by career builders.
        </p>
      </footer>

      {/* OPTIMIZE MODAL OVERLAY */}
      {showOptimizeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden space-y-8 animate-scale-in">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
            
            {!showEmailInstructions ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto shadow-inner text-[#10B981] shadow-emerald-500/5">
                  🚀
                </div>

                <div className="space-y-4 text-center">
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">
                    Boost Your Application!
                  </h3>
                  <p className="text-sm font-semibold text-slate-650 leading-relaxed">
                    Would you like to analyze and optimize your CV with our AI tool before applying to increase your chances?
                  </p>
                  {job.redirect_url && (job.redirect_url.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(job.redirect_url)) && (
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 mt-3">
                      📧 Send your CV directly to: <strong className="text-slate-800 select-all">{job.redirect_url.replace('mailto:', '')}</strong>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3.5 pt-2">
                  <button 
                    onClick={handleOptimizeCv}
                    className="w-full bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm py-4.5 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer border-0 text-center"
                  >
                    ✨ Optimize CV First (Recommended)
                  </button>
                  <button 
                    onClick={handleApplyDirectly}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-4 rounded-2xl transition duration-200 uppercase tracking-widest cursor-pointer border-0 text-center"
                  >
                    No, Apply Directly
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto shadow-inner text-[#10B981] shadow-emerald-500/5">
                  📧
                </div>

                <div className="space-y-4 text-center">
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">
                    Direct Email Application
                  </h3>
                  <p className="text-sm font-semibold text-slate-650 leading-relaxed">
                    This position accepts applications directly via email. Use the copy options below to prepare your message.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email address field */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Send your CV to</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                      <span className="text-slate-700 font-bold text-xs truncate flex-1 select-all">
                        {job.redirect_url?.replace(/^mailto:/, '')}
                      </span>
                      <button
                        onClick={() => copyToClipboard(job.redirect_url?.replace(/^mailto:/, ''), 'email')}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition duration-150 border-0 cursor-pointer ${
                          emailCopied 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        {emailCopied ? 'Copied! ✓' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Subject line field */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Suggested Subject Line</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                      <span className="text-slate-700 font-bold text-xs truncate flex-1 select-all">
                        {`Application for ${jobTitle}`}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`Application for ${jobTitle}`, 'subject')}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition duration-150 border-0 cursor-pointer ${
                          subjectCopied 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        {subjectCopied ? 'Copied! ✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={() => {
                      window.location.href = job.redirect_url;
                    }}
                    className="w-full bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm py-4.5 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer border-0 text-center"
                  >
                    📬 Open Email Application
                  </button>
                  <button 
                    onClick={() => setShowOptimizeModal(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3.5 rounded-2xl transition duration-200 uppercase tracking-widest cursor-pointer border-0 text-center"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            <button 
              onClick={() => setShowOptimizeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer border-0 bg-transparent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* INLINE AUTH MODAL OVERLAY */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative overflow-hidden space-y-6 animate-scale-in">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
            
            {/* Header / Logo */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-600/20">
                <span className="text-white text-lg">✨</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                {authTab === 'login' ? 'Sign In to Tailor Resume' : 'Create Account to Tailor'}
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                {authTab === 'login' 
                  ? 'Sign in to access the AI CV optimization workspace.' 
                  : 'Sign up to tailor your resume for this position.'}
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition ${
                  authTab === 'login' ? 'border-b-2 border-emerald-600 text-slate-800' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition ${
                  authTab === 'signup' ? 'border-b-2 border-emerald-600 text-slate-800' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold text-center">
                ❌ {authError}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === 'signup' && (
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-4 rounded-xl shadow-md transition duration-200 uppercase tracking-widest disabled:opacity-50 cursor-pointer border-0 mt-2"
              >
                {authLoading 
                  ? 'Processing...' 
                  : (authTab === 'login' ? 'Sign In To Account' : 'Create Free Account')}
              </button>
            </form>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer border-0 bg-transparent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
