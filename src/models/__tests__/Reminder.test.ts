import { getDaysUntil, getNextBirthday, getReminderType } from '../Reminder';

describe('getNextBirthday', () => {
  it('renvoie la date de cette année si l\'anniversaire n\'est pas encore passé', () => {
    const today = new Date('2026-07-19');
    const result = getNextBirthday('1998-07-26', today);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(6); // juillet = index 6
    expect(result.getDate()).toBe(26);
  });

  it('renvoie l\'année suivante si l\'anniversaire est déjà passé', () => {
    const today = new Date('2026-07-19');
    const result = getNextBirthday('1998-01-10', today);
    expect(result.getFullYear()).toBe(2027);
  });

  it('gère le jour même comme "pas encore passé"', () => {
    const today = new Date('2026-07-19');
    const result = getNextBirthday('1998-07-19', today);
    expect(result.getFullYear()).toBe(2026);
  });
});

describe('getDaysUntil', () => {
  it('calcule correctement le nombre de jours restants', () => {
    const today = new Date('2026-07-19');
    const target = new Date('2026-07-26');
    expect(getDaysUntil(target, today)).toBe(7);
  });

  it('renvoie 0 pour aujourd\'hui même', () => {
    const today = new Date('2026-07-19');
    expect(getDaysUntil(today, today)).toBe(0);
  });
});

describe('getReminderType', () => {
  it('renvoie "J-7" pour 7 jours restants', () => {
    expect(getReminderType(7)).toBe('J-7');
  });

  it('renvoie "J-1" pour 1 jour restant', () => {
    expect(getReminderType(1)).toBe('J-1');
  });

  it('renvoie null pour un nombre de jours hors seuils', () => {
    expect(getReminderType(15)).toBeNull();
    expect(getReminderType(0)).toBeNull();
  });
});