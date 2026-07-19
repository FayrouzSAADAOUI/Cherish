import { GoogleGenAI } from '@google/genai';
import { Contact } from '../models/Contact';

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export function buildGiftPrompt(contact: Contact): string {
  return `Tu es un assistant qui suggère des idées cadeaux personnalisées.
Voici le profil d'un proche :
- Nom : ${contact.nom}
- Intérêts : ${contact.interets ?? 'non précisés'}
- Budget : ${contact.budget ? `${contact.budget} €` : 'non précisé'}

Propose exactement 3 idées cadeaux courtes et concrètes adaptées à ce profil, une par ligne, sans numérotation ni texte supplémentaire.`;
}

export function parseSuggestions(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim().replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 3);
}

export async function generateGiftSuggestions(contact: Contact): Promise<string[]> {
  const response = await getClient().models.generateContent({
    model: 'gemini-flash-latest',
    contents: buildGiftPrompt(contact),
  });

  return parseSuggestions(response.text ?? '');
}