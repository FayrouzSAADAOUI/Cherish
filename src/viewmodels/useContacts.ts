import { useCallback, useEffect, useState } from 'react';
import { Contact, NewContact } from '../models/Contact';
import { supabase } from '../services/supabase';

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

  async function deleteContact(id: string) {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      setError(error.message);
      return false;
    }
    await fetchContacts();
    return true;
  }

  async function updateContact(id: string, patch: Partial<NewContact>) {
    const { error } = await supabase.from('contacts').update(patch).eq('id', id);
    if (error) {
      setError(error.message);
      return false;
    }
    await fetchContacts();
    return true;
  }

  return { contacts, loading, error, addContact, deleteContact, updateContact, refetch: fetchContacts };
}