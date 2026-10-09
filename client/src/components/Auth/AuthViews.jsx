import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ChevronLeft } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../../supabaseClient';

export const LoginView = ({ onNavigate, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsUnconfirmed(false);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        const errorMsg = error.message || 'Login failed';
        if (errorMsg.toLowerCase().includes('email not confirmed')) {
          setIsUnconfirmed(true);
          setErrorMessage('Your email address has not been confirmed yet. Please verify your email via the link sent to your inbox.');
        } else {
          setErrorMessage(errorMsg);
        }
      } else {
        if (typeof setCurrentUser === 'function' && data.user) {
          setCurrentUser(data.user);
        }
        onNavigate('selection');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to resend the confirmation link.');
      return;
    }

    setIsResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to resend confirmation email.');
      } else {
        setSuccessMessage(`✅ A fresh confirmation link has been sent to ${email.trim()}. Please check your inbox and spam folder.`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailInput = prompt("Please confirm your email address for password reset:", email);
    if (emailInput === null) return;
    if (!emailInput.trim()) {
      setErrorMessage("Email address is required to reset password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailInput.trim(), {
      redirectTo: `${window.location.origin}/`
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage(`✅ A password reset link has been dispatched to ${emailInput.trim()}.`);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* BACK TO HOME LINK */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors group cursor-pointer"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col animate-in fade-in zoom-in-95 duration-500">

        {/* LOGO ICON */}
        <a 
          href="/"
          className="flex items-center gap-1.5 mb-8 justify-center hover:opacity-80 transition focus:outline-none"
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
        <p className="text-sm font-medium text-slate-400 mb-6">Enter your credentials to access your resumes.</p>

        {/* INLINE ERROR ALERT */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold text-left space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
            {isUnconfirmed && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isResending}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black text-[10px] uppercase tracking-widest py-2.5 px-4 rounded-lg transition text-center cursor-pointer border-0"
              >
                {isResending ? 'Sending Confirmation Link...' : 'Resend Confirmation Email ✉️'}
              </button>
            )}
          </div>
        )}

        {/* INLINE SUCCESS ALERT */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold text-left flex items-start gap-2">
            <span className="text-base shrink-0">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Email Address</label>
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
                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors focus:outline-none cursor-pointer"
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
                className={`absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest select-none transition-colors cursor-pointer ${showPassword ? "text-emerald-600" : "text-slate-400"}`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs py-4 rounded-xl shadow-lg shadow-emerald-600/10 transition duration-200 mt-2 tracking-widest uppercase active:scale-[0.98] cursor-pointer"
          >
            {isLoading ? 'Signing In...' : 'Sign In To Account'}
          </button>
        </form>

        {/* REGISTRATION SWITCH ACTION */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Don't have an account?
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="ml-2 text-emerald-600 hover:text-emerald-700 transition-colors font-black underline-offset-4 hover:underline cursor-pointer"
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
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationPending, setConfirmationPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const sendWelcomeEmail = (userEmail, userName) => {
    const templateParams = {
      to_name: userName || 'User',
      to_email: userEmail,
      reply_to: 'genusai001@gmail.com'
    };

    const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim();
    const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim();
    const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim();

    if (serviceId && templateId && publicKey) {
      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then(() => console.log('Welcome email sent successfully!'))
        .catch((err) => console.error('Email error:', err));
    }
  };

  const handleSignUpSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // Check if email confirmation is required (data.session is null)
      if (data?.user && !data.session) {
        setConfirmationPending(true);
        sendWelcomeEmail(email.trim(), fullName.trim());
      } else if (data?.session) {
        // Confirmation is disabled or user is already auto-confirmed
        sendWelcomeEmail(email.trim(), fullName.trim());
        if (typeof setCurrentUser === 'function' && data.user) {
          setCurrentUser(data.user);
        }
        onNavigate('selection');
      } else {
        setConfirmationPending(true);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSignupLink = async () => {
    setIsResending(true);
    setResendSuccess('');
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setResendSuccess(`Confirmation email resent to ${email.trim()}! Please check your inbox.`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };

  // If waiting for email confirmation, render confirmation message card
  if (confirmationPending) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 flex flex-col text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center text-3xl mx-auto border border-emerald-100 shadow-inner">
            📬
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Check Your Email</h2>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              We have sent an activation link to <strong className="text-slate-800">{email}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-medium text-slate-650 text-left leading-relaxed space-y-1.5">
            <p className="font-bold text-slate-800">Next Steps:</p>
            <p>1. Open your inbox (and check the spam folder).</p>
            <p>2. Click the confirmation link to activate your GenusJob account.</p>
            <p>3. Once confirmed, sign in to start creating resumes.</p>
          </div>

          {resendSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl text-center">
              ✓ {resendSuccess}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest shadow-md transition cursor-pointer"
            >
              Go to Sign In →
            </button>

            <button
              onClick={handleResendSignupLink}
              disabled={isResending}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl uppercase tracking-widest transition cursor-pointer border border-slate-200"
            >
              {isResending ? 'Resending Link...' : 'Resend Email Link'}
            </button>
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Wrong email?{' '}
            <button
              onClick={() => { setConfirmationPending(false); }}
              className="text-emerald-600 hover:underline cursor-pointer font-bold"
            >
              Re-enter details
            </button>
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* BACK TO HOME LINK */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors group cursor-pointer"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col animate-in fade-in zoom-in-95 duration-500">

        {/* LOGO ICON */}
        <a 
          href="/"
          className="flex items-center gap-1.5 mb-8 justify-center hover:opacity-80 transition focus:outline-none"
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
        <p className="text-sm font-medium text-slate-400 mb-6">Join the world's most powerful AI resume platform.</p>

        {/* INLINE ERROR ALERT */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold text-left flex items-start gap-2">
            <span className="text-base shrink-0">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* INPUT INPUT CREATE SUBMIT */}
        <form onSubmit={handleSignUpSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Your Full Name</label>
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
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Email Address</label>
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
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Choose Password</label>
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
                className={`absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest select-none transition-colors cursor-pointer ${showPassword ? "text-emerald-600" : "text-slate-400"}`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs py-4 rounded-xl shadow-lg shadow-emerald-600/10 transition duration-200 mt-2 tracking-widest uppercase active:scale-[0.98] cursor-pointer"
          >
            {isLoading ? 'Creating Account...' : 'Create Free Account'}
          </button>
        </form>

        {/* AUTH BACK ACTION */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Already have an account?
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="ml-2 text-emerald-600 hover:text-emerald-700 transition-colors font-black underline-offset-4 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};