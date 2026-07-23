import { Contact } from '../../models/Contact';
import { buildGiftPrompt, parseSuggestions } from '../gemini';

describe('parseSuggestions', () => {
  it('extrait 3 lignes propres depuis une réponse simple', () => {
    const raw = 'Un livre\nUne plante\nUn carnet';
    expect(parseSuggestions(raw)).toEqual(['Un livre', 'Une plante', 'Un carnet']);
  });

  it('retire la numérotation si Gemini en ajoute une', () => {
    const raw = '1. Un livre\n2. Une plante\n3. Un carnet';
    expect(parseSuggestions(raw)).toEqual(['Un livre', 'Une plante', 'Un carnet']);
  });

  it('retire les puces (-, *)', () => {
    const raw = '- Un livre\n* Une plante';
    expect(parseSuggestions(raw)).toEqual(['Un livre', 'Une plante']);
  });

  it('ignore les lignes vides', () => {
    const raw = 'Un livre\n\n\nUne plante\n';
    expect(parseSuggestions(raw)).toEqual(['Un livre', 'Une plante']);
  });

  it('tronque à 3 même si Gemini en renvoie plus', () => {
    const raw = 'Idée 1\nIdée 2\nIdée 3\nIdée 4\nIdée 5';
    expect(parseSuggestions(raw)).toHaveLength(3);
  });

  it('renvoie un tableau vide pour une réponse vide', () => {
    expect(parseSuggestions('')).toEqual([]);
  });
});

describe('buildGiftPrompt', () => {
  const contact: Contact = {
    id: '1',
    user_id: '1',
    nom: 'Marie',
    date_naissance: '1998-03-15',
    interets: 'lecture',
    budget: 30,
    relation: null,
    notes: null,
    created_at: new Date().toISOString(),
  };

  it('inclut le nom, les intérêts et le budget dans le prompt', () => {
    const prompt = buildGiftPrompt(contact);
    expect(prompt).toContain('Marie');
    expect(prompt).toContain('lecture');
    expect(prompt).toContain('30 €');
  });

  it('gère les intérêts et budget manquants', () => {
    const prompt = buildGiftPrompt({ ...contact, interets: null, budget: null });
    expect(prompt).toContain('non précisés');
    expect(prompt).toContain('non précisé');
  });
});