import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function FreeCoursePage() {
  const [activeLesson, setActiveLesson] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Free 1-Hour Vibe Coding Course | Genus AI';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn Vibe Coding in 1 Hour: Master AI prompt engineering to build and deploy live web applications and portfolio websites with zero prior coding experience.'
      );
    }
  }, []);

  const lessons = [
    {
      id: 1,
      number: '01',
      title: 'Introduction to Vibe Coding & AI Prompting Basics',
      duration: '10 Mins',
      badge: 'Basics',
      description: 'Understand the Vibe Coding mindset: How to instruct AI assistants like ChatGPT, Claude, and Gemini to translate your app ideas into clean, functional code.',
      promptExample: 'Prompt: "Act as a senior front-end engineer. Create a sleek, modern landing page header with a brand logo, navigation links, and a gradient CTA button using Tailwind CSS."',
      keyTakeaways: [
        'How to write precise, context-aware AI prompts',
        'Structuring initial project boilerplate using AI',
        'Iterative refinement: Fixing UI bugs in plain English'
      ]
    },
    {
      id: 2,
      number: '02',
      title: 'Designing Modern UI Layouts with AI Assistants',
      duration: '12 Mins',
      badge: 'Design',
      description: 'Master glassmorphism, responsive flexbox/grid containers, curated color palettes, and micro-animations by communicating design intent to AI models.',
      promptExample: 'Prompt: "Design a 3-column pricing grid featuring dark mode cards, subtle hover scale effects, glowing emerald badges, and responsive mobile stacking."',
      keyTakeaways: [
        'Utilizing modern design systems without manual CSS',
        'Ensuring mobile-first responsive breakpoints',
        'Creating visual hierarchy and micro-interactions'
      ]
    },
    {
      id: 3,
      number: '03',
      title: 'Generating Interactive Logic & State in Plain English',
      duration: '15 Mins',
      badge: 'Interactive',
      description: 'Add dynamic functionality: Learn to prompt AI to generate React state hooks, live search inputs, modal popups, and tab filters effortlessly.',
      promptExample: 'Prompt: "Add a live search filter input and category dropdown to filter an array of candidate portfolio projects in real time."',
      keyTakeaways: [
        'Managing component state and user input events',
        'Building dynamic popups, modals, and drawers',
        'Handling state updates without syntax errors'
      ]
    },
    {
      id: 4,
      number: '04',
      title: 'Connecting Databases & Free Hosting (Supabase)',
      duration: '13 Mins',
      badge: 'Database',
      description: 'Link your AI-generated front-end to Supabase Postgres database tables for real data storage, user registration, and content management.',
      promptExample: 'Prompt: "Write a Supabase JS query to fetch records from the \'projects\' table ordered by creation date and display loading skeletons while fetching."',
      keyTakeaways: [
        'Setting up Supabase tables and Row Level Security',
        'Reading and writing database records via client libraries',
        'Handling asynchronous data fetching and loading states'
      ]
    },
    {
      id: 5,
      number: '05',
      title: 'Deploying Your Live Portfolio & Launching Online',
      duration: '10 Mins',
      badge: 'Launch',
      description: 'Publish your completed web application to a custom live URL on Vercel or Netlify. Configure custom domain names, Open Graph meta tags, and share your creation.',
      promptExample: 'Prompt: "Configure build settings for Vite/React and generate standard Open Graph meta tags for social media link sharing."',
      keyTakeaways: [
        '1-Click automated deployment to Vercel/Netlify',
        'Configuring custom domain names and SSL',
        'Adding social preview cards and SEO tags'
      ]
    }
  ];

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
              GENUS AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/course/free" className="text-xs font-black uppercase tracking-widest text-[#10B981] transition-colors">
              Free Course
            </Link>
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Jobs &amp; Projects
            </Link>
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              AI Tools
            </Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link to="/" className="bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest px-4 py-2 rounded-full transition shadow-lg shadow-emerald-500/10">
              Start Building
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

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-[#FFFFFF] px-4 py-4 flex flex-col gap-3.5 shadow-lg">
            <Link to="/course/free" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-[#10B981] py-1">Free Course</Link>
            <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 py-1">Jobs &amp; Projects</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 py-1">AI Tools</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-650 py-1">About</Link>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="bg-[#10B981] text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center shadow-md mt-1">Start Building</Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-16 text-left">
        {/* HERO HEADER */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
            <span>🎓 FREE 1-HOUR VIBE CODING TRACK</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-[1.15]">
            Vibe Code Your First <span className="text-[#10B981]">Portfolio Website</span> in 1 Hour
          </h1>

          <p className="text-base md:text-lg font-medium text-slate-600 leading-relaxed">
            Go from plain English prompts to a live, functional web application. Designed specifically for African students, freelancers, and ambitious builders.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-extrabold uppercase tracking-widest text-slate-500 pt-2">
            <span className="bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">⏱️ 60-Minute Total Duration</span>
            <span className="bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">⚡ 100% Free &amp; Self-Paced</span>
            <span className="bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">🚀 Zero Coding Required</span>
          </div>
        </section>

        {/* INTERACTIVE LESSON MODULES */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Course Curriculum (5 Lessons)
            </h2>
            <span className="text-xs font-extrabold text-[#10B981] uppercase tracking-widest">
              Lesson {activeLesson + 1} of 5 Selected
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LESSON NAVIGATION LIST */}
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    activeLesson === idx
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                    activeLesson === idx ? 'bg-[#10B981] text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {lesson.number}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-wide leading-snug">
                      {lesson.title}
                    </h3>
                    <p className={`text-[10px] font-semibold ${
                      activeLesson === idx ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      ⏱️ {lesson.duration} &nbsp;•&nbsp; {lesson.badge}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* LESSON CONTENT VIEW */}
            <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Lesson Module {lessons[activeLesson].number}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Duration: {lessons[activeLesson].duration}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {lessons[activeLesson].title}
                </h3>

                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {lessons[activeLesson].description}
                </p>

                {/* AI PROMPT PLAYGROUND PREVIEW */}
                <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl text-xs font-mono space-y-2 border border-slate-800 shadow-inner">
                  <div className="text-slate-500 uppercase tracking-widest font-sans font-bold text-[10px] flex items-center justify-between">
                    <span>💬 COPYABLE AI PROMPT TEMPLATE</span>
                    <span className="text-emerald-400 font-bold">READY TO PASTE</span>
                  </div>
                  <p className="leading-relaxed text-slate-200">
                    {lessons[activeLesson].promptExample}
                  </p>
                </div>

                {/* KEY TAKEAWAYS */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Key Learning Takeaways:
                  </h4>
                  <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
                    {lessons[activeLesson].keyTakeaways.map((takeaway, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-2">
                        <span className="text-[#10B981] font-bold">✓</span>
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={activeLesson === 0}
                  onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                  className="text-xs font-black uppercase tracking-widest text-slate-500 disabled:opacity-30 hover:text-slate-900 transition"
                >
                  &larr; Previous Lesson
                </button>
                {activeLesson < lessons.length - 1 ? (
                  <button
                    onClick={() => setActiveLesson(activeLesson + 1)}
                    className="bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-xl uppercase tracking-widest transition shadow-md shadow-emerald-500/20"
                  >
                    Next Lesson &rarr;
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-6 py-3 rounded-xl uppercase tracking-widest transition shadow-md"
                  >
                    Start Vibe Coding Apps &rarr;
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PAID MASTERCLASS BANNER */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-[#10B981] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">
              🚀 ADVANCED MASTERCLASS TEASER
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Full-Stack Vibe Coding: Supabase, Auth &amp; Paystack Integration
            </h3>
            <p className="text-xs md:text-sm font-medium text-slate-300 leading-relaxed">
              Take your Vibe Coding skills to production level. Learn to connect local payment gateways, user authentication, and scale automated SaaS applications.
            </p>
          </div>
          <Link
            to="/blog"
            className="shrink-0 bg-[#10B981] hover:bg-emerald-500 text-white font-black text-xs px-8 py-4 rounded-xl uppercase tracking-widest transition shadow-lg shadow-emerald-500/20 text-center"
          >
            Explore AI Masterclass Teaser &rarr;
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
