import React, { useEffect, useRef } from 'react';

export default function TradingViewChart({ symbol }) {
  const container = useRef();

  useEffect(() => {
    // Clear any existing chart container content
    if (container.current) {
      container.current.innerHTML = '';
    }

    // Format the symbol (e.g. converting "RELIANCE.NS" to "NSE:RELIANCE")
    let formattedSymbol = symbol;
    if (symbol.includes('.')) {
      const parts = symbol.split('.');
      if (parts[1] === 'NS') {
        formattedSymbol = `NSE:${parts[0]}`;
      } else if (parts[1] === 'BO') {
        formattedSymbol = `BSE:${parts[0]}`;
      } else {
        formattedSymbol = symbol;
      }
    } else {
      // Default prefix for Indian Nifty 50 stocks
      formattedSymbol = `NSE:${symbol}`;
    }

    // Create the script tag for TradingView widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": formattedSymbol,
      "interval": "D",
      "timezone": "Asia/Kolkata",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    if (container.current) {
      container.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div 
      className="tradingview-widget-container border border-slate-800 rounded-3xl overflow-hidden h-[550px] w-full" 
      ref={container}
    >
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
}
