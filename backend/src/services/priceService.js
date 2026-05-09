import axios from 'axios';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

const cache = new Map();
const CACHE_TTL = 60_000; // 1 minute

export async function getPrices(coingeckoIds) {
  const key = [...coingeckoIds].sort().join(',');
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;

  const ids = coingeckoIds.join(',');
  const url = `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  const headers = {};
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }

  const res = await axios.get(url, { headers, timeout: 10_000 });
  cache.set(key, { data: res.data, ts: Date.now() });
  return res.data;
}
