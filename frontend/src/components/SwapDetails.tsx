import { useState } from 'react';
import type { Quote, Token } from '../types';

interface Props {
  quote: Quote;
  fromToken: Token;
  toToken: Token;
}

export function SwapDetails({ quote, fromToken, toToken }: Props) {
  const [flipped, setFlipped] = useState(false);

  const rate = flipped
    ? `1 ${toToken.symbol} ≈ ${parseFloat(quote.rateInverse).toFixed(6)} ${fromToken.symbol}`
    : `1 ${fromToken.symbol} ≈ ${parseFloat(quote.rate).toFixed(6)} ${toToken.symbol}`;

  return (
    <div className="rounded-2xl border border-white/5 bg-bg-input px-4 py-3 text-sm space-y-2.5">
      <Row label="Rate">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="text-white font-medium flex items-center gap-1 hover:text-accent-purple-light transition-colors"
        >
          {rate}
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </Row>

      <Row label="Value">
        <span className="text-white">${parseFloat(quote.usdValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
      </Row>

      {quote.fee && (
        <Row label="Est. fee">
          <span className="text-white">≈ ${parseFloat(quote.fee).toFixed(2)}</span>
        </Row>
      )}

      <Row label="Min amount">
        <span className="text-white">{quote.minAmount} {fromToken.symbol}</span>
      </Row>

      {quote.mode === 'demo' && (
        <div className="pt-1 border-t border-white/5 flex items-center gap-2 text-amber-400/70 text-xs">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Demo mode — add a SimpleSwap API key for live rates
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      {children}
    </div>
  );
}
