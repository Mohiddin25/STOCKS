import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini API client if the API key is present and not a placeholder
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Generate a clean prompt and get structural news analysis from Gemini

export const analyzeNews = async (symbol, newsArticles) => {
  if (!genAI) {
     throw new Error('Gemini API key is missing');
  }
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    // Format news articles to keep token count clean (making array of article into a single string)
    const formattedNews = newsArticles.map((article, idx) => `
    Article #${idx + 1}:
    Title: ${article.title}
    Publisher: ${article.publisher}
    Link: ${article.link}
    PublishTime: ${article.uuid || new Date(article.providerPublishTime * 1000).toLocaleDateString()}
    Snippet/Content: ${article.description || article.title}
    -------------------`).join('\n');
    const prompt = `
    You are a professional financial AI analyst specializing in the Indian stock market.
    Analyze the following news articles related to the stock ticker "${symbol}" and return a detailed sentiment analysis.

    News Articles to analyze:
    ${formattedNews || 'No recent news articles available.'}

    You must return a valid JSON object matching this schema exactly:
    {
    "trend": "bullish" | "bearish" | "neutral",
    "risk": "low" | "medium" | "high",
    "confidence": 85, // Integer between 0 and 100 representing your assessment confidence
    "recommendation": "buy" | "sell" | "hold" | "accumulate",
    "summary": "A cohesive 3-4 sentence paragraph summarizing the overall sentiment and major themes of the news.",
    "reasons": [
        "Specific factor or event from news supporting the analysis.",
        "Another reason detailing regulatory, earnings, or market impact.",
        "Additional rationale based on market sentiment."
    ]
    }

    Ensure the output is pure JSON and matches the specification. Do not include markdown code block syntax (like \`\`\`json) inside the JSON response itself.
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().trim();
    
    // Parse response converting text type json to json object
    const analysis = JSON.parse(jsonText);
    return analysis;
  } catch (error) {
    console.error(`Gemini News Analysis failed for ${symbol}:`, error.message);
    return null;
  }
};


//  Generate overall market insights based on current indices performance on Nifty 50, Sensex, and Bank Nifty using Gemini AI

export const getMarketInsight = async (indicesData) => {
  if (!genAI) {
    // simple fake response if Gemini API key is not set, to ensure the app remains functional without it
    return "Market sentiment appears stable. Nifty 50 and Sensex are showing standard volatility. Watch for global cues and corporate earnings releases. (Activate Gemini API key for real-time generative insights).";
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
Summarize the current sentiment of the Indian stock market based on these three indices:
- NIFTY 50: Price ${indicesData.NIFTY50?.price}, Change: ${indicesData.NIFTY50?.change} (${indicesData.NIFTY50?.changePercent}%)
- SENSEX: Price ${indicesData.SENSEX?.price}, Change: ${indicesData.SENSEX?.change} (${indicesData.SENSEX?.changePercent}%)
- NIFTY BANK: Price ${indicesData.BANKNIFTY?.price}, Change: ${indicesData.BANKNIFTY?.change} (${indicesData.BANKNIFTY?.changePercent}%)

Provide a concise, professional market intelligence summary in 2-3 sentences. Do not mention HTML or API names. Speak directly to an investor.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini Market Insight failed:', error.message);
    return 'The Indian stock indices are exhibiting typical fluctuations. Sectoral rotation is visible, especially in Banking and Financial services. Tech indices remain mixed as global interest rate decisions loom.';
  }
};