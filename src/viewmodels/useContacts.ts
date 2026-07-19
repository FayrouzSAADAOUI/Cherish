import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Contact, NewContact } from '../models/Contact';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('date_naissance', { ascending: true });

    if (error) setError(error.message);
    else setContacts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  async function addContact(contact: NewContact) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('contacts')
      .insert({ ...contact, user_id: user.id });

    if (error) {
      setError(error.message);
      return false;
    }
    await fetchContacts();
    return true;
  }

  return { contacts, loading, error, addContact, refetch: fetchContacts };
}