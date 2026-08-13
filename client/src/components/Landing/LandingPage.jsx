import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

export const LandingPage = ({ setCurrentView }) => {
  const homeRef = React.useRef(null);
  const courseRef = React.useRef(null);
  const masterclassRef = React.useRef(null);
  const toolsRef = React.useRef(null);
  const contactRef = React.useRef(null);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = React.useState(false);

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 max-w-7xl mx-auto w-full">
        <div className="px-4 py-3 flex justify-between items-center w-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-85 transition"
          >
            <div className="bg-[#10B981] p-1.5 rounded-lg shadow-md shadow-emerald-500/10">
              <span className="text-white text-base">✨</span>
            </div>
            <span className="text-lg md:text-2xl font-black tracking-tight text-gray-900 font-sans">
              GENUS AI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <button onClick={() => scrollToSection(homeRef)} className="hover:text-slate-900 transition">Home</button>
            <button onClick={() => scrollToSection(courseRef)} className="hover:text-slate-900 transition">Free Course</button>
            <button onClick={() => scrollToSection(masterclassRef)} className="hover:text-slate-900 transition">Masterclass</button>
            <button onClick={() => scrollToSection(toolsRef)} className="hover:text-slate-900 transition">AI Tools</button>
            <Link to="/about" className="hover:text-slate-900 transition">About Us</Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <Link
              to="/course/free"
              className="bg-[#10B981] hover:bg-[#0E9F6E] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-full shadow-sm transition"
            >
              Free Course
            </Link>

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
              onClick={() => { scrollToSection(courseRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Free Course
            </button>
            <button
              onClick={() => { scrollToSection(masterclassRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              Masterclass
            </button>
            <button
              onClick={() => { scrollToSection(toolsRef); setIsMenuOpen(false); }}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              AI Tools
            </button>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-left text-xs font-black uppercase tracking-widest text-slate-655 hover:text-slate-900 py-1 transition-colors"
            >
              About Us
            </Link>
            <div className="border-t border-slate-100 pt-2 flex flex-col gap-2">
              <Link
                to="/course/free"
                onClick={() => setIsMenuOpen(false)}
                className="bg-[#10B981] hover:bg-[#0E9F6E] text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full text-center transition shadow-lg shadow-emerald-500/10"
              >
                Start Free Course
              </Link>
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
      <section ref={homeRef} className="pt-16 pb-20 px-6 max-w-5xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none"></div>

        {/* SOCIAL PROOF CLUSTER */}
        <div className="flex flex-col items-center gap-3 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
            <span>✨ THE VIBE CODING &amp; AI PLATFORM FOR AFRICA</span>
          </div>

          <div className="flex items-center -space-x-2.5 pt-2">
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="African builder" />
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="African developer" />
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="African student" />
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="African founder" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-amber-400 text-xs tracking-widest font-black">★★★★★</div>
            <p className="text-[10px] font-black text-slate-500 tracking-widest mt-1 uppercase opacity-60">Empowering 10,000+ African Students &amp; Freelancers</p>
          </div>
        </div>

        {/* HEADLINE & SUBHEADLINE */}
        <h1 className="text-4xl md:text-6xl font-[900] tracking-tight text-slate-900 mb-6 leading-[1.1] relative z-10 max-w-4xl text-balance uppercase">
          Learn to Build Apps &amp; Websites with AI—<span className="text-[#10B981]">No Coding Needed.</span>
        </h1>

        <p className="text-slate-700 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed relative z-10 font-medium">
          Master Vibe Coding. Go from plain English prompts to live, functional web applications in hours.
        </p>

        {/* HERO CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full max-w-md mx-auto px-4">
          <Link
            to="/course/free"
            className="w-full sm:w-auto bg-[#10B981] hover:bg-[#0E9F6E] text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center"
          >
            Start Free 1-Hour Course &rarr;
          </Link>
          <Link 
            to="/blog" 
            className="w-full sm:w-auto border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 text-center"
          >
            Explore AI Tools
          </Link>
        </div>

        {/* TRUSTED COMMUNITY BRANDS */}
        <div className="mt-20 w-full max-w-3xl mx-auto relative z-10">
          <p className="text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase mb-6 opacity-60">Empowering Builders Across</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40 grayscale text-xs font-black text-slate-600 italic tracking-tighter">
            <span>NIGERIA</span>
            <span>KENYA</span>
            <span>GHANA</span>
            <span>SOUTH AFRICA</span>
            <span>RWANDA</span>
            <span className="not-italic text-emerald-500">🌍</span>
          </div>
        </div>
      </section>

      {/* SECTION 1: FREE COURSE PREVIEW */}
      <section ref={courseRef} className="py-24 bg-slate-50/60 border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-emerald-500/15">
              <span>🎓 FREE 1-HOUR COURSE TRACK</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
              Vibe Code Your First Portfolio Website in 1 Hour
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto">
              5 bite-sized interactive lessons to build and publish your first live AI-powered web app with zero prior coding experience.
            </p>
          </div>

          {/* 5 LESSON CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
            {/* LESSON 1 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
              <div className="space-y-3">
                <span className="text-xs font-black bg-emerald-100 text-[#10B981] px-2.5 py-1 rounded-md inline-block">Lesson 01</span>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                  Intro to Vibe Coding
                </h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Prompting AI assistants like ChatGPT &amp; Claude to turn plain ideas into working code.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-t border-slate-100">
                ⏱️ 10 Mins • Free
              </div>
            </div>

            {/* LESSON 2 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
              <div className="space-y-3">
                <span className="text-xs font-black bg-emerald-100 text-[#10B981] px-2.5 py-1 rounded-md inline-block">Lesson 02</span>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                  UI Design with AI
                </h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Generating modern, responsive flexbox and grid UI components effortlessly.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-t border-slate-100">
                ⏱️ 12 Mins • Free
              </div>
            </div>

            {/* LESSON 3 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
              <div className="space-y-3">
                <span className="text-xs font-black bg-emerald-100 text-[#10B981] px-2.5 py-1 rounded-md inline-block">Lesson 03</span>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                  App Logic &amp; State
                </h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Adding state, forms, click handlers, and dynamic interactivity using English prompts.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-t border-slate-100">
                ⏱️ 15 Mins • Free
              </div>
            </div>

            {/* LESSON 4 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
              <div className="space-y-3">
                <span className="text-xs font-black bg-emerald-100 text-[#10B981] px-2.5 py-1 rounded-md inline-block">Lesson 04</span>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                  Supabase Auth &amp; DB
                </h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Linking Supabase database storage and user login authentication seamlessly.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-t border-slate-100">
                ⏱️ 13 Mins • Free
              </div>
            </div>

            {/* LESSON 5 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
              <div className="space-y-3">
                <span className="text-xs font-black bg-emerald-100 text-[#10B981] px-2.5 py-1 rounded-md inline-block">Lesson 05</span>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                  Live Vercel Launch
                </h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  Publishing your portfolio website to a custom live URL on Vercel or Netlify.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-t border-slate-100">
                ⏱️ 10 Mins • Free
              </div>
            </div>
          </div>

          <div>
            <Link
              to="/course/free"
              className="inline-block bg-[#10B981] hover:bg-[#0E9F6E] text-white font-black text-xs px-8 py-4 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Start Free Course Now &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: PAID MASTERCLASS TEASER */}
      <section ref={masterclassRef} className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden text-left border border-slate-800 space-y-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-amber-400/30">
                ⚡ COMING SOON &nbsp;•&nbsp; ADVANCED TRACK
              </div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                Cohort 1 Registration Opening
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                Full-Stack Vibe Coding: Supabase, Auth &amp; Paystack Integration
              </h2>
              <p className="text-sm md:text-base font-medium text-slate-300 leading-relaxed max-w-2xl">
                The ultimate masterclass for African freelancers, students &amp; founders building production-ready SaaS applications with local payment gateways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="text-[#10B981] font-bold text-base">✓</span>
                Advanced Prompt Engineering for Complex Web Apps
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="text-[#10B981] font-bold text-base">✓</span>
                User Authentication &amp; Supabase Row Level Security
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="text-[#10B981] font-bold text-base">✓</span>
                Paystack &amp; Flutterwave Payment Gateway Integration
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <span className="text-[#10B981] font-bold text-base">✓</span>
                Deploying &amp; Scaling Production SaaS Infrastructure
              </div>
            </div>

            <div className="pt-4 relative z-10 flex flex-col sm:flex-row items-center gap-4">
              {waitlistSuccess ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-6 py-3.5 rounded-xl">
                  🎉 You are on the Masterclass waitlist! We will notify you first.
                </div>
              ) : (
                <button
                  onClick={() => setWaitlistSuccess(true)}
                  className="w-full sm:w-auto bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs px-8 py-4 rounded-xl uppercase tracking-widest transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
                >
                  Join Masterclass Waitlist ✨
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI INSIGHTS & TOOLS SHOWCASE */}
      <section ref={toolsRef} className="py-24 bg-slate-50/40 border-t border-slate-100 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
              <span>🛠️ AI TOOLS &amp; NEWS SHOWCASE</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Curated AI Resources for African Builders
            </h2>
            <p className="text-slate-650 text-sm max-w-xl mx-auto font-medium">
              Hand-picked prompt generators, workflow guides, and tools to accelerate your web development speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* ITEM 1 */}
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-[#10B981] rounded-2xl flex items-center justify-center text-xl font-black">
                🤖
              </div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                AI Prompt Generators
              </h3>
              <p className="text-slate-650 text-xs leading-relaxed font-medium">
                Copy-pasteable prompt recipes tailored for generating clean React, Tailwind CSS, and Node.js components.
              </p>
              <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-[#10B981] inline-block">
                Explore Prompt Library &rarr;
              </Link>
            </div>

            {/* ITEM 2 */}
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-black">
                ⚡
              </div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                Vibe Coding Workflow Frameworks
              </h3>
              <p className="text-slate-650 text-xs leading-relaxed font-medium">
                Step-by-step blueprints showing how African creators go from idea validation to live application in under 60 minutes.
              </p>
              <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-blue-600 inline-block">
                Read Workflow Guides &rarr;
              </Link>
            </div>

            {/* ITEM 3 */}
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl font-black">
                📊
              </div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                African Builder Community
              </h3>
              <p className="text-slate-650 text-xs leading-relaxed font-medium">
                Connect with thousands of students, freelancers, and early-stage founders building AI-powered startups across Africa.
              </p>
              <Link to="/about" className="text-xs font-black uppercase tracking-widest text-purple-600 inline-block">
                Learn About Genus AI &rarr;
              </Link>
            </div>

            {/* ITEM 4 */}
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl font-black">
                🛠️
              </div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
                Curated AI Developer Directory
              </h3>
              <p className="text-slate-650 text-xs leading-relaxed font-medium">
                Discover free vector databases, serverless APIs, LLM providers, and hosting solutions optimized for fast prototyping.
              </p>
              <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-amber-600 inline-block">
                View Tool Directory &rarr;
              </Link>
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
