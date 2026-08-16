import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-8 border-t border-slate-800 text-left">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs">
        {/* Column 1: Left Branding Block */}
        <div className="space-y-3">
          <Link 
            to="/"
            className="flex items-center gap-1 hover:opacity-85 transition inline-block"
          >
            <span className="text-lg font-extrabold tracking-tight text-white font-sans">GENUS</span>
            <span className="text-lg font-medium tracking-tight text-[#10B981] font-sans">AI</span>
          </Link>
          <p className="leading-relaxed text-slate-300 text-xs">
            The AI education and Vibe Coding platform empowering African students, freelancers, and builders.
          </p>
          <a
            href="https://deegeniousweb.pyfib.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleASRIF9leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeVqS87Xe9_umYm9qhK_BGpFbV-41m9T9auEpM-beM052i8hIhG0tyts3pRfw_aem_YWlNzvLp3yZvUMA8GqE6LQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#10B981] hover:underline block font-semibold text-xs transition"
          >
            deegeniousweb.pyfib.com
          </a>
        </div>

        {/* Column 2: Platform Navigation */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-300">
            <li>
              <Link to="/course/free" className="text-[#10B981] hover:underline font-bold transition-colors">Free Vibe Coding Course</Link>
            </li>
            <li>
              <Link to="/jobs" className="hover:text-[#10B981] transition-colors">Jobs &amp; Projects</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-[#10B981] transition-colors">AI Tools &amp; Guides</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#10B981] transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/post-job" className="hover:text-[#10B981] transition-colors">Post a Job / Partner</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Policies */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Legal &amp; Policies</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-300">
            <li>
              <Link to="/privacy" className="hover:text-[#10B981] transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#10B981] transition-colors">Terms of Service</Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-[#10B981] transition-colors">Cookie Policy</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Structured Contacts Block */}
        <div className="space-y-4">
          <div>
            <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">HAVE QUESTIONS? / EMAIL US</h4>
            <a href="mailto:genusai001@gmail.com" className="text-[#10B981] hover:underline font-bold text-sm transition block">
              genusai001@gmail.com
            </a>
          </div>

          <div>
            <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">CALL, TEXT, OR WHATSAPP US</h4>
            <a href="tel:+2348130001427" className="text-white font-bold text-xs block hover:text-[#10B981] transition">
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
        &copy; 2026 Genus AI. All rights reserved. Empowering African builders.
      </div>
    </footer>
  );
}
