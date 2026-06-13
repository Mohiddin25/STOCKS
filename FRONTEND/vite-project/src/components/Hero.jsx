import React from 'react';
import { TrendingUp, Sparkles, Lock, ArrowRight } from 'lucide-react';

export default function Hero({ openAuth }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6 animate-fade-in">
        <Sparkles className="w-3.5 h-3.5" />
        Introducing AI Sentiment Stock Analysis
      </div>
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white mb-6">
        Smart Investing, <br />
        <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
          Assisted by AI Intelligence
        </span>
      </h1>
      <p className="text-lg text-slate-400 mb-10 max-w-2xl leading-relaxed">
        Track live Nifty 50 movers, analyze real-time market news sentiments utilizing Gemini AI, and manage your custom portfolio with simple, high-security 6-digit PIN logins.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full justify-center">
        <button
          onClick={() => openAuth('signup')}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-full shadow-xl shadow-purple-900/30 flex items-center justify-center gap-2 group transition-all duration-200 cursor-pointer"
        >
          Get Started Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => openAuth('signin')}
          className="border border-slate-700 hover:border-slate-500 bg-slate-900/40 text-slate-350 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-250 cursor-pointer"
        >
          Sign In to Account
        </button>
      </div>

      {/* Features list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl inline-block mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-100 mb-2">Live Nifty movers</h3>
          <p className="text-slate-400 text-sm">Track top gainers and losers instantly. Get pricing data direct from market APIs.</p>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl inline-block mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-100 mb-2">Gemini News Analysis</h3>
          <p className="text-slate-400 text-sm">Get real-time sentiment classifications, summaries, and confidence scores based on news.</p>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl inline-block mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-100 mb-2">6-Digit Secure PIN</h3>
          <p className="text-slate-400 text-sm">Sign up and log in quickly. Protect your sessions using custom secure passwords.</p>
        </div>
      </div>
    </div>
  );
}
