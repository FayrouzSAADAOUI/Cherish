import { useCallback, useState } from 'react';
import { Contact } from '../models/Contact';
import { generateGiftSuggestions } from '../services/gemini';
import { supabase } from '../services/supabase';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = useCallback(async (contact: Contact, forceRefresh = false) => {
    setLoading(true);
    setError(null);

    if (!forceRefresh) {
      const { data: cached, error: cacheError } = await supabase
        .from('gift_ideas_cache')
        .select('suggestions')
        .eq('contact_id', contact.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cacheError) {
        setError(cacheError.message);
        setLoading(false);
        return;
      }

      if (cached) {
        setSuggestions(cached.suggestions);
        setLoading(false);
        return;
      }
    }

    try {
      const newSuggestions = await generateGiftSuggestions(contact);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('gift_ideas_cache').insert({
          contact_id: contact.id,
          user_id: user.id,
          suggestions: newSuggestions,
        });
      }
      setSuggestions(newSuggestions);
    } catch (e: any) {
      setError(e.message ?? 'Erreur lors de la génération des suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  return { suggestions, loading, error, getSuggestions };
}