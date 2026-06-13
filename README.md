# STOCKS - Stock Tracking & Analysis Platform

A full-stack web application for tracking stocks, managing watchlists, and getting AI-powered market insights in real-time.

## Features

- **User Authentication**: Secure login/signup with JWT-based authentication
- **Stock Tracking**: Real-time stock data using Yahoo Finance API
- **Watchlists**: Create and manage personalized stock watchlists
- **AI News Feed**: AI-powered financial news summaries using Google Gemini
- **Interactive Charts**: TradingView charts for technical analysis
- **Market Movers**: Track top-performing and declining stocks (NIFTY 50)

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- Google Generative AI (Gemini)
- Yahoo Finance API
- JWT authentication with bcryptjs
- Scheduled tasks with node-cron

**Frontend**
- React 19 with Vite
- Tailwind CSS for styling
- Lucide React icons

## Project Structure

```
STOCKS/
├── BACKEND/          # Express server & APIs
│   ├── APIs/         # Route handlers
│   ├── models/       # MongoDB schemas
│   ├── services/     # Business logic
│   ├── middlewares/  # Auth & utilities
│   └── server.js
├── FRONTEND/         # React application
│   └── vite-project/
│       └── src/
│           ├── components/
│           └── App.jsx
└── README.md
```

## Getting Started

### Backend
```bash
cd BACKEND
npm install
npm start
```

### Frontend
```bash
cd FRONTEND/vite-project
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the BACKEND directory with:
- Database connection string
- JWT secret key
- Google Gemini API key
- Yahoo Finance API credentials