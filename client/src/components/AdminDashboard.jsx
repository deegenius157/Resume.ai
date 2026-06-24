import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [deadline, setDeadline] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  
  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auth states (for inline login if not authenticated)
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      setSession(activeSession);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword
      });

      if (error) throw error;
      setSession(data.session);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setIsSubmitting(true);

    if (!title || !company || !location || !description) {
      setErrorMsg('Title, Company, Location, and Description are required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Generate a unique job_id for manual entries to satisfy the unique constraint
      const uniqueManualId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            title: title.trim(),
            company: company.trim(),
            location: location.trim(),
            description: description.trim(),
            requirements: requirements.trim(),
            benefits: benefits.trim(),
            deadline: deadline || null,
            source_url: sourceUrl.trim() || null,
            job_id: uniqueManualId,
            category: 'Private Job',
            url: sourceUrl.trim() || `https://genusjob.com/jobs/${uniqueManualId}`,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setSuccessMsg('🎉 Job posting successfully created and saved in Supabase database!');
      
      // Reset form fields
      setTitle('');
      setCompany('');
      setLocation('');
      setDescription('');
      setRequirements('');
      setBenefits('');
      setDeadline('');
      setSourceUrl('');
    } catch (err) {
      setErrorMsg(`❌ Failed to insert job posting: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Verifying Admin Session...</p>
      </div>
    );
  }

  // Enforce basic client-side authentication
  if (!session) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10 flex flex-col animate-scale-in">
          
          <div className="bg-rose-50 border border-rose-100 p-4.5 rounded-2xl flex items-center gap-3 text-rose-600 mb-8">
            <span className="text-2xl">⚠️</span>
            <div className="text-left">
              <h4 className="text-xs font-black uppercase tracking-widest leading-none">Access Restricted</h4>
              <p className="text-[10px] font-semibold text-rose-500 mt-1 leading-snug">Authorized administrator credentials required.</p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center mb-2">Admin Control Hub</h2>
          <p className="text-xs font-semibold text-slate-450 text-center mb-8">Sign in below to manage the GenusJob platform listings.</p>

          {authError && (
            <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold text-center border border-rose-100 mb-6">
              ❌ {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-left">Admin Email</label>
              <input
                type="email"
                placeholder="admin@company.com"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-left">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-4 rounded-xl transition duration-200 uppercase tracking-widest shadow-md cursor-pointer border-0 mt-4"
            >
              Authenticate Session
            </button>
          </form>

          <Link to="/jobs" className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors text-center focus:outline-none">
            ← Back to Careers Board
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased relative">
      
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 focus:outline-none">
            <div className="bg-slate-900 p-1 rounded-lg">
              <span className="text-white text-xs">🛠️</span>
            </div>
            <span className="font-extrabold text-sm tracking-widest text-slate-900">GENUSJOB ADMIN</span>
          </Link>
          <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Control Hub
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            👤 Session: <strong className="text-slate-800">{session.user.email}</strong>
          </span>
          <button 
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition cursor-pointer border border-rose-200/50"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* CONTAINER */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12">
        <div className="space-y-8 animate-fade-in">
          
          {/* Header Title */}
          <div className="text-left space-y-2">
            <Link to="/jobs" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
              ← Back to Job Board
            </Link>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Manual Job Insertion</h1>
            <p className="text-xs font-semibold text-slate-500">Insert custom premium listings directly into the Supabase database. These listings will appear immediately on the careers page.</p>
          </div>

          {/* Feedback alerts */}
          {successMsg && (
            <div className="p-5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-bold text-left animate-scale-in">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-5 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold text-left animate-scale-in">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8 text-left">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sterling Bank Plc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos, Nigeria or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target / Source Application URL</label>
              <input
                type="url"
                placeholder="https://company-website.com/careers/apply-job-1"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role Description <span className="text-rose-500">*</span></label>
              <textarea
                required
                rows={5}
                placeholder="Detail core tasks, daily workflows, and organizational context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qualifications & Requirements</label>
              <textarea
                rows={4}
                placeholder="Outline required certifications, key technical languages, degree requirements, or experience expectations..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Benefits & Compensation</label>
              <textarea
                rows={3}
                placeholder="Salary parameters, health plans, stock options, leave allowances, work-from-home benefits..."
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#10B981] hover:bg-emerald-500 disabled:bg-emerald-300 text-white font-black text-sm px-10 py-4.5 rounded-2xl transition duration-200 uppercase tracking-widest shadow-md hover:shadow-emerald-500/20 cursor-pointer border-0"
              >
                {isSubmitting ? 'Inserting Listing...' : 'Publish Job Listing'}
              </button>
            </div>

          </form>

        </div>
      </main>

    </div>
  );
}
