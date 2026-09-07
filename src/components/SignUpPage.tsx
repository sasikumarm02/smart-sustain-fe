import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Leaf, User, Briefcase, ArrowLeft, Phone } from 'lucide-react';
import heroImage from '../assets/login_hero.png';
import mindgraphLogo from '../assets/mindgraph-logo.png';

interface SignUpPageProps {
  onSignUpSuccess: () => void;
  onBackToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onBackToLogin }) => {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (!jobTitle.trim()) {
      setError('Please enter your job title.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await signup(fullName, email, password, jobTitle, phone);
      setLoading(false);

      if (res.success) {
        // If API succeeds, navigate to login page for user to sign in
        onSignUpSuccess();
      } else {
        // Throw / show error message
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Registration failed. Please check your network and try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-between overflow-x-hidden font-sans text-slate-800">
      {/* Split Screen Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Hero Section with Sustainable Architecture */}
        <div className="lg:col-span-7 relative flex flex-col justify-between p-8 lg:p-14 overflow-hidden bg-slate-900">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Sustainable Green Architecture"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          </div>

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              SmartSustain<span className="text-cyan-400 font-mono text-sm">.AI</span>
            </span>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-xl my-auto py-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              AI-Powered ESG <br />
              reporting Platform
            </h1>
            <p className="text-sm lg:text-base text-slate-300 font-normal leading-relaxed max-w-md">
              Join thousands of enterprises tracking emissions, automating ESG reporting, and achieving net-zero goals.
            </p>
          </div>

          {/* Hero Footer */}
          <div className="relative z-10 text-xs text-slate-400 font-medium">
            Enterprise ESG & Carbon Accounting Suite
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-6 sm:p-10 lg:p-16 bg-gradient-to-b from-slate-50 via-white to-sky-50/40">
          {/* Top Header Bar */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              Back to Login
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-slate-100 text-[11px] font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Platform Status: <span className="font-semibold text-slate-700">Active</span>
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="w-full max-w-md mx-auto my-auto py-6">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100/80 transition-all">
              {/* Header Titles */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d769f] tracking-tight mb-1">
                  Create Account
                </h2>
                <p className="text-[11px] font-bold tracking-wider text-cyan-600 uppercase mb-2">
                  START YOUR ESG JOURNEY
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Sustainability Measurement And Reporting Tool (SMART)
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    EMAIL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your mail"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    PHONE NUMBER
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1-555-0199"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Job Title Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    JOB TITLE
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. ESG Lead / Manager"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 Characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#25a5cb] hover:bg-[#1f93b5] active:bg-[#1a82a1] text-white font-bold text-sm tracking-wide shadow-md shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 mt-5 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Sign Up'
                  )}
                </button>

                {/* Back to Login Link Prompt */}
                <div className="text-center pt-2 text-xs text-slate-500 font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 inline font-sans"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>

            {/* Copyright Note under Card */}
            <div className="text-center mt-4 text-[11px] text-slate-400">
              © 2026 Smart Sustain.AI All Rights Reserved
            </div>
          </div>

          {/* Bottom Right Brand Attribution */}
          <div className="flex justify-end">
            <div className="flex flex-col items-center text-center gap-1 text-[10px] text-slate-400">
              <span className="text-center">Powered by</span>
              <img src={mindgraphLogo} alt="Mindgraph" className="h-6 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
