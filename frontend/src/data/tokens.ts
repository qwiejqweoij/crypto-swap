import type { Token } from '../types';

export const TOKENS: Token[] = [
  // ── Layer-1 natives ──────────────────────────────────────────
  {
    id: 'btc', symbol: 'BTC', name: 'Bitcoin', chain: 'bitcoin',
    coingeckoId: 'bitcoin', decimals: 8, color: '#F7931A',
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    simpleswapId: 'btc',
  },
  {
    id: 'xmr', symbol: 'XMR', name: 'Monero', chain: 'monero',
    coingeckoId: 'monero', decimals: 12, color: '#FF6600',
    logo: 'https://assets.coingecko.com/coins/images/69/small/monero_logo.png',
    simpleswapId: 'xmr',
  },
  {
    id: 'eth', symbol: 'ETH', name: 'Ethereum', chain: 'ethereum',
    coingeckoId: 'ethereum', decimals: 18, color: '#627EEA',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    simpleswapId: 'eth',
  },
  {
    id: 'ltc', symbol: 'LTC', name: 'Litecoin', chain: 'litecoin',
    coingeckoId: 'litecoin', decimals: 8, color: '#A6A9AA',
    logo: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
    simpleswapId: 'ltc',
  },
  {
    id: 'trx', symbol: 'TRX', name: 'Tron', chain: 'tron',
    coingeckoId: 'tron', decimals: 6, color: '#EB0029',
    logo: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
    simpleswapId: 'trx',
  },

  // ── ERC-20 ────────────────────────────────────────────────────
  {
    id: 'usdt', symbol: 'USDT', name: 'Tether USD', chain: 'ethereum',
    coingeckoId: 'tether', decimals: 6, color: '#26A17B', tag: 'ERC20',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    simpleswapId: 'usdterc20',
  },
  {
    id: 'usdc', symbol: 'USDC', name: 'USD Coin', chain: 'ethereum',
    coingeckoId: 'usd-coin', decimals: 6, color: '#2775CA', tag: 'ERC20',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    simpleswapId: 'usdc',
  },
  {
    id: 'dai', symbol: 'DAI', name: 'Dai', chain: 'ethereum',
    coingeckoId: 'dai', decimals: 18, color: '#F5AC37', tag: 'ERC20',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    logo: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
    simpleswapId: 'dai',
  },
  {
    id: 'wbtc', symbol: 'WBTC', name: 'Wrapped Bitcoin', chain: 'ethereum',
    coingeckoId: 'wrapped-bitcoin', decimals: 8, color: '#F7931A', tag: 'ERC20',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    simpleswapId: 'wbtc',
  },
  {
    id: 'uni', symbol: 'UNI', name: 'Uniswap', chain: 'ethereum',
    coingeckoId: 'uniswap', decimals: 18, color: '#FF007A', tag: 'ERC20',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    logo: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    simpleswapId: 'uni',
  },
  {
    id: 'link', symbol: 'LINK', name: 'Chainlink', chain: 'ethereum',
    coingeckoId: 'chainlink', decimals: 18, color: '#2A5ADA', tag: 'ERC20',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    simpleswapId: 'link',
  },
  {
    id: 'shib', symbol: 'SHIB', name: 'Shiba Inu', chain: 'ethereum',
    coingeckoId: 'shiba-inu', decimals: 18, color: '#FFA409', tag: 'ERC20',
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    logo: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
    simpleswapId: 'shib',
  },
  {
    id: 'pol', symbol: 'POL', name: 'Polygon', chain: 'ethereum',
    coingeckoId: 'matic-network', decimals: 18, color: '#8247E5', tag: 'ERC20',
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    simpleswapId: 'matic',
  },
  {
    id: 'aave', symbol: 'AAVE', name: 'Aave', chain: 'ethereum',
    coingeckoId: 'aave', decimals: 18, color: '#B6509E', tag: 'ERC20',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    logo: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
    simpleswapId: 'aave',
  },

  // ── TRC-20 ────────────────────────────────────────────────────
  {
    id: 'usdt-trc20', symbol: 'USDT', name: 'Tether (TRC20)', chain: 'tron',
    coingeckoId: 'tether', decimals: 6, color: '#26A17B', tag: 'TRC20',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    simpleswapId: 'usdttrc20',
  },
  {
    id: 'usdd', symbol: 'USDD', name: 'USDD', chain: 'tron',
    coingeckoId: 'usdd', decimals: 18, color: '#00A86B', tag: 'TRC20',
    address: 'TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn',
    logo: 'https://assets.coingecko.com/coins/images/25380/small/UUSD.jpg',
    simpleswapId: 'usdd',
  },
  {
    id: 'usdc-trc20', symbol: 'USDC', name: 'USD Coin (TRC20)', chain: 'tron',
    coingeckoId: 'usd-coin', decimals: 6, color: '#2775CA', tag: 'TRC20',
    address: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    simpleswapId: 'usdctrc20',
  },
];
