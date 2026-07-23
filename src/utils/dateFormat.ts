const MOIS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

// Convertit une date ISO (YYYY-MM-DD, format base de données) vers l'affichage français (JJ-MM-AAAA)
export function isoToFr(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
}

// Convertit une saisie française (JJ-MM-AAAA) vers le format ISO attendu par Supabase.
export function frToIso(fr: string): string | null {
  const match = fr.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, d, m, y] = match;
  return `${y}-${m}-${d}`;
}

// Calcule l'âge actuel à partir d'une date de naissance ISO.
export function calculateAge(iso: string, today: Date = new Date()): number {
  const birth = new Date(iso);
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

// Formate le jour et le mois en français, ex: "15 Juin"
export function formatDayMonthFr(iso: string): string {
  const [, m, d] = iso.split('-');
  const monthIndex = parseInt(m, 10) - 1;
  const day = parseInt(d, 10);
  return `${day} ${MOIS_FR[monthIndex] ?? ''}`;
}