import { useCallback, useEffect, useState } from 'react';
import { GiftHistoryEntry, NewGiftHistoryEntry } from '../models/GiftHistory';
import { supabase } from '../services/supabase';

export function useGiftHistory() {
  const [history, setHistory] = useState<GiftHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gift_history')
      .select('*, contacts(nom)')
      .order('date_offert', { ascending: false });

    if (error) setError(error.message);
    else setHistory(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  async function addHistoryEntry(entry: NewGiftHistoryEntry) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('gift_history')
      .insert({ ...entry, user_id: user.id });

    if (error) {
      setError(error.message);
      return false;
    }
    await fetchHistory();
    return true;
  }

  return { history, loading, error, addHistoryEntry, refetch: fetchHistory };
}