import YahooFinance from "yahoo-finance2";

import nifty50 from "../utils/nifty50.js";

const yahooFinance = new YahooFinance();

const getMarketMovers = async () => {

   try {

      const promises = nifty50.map(symbol =>
         yahooFinance.quote(symbol)
      );

      const results = await Promise.all(promises);

      return results.map(stock => ({

         symbol: stock.symbol,

         company: stock.shortName,

         price: stock.regularMarketPrice,

         changePercent:
         stock.regularMarketChangePercent

      }));

   } catch (error) {

      console.log(error);

      return [];
   }
};

export default getMarketMovers;