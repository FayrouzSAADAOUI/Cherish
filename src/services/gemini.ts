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
  const budgetLine = contact.budget
    ? `- Budget maximum : ${contact.budget} € (c'est un plafond, pas une cible : propose des idées à des prix variés, du plus abordable jusqu'à ce montant, pas uniquement des idées proches du maximum)`
    : '- Budget : non précisé';

  return `Tu es un assistant qui suggère des idées cadeaux personnalisées.
Voici le profil d'un proche :
- Nom : ${contact.nom}
- Intérêts : ${contact.interets ?? 'non précisés'}
${budgetLine}

Propose exactement 3 idées cadeaux courtes et concrètes adaptées à ce profil, avec des prix variés et différents les uns des autres dans le budget indiqué, une par ligne, sans numérotation ni texte supplémentaire.`;
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