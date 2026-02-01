import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({projectId: 'studio-3034637948-253c5'})],
  model: 'googleai/gemini-2.5-flash',
});
