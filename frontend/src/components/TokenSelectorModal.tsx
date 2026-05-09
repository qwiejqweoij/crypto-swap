import { useState, useMemo, useEffect, useRef } from 'react';
import type { Token, Prices } from '../types';
import { TokenIcon } from './TokenIcon';

const CHAIN_ORDER = ['bitcoin', 'ethereum', 'tron', 'litecoin', 'monero'];
const CHAIN_LABELS: Record<string, string> = {
  bitcoin: 'Bitcoin',
  monero: 'Monero',
  ethereum: 'Ethereum',
  litecoin: 'Litecoin',
  tron: 'Tron',
};

interface Props {
  tokens: Token[];
  onSelect: (t: Token) => void;
  onClose: () => void;
  excludeId?: string;
  prices: Prices;
}

export function TokenSelectorModal({ tokens, onSelect, onClose, excludeId, prices }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return tokens.filter(
      (t) =>
        t.id !== excludeId &&
        (t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.chain.toLowerCase().includes(q) ||
          (t.tag?.toLowerCase() ?? '').includes(q))
    );
  }, [tokens, query, excludeId]);

  const grouped = useMemo(() => {
    const map = new Map<string, Token[]>();
    CHAIN_ORDER.forEach((c) => map.set(c, []));
    filtered.forEach((t) => {
      if (!map.has(t.chain)) map.set(t.chain, []);
      map.get(t.chain)!.push(t);
    });
    return [...map.entries()].filter(([, v]) => v.length > 0);
  }, [filtered]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative bg-bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-base">Select token</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, symbol, or chain…"
              className="w-full bg-bg-input border border-white/5 focus:border-accent-purple/40 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 outline-none text-sm transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-2">
          {grouped.length === 0 && (
            <div className="text-center py-14 text-gray-500 text-sm">No tokens found</div>
          )}
          {grouped.map(([chain, chainTokens]) => (
            <div key={chain} className="mb-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                {CHAIN_LABELS[chain] ?? chain}
              </div>
              {chainTokens.map((token) => {
                const price = prices[token.coingeckoId];
                return (
                  <button
                    key={token.id}
                    onClick={() => onSelect(token)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-hover active:bg-bg-hover/80 transition-colors"
                  >
                    <TokenIcon token={token} size={36} />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-medium text-sm">{token.symbol}</span>
                        {token.tag && (
                          <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                            {token.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs truncate">{token.name}</div>
                    </div>
                    {price && (
                      <div className="text-right shrink-0">
                        <div className="text-white text-sm font-medium">
                          ${price.usd < 0.01
                            ? price.usd.toExponential(2)
                            : price.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        {price.usd_24h_change != null && (
                          <div className={`text-[11px] font-medium ${price.usd_24h_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {price.usd_24h_change >= 0 ? '+' : ''}{price.usd_24h_change.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
