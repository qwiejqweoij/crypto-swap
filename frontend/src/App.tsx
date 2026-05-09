import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Prices } from './types';
import { Header } from './components/Header';
import { SwapCard } from './components/SwapCard';

export default function App() {
  const [prices, setPrices] = useState<Prices>({});

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await axios.get<Prices>('/api/prices');
        setPrices(res.data);
      } catch {
        // prices are optional UI enhancement — silent failure is fine
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-purple-950/40 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-violet-950/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-950/20 rounded-full blur-[100px]" />
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 relative">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Cross-chain swaps,{' '}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              simplified
            </span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-sm">
            BTC · XMR · ETH · LTC · TRX and their tokens — no registration required
          </p>
        </div>

        <SwapCard prices={prices} />

        <p className="mt-6 text-gray-700 text-xs text-center max-w-xs leading-relaxed">
          Always verify receiving addresses. Not financial advice. Swaps are processed by third-party providers.
        </p>
      </main>
    </div>
  );
}
