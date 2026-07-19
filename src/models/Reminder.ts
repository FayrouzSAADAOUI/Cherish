export type ReminderType = 'J-7' | 'J-1' | null;

export type UpcomingReminder = {
  contactId: string;
  nom: string;
  prochainAnniversaire: string;
  joursRestants: number;
  type: ReminderType;
};

export function getNextBirthday(dateNaissance: string, today: Date = new Date()): Date {
  const birth = new Date(dateNaissance);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

  if (next < todayMidnight) {
    next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  return next;
}

export function getDaysUntil(target: Date, today: Date = new Date()): number {
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getReminderType(joursRestants: number): ReminderType {
  if (joursRestants === 7) return 'J-7';
  if (joursRestants === 1) return 'J-1';
  return null;
}