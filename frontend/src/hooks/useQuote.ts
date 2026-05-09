import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import type { Quote } from '../types';

export function useQuote(fromId: string | null, toId: string | null, amount: string) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (!fromId || !toId || !amount || parseFloat(amount) <= 0) {
      setQuote(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    timer.current = setTimeout(async () => {
      try {
        const res = await axios.get<Quote>('/api/quote', {
          params: { from: fromId, to: toId, amount },
        });
        setQuote(res.data);
        setError(null);
      } catch (err) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error ?? 'Failed to get quote'
          : 'Failed to get quote';
        setError(msg);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [fromId, toId, amount]);

  return { quote, loading, error };
}
