export type GiftHistoryEntry = {
  id: string;
  contact_id: string;
  user_id: string;
  cadeau: string;
  date_offert: string;
  created_at: string;
};

export type NewGiftHistoryEntry = {
  contact_id: string;
  cadeau: string;
  date_offert: string;
};