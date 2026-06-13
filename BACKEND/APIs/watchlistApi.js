import express from 'express';
import {Watchlist} from '../models/watchlist.js';

import {verifyToken} from '../middlewares/verifyToken.js';

const watchlistRouter = express.Router();

// Apply protection middleware to all watchlist routes

// get users watchlist in lastest manner
watchlistRouter.get('/',verifyToken(), async (req, res) => {
  try {
    const list = await Watchlist.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(list);
  } catch (error) {
    console.error('Error fetching watchlist:', error.message);
    return res.status(500).json({ message: 'Failed to retrieve watchlist.' });
  }
});

// Add a stock to the user's watchlist
watchlistRouter.post('/add', verifyToken(), async (req, res) => {
  const { symbol, name } = req.body;

  if (!symbol || !name) {
    return res.status(400).json({ message: 'Symbol and company name are required.' });
  }

  try {
    const cleanSymbol = symbol.toUpperCase().trim();

    // Check if already exists in user's watchlist
    const existing = await Watchlist.findOne({ userId: req.user.id, symbol: cleanSymbol });
    if (existing) {
      return res.status(400).json({ message: 'Stock already in watchlist.' });
    }

    const newItem = new Watchlist({
      userId: req.user.id,
      symbol: cleanSymbol,
      name: name.trim()
    });

    await newItem.save();
    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding to watchlist:', error.message);
    return res.status(500).json({ message: 'Failed to add stock to watchlist.' });
  }
});

// Remove a stock from the user's watchlist
watchlistRouter.delete('/remove/:symbol', verifyToken(), async (req, res) => {
  const { symbol } = req.params;

  try {
    const cleanSymbol = symbol.toUpperCase().trim();
    const result = await Watchlist.findOneAndDelete({ userId: req.user.id, symbol: cleanSymbol });

    if (!result) {
      return res.status(404).json({ message: 'Stock not found in your watchlist.' });
    }

    return res.status(200).json({ message: 'Stock removed from watchlist.', symbol: cleanSymbol });
  } catch (error) {
    console.error('Error removing from watchlist:', error.message);
    return res.status(500).json({ message: 'Failed to remove stock from watchlist.' });
  }
});

export default watchlistRouter;
