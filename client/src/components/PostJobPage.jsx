import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function sanitizeApplicationUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  url = url.replace(/[\>\"\'\`\)]+$/, '');

  if (!url.startsWith('mailto:') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) {
    return `mailto:${url}`;
  }

  if (url.startsWith('mailto:')) {
    return url;
  }

  if (!/^https?:\/\//i.test(url)) {
    if (url.startsWith('//')) {
      url = `https:${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch (e) {
    return url;
  }
}

function slugify(text) {
  if (!text) return 'position';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function PostJobPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form fields
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI & Automation');
  const [jobType, setJobType] = useState('Full-Time');
  const [location, setLocation] = useState('Remote (Global)');
  const [salary, setSalary] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [description, setDescription] = useState('');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdJob, setCreatedJob] = useState(null);

  useEffect(() => {
    document.title = 'Post a Remote Job | GenusJob Recruiter Portal';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Post your remote job listing to reach thousands of verified tech, AI, and remote professionals on GenusJob.'
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!company.trim() || !title.trim() || !applicationUrl.trim() || !description.trim()) {
      setErrorMsg('Please fill in all required fields (Company, Job Title, Application Link/Email, and Description).');
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedUrl = sanitizeApplicationUrl(applicationUrl.trim());
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const uniqueJobId = `recruiter_${Date.now()}_${randomSuffix}`;
      const uniqueSlug = `${slugify(title)}-${randomSuffix}`;

      const newJobRecord = {
        job_id: uniqueJobId,
        title: title.trim(),
        company: company.trim(),
        category: category,
        job_type: jobType,
        location: location.trim() || 'Remote (Global)',
        salary: salary.trim() || null,
        source_url: sanitizedUrl,
        url: uniqueSlug,
        description: description.trim(),
        source: 'direct_recruiter',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert([newJobRecord])
        .select()
        .single();

      if (error) throw error;

      setCreatedJob(data || newJobRecord);
    } catch (err) {
      console.error('Failed to post job:', err);
      setErrorMsg(err.message || 'Failed to post job listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[130px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="px-4 py-3 flex justify-between items-center max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-85 transition">
            <div className="bg-[#10B981] p-1.5 rounded-lg shadow-lg shadow-emerald-500/10">
              <span className="text-white text-base">✨</span>
            </div>
            <span className="text-lg md:text-2xl font-black tracking-tight text-gray-900 font-sans">
              GENUSJOB.COM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Jobs
            </Link>
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link to="/post-job" className="text-xs font-black uppercase tracking-widest text-[#10B981] transition-colors">
              Post a Job
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
            <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1">Jobs</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1">Blog</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 py-1">About</Link>
            <Link to="/post-job" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-[#10B981] py-1">Post a Job</Link>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="bg-[#10B981] text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center shadow-md mt-1">Build Resume</Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-12">
        {/* HERO HEADER */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
            <span>💼 RECRUITER &amp; EMPLOYER PORTAL</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-[1.15]">
            Post a Remote Job &amp; Reach <span className="text-[#10B981]">Top Global Talent</span>
          </h1>

          <p className="text-base md:text-lg font-medium text-slate-600 leading-relaxed">
            Publish your position directly to thousands of verified, highly-motivated remote candidates equipped with modern AI skills.
          </p>
        </section>

        {/* SUCCESS STATE DISPLAY */}
        {createdJob ? (
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#10B981] border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto">
              🎉
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                Position Published Successfully!
              </h2>
              <p className="text-sm font-medium text-slate-300 max-w-md mx-auto">
                Your job listing for <strong className="text-white">{createdJob.title}</strong> at <strong className="text-white">{createdJob.company}</strong> is now live on GenusJob.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/jobs/${createdJob.job_id || createdJob.id}-${slugify(createdJob.title)}`}
                className="bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs px-8 py-3.5 rounded-xl uppercase tracking-widest transition shadow-lg shadow-emerald-500/20"
              >
                View Live Listing ↗
              </Link>
              <button
                onClick={() => {
                  setCreatedJob(null);
                  setTitle('');
                  setCompany('');
                  setSalary('');
                  setApplicationUrl('');
                  setDescription('');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white font-black text-xs px-8 py-3.5 rounded-xl uppercase tracking-widest transition border border-slate-700"
              >
                Post Another Job +
              </button>
            </div>
          </div>
        ) : (
          /* JOB POSTING FORM */
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8 text-left">
            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold uppercase tracking-wide">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
                1. Company &amp; Position Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Job Title */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Python & AI Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="AI & Automation">⚡ AI &amp; Automation</option>
                    <option value="Software Engineering">💻 Software Engineering</option>
                    <option value="UI/UX Design">🎨 UI/UX Design</option>
                    <option value="Growth & Operations">📈 Growth &amp; Operations</option>
                    <option value="Customer Experience">💬 Customer Experience</option>
                    <option value="Data & Analytics">📊 Data &amp; Analytics</option>
                  </select>
                </div>

                {/* Job Type Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Job Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Location / Work Arrangement */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Location / Work Arrangement
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote (Global) or Lagos (Hybrid)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
                2. Application Method &amp; Compensation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Link or Email */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Application Link or Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://company.com/apply OR careers@company.com"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <p className="text-[10px] font-semibold text-slate-400">
                    Enter your careers page application URL or direct receiving email address.
                  </p>
                </div>

                {/* Salary Range */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Salary Range / Compensation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $3,000 - $5,000 / month"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
                3. Role Description &amp; Requirements
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Outline the responsibilities, key qualifications, benefits, and required skills for this position..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 transition leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#10B981] hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black text-sm py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition cursor-pointer border-0 text-center"
              >
                {isSubmitting ? 'Publishing Position...' : 'Publish Remote Job Now ✨'}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6 md:px-12 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
            © 2026 Genusjob Resume AI. Built by career builders.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700">Jobs</Link>
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700">Blog</Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700">About</Link>
            <Link to="/post-job" className="text-xs font-black uppercase tracking-widest text-[#10B981]">Post a Job</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
