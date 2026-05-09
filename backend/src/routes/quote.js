import { Router } from 'express';
import { TOKENS } from '../data/tokens.js';
import { getPrices } from '../services/priceService.js';
import { getEstimated, getMinAmount } from '../services/swapService.js';

const router = Router();

const isLiveMode = () =>
  process.env.SIMPLESWAP_API_KEY &&
  process.env.SIMPLESWAP_API_KEY !== 'your_api_key_here';

router.get('/', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing params: from, to, amount' });
  }

  const fromToken = TOKENS.find((t) => t.id === from);
  const toToken = TOKENS.find((t) => t.id === to);

  if (!fromToken || !toToken) {
    return res.status(400).json({ error: 'Unknown token id' });
  }
  if (fromToken.id === toToken.id) {
    return res.status(400).json({ error: 'Cannot swap a token for itself' });
  }

  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    // Always fetch prices for USD value display
    const prices = await getPrices([fromToken.coingeckoId, toToken.coingeckoId]);
    const fromPrice = prices[fromToken.coingeckoId]?.usd ?? 0;
    const toPrice = prices[toToken.coingeckoId]?.usd ?? 0;
    const usdValue = (amt * fromPrice).toFixed(2);

    if (!isLiveMode()) {
      // Demo mode: derive estimate from CoinGecko prices
      if (!fromPrice || !toPrice) {
        return res.status(503).json({ error: 'Price data unavailable' });
      }
      const rate = fromPrice / toPrice;
      const toAmount = (amt * rate * 0.995).toFixed(8); // simulate 0.5% fee
      return res.json({
        fromToken: from,
        toToken: to,
        fromAmount: amount,
        toAmount,
        rate: rate.toFixed(8),
        rateInverse: (1 / rate).toFixed(8),
        fee: (parseFloat(usdValue) * 0.005).toFixed(2),
        usdValue,
        minAmount: '0.0001',
        mode: 'demo',
      });
    }

    // Live mode via SimpleSwap
    const [estimated, minAmount] = await Promise.all([
      getEstimated(fromToken.simpleswapId, toToken.simpleswapId, amt),
      getMinAmount(fromToken.simpleswapId, toToken.simpleswapId),
    ]);

    const toAmount = parseFloat(estimated);
    const rate = toAmount / amt;

    return res.json({
      fromToken: from,
      toToken: to,
      fromAmount: amount,
      toAmount: estimated,
      rate: rate.toFixed(8),
      rateInverse: (1 / rate).toFixed(8),
      usdValue,
      minAmount: minAmount ?? '0.0001',
      mode: 'live',
    });
  } catch (err) {
    console.error('Quote error:', err.message);
    res.status(502).json({ error: err.message ?? 'Quote failed' });
  }
});

export default router;
