import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function CookiePolicy() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Cookie Policy | GenusJob - Local Storage & Cookies';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'GenusJob Cookie Policy: Learn how we use essential cookies and local storage to secure user sessions and improve site performance.'
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
            <span>🍪 COOKIES &amp; STORAGE POLICY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Last Updated: August 2026 &nbsp;•&nbsp; Effective Date: August 1, 2026
          </p>
        </section>

        {/* EDITORIAL CONTENT */}
        <div className="space-y-8 text-slate-700 font-medium text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              1. What Are Cookies &amp; Local Storage?
            </h2>
            <p>
              Cookies and browser local storage are small data files stored directly on your computer or mobile device when you visit websites. They allow platforms to remember your session, save draft preferences, and deliver faster page load times.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              2. How GenusJob Uses Cookies
            </h2>
            <p>
              GenusJob uses strictly necessary session cookies and HTML5 browser Local Storage for the following functional purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-650">
              <li><strong>Authentication &amp; Security:</strong> Supabase authentication session tokens (`sb-access-token`) to keep candidate accounts logged in securely across pages.</li>
              <li><strong>Workspace &amp; Draft Memory:</strong> Local storage keys (`redirect_to_workspace`, draft CV contents) so you never lose progress when optimizing resumes.</li>
              <li><strong>Performance Telemetry:</strong> Essential aggregated analytics to evaluate load speeds and prevent technical errors.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              3. Managing &amp; Clearing Cookies
            </h2>
            <p>
              You can control or clear cookies at any time through your browser settings. Please note that disabling essential authentication cookies may prevent you from remaining logged into your AI Resume Builder account workspace.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding our Cookie &amp; Storage Policy, please email <a href="mailto:infooesume@gmail.com" className="text-emerald-600 font-bold hover:underline">infooesume@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
