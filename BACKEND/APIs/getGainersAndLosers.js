import express from "express";
import  getMarketMovers  from "../services/marketService.js";


export const getGainersAndLosersRouter = express.Router();

 getGainersAndLosersRouter.get("/gainers-losers", async (req, res) => {

   try {
    const stocks = await getMarketMovers();

    const sorted = stocks.sort((a, b) => b.changePercent - a.changePercent);

    const topGainers = sorted.slice(0, 5);
    const topLosers = sorted.slice(-5).reverse();

    return res.status(200).json({
        topGainers,
        topLosers
    });

   } catch (error) {

      res.status(500).json({
         error: error.message
      });
   }
});
