import React from 'react';
import { Newspaper, Loader2 } from 'lucide-react';

export default function NewsFeed({ newsLoading, generalNews }) {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-xl text-white flex items-center gap-2 tracking-tight">
        <Newspaper className="w-5 h-5 text-indigo-400" />
        Latest Market News updates
      </h3>
      
      {newsLoading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Fetching latest financial news...</p>
        </div>
      ) : generalNews && generalNews.news && generalNews.news.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {generalNews.news.slice(0, 8).map((item, idx) => (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-slate-750 p-5 rounded-2xl flex flex-col gap-2 transition-all duration-200 group"
            >
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span className="text-purple-400 font-bold">{item.publisher}</span>
                <span>
                  {new Date(item.publishTime).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <h4 className="font-semibold text-slate-150 group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {item.snippet}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
          No general news items available at the moment. Try searching a symbol.
        </div>
      )}
    </div>
  );
}
