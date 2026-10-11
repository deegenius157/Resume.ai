import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

export const LandingPage = ({ setCurrentView }) => {
  const homeRef = React.useRef(null);
  const featuresRef = React.useRef(null);
  const contactRef = React.useRef(null);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 max-w-7xl mx-auto w-full">
        <div className="px-4 py-3 flex justify-between items-center w-full">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-1 hover:opacity-85 transition"
          >
            <span className="text-lg md:text-2xl font-black tracking-tight text-gray-900 font-sans">
              GENUSJOB.COM
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <button onClick={() => scrollToSection(homeRef)} className="hover:text-slate-900 transition cursor-pointer">Home</button>
            <Link to="/jobs" className="hover:text-slate-900 transition">Browse Jobs</Link>
            <button onClick={() => scrollToSection(featuresRef)} className="hover:text-slate-900 transition cursor-pointer">Features</button>
            <Link to="/about" className="hover:text-slate-900 transition">About Us</Link>
            <button onClick={() => scrollToSection(contactRef)} className="hover:text-slate-900 transition cursor-pointer">Contact</button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            {/* GET STARTED BUTTON */}
            <button
              onClick={() => setCurrentView('signup')}
              className="bg-[#10B981] hover:bg-[#0E9F6E] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-5 md:py-2.5 rounded-full shadow-sm transition cursor-pointer"
            >
              Get started
            </button>

            {/* LOGIN BUTTON */}
            <button
              onClick={() => setCurrentView('login')}
              className="border border-slate-200 text-slate-700 text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-5 md:py-2.5 rounded-full hover:bg-slate-50 transition cursor-pointer"
            >
              Login
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block md:hidden p-1.5 text-slate-655 hover:text-slate-900 focus:outline-none"
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
          <div className="md:hidden border-t border-slate-100 bg-[#FFFFFF] px-4 py-4 flex flex-col gap-3.5 shadow-lg transition-all duration-200 animate-fadeIn">
            <button
              onClick={() => { scrollToSection(homeRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Home
            </button>
            <Link
              to="/jobs"
              onClick={() => setIsMenuOpen(false)}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Browse Jobs
            </Link>
            <button
              onClick={() => { scrollToSection(featuresRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Features
            </button>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              About Us
            </Link>
            <button
              onClick={() => { scrollToSection(contactRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Contact
            </button>
            <div className="border-t border-slate-100 pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setCurrentView('signup'); setIsMenuOpen(false); }}
                className="bg-[#10B981] hover:bg-[#0E9F6E] text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full text-center transition shadow-lg shadow-emerald-500/10"
              >
                Get started
              </button>
              <button
                onClick={() => { setCurrentView('login'); setIsMenuOpen(false); }}
                className="border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full text-center hover:bg-slate-50 transition"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section ref={homeRef} className="pt-16 pb-20 px-6 max-w-4xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none"></div>

        {/* HONEST TAGLINE PILL */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-xs font-extrabold uppercase tracking-wider px-5 py-2 rounded-full border border-emerald-500/20">
            <span>✨ Free resume builder and verified job listings.</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-[900] tracking-tight text-slate-900 mb-8 leading-[1.1] relative z-10 max-w-3xl mx-auto text-balance">
          Land your dream job with <br />
          <span className="text-[#10B981]">AI-powered</span> resumes.
        </h1>

        <p className="text-slate-700 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed relative z-10 font-medium">
          Create, edit and download professional resumes with <br className="hidden md:block" /> AI-powered assistance in minutes—and apply to verified remote and international jobs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full max-w-md mx-auto px-4">
          <button 
            onClick={() => setCurrentView('signup')} 
            className="w-full sm:w-auto bg-[#10B981] hover:bg-[#0E9F6E] text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center cursor-pointer"
          >
            Build Free Resume &rarr;
          </button>
          <Link 
            to="/jobs" 
            className="w-full sm:w-auto border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 text-center"
          >
            Browse Verified Jobs
          </Link>
        </div>
      </section>

      {/* 🟢 FEATURES SECTION */}
      <section ref={featuresRef} className="py-24 bg-slate-50/40 border-t border-slate-100 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] mb-4">Features</div>
          <h2 className="text-3xl font-black tracking-tight mb-4 text-slate-900">Engineered for Your Career</h2>
          <p className="text-slate-650 text-sm mb-16 max-w-xl mx-auto font-medium">Practical tools to help your resume pass ATS filters and connect you with verified employers.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-[#E8F9EE] rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">✨</div>
              <h3 className="font-black text-sm mb-3 text-slate-900 uppercase tracking-tight">AI Enhancement</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Turn rough drafts into clear, professional work experience summaries.</p>
            </div>
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-[#E8F9EE] rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">📂</div>
              <h3 className="font-black text-sm mb-3 text-slate-900 uppercase tracking-tight">Smart Parsing</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Upload your existing PDF resume and let AI map your fields automatically.</p>
            </div>
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-[#E8F9EE] rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="font-black text-sm mb-3 text-slate-900 uppercase tracking-tight">ATS Optimization</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Format structured keywords cleanly so your resume is easy for recruiters and systems to read.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL DARK FOOTER */}
      <div ref={contactRef}>
        <Footer />
      </div>
    </div>
  );
};
