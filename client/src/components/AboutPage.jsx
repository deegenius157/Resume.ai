import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// MODULAR TESTIMONIALS & SUCCESS STORIES COMPONENT
function TestimonialsSection({ showLiveOnly = false }) {
  const testimonials = [
    {
      id: 1,
      quote: "GenusJob helped me optimize my CV for ATS filters in under a minute. I landed my remote Full-Stack Developer role with a US startup within two weeks of applying!",
      name: "Adebayo O.",
      role: "Full-Stack Software Engineer",
      location: "Lagos, Nigeria",
      metric: "Hired in 14 Days",
      avatar: "👨‍💻"
    },
    {
      id: 2,
      quote: "Finding legit AI Data Annotation and Operations roles was nearly impossible on traditional job sites. GenusJob curates verified, high-paying remote roles that actually exist.",
      name: "Sarah M.",
      role: "AI Data Specialist & Prompt Engineer",
      location: "Nairobi, Kenya",
      metric: "$4,500 / Month",
      avatar: "🤖"
    },
    {
      id: 3,
      quote: "The ATS keyword optimization tool changed everything for me. Instead of sending 100 blind applications, I tailored my CV to 5 targeted roles and got 3 interviews.",
      name: "Carlos R.",
      role: "Technical Product Manager",
      location: "Buenos Aires, Argentina",
      metric: "60% Interview Rate",
      avatar: "🚀"
    }
  ];

  return (
    <section className="space-y-10 text-center py-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
          <span>💬 SUCCESS STORIES &amp; METRICS</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
          Empowering Talent Worldwide
        </h2>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest max-w-xl mx-auto">
          Real results from job seekers who optimized their CVs and landed remote careers on GenusJob
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50 border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.avatar}</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#10B981] text-white px-3 py-1 rounded-full shadow-sm">
                  {item.metric}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
              <div>
                <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                <p className="text-xs font-semibold text-slate-500">{item.role}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {item.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'About Us | GenusJob - Building Bridges Between Talent & Opportunity';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'GenusJob was created to empower job seekers with verified remote careers and AI-driven tools to get hired faster.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      {/* GLOW BACKGROUND DECORATIONS */}
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

          {/* Desktop Navigation Links & Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Jobs
            </Link>
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-[#10B981] transition-colors">
              About
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
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-[#10B981] py-1 transition-colors"
            >
              About
            </Link>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="bg-[#10B981] text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center shadow-md mt-1"
            >
              Build Resume
            </Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-24">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
            <span>✨ ABOUT GENUSJOB</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tight leading-[1.1]">
            Building Bridges Between <span className="text-[#10B981]">Talent &amp; Opportunity</span>
          </h1>

          <p className="text-lg md:text-xl font-medium text-slate-600 leading-relaxed max-w-3xl mx-auto">
            GenusJob was created to empower job seekers with verified remote careers and AI-driven tools to get hired faster.
          </p>
        </section>

        {/* 1. VISION & MISSION STATEMENT SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* MISSION CARD */}
          <div className="bg-emerald-950 text-white border border-emerald-900 rounded-[2.5rem] p-8 md:p-12 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-6 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-[#10B981] text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border border-emerald-500/30">
                🎯 OUR MISSION
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Bridging the Global Opportunity Gap
              </h2>
              <p className="text-base font-medium text-slate-300 leading-relaxed">
                To bridge the global opportunity gap by connecting world-class talent in emerging markets with verified remote roles, while empowering candidates with AI tools to become genuinely employable.
              </p>
            </div>
            <div className="pt-4 text-xs font-black uppercase tracking-widest text-[#10B981] relative z-10">
              Empowering World-Class Talent &rarr;
            </div>
          </div>

          {/* VISION CARD */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-6 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border border-blue-500/30">
                🚀 OUR VISION
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                The Primary Global Career Ecosystem
              </h2>
              <p className="text-base font-medium text-slate-300 leading-relaxed">
                To become the primary career ecosystem for global talent—where job seekers optimize, apply, and land remote roles with complete confidence.
              </p>
            </div>
            <div className="pt-4 text-xs font-black uppercase tracking-widest text-blue-400 relative z-10">
              Borderless Employability &rarr;
            </div>
          </div>
        </section>

        {/* FOUNDER'S LETTER SECTION */}
        <section className="bg-slate-50 border border-slate-200/80 rounded-[2.5rem] p-8 md:p-14 shadow-sm relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                A Note From Our Founder
              </h2>
            </div>

            <div className="space-y-5 text-slate-700 font-medium text-base md:text-lg leading-relaxed border-l-4 border-[#10B981] pl-4 md:pl-6">
              <p>
                &ldquo;For too long, I watched immensely talented, highly qualified individuals struggle through the job application process. They had the skills, the drive, and the ambition, but they kept getting filtered out by automated screening systems or trapped in an ocean of unqualified applicants.
              </p>
              <p>
                On the other side, hiring managers were overwhelmed, struggling to cut through the noise to find candidates who could actually deliver results.
              </p>
              <p className="font-bold text-slate-900 text-lg md:text-xl">
                I built GenusJob to break that cycle.
              </p>
              <p>
                GenusJob isn't just another job board. It is a complete career ecosystem designed to make job seekers genuinely employable. We curate high-paying, verified remote and hybrid opportunities while giving candidates access to 60-second AI tools that optimize their CVs to pass ATS filters and stand out to recruiters on day one.
              </p>
              <p>
                Whether you are looking for your next big break in Tech, Growth Operations, or AI-enabled roles, GenusJob exists to make sure your talent gets seen, valued, and hired.&rdquo;
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-md">
                  US
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">Uthman Shittu</h4>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Founder, GenusJob</p>
                </div>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 bg-white px-3.5 py-1.5 rounded-full border border-slate-200">
                Verified Founder Statement
              </span>
            </div>
          </div>
        </section>

        {/* 2. "WHY GENUSJOB?" (KEY DIFFERENTIATORS GRID) */}
        <section className="space-y-10 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#10B981] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/15">
              <span>⚡ KEY DIFFERENTIATORS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Why GenusJob?
            </h2>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest max-w-xl mx-auto">
              How we stand apart from traditional, noisy job boards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* DIFFERENTIATOR 1 */}
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/40 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#10B981] flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                100% Verified Remote Roles
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                No spam, no ghost jobs, and no low-quality scrapes. Every listing is reviewed and verified for active hiring status and fair terms.
              </p>
            </div>

            {/* DIFFERENTIATOR 2 */}
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/40 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                AI Resume Optimization
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Instant, 60-second ATS optimization tailored to job requirements before applying, helping candidate CVs pass automated screening filters.
              </p>
            </div>

            {/* DIFFERENTIATOR 3 */}
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/40 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                Transparent Compensation
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Clear pay ranges, regions, and work terms on every listing. We prioritize fair compensation visibility for global talent.
              </p>
            </div>

            {/* DIFFERENTIATOR 4 */}
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/40 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                Community-Centric Ecosystem
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Built to educate and support talent through every step of their career journey with actionable guides, resume builders, and interview prep.
              </p>
            </div>
          </div>
        </section>

        {/* 3. "WHO WE SERVE" SECTION */}
        <section className="space-y-10 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-500/15">
              <span>👥 OUR COMMUNITY</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Who We Serve
            </h2>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest max-w-xl mx-auto">
              Empowering ambitious professionals across every stage of their remote career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* SEGMENT 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="text-4xl mb-2">🎓</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Recent Graduates &amp; Entry-Level Talent
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Looking to bridge the experience gap, tailor candidate profiles, and build ATS-ready resumes that open international career doors.
              </p>
            </div>

            {/* SEGMENT 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="text-4xl mb-2">💻</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Remote Professionals &amp; Tech Specialists
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Seeking high-paying, flexible, global opportunities in Software Engineering, Product, Growth Marketing, and Customer Experience.
              </p>
            </div>

            {/* SEGMENT 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                AI-Enabled Operators &amp; Specialists
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Professionals leveraging modern AI tools for Data Annotation, AI Operations, Prompting, and AI-assisted workflow automation.
              </p>
            </div>
          </div>
        </section>

        {/* 4. COMPANY VALUES SECTION */}
        <section className="space-y-10 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-purple-500/15">
              <span>🌟 OUR PILLARS &amp; VALUES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Company Values
            </h2>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest max-w-xl mx-auto">
              The core principles guiding every feature we build and opportunity we publish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* VALUE 1 */}
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#10B981] flex items-center justify-center text-2xl font-black">
                ✊
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Empowerment First
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Giving talent the exact tools, keyword insights, and ATS optimization technology they need to stand out on day one.
              </p>
            </div>

            {/* VALUE 2 */}
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl font-black">
                🔍
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Radical Transparency
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Clear job requirements, fair salary ranges, honest career education, and direct feedback without ghosting.
              </p>
            </div>

            {/* VALUE 3 */}
            <div className="bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl font-black">
                ⚡
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Innovation Driven
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Integrating modern AI workflows and automated matchers into traditional hiring pipelines for faster, smarter results.
              </p>
            </div>
          </div>
        </section>

        {/* 5. "FOR EMPLOYERS" SECTION */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-[#10B981] text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border border-emerald-500/30">
              <span>💼 RECRUITERS &amp; HIRING MANAGERS</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
              Hiring Remote Talent?
            </h3>
            <p className="text-base font-medium text-slate-300 leading-relaxed">
              Access pre-vetted, highly motivated candidates equipped with modern AI skills. Partner with GenusJob to streamline your hiring pipeline and fill roles faster.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto relative z-10">
            <a
              href="mailto:employers@genusjob.com?subject=Partner%20or%20Post%20a%20Job%20on%20GenusJob"
              className="w-full md:w-auto inline-block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm px-8 py-4 rounded-xl text-center transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest cursor-pointer border-0"
            >
              Partner / Post a Job &rarr;
            </a>
          </div>
        </section>

        {/* 6. MODULAR TESTIMONIALS SECTION */}
        <TestimonialsSection />

        {/* CALL TO ACTION (CTA) */}
        <section className="p-10 md:p-14 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="space-y-3 max-w-xl text-left relative z-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
              Ready to land your dream remote role?
            </h3>
            <p className="text-sm md:text-base font-medium text-slate-300 leading-relaxed">
              Explore thousands of active, verified opportunities or build an ATS-proof resume with our AI tools today.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-4 relative z-10">
            <Link
              to="/jobs"
              className="w-full sm:w-auto block bg-[#10B981] hover:bg-emerald-500 text-white font-black text-sm px-8 py-4 rounded-xl text-center transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest cursor-pointer"
            >
              Browse Open Roles
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto block bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black text-sm px-8 py-4 rounded-xl text-center transition-all uppercase tracking-widest cursor-pointer"
            >
              Optimize Your CV
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6 md:px-12 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
            © 2026 Genusjob Resume AI. Built by career builders.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors">
              Jobs
            </Link>
            <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-[#10B981] transition-colors">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
