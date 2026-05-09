import { Router } from 'express';
import { TOKENS } from '../data/tokens.js';
import { getPrices } from '../services/priceService.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const ids = [...new Set(TOKENS.map((t) => t.coingeckoId))];
    const prices = await getPrices(ids);
    res.json(prices);
  } catch (err) {
    console.error('Prices error:', err.message);
    res.status(502).json({ error: 'Failed to fetch prices' });
  }
});

export default router;
