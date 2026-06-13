import React from 'react';
import { X, Sparkles, Newspaper, Loader2, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import TradingViewChart from './TradingViewChart';

export default function StockDetails({ searchedStock, searchedNews, clearSearch, watchlist = [], toggleWatchlist }) {
  // Helper formats
  const formatNum = (val) => {
    if (val === undefined || val === null) return 'N/A';
    return Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const formatPrice = (val, currency) => {
    if (val === undefined || val === null) return 'N/A';
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${formatNum(val)}`;
  };

  const formatMarketCap = (val) => {
    if (!val) return 'N/A';
    if (val >= 1e12) return `₹${(val / 1e12).toFixed(2)} Lakh Cr`;
    if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)} Cr`;
    return `₹${formatNum(val)}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section: Chart & Statistics Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TradingView Chart (2/3 width) */}
        <div className="lg:col-span-2 w-full">
          <TradingViewChart symbol={searchedStock.symbol} />
        </div>

        {/* Stock Quote Card / Key Stats (1/3 width) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-[555px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          {/* Header */}
          <div>
            <div className="flex justify-between items-start gap-2 mb-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-purple-400 tracking-wider">
                    {searchedStock.exchange}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{searchedStock.currency}</span>
                </div>
                <h2 className="text-lg font-bold text-white leading-tight truncate" title={searchedStock.name}>
                  {searchedStock.name}
                </h2>
                <p className="text-xs font-semibold tracking-wider text-slate-400">{searchedStock.symbol}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleWatchlist(searchedStock.symbol, searchedStock.name)}
                  className={`p-1 rounded-full hover:bg-slate-800 transition-colors ${
                    watchlist.some(item => item.symbol.toUpperCase() === searchedStock.symbol.toUpperCase()) 
                      ? 'text-amber-400' 
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                  title={watchlist.some(item => item.symbol.toUpperCase() === searchedStock.symbol.toUpperCase()) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Star className={`w-5 h-5 ${watchlist.some(item => item.symbol.toUpperCase() === searchedStock.symbol.toUpperCase()) ? 'fill-amber-400' : ''}`} />
                </button>
                <button
                  onClick={clearSearch}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Price Detail */}
            <div className="pb-4 mb-4 border-b border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block mb-0.5">Price</span>
              <span className="text-2xl font-black text-white">
                {formatPrice(searchedStock.price, searchedStock.currency)}
              </span>
              <div className={`flex items-center gap-1 text-xs font-bold mt-0.5 ${searchedStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {searchedStock.change >= 0 ? '+' : ''}
                {formatNum(searchedStock.change)} ({searchedStock.change >= 0 ? '+' : ''}{formatNum(searchedStock.changePercent)}%)
              </div>
            </div>
          </div>

          {/* Key Stats List */}
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Key Statistics</h3>
            
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs">
              <span className="text-slate-500">Open</span>
              <span className="font-semibold text-slate-200">{formatPrice(searchedStock.open, searchedStock.currency)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs">
              <span className="text-slate-500">Day High</span>
              <span className="font-semibold text-slate-200">{formatPrice(searchedStock.high, searchedStock.currency)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs">
              <span className="text-slate-500">Day Low</span>
              <span className="font-semibold text-slate-200">{formatPrice(searchedStock.low, searchedStock.currency)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs">
              <span className="text-slate-500">Market Cap</span>
              <span className="font-semibold text-slate-200">{formatMarketCap(searchedStock.marketCap)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 text-xs">
              <span className="text-slate-500">P/E Ratio</span>
              <span className="font-semibold text-slate-200">{formatNum(searchedStock.peRatio)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1.5 text-xs">
              <span className="text-slate-500">Volume</span>
              <span className="font-semibold text-slate-200">{formatNum(searchedStock.volume)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Sentiment Analysis Card */}
      {searchedNews ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <div className="bg-purple-500/10 text-purple-400 p-2 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">AI News Sentiment</h3>
              <p className="text-xs text-slate-500">Gemini generative analysis on latest updates</p>
            </div>
          </div>

          {searchedNews.analysis ? (
            <div className="space-y-6">
              
              {/* Sentiment metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Trend */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-xs text-slate-500 block mb-2 font-medium uppercase tracking-wider">Trend</span>
                  <span className={`inline-flex items-center justify-center self-start px-3 py-1 rounded-full font-bold text-xs uppercase ${
                    searchedNews.analysis.trend === 'bullish' ? 'bg-emerald-500/10 text-emerald-400' :
                    searchedNews.analysis.trend === 'bearish' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {searchedNews.analysis.trend}
                  </span>
                </div>

                {/* Recommendation */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-xs text-slate-500 block mb-2 font-medium uppercase tracking-wider">AI Call</span>
                  <span className={`inline-flex items-center justify-center self-start px-3 py-1 rounded-full font-bold text-xs uppercase ${
                    searchedNews.analysis.recommendation === 'buy' || searchedNews.analysis.recommendation === 'accumulate' ? 'bg-emerald-500/10 text-emerald-400' :
                    searchedNews.analysis.recommendation === 'sell' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {searchedNews.analysis.recommendation}
                  </span>
                </div>

                {/* Confidence */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <span className="text-xs text-slate-500 block mb-1 font-medium uppercase tracking-wider">Confidence</span>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-lg">{searchedNews.analysis.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${searchedNews.analysis.confidence}%` }}
                    ></div>
                  </div>
                </div>

              </div>

              {/* Summary text */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Market Summary</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{searchedNews.analysis.summary}</p>
              </div>

              {/* Reasons list */}
              {searchedNews.analysis.reasons && searchedNews.analysis.reasons.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Factors Analyzed</h4>
                  <ul className="space-y-2.5">
                    {searchedNews.analysis.reasons.map((reason, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-800 text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">AI analysis sentiment is currently unavailable for this ticker.</p>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      )}

      {/* Stock Specific News */}
      {searchedNews && searchedNews.news && searchedNews.news.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-indigo-400" />
            Related News Coverage
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {searchedNews.news.map((item, idx) => (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 p-5 rounded-2xl flex flex-col md:flex-row gap-4 transition-all duration-200 group"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span className="text-purple-400 font-semibold">{item.publisher}</span>
                    <span>{new Date(item.publishTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h4 className="font-semibold text-slate-100 group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
