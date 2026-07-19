import { useMemo } from 'react';
import { getDaysUntil, getNextBirthday, getReminderType, UpcomingReminder } from '../models/Reminder';
import { useContacts } from './useContacts';

export function useReminders() {
  const { contacts, loading, error } = useContacts();

  const reminders: UpcomingReminder[] = useMemo(() => {
    return contacts
      .map((contact) => {
        const next = getNextBirthday(contact.date_naissance);
        const joursRestants = getDaysUntil(next);
        return {
          contactId: contact.id,
          nom: contact.nom,
          prochainAnniversaire: next.toISOString().split('T')[0],
          joursRestants,
          type: getReminderType(joursRestants),
        };
      })
      .sort((a, b) => a.joursRestants - b.joursRestants);
  }, [contacts]);

  return { reminders, loading, error };
}