export interface Token {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  coingeckoId: string;
  decimals: number;
  color: string;
  logo: string;
  address?: string;
  simpleswapId: string;
  tag?: string;
}

export interface Quote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  rateInverse: string;
  fee?: string;
  usdValue: string;
  minAmount: string;
  mode: 'demo' | 'live';
}

export interface SwapOrder {
  id: string;
  status: string;
  addressFrom: string;
  expectedAmountFrom: string;
  expectedAmountTo: string;
  currencyFrom: string;
  currencyTo: string;
  addressTo: string;
  mode?: 'demo' | 'live';
  message?: string;
}

export type Prices = Record<string, { usd: number; usd_24h_change?: number }>;
