export type Contact = {
  id: string;
  user_id: string;
  nom: string;
  date_naissance: string; // format ISO 'YYYY-MM-DD' en base
  interets: string | null;
  budget: number | null;
  relation: string | null;
  notes: string | null;
  created_at: string;
};

export type NewContact = Omit<Contact, 'id' | 'user_id' | 'created_at'>;