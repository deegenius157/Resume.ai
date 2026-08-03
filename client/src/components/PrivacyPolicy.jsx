import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function PrivacyPolicy() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Privacy Policy | GenusJob - Data Protection & Resume Privacy';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'GenusJob Privacy Policy: Learn how we protect your data, handle AI resume optimization, and guarantee that personal information is never sold to third parties.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
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
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">Jobs</Link>
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">Blog</Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">About</Link>
            <Link to="/post-job" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">Post a Job</Link>
            <Link to="/" className="bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest px-4 py-2 rounded-full transition shadow-lg shadow-emerald-500/10">
              Build Resume
            </Link>
          </div>

          {/* Mobile Toggle */}
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

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-[#FFFFFF] px-4 py-4 flex flex-col gap-3.5 shadow-lg">
            <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 py-1">Jobs</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 py-1">Blog</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 py-1">About</Link>
            <Link to="/post-job" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 py-1">Post a Job</Link>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="bg-[#10B981] text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center shadow-md">Build Resume</Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-10 text-left">
        {/* PAGE HEADER */}
        <section className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
            <span>🛡️ LEGAL &amp; DATA PRIVACY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Last Updated: August 2026 &nbsp;•&nbsp; Effective Date: August 1, 2026
          </p>
        </section>

        {/* PLEDGE BANNER */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase tracking-wider">
            <span>🔒 Our Zero Data Sale Pledge</span>
          </div>
          <p className="text-xs md:text-sm font-medium text-emerald-950 leading-relaxed">
            GenusJob collects only the minimal data required to provide remote job listings and AI resume optimization services. <strong>Your personal data, email address, and uploaded resumes are NEVER sold, rented, or monetized to third-party data brokers or advertisers.</strong>
          </p>
        </div>

        {/* EDITORIAL CONTENT */}
        <div className="space-y-8 text-slate-700 font-medium text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect information to operate the GenusJob platform efficiently, personalize your experience, and provide 60-second AI resume optimization tools. The types of information we collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-650">
              <li><strong>Account Information:</strong> When you register or sign in using Supabase Authentication, we collect your email address and full name.</li>
              <li><strong>Resume &amp; CV Data:</strong> Text, skills, work experience, and educational background uploaded or pasted into our AI Resume Builder for ATS optimization.</li>
              <li><strong>Usage Metrics:</strong> Basic interaction telemetry (e.g., job application clicks, search queries, and page view timestamps) to optimize server speed and feature performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is strictly used for functional career services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-650">
              <li>To generate ATS-tailored resume keywords, formatting, and experience recommendations.</li>
              <li>To maintain secure user sessions, save your draft CVs, and enable instant single-click access.</li>
              <li>To route application clicks cleanly to external employer ATS portals or mailto links.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-[#10B981] uppercase tracking-tight border-b border-slate-100 pb-2">
              3. Data Security &amp; Storage
            </h2>
            <p>
              GenusJob leverages enterprise-grade Supabase Postgres infrastructure with Row Level Security (RLS) policies to protect stored user accounts and resume records. All data transmitted between your browser and our servers is encrypted using industry-standard TLS/SSL protocols.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              4. Third-Party Integrations &amp; Job Links
            </h2>
            <p>
              Our platform links to external job posting sources and recruiter application portals. When you click &ldquo;Apply Directly&rdquo;, you may be redirected to an external employer domain governed by its own privacy policies. GenusJob is not responsible for the privacy practices of external hiring domains.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              5. Your Rights &amp; Data Deletion
            </h2>
            <p>
              You maintain full ownership of your personal data. You have the right to inspect, edit, or permanently request deletion of your account and uploaded CV records at any time by contacting us at <a href="mailto:infooesume@gmail.com" className="text-emerald-600 font-bold hover:underline">infooesume@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
