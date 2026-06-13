import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MoversSidebar({ movers, handleSelectStock }) {
  // Helper formats
  const formatNum = (val) => {
    if (val === undefined || val === null) return 'N/A';
    return Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const handleMoverClick = (symbol) => {
    // Strip suffix like .NS if present to keep lookup clean
    const cleanSymbol = symbol.split('.')[0];
    handleSelectStock(cleanSymbol);
  };

  return (
    <div className="space-y-6">
      
      {/* TOP GAINERS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Top Gainers
        </h3>
        {movers.gainers && movers.gainers.length > 0 ? (
          <div className="space-y-3.5">
            {movers.gainers.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleMoverClick(item.symbol)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-850 cursor-pointer transition-colors duration-150 group"
              >
                <div className="min-w-0">
                  <span className="font-bold text-sm text-slate-100 block group-hover:text-purple-400 transition-colors truncate">
                    {item.symbol.split('.')[0]}
                  </span>
                  <span className="text-xxs text-slate-500 truncate block max-w-[140px]">{item.name || 'Company'}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-200 block">₹{formatNum(item.price)}</span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    +{formatNum(item.changePercent)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-sm py-4 text-center">Loading movers...</div>
        )}
      </div>

      {/* TOP LOSERS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800">
          <TrendingDown className="w-5 h-5 text-rose-400" />
          Top Losers
        </h3>
        {movers.losers && movers.losers.length > 0 ? (
          <div className="space-y-3.5">
            {movers.losers.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleMoverClick(item.symbol)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-850 cursor-pointer transition-colors duration-150 group"
              >
                <div className="min-w-0">
                  <span className="font-bold text-sm text-slate-100 block group-hover:text-purple-400 transition-colors truncate">
                    {item.symbol.split('.')[0]}
                  </span>
                  <span className="text-xxs text-slate-500 truncate block max-w-[140px]">{item.name || 'Company'}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-200 block">₹{formatNum(item.price)}</span>
                  <span className="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                    {formatNum(item.changePercent)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-sm py-4 text-center">Loading movers...</div>
        )}
      </div>

    </div>
  );
}
