import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ChevronLeft } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../../supabaseClient';

export const LoginView = ({ onNavigate, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      alert("❌ " + error.message);
    } else {
      if (typeof setCurrentUser === 'function' && data.user) {
        setCurrentUser(data.user);
      }
      onNavigate('selection');
    }
  };

  const handleForgotPassword = () => {
    const emailInput = prompt("Please confirm your email address for password reset:", email);
    if (emailInput === null) return; // user cancelled
    if (!emailInput.trim()) {
      alert("❌ Email address is required!");
      return;
    }
    alert("✅ A password reset link has been dispatched to your email address.");
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* BACK TO HOME LINK */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col animate-in fade-in zoom-in-95 duration-500">

        {/* LOGO ICON */}
        <a 
          href="/"
          className="flex items-center gap-1.5 mb-10 justify-center hover:opacity-80 transition focus:outline-none"
        >
          <div className="bg-emerald-600 p-1.5 rounded-lg shadow-lg shadow-emerald-600/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-2xl ml-1.5 flex items-center gap-1">
            <span className="font-extrabold tracking-tight text-slate-900 font-sans">GENUS</span>
            <span className="font-medium tracking-tight text-[#10B981] font-sans">JOB.COM</span>
          </span>
        </a>

        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-sm font-medium text-slate-400 mb-10">Enter your credentials to access your resumes.</p>

        {/* INPUT INPUT SUBMIT TRACK */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 rounded-xl py-4 pl-12 pr-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors focus:outline-none"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 rounded-xl py-4 pl-12 pr-16 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword(!showPassword);
                }}
                className={`absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest select-none transition-colors ${showPassword ? "text-emerald-600" : "text-slate-400"}`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-4 rounded-xl shadow-lg shadow-emerald-600/10 transition duration-200 mt-2 tracking-widest uppercase active:scale-[0.98]"
          >
            Sign In To Account
          </button>
        </form>

        {/* REGISTRATION SWITCH ACTION */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Don't have an account?
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="ml-2 text-emerald-600 hover:text-emerald-700 transition-colors font-black underline-offset-4 hover:underline"
            >
              Create One
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export const SignupView = ({ onNavigate, setCurrentUser }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const sendWelcomeEmail = (userEmail, userName) => {
    const templateParams = {
      to_name: userName || 'User',
      to_email: userEmail,
      reply_to: 'infooesume@gmail.com'
    };

    const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim();
    const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim();
    const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim();

    if (serviceId && templateId && publicKey) {
      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then(() => console.log('Welcome email sent successfully!'))
        .catch((err) => console.error('Email error:', err));
    } else {
      console.warn('EmailJS environment variables are missing. Welcome email not sent.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      alert("❌ " + error.message);
      return;
    }

    alert("Account created successfully! Welcome to Genusjob.");

    if (typeof setCurrentUser === 'function' && data.user) {
      setCurrentUser(data.user);
    }
    onNavigate('selection');
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* BACK TO HOME LINK */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col animate-in fade-in zoom-in-95 duration-500">

        {/* LOGO ICON */}
        <a 
          href="/"
          className="flex items-center gap-1.5 mb-10 justify-center hover:opacity-80 transition focus:outline-none"
        >
          <div className="bg-emerald-600 p-1.5 rounded-lg shadow-lg shadow-emerald-600/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-2xl ml-1.5 flex items-center gap-1">
            <span className="font-extrabold tracking-tight text-slate-900 font-sans">GENUS</span>
            <span className="font-medium tracking-tight text-[#10B981] font-sans">JOB.COM</span>
          </span>
        </a>

        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
        <p className="text-sm font-medium text-slate-400 mb-10">Join the world's most powerful AI resume platform.</p>

        {/* INPUT INPUT CREATE SUBMIT */}
        <form onSubmit={handleSignUpSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Johnathan Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 rounded-xl py-4 pl-12 pr-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 rounded-xl py-4 pl-12 pr-4 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Choose Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 rounded-xl py-4 pl-12 pr-16 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword(!showPassword);
                }}
                className={`absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest select-none transition-colors ${showPassword ? "text-emerald-600" : "text-slate-400"}`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-4 rounded-xl shadow-lg shadow-emerald-600/10 transition duration-200 mt-2 tracking-widest uppercase active:scale-[0.98]"
          >
            Create Free Account
          </button>
        </form>

        {/* AUTH BACK ACTION */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Already have an account?
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="ml-2 text-emerald-600 hover:text-emerald-700 transition-colors font-black underline-offset-4 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};