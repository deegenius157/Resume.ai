import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function PostJobPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Post a Job & Hire Talent | GenusJob Recruiter Portal';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Post your job listing to reach thousands of verified candidates and tech professionals across Nigeria and globally on GenusJob.'
      );
    }
  }, []);

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

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link to="/" className="hover:text-emerald-600 transition">Resume Builder</Link>
            <Link to="/jobs" className="hover:text-emerald-600 transition">Browse Jobs</Link>
            <Link to="/blog" className="hover:text-emerald-600 transition">Career Blog</Link>
            <Link to="/about" className="hover:text-emerald-600 transition">About Us</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/jobs"
              className="bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-sm transition"
            >
              Browse Jobs
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-slate-700 py-1">Resume Builder</Link>
            <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-slate-700 py-1">Browse Jobs</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-slate-700 py-1">Career Blog</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-slate-700 py-1">About Us</Link>
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
            Post a Job &amp; Reach <span className="text-[#10B981]">Top Verified Talent</span>
          </h1>

          <p className="text-base md:text-lg font-medium text-slate-600 leading-relaxed">
            Reach thousands of active, motivated candidates across Nigeria and internationally on GenusJob.
          </p>
        </section>

        {/* CONTACT / RECRUITER SUBMISSION CARD */}
        <section className="bg-white border border-slate-200/90 rounded-[2.5rem] p-8 md:p-14 shadow-sm space-y-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center text-3xl mx-auto border border-emerald-100">
            📬
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Publish Your Job Listing
            </h2>
            <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-md mx-auto">
              All job postings on GenusJob are verified and manually published by our team to maintain quality. Send us your job details via email or WhatsApp and we will review and publish it for you within 24 hours.
            </p>
          </div>

          {/* WHAT TO INCLUDE */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Please include in your message:
            </h3>
            <ul className="text-xs font-medium text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Company Name &amp; Website
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Job Title, Role Type (Full-Time, Remote, Hybrid, etc.) &amp; Location
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Responsibilities, Requirements &amp; Salary (if applicable)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Application Link or Email address
              </li>
            </ul>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:genusai001@gmail.com?subject=Job%20Posting%20Submission%20-%20GenusJob"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs px-8 py-4 rounded-xl uppercase tracking-widest transition shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-2"
            >
              <span>✉️</span> Email Your Job
            </a>

            <a
              href="https://wa.me/2348130001427?text=Hello%20GenusJob,%20I%20would%20like%20to%20publish%20a%20job%20listing."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-black text-xs px-8 py-4 rounded-xl uppercase tracking-widest transition text-center flex items-center justify-center gap-2"
            >
              <span>💬</span> Message via WhatsApp
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-medium">
            <span>Direct Email: <strong className="text-slate-800">genusai001@gmail.com</strong></span>
            <span>WhatsApp: <strong className="text-slate-800">+234 813 000 1427</strong></span>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="text-2xl">🎯</div>
            <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">Targeted Audience</h4>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">Reach candidates actively building professional CVs and seeking opportunities.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="text-2xl">⚡</div>
            <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">Quick Turnaround</h4>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">Jobs are verified and published rapidly with direct links to your application channels.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="text-2xl">🌍</div>
            <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">Broad Reach</h4>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">Exposure across Nigeria, Africa, and global remote job seekers.</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
