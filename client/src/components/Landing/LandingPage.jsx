import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = ({ setCurrentView }) => {
  const homeRef = React.useRef(null);
  const featuresRef = React.useRef(null);
  const testimonialsRef = React.useRef(null);
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
            <button onClick={() => scrollToSection(homeRef)} className="hover:text-slate-900 transition">Home</button>
            <button onClick={() => scrollToSection(featuresRef)} className="hover:text-slate-900 transition">Features</button>
            <button onClick={() => scrollToSection(testimonialsRef)} className="hover:text-slate-900 transition">Testimonials</button>
            <button onClick={() => scrollToSection(contactRef)} className="hover:text-slate-900 transition">Contact</button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            {/* GET STARTED BUTTON */}
            <button
              onClick={() => setCurrentView('signup')}
              className="bg-[#10B981] hover:bg-[#0E9F6E] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-5 md:py-2.5 rounded-full shadow-sm transition"
            >
              Get started
            </button>

            {/* LOGIN BUTTON */}
            <button
              onClick={() => setCurrentView('login')}
              className="border border-slate-200 text-slate-700 text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-5 md:py-2.5 rounded-full hover:bg-slate-50 transition"
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
            <button
              onClick={() => { scrollToSection(featuresRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => { scrollToSection(testimonialsRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Testimonials
            </button>
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

        {/* SOCIAL PROOF CLUSTER */}
        <div className="flex flex-col items-center gap-3 mb-10 relative z-10">
          <div className="flex items-center -space-x-2.5">
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="user" />
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="user" />
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="user" />
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="user" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-amber-400 text-xs tracking-widest font-black transition-transform hover:scale-110">★★★★★</div>
            <p className="text-[10px] font-black text-slate-500 tracking-widest mt-1 uppercase opacity-60">Used by 10,000+ users</p>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-[900] tracking-tight text-slate-900 mb-8 leading-[1.1] relative z-10 max-w-3xl text-balance">
          Land your dream job with <br />
          <span className="text-[#10B981]">AI-powered</span> resumes.
        </h1>

        <p className="text-slate-700 text-sm md:text-base max-w-xl mb-12 leading-relaxed relative z-10 font-medium">
          Create, edit and download professional resumes with <br className="hidden md:block" /> AI-powered assistance in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full max-w-md mx-auto px-4">
          <button 
            onClick={() => setCurrentView('signup')} 
            className="w-full sm:w-auto bg-[#10B981] hover:bg-[#0E9F6E] text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center"
          >
            Get started &rarr;
          </button>
          <Link 
            to="/jobs" 
            className="w-full sm:w-auto border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 text-center"
          >
            View Tech Jobs
          </Link>
        </div>

        {/* TRUSTED BRANDS */}
        <div className="mt-28 w-full max-w-3xl relative z-10">
          <p className="text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase mb-8 opacity-50">Trusting by leading brands, including</p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6 opacity-30 grayscale contrast-125 text-xs font-black text-slate-600 italic tracking-tighter">
            <span className="hover:opacity-100 transition-opacity">Instagram</span>
            <span className="hover:opacity-100 transition-opacity">Framer</span>
            <span className="hover:opacity-100 transition-opacity">Microsoft</span>
            <span className="hover:opacity-100 transition-opacity">HUAWEI</span>
            <span className="hover:opacity-100 transition-opacity flex items-center gap-1">Walmart <span className="not-italic text-emerald-500">✨</span></span>
          </div>
        </div>
      </section>

      {/* 🟢 FEATURES SECTION */}
      <section ref={featuresRef} className="py-24 bg-slate-50/40 border-t border-slate-100 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] mb-4">Features</div>
          <h2 className="text-3xl font-black tracking-tight mb-4 text-slate-900">Engineered for Your Success</h2>
          <p className="text-slate-650 text-sm mb-16 max-w-xl mx-auto font-medium">Discover tools designed to bypass ATS machine filters and grab recruiter attention.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-[#E8F9EE] rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">✨</div>
              <h3 className="font-black text-sm mb-3 text-slate-900 uppercase tracking-tight">AI Enhancement</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Instantly elevate casual drafts into impactful corporate summaries.</p>
            </div>
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-[#E8F9EE] rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">📂</div>
              <h3 className="font-black text-sm mb-3 text-slate-900 uppercase tracking-tight">Smart Parsing</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Upload old PDF resumes and let AI instantly map your fields perfectly.</p>
            </div>
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-[#E8F9EE] rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="font-black text-sm mb-3 text-slate-900 uppercase tracking-tight">ATS Optimization</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Format structured keywords cleanly to bypass machine filters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 TESTIMONIALS SECTION */}
      <section ref={testimonialsRef} className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] mb-6">Testimonials</div>
          <h2 className="text-3xl font-black tracking-tight mb-16 text-slate-900">Don't just take our words</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:border-[#10B981]/20 transition-colors">
              <p className="text-slate-600 text-sm italic mb-6 leading-relaxed font-medium">"The AI parser saved me hours of retyping data. The interface is completely effortless and the design is stunning!"</p>
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-widest">- Happy Candidate</h4>
            </div>
            <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:border-[#10B981]/20 transition-colors">
              <p className="text-slate-600 text-sm italic mb-6 leading-relaxed font-medium">"Enhanced my job summaries perfectly. Got 3 interviews in my first week of applying after being stuck."</p>
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-widest">- Lead Engineer</h4>
            </div>
          </div>
        </div>
      </section>

      <footer ref={contactRef} className="bg-slate-900 text-slate-400 py-16 px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12 text-xs">
          {/* Left Branding Block */}
          <div>
            <a 
              href="/"
              className="flex items-center gap-1 mb-3 hover:opacity-85 transition"
            >
              <span className="text-lg font-extrabold tracking-tight text-white font-sans">GENUS</span>
              <span className="text-lg font-medium tracking-tight text-[#10B981] font-sans">JOB.COM</span>
            </a>
            <p className="leading-relaxed max-w-xs text-slate-300 text-sm">
              The world's most powerful AI resume builder, designed for modern professionals.
            </p>
            <a
              href="https://deegeniousweb.pyfib.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleASRIF9leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeVqS87Xe9_umYm9qhK_BGpFbV-41m9T9auEpM-beM052i8hIhG0tyts3pRfw_aem_YWlNzvLp3yZvUMA8GqE6LQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#10B981] hover:underline block mt-3 font-semibold text-sm transition"
            >
              deegeniousweb.pyfib.com
            </a>
          </div>

          {/* Center Supportive Explainer Block */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Have Questions?</h3>
            <p className="leading-relaxed text-slate-300 text-sm">
              We are here to help you build a standout career profile. Reach out anytime via our active digital channels.
            </p>
          </div>

          {/* Right Structured Contacts Block */}
          <div className="md:text-right flex flex-col md:items-end gap-4">
            <div>
              <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">EMAIL US</h4>
              <a href="mailto:infooesume@gmail.com" className="text-[#10B981] hover:underline font-medium text-sm transition">
                infooesume@gmail.com
              </a>
            </div>

            <div>
              <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">CALL, TEXT, OR WHATSAPP US</h4>
              <a href="tel:+2348130001427" className="text-white font-bold text-sm block hover:text-[#10B981] transition">
                +234 813 000 1427
              </a>
              <a
                href="https://wa.me/2348130001427"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#10B981] hover:underline mt-0.5 inline-block font-semibold transition"
              >
                Open in WhatsApp &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-800 pt-8 text-center text-xs tracking-wide text-slate-400">
          &copy; 2026 Genusjob Resume AI. All rights reserved. Built beautifully with PrebuiltUI assets.
        </div>
      </footer>
    </div >
  );
};
