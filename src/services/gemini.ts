import { GoogleGenAI } from '@google/genai';
import { Contact } from '../models/Contact';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey });

export async function generateGiftSuggestions(contact: Contact): Promise<string[]> {
  const prompt = `Tu es un assistant qui suggère des idées cadeaux personnalisées.
Voici le profil d'un proche :
- Nom : ${contact.nom}
- Intérêts : ${contact.interets ?? 'non précisés'}
- Budget : ${contact.budget ? `${contact.budget} €` : 'non précisé'}

Propose exactement 3 idées cadeaux courtes et concrètes adaptées à ce profil, une par ligne, sans numérotation ni texte supplémentaire.`;

  const response = await ai.models.generateContent({
  model: 'gemini-flash-latest',
    contents: prompt,
  });

  const text = response.text ?? '';
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 3);
}