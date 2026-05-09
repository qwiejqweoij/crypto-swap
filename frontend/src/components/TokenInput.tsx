import type { Token } from '../types';
import { TokenIcon } from './TokenIcon';

interface Props {
  label: string;
  token: Token | null;
  amount: string;
  onAmountChange?: (v: string) => void;
  onTokenSelect: () => void;
  usdValue?: string;
  readonly?: boolean;
  loading?: boolean;
}

export function TokenInput({
  label, token, amount, onAmountChange, onTokenSelect,
  usdValue, readonly = false, loading = false,
}: Props) {
  return (
    <div className="bg-bg-input rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">{label}</span>
        {usdValue && parseFloat(usdValue) > 0 && (
          <span className="text-xs text-gray-500">
            ≈ ${parseFloat(usdValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTokenSelect}
          className="flex items-center gap-2 bg-bg-card hover:bg-bg-hover active:scale-95 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2 transition-all shrink-0"
        >
          {token ? (
            <>
              <TokenIcon token={token} size={22} />
              <span className="text-white font-semibold text-sm">{token.symbol}</span>
              {token.tag && (
                <span className="hidden sm:block text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                  {token.tag}
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 text-sm">Select</span>
          )}
          <svg className="w-3.5 h-3.5 text-gray-500 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-end">
              <div className="h-8 w-28 bg-white/5 rounded-lg animate-pulse" />
            </div>
          ) : (
            <input
              type="number"
              value={amount}
              onChange={onAmountChange ? (e) => onAmountChange(e.target.value) : undefined}
              readOnly={readonly}
              placeholder="0.0"
              min="0"
              className="w-full bg-transparent text-right text-2xl font-semibold text-white placeholder-gray-700 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          )}
        </div>
      </div>

      {token && (
        <div className="mt-2 text-[11px] text-gray-600">
          {token.chain.charAt(0).toUpperCase() + token.chain.slice(1)} Network
          {token.address && (
            <span className="ml-2 font-mono">{token.address.slice(0, 6)}…{token.address.slice(-4)}</span>
          )}
        </div>
      )}
    </div>
  );
}
