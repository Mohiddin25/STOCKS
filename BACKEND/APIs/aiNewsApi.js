import express from 'express';
import { getStockNews } from '../services/stockService.js';
import { analyzeNews } from '../services/geminiService.js';

const aiNewsRouter = express.Router();

// Fetches news related to the stock symbol and passes it to Gemini AI for sentiment analysis.
// This route is public and does not require authentication.

aiNewsRouter.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    // 1. Fetch news articles from Yahoo Finance search
    const newsArticles = await getStockNews(symbol);

    // 2. Perform Gemini news sentiment analysis
    const analysis = await analyzeNews(symbol, newsArticles);

    // 3. Return results alongside raw news for UI rendering
    return res.status(200).json({
      symbol: symbol.toUpperCase(),
      analysis,
      newsCount: newsArticles.length,
      news: newsArticles.map(n => ({
        title: n.title,
        publisher: n.publisher,
        link: n.link,
        publishTime: n.providerPublishTime ? new Date(n.providerPublishTime * 1000) : new Date(),
        snippet: n.description || n.title
      }))
    });
  } catch (error) {
    console.error(`Error in AI News Analysis for ${symbol}:`, error.message);
    return res.status(500).json({ message: 'Failed to process AI news analysis.' });
  }
});

export default aiNewsRouter;