import axios from "axios";

const fetchNews = async (company) => {

   try {
    const query = `${company} NSE stock market`;


      const response = await axios.get(
         "https://api.marketaux.com/v1/news/all",
         {
            params: {
               api_token: process.env.MARKETAUX_API_KEY,
               search: company,
               language: "en",
               limit: 5,
            filter_entities: true
            }
         }
      );

      return response.data.data;

   } catch (error) {

      console.log(error.message);

      return [];
   }
};

export default fetchNews;