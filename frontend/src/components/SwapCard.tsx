import { useState } from 'react';
import axios from 'axios';
import type { Token, Quote, SwapOrder, Prices } from '../types';
import { TOKENS } from '../data/tokens';
import { useQuote } from '../hooks/useQuote';
import { TokenInput } from './TokenInput';
import { TokenSelectorModal } from './TokenSelectorModal';
import { SwapDetails } from './SwapDetails';
import { TokenIcon } from './TokenIcon';

interface Props {
  prices: Prices;
}

type Step = 'swap' | 'confirm' | 'awaiting';

export function SwapCard({ prices }: Props) {
  const [fromToken, setFromToken] = useState<Token | null>(
    TOKENS.find((t) => t.id === 'btc') ?? null
  );
  const [toToken, setToToken] = useState<Token | null>(
    TOKENS.find((t) => t.id === 'eth') ?? null
  );
  const [fromAmount, setFromAmount] = useState('');
  const [selecting, setSelecting] = useState<'from' | 'to' | null>(null);
  const [step, setStep] = useState<Step>('swap');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [order, setOrder] = useState<SwapOrder | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const { quote, loading: quoteLoading, error: quoteError } = useQuote(
    fromToken?.id ?? null,
    toToken?.id ?? null,
    fromAmount
  );

  function flipTokens() {
    const prev = fromToken;
    setFromToken(toToken);
    setToToken(prev);
    if (quote) setFromAmount(quote.toAmount);
  }

  function pickToken(side: 'from' | 'to', token: Token) {
    if (side === 'from') {
      if (token.id === toToken?.id) setToToken(fromToken);
      setFromToken(token);
    } else {
      if (token.id === fromToken?.id) setFromToken(toToken);
      setToToken(token);
    }
    setSelecting(null);
  }

  async function createSwap() {
    if (!fromToken || !toToken || !quote || !recipientAddress.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await axios.post<SwapOrder>('/api/swap/create', {
        from: fromToken.id,
        to: toToken.id,
        amount: fromAmount,
        address: recipientAddress.trim(),
      });
      setOrder(res.data);
      setStep('awaiting');
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Swap creation failed'
        : 'Swap creation failed';
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  }

  const fromUsd =
    fromToken && prices[fromToken.coingeckoId] && fromAmount
      ? (parseFloat(fromAmount) * prices[fromToken.coingeckoId].usd).toFixed(2)
      : undefined;

  const toUsd =
    toToken && prices[toToken.coingeckoId] && quote
      ? (parseFloat(quote.toAmount) * prices[toToken.coingeckoId].usd).toFixed(2)
      : undefined;

  const canReview = !!fromToken && !!toToken && !!quote && !quoteLoading && !quoteError;

  // ── Awaiting deposit ──────────────────────────────────────────
  if (step === 'awaiting' && order) {
    return (
      <div className="bg-bg-card rounded-3xl p-6 border border-white/5 shadow-2xl shadow-black/60 w-full max-w-[480px] animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-xl">Awaiting deposit</h2>
          <p className="text-gray-400 text-sm mt-1">
            Send <span className="text-white font-medium">{order.currencyFrom}</span> to the address below
          </p>
        </div>

        {order.mode === 'demo' && (
          <div className="mb-4 px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400/80 text-xs leading-relaxed">
            {order.message}
          </div>
        )}

        <div className="space-y-3 mb-5">
          <InfoBox label="Send exactly">
            <span className="text-white font-bold text-lg">{order.expectedAmountFrom} {order.currencyFrom}</span>
          </InfoBox>
          <InfoBox label="To this deposit address">
            <span className="text-white font-mono text-sm break-all leading-relaxed">{order.addressFrom}</span>
            <button
              onClick={() => navigator.clipboard.writeText(order.addressFrom)}
              className="mt-2 text-xs text-accent-purple-light hover:text-accent-purple transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy address
            </button>
          </InfoBox>
          <InfoBox label="Order ID">
            <span className="text-white font-mono text-sm">{order.id}</span>
          </InfoBox>
          <InfoBox label="You will receive ≈">
            <span className="text-white font-semibold">{parseFloat(order.expectedAmountTo).toFixed(6)} {order.currencyTo}</span>
          </InfoBox>
        </div>

        <div className="text-xs text-blue-400/60 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 mb-4 leading-relaxed">
          Your swap processes automatically after the deposit confirms. Save the Order ID to track it.
        </div>

        <button
          onClick={() => { setStep('swap'); setOrder(null); setFromAmount(''); }}
          className="w-full py-3.5 rounded-2xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium text-sm"
        >
          ← New swap
        </button>
      </div>
    );
  }

  // ── Confirm step ──────────────────────────────────────────────
  if (step === 'confirm' && quote && fromToken && toToken) {
    return (
      <div className="bg-bg-card rounded-3xl p-6 border border-white/5 shadow-2xl shadow-black/60 w-full max-w-[480px] animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('swap')} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-white font-semibold text-lg">Confirm swap</h2>
        </div>

        <div className="space-y-2 mb-5">
          <div className="bg-bg-input rounded-2xl p-4 flex items-center gap-3">
            <TokenIcon token={fromToken} size={40} />
            <div>
              <div className="text-xs text-gray-500 mb-0.5">You send</div>
              <div className="text-white font-bold text-xl">{fromAmount} {fromToken.symbol}</div>
              <div className="text-xs text-gray-500">{fromToken.name}</div>
            </div>
          </div>

          <div className="flex justify-center text-gray-600 py-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <div className="bg-bg-input rounded-2xl p-4 flex items-center gap-3">
            <TokenIcon token={toToken} size={40} />
            <div>
              <div className="text-xs text-gray-500 mb-0.5">You receive ≈</div>
              <div className="text-white font-bold text-xl">{parseFloat(quote.toAmount).toFixed(6)} {toToken.symbol}</div>
              <div className="text-xs text-gray-500">{toToken.name}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Your <span className="text-white font-medium">{toToken.symbol}</span> receiving address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder={`Enter your ${toToken.chain} address`}
            className="w-full bg-bg-input border border-white/5 focus:border-accent-purple/40 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none font-mono text-sm transition-colors"
          />
        </div>

        {createError && (
          <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {createError}
          </div>
        )}

        <button
          disabled={recipientAddress.trim().length < 10 || creating}
          onClick={createSwap}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
            recipientAddress.trim().length >= 10 && !creating
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/30 active:scale-[0.99]'
              : 'bg-bg-input text-gray-600 cursor-not-allowed'
          }`}
        >
          {creating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating order…
            </span>
          ) : (
            'Confirm & Create Swap'
          )}
        </button>

        <p className="text-center text-xs text-gray-600 mt-3">
          Final rate is set when the deposit is received. Quotes are not guaranteed.
        </p>
      </div>
    );
  }

  // ── Main swap card ────────────────────────────────────────────
  return (
    <>
      <div className="bg-bg-card rounded-3xl p-2 border border-white/5 shadow-2xl shadow-black/60 w-full max-w-[480px] animate-slide-up">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <span className="text-white font-semibold text-lg">Swap</span>
          <button className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors" title="Settings (coming soon)">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Inputs */}
        <div className="p-2 space-y-1">
          <TokenInput
            label="Sell"
            token={fromToken}
            amount={fromAmount}
            onAmountChange={setFromAmount}
            onTokenSelect={() => setSelecting('from')}
            usdValue={fromUsd}
          />

          {/* Flip button */}
          <div className="relative flex justify-center">
            <button
              onClick={flipTokens}
              className="w-9 h-9 rounded-xl bg-bg-card border-[3px] border-bg-primary flex items-center justify-center text-gray-400 hover:text-white hover:bg-bg-hover transition-all hover:scale-110 active:scale-95 z-10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <TokenInput
            label="Buy"
            token={toToken}
            amount={quote?.toAmount ?? ''}
            onAmountChange={() => {}}
            onTokenSelect={() => setSelecting('to')}
            readonly
            loading={quoteLoading}
            usdValue={toUsd}
          />
        </div>

        {/* Quote error */}
        {quoteError && fromAmount && parseFloat(fromAmount) > 0 && (
          <div className="mx-2 mb-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
            {quoteError}
          </div>
        )}

        {/* Details */}
        {quote && fromToken && toToken && (
          <div className="px-2 pb-2">
            <SwapDetails quote={quote} fromToken={fromToken} toToken={toToken} />
          </div>
        )}

        {/* CTA */}
        <div className="p-2">
          <button
            disabled={!canReview}
            onClick={() => setStep('confirm')}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
              canReview
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/30 active:scale-[0.99]'
                : 'bg-bg-input text-gray-600 cursor-not-allowed'
            }`}
          >
            {!fromToken || !toToken
              ? 'Select tokens'
              : !fromAmount || parseFloat(fromAmount) <= 0
              ? 'Enter an amount'
              : quoteLoading
              ? 'Getting quote…'
              : quoteError
              ? 'Quote unavailable'
              : 'Review swap →'}
          </button>
        </div>
      </div>

      {/* Token selector modal */}
      {selecting && (
        <TokenSelectorModal
          tokens={TOKENS}
          prices={prices}
          onSelect={(t) => pickToken(selecting, t)}
          onClose={() => setSelecting(null)}
          excludeId={selecting === 'from' ? toToken?.id : fromToken?.id}
        />
      )}
    </>
  );
}

function InfoBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-input rounded-xl p-3.5">
      <div className="text-[11px] text-gray-500 mb-1">{label}</div>
      {children}
    </div>
  );
}
