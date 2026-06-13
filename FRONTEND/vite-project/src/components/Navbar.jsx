import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Search, Loader2, LogOut } from 'lucide-react';

const SUGGESTIONS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'INFY', name: 'Infosys Limited' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'LT', name: 'Larsen & Toubro' },
  { symbol: 'ITC', name: 'ITC Limited' },
  { symbol: 'AXISBANK', name: 'Axis Bank' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki' },
  { symbol: 'HCLTECH', name: 'HCL Technologies' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical' }
];

export default function Navbar({
  user,
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchLoading,
  handleLogout,
  openAuth,
  clearSearch,
  handleSelectStock
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on typed text
  const filtered = searchQuery.trim()
    ? SUGGESTIONS.filter(
        (item) =>
          item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SUGGESTIONS;

  const onSuggestionClick = (symbol) => {
    setSearchQuery(symbol);
    setShowSuggestions(false);
    handleSelectStock(symbol);
  };

  const onLogoutClick = () => {
    setShowProfileMenu(false);
    handleLogout();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none" 
          onClick={clearSearch}
        >
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-900/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
            STOCKS<span className="text-purple-500 font-extrabold text-sm ml-1 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800">AI</span>
          </span>
        </div>

        {/* Search Bar Container */}
        {user && (
          <div className="flex-1 max-w-lg relative" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search symbol (e.g. RELIANCE, INFY, TCS)..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-full py-2 pl-4 pr-10 outline-none text-sm placeholder-slate-500 text-slate-200 focus:ring-2 focus:ring-purple-950 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && filtered.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 max-h-60 overflow-y-auto">
                {filtered.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSuggestionClick(item.symbol)}
                    className="flex justify-between items-center px-4 py-2.5 hover:bg-slate-800 cursor-pointer text-left text-sm transition-colors duration-150"
                  >
                    <div>
                      <span className="font-bold text-slate-100">{item.symbol}</span>
                      <span className="text-slate-500 text-xs ml-2 font-medium">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-purple-400 font-bold uppercase bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/30">
                      Nifty 50
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Actions / Auths */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end flex-shrink-0 select-none">
                <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 font-bold text-white shadow-md cursor-pointer select-none focus:ring-2 focus:ring-purple-800"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                
                {/* Profile Click Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl py-1 shadow-2xl scale-100 opacity-100 pointer-events-auto transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-slate-850 sm:hidden">
                      <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={onLogoutClick}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2 transition-colors duration-150 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('signin')}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-purple-900/30 transition-all duration-150 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
