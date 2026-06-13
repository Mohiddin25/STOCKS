import express from 'express';
import {getMarketMovers,getStockQuote} from '../services/stockService.js';
import { verifyToken } from '../middlewares/verifyToken.js';


const stockRouter = express.Router();

// stockRouter.get('/overview', getOverview);

// get top gainers and losers
stockRouter.get('/movers', verifyToken(), async (req, res) => {
  try {
    const data = await getMarketMovers();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getMovers Controller:', error.message);
    return res.status(500).json({ message: 'Failed to fetch market movers.' });
  }
});

// get induviual news
stockRouter.get('/:symbol', verifyToken(), async (req, res) => {
  const { symbol } = req.params;
  try {
    const data = await getStockQuote(symbol);
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error in getStockDetails Controller for ${symbol}:`, error.message);
    return res.status(404).json({ message: error.message });
  }
});

export default stockRouter;
