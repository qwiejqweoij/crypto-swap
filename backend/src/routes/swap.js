import { Router } from 'express';
import { TOKENS } from '../data/tokens.js';
import { createExchange, getExchangeStatus } from '../services/swapService.js';

const router = Router();

const isLiveMode = () =>
  process.env.SIMPLESWAP_API_KEY &&
  process.env.SIMPLESWAP_API_KEY !== 'your_api_key_here';

router.post('/create', async (req, res) => {
  const { from, to, amount, address, refundAddress } = req.body;

  if (!from || !to || !amount || !address) {
    return res.status(400).json({ error: 'Missing fields: from, to, amount, address' });
  }

  const fromToken = TOKENS.find((t) => t.id === from);
  const toToken = TOKENS.find((t) => t.id === to);

  if (!fromToken || !toToken) {
    return res.status(400).json({ error: 'Unknown token id' });
  }

  if (!isLiveMode()) {
    return res.json({
      id: `demo_${Date.now()}`,
      status: 'waiting',
      addressFrom: `DEMO_SEND_${fromToken.symbol}_HERE_${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      expectedAmountFrom: String(amount),
      expectedAmountTo: (parseFloat(amount) * 0.995).toFixed(8),
      currencyFrom: fromToken.symbol,
      currencyTo: toToken.symbol,
      addressTo: address,
      mode: 'demo',
      message:
        'Demo mode active. Add your SimpleSwap API key to .env to enable real swaps.',
    });
  }

  try {
    const order = await createExchange({
      from: fromToken.simpleswapId,
      to: toToken.simpleswapId,
      amount: parseFloat(amount),
      addressTo: address,
      refundAddress,
    });
    res.json(order);
  } catch (err) {
    console.error('Swap create error:', err.message);
    res.status(502).json({ error: err.message ?? 'Swap creation failed' });
  }
});

router.get('/status/:id', async (req, res) => {
  const { id } = req.params;

  if (id.startsWith('demo_')) {
    return res.json({ id, status: 'waiting', mode: 'demo' });
  }

  try {
    const status = await getExchangeStatus(id);
    res.json(status);
  } catch (err) {
    res.status(502).json({ error: err.message ?? 'Status fetch failed' });
  }
});

export default router;
