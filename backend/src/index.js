import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import tokensRouter from './routes/tokens.js';
import pricesRouter from './routes/prices.js';
import quoteRouter from './routes/quote.js';
import swapRouter from './routes/swap.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }));
app.use(express.json());

app.use(
  '/api',
  rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false })
);

app.use('/api/tokens', tokensRouter);
app.use('/api/prices', pricesRouter);
app.use('/api/quote', quoteRouter);
app.use('/api/swap', swapRouter);

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', mode: process.env.SIMPLESWAP_API_KEY ? 'live' : 'demo' })
);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  const mode = process.env.SIMPLESWAP_API_KEY && process.env.SIMPLESWAP_API_KEY !== 'your_api_key_here'
    ? 'LIVE'
    : 'DEMO';
  console.log(`\n  Crypto Swap API  →  http://localhost:${PORT}`);
  console.log(`  Mode: ${mode}\n`);
});
