import React, { useEffect } from 'react';
import { Mail, Key, User, Lock, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function AuthModal({
  showAuthModal,
  setShowAuthModal,
  authMode,
  openAuth,
  email,
  setEmail,
  pin,
  setPin,
  name,
  setName,
  error,
  successMsg,
  loading,
  googleTempUser,
  handleSignInSubmit,
  handleSignUpSubmit,
  handleCreatePinSubmit,
  handleGoogleCredentialResponse,
  resetAuthForm
}) {
  useEffect(() => {
    if (showAuthModal && (authMode === 'signin' || authMode === 'signup')) {
      const initGoogle = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1074366538555-dummyclientid.apps.googleusercontent.com',
            callback: handleGoogleCredentialResponse,
          });
          const googleBtn = document.getElementById('google-signin-btn-modal');
          if (googleBtn) {
            window.google.accounts.id.renderButton(googleBtn, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: authMode === 'signin' ? 'signin_with' : 'signup_with',
            });
          }
        }
      };

      const timer = setTimeout(initGoogle, 400);
      return () => clearTimeout(timer);
    }
  }, [showAuthModal, authMode, handleGoogleCredentialResponse]);

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden transition-all duration-300 transform scale-100">
        
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white hover:bg-slate-850 p-1.5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-purple-500/10 p-3 rounded-full text-purple-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          {authMode === 'signin' && (
            <>
              <h3 className="text-xl font-bold text-white">Sign In to Stocks AI</h3>
              <p className="text-sm text-slate-500 mt-1">Enter your email and 6-digit security PIN</p>
            </>
          )}
          {authMode === 'signup' && (
            <>
              <h3 className="text-xl font-bold text-white">Create Account</h3>
              <p className="text-sm text-slate-500 mt-1">Sign up to get access to AI News Analytics</p>
            </>
          )}
          {authMode === 'create-pin' && (
            <>
              <h3 className="text-xl font-bold text-white">Setup Security PIN</h3>
              <p className="text-sm text-slate-500 mt-1">Create a 6-digit PIN for {googleTempUser?.email}</p>
            </>
          )}
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-850 text-rose-300 px-4 py-3 rounded-xl text-xs mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-850 text-emerald-300 px-4 py-3 rounded-xl text-xs mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Authentication forms */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-slate-200 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-400">6-Digit PIN</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="******"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPin(val);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-slate-200 focus:border-purple-500 transition-colors text-center tracking-[0.5em] font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors mt-2 cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-slate-200 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-slate-200 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-400">Create 6-Digit PIN</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="******"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPin(val);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-slate-200 focus:border-purple-500 transition-colors text-center tracking-[0.5em] font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors mt-2 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
        )}

        {authMode === 'create-pin' && (
          <form onSubmit={handleCreatePinSubmit} className="space-y-4">
            <div className="text-left text-xs bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-slate-400 space-y-1">
              <div><strong className="text-slate-350 font-semibold">Name:</strong> {googleTempUser?.name}</div>
              <div><strong className="text-slate-350 font-semibold">Email:</strong> {googleTempUser?.email}</div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-400">Set 6-Digit PIN</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="******"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPin(val);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-slate-200 focus:border-purple-500 transition-colors text-center tracking-[0.5em] font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors mt-2 cursor-pointer"
            >
              {loading ? 'Registering PIN...' : 'Complete & Sign In'}
            </button>
          </form>
        )}

        {/* OAUTH SECTION */}
        {(authMode === 'signin' || authMode === 'signup') && (
          <div className="mt-6 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-850 w-full absolute"></div>
              <span className="bg-slate-900 px-3 text-xs text-slate-500 font-semibold relative z-10">OR CONTINUE WITH</span>
            </div>

            {/* Google Sign-in Button */}
            <div className="flex justify-center w-full min-h-[44px]">
              <div id="google-signin-btn-modal" className="w-full flex justify-center"></div>
            </div>


          </div>
        )}

        {/* SWITCH MODES */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {authMode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button onClick={() => openAuth('signup')} className="text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer">
                Sign Up
              </button>
            </p>
          )}
          {authMode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button onClick={() => openAuth('signin')} className="text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer">
                Sign In
              </button>
            </p>
          )}
          {authMode === 'create-pin' && (
            <p>
              Want to use a different account?{' '}
              <button onClick={() => openAuth('signin')} className="text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer">
                Cancel & Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
