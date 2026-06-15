import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, X } from 'lucide-react';

// Import modular beginner-friendly components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthModal from './components/AuthModal';
import NewsFeed from './components/NewsFeed';
import MoversSidebar from './components/MoversSidebar';
import StockDetails from './components/StockDetails';

export default function App() {
  // Session & Authentication states
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'create-pin'
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleTempUser, setGoogleTempUser] = useState(null); // Hold Google details before PIN creation

  // Dashboard states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedStock, setSearchedStock] = useState(null);
  const [searchedNews, setSearchedNews] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [movers, setMovers] = useState({ gainers: [], losers: [] });
  const [generalNews, setGeneralNews] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const API_BASE = 'https://stocks-sgv3.onrender.com';

  // Check active user session on app mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.log('No active session found on initial check.');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Fetch movers, news feeds, and watchlist when user session changes
  useEffect(() => {
    if (user) {
      fetchMovers();
      fetchGeneralNews();
      fetchWatchlist();
    } else {
      clearSearch();
      setMovers({ gainers: [], losers: [] });
      setGeneralNews(null);
      setWatchlist([]);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${API_BASE}/watchlist`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  const toggleWatchlist = async (symbol, name) => {
    if (!user) return;
    const cleanSymbol = symbol.toUpperCase().trim();
    const isWatchlisted = watchlist.some(item => item.symbol === cleanSymbol);

    try {
      if (isWatchlisted) {
        const res = await fetch(`${API_BASE}/watchlist/remove/${cleanSymbol}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          setWatchlist(prev => prev.filter(item => item.symbol !== cleanSymbol));
        }
      } else {
        const res = await fetch(`${API_BASE}/watchlist/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ symbol: cleanSymbol, name }),
        });
        if (res.ok) {
          const newItem = await res.json();
          setWatchlist(prev => [newItem, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  const fetchMovers = async () => {
    try {
      const res = await fetch(`${API_BASE}/stock/movers`);
      if (res.ok) {
        const data = await res.json();
        setMovers(data);
      }
    } catch (err) {
      console.error('Error fetching movers:', err);
    }
  };

  const fetchGeneralNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/news/NIFTY`);
      if (res.ok) {
        const data = await res.json();
        setGeneralNews(data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setNewsLoading(false);
    }
  };

  // Select a stock (either via search submission or clicking a sidebar mover)
  const handleSelectStock = async (symbol) => {
    setSearchLoading(true);
    setSearchError('');
    setSearchedStock(null);
    setSearchedNews(null);

    try {
      const stockRes = await fetch(`${API_BASE}/stock/${symbol}`);
      if (!stockRes.ok) {
        const errData = await stockRes.json();
        throw new Error(errData.message || 'Stock symbol not found or lookup failed');
      }
      const stockData = await stockRes.json();
      setSearchedStock(stockData);

      // Fetch AI analysis & specific stock news
      const newsRes = await fetch(`${API_BASE}/news/${symbol}`);
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setSearchedNews(newsData);
      }
    } catch (err) {
      setSearchError(err.message || 'Failed to search stock details.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    handleSelectStock(searchQuery.trim().toUpperCase());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchedStock(null);
    setSearchedNews(null);
    setSearchError('');
  };

  // Normal login submit
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Sign in failed');
      }
      setUser(data.payload);
      setShowAuthModal(false);
      resetAuthForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Normal registration submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, name, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Sign up failed');
      }
      setUser(data.user);
      setShowAuthModal(false);
      resetAuthForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Google OAuth credential callback response
  const handleGoogleCredentialResponse = async (response) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/google-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google Auth verification failed');
      }
      if (data.isNewUser) {
        setGoogleTempUser({ email: data.email, name: data.name });
        setAuthMode('create-pin');
      } else {
        setUser(data.user);
        setShowAuthModal(false);
        resetAuthForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Mock Google Authentication Flow for development/offline mode
  const handleMockGoogleAuth = async () => {
    setError('');
    try {
      const mockEmail = 'demo_investor@gmail.com';
      const mockName = 'Demo Investor';
      const res = await fetch(`${API_BASE}/auth/google-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mockUser: { email: mockEmail, name: mockName }
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Mock Auth failed');
      }
      if (data.isNewUser) {
        setGoogleTempUser({ email: data.email, name: data.name });
        setAuthMode('create-pin');
      } else {
        setUser(data.user);
        setShowAuthModal(false);
        resetAuthForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Create PIN for Google users
  const handleCreatePinSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/create-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: googleTempUser.email,
          name: googleTempUser.name,
          pin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Creating PIN failed');
      }
      setUser(data.user);
      setShowAuthModal(false);
      resetAuthForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      clearSearch();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const resetAuthForm = () => {
    setEmail('');
    setPin('');
    setName('');
    setError('');
    setGoogleTempUser(null);
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    resetAuthForm();
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Stocks Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* NAVBAR */}
      <Navbar
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        searchLoading={searchLoading}
        handleLogout={handleLogout}
        openAuth={openAuth}
        clearSearch={clearSearch}
        handleSelectStock={handleSelectStock}
      />

      {/* WATCHLIST HORIZONTAL BAR */}
      {user && (
        <div className="bg-slate-900 border-b border-slate-800 py-3 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none">
              ★ My Watchlist:
            </span>
            {watchlist.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {watchlist.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => handleSelectStock(item.symbol)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      searchedStock?.symbol === item.symbol
                        ? 'bg-purple-650/15 border-purple-500 text-purple-400 shadow-md shadow-purple-950/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    {item.symbol}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">
                Your watchlist is empty. Search a symbol and click the Star icon to add it.
              </span>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          /* HERO / LANDING PAGE */
          <Hero openAuth={openAuth} />
        ) : (
          /* LOGGED IN DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT / MIDDLE COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Search Errors */}
              {searchError && (
                <div className="bg-red-950/40 border border-red-850 text-red-300 p-4 rounded-2xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{searchError}</p>
                  <button 
                    onClick={() => setSearchError('')} 
                    className="ml-auto text-red-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Searched Stock details or News updates */}
              {searchedStock ? (
                <StockDetails
                  searchedStock={searchedStock}
                  searchedNews={searchedNews}
                  clearSearch={clearSearch}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                />
              ) : (
                <NewsFeed
                  newsLoading={newsLoading}
                  generalNews={generalNews}
                />
              )}
            </div>

            {/* RIGHT SIDEBAR COLUMN - MOVERS */}
            <div className="space-y-6">
              <MoversSidebar
                movers={movers}
                handleSelectStock={handleSelectStock}
              />
            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
        <p>© 2026 Stocks AI. All rights reserved. Live markets, analyzed by intelligence.</p>
      </footer>

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        openAuth={openAuth}
        email={email}
        setEmail={setEmail}
        pin={pin}
        setPin={setPin}
        name={name}
        setName={setName}
        error={error}
        successMsg={successMsg}
        loading={loading}
        googleTempUser={googleTempUser}
        handleSignInSubmit={handleSignInSubmit}
        handleSignUpSubmit={handleSignUpSubmit}
        handleCreatePinSubmit={handleCreatePinSubmit}
        handleGoogleCredentialResponse={handleGoogleCredentialResponse}
        resetAuthForm={resetAuthForm}
      />
    </div>
  );
}
