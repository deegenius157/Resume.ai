import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-14 px-6 md:px-12 text-slate-600">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
        {/* BRAND & MISSION COLUMN */}
        <div className="space-y-4 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition inline-block">
            <div className="bg-[#10B981] p-1.5 rounded-lg shadow-md shadow-emerald-500/10">
              <span className="text-white text-base">✨</span>
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight text-slate-900 font-sans">
              GENUSJOB.COM
            </span>
          </Link>

          <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-md">
            Connecting world-class remote talent with verified global careers, while empowering job seekers with 60-second AI resume optimization tools to get hired faster.
          </p>

          <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase pt-2">
            © 2026 Genusjob Resume AI. Built by career builders.
          </p>
        </div>

        {/* PLATFORM NAVIGATION COLUMN */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
            Platform
          </h4>
          <ul className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <li>
              <Link to="/jobs" className="hover:text-[#10B981] transition-colors">
                Remote Jobs
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-[#10B981] transition-colors">
                Career Blog
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#10B981] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/post-job" className="hover:text-[#10B981] transition-colors text-emerald-600 font-extrabold">
                Post a Job / Partner
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-[#10B981] transition-colors">
                AI Resume Builder
              </Link>
            </li>
          </ul>
        </div>

        {/* LEGAL & POLICIES COLUMN */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
            Legal &amp; Policies
          </h4>
          <ul className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <li>
              <Link to="/privacy" className="hover:text-[#10B981] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#10B981] transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-[#10B981] transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
