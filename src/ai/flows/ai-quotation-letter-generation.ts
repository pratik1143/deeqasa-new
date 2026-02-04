'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating professional covering letter bodies for IT quotations.
 *
 * - generateLetterBody - A function that generates a formal letter body based on the quotation subject and customer details.
 * - GenerateLetterBodyInput - The input type for the function.
 * - GenerateLetterBodyOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLetterBodyInputSchema = z.object({
  subject: z.string().describe('The subject line of the quotation.'),
  customerName: z.string().describe('Name of the person the letter is addressed to.'),
  companyName: z.string().describe('Department or organization name.'),
  address: z.string().describe('Location/Address of the organization.'),
});
export type GenerateLetterBodyInput = z.infer<typeof GenerateLetterBodyInputSchema>;

const GenerateLetterBodyOutputSchema = z.object({
  letterBody: z.string().describe('A formal and professionally written body for the covering letter.'),
});
export type GenerateLetterBodyOutput = z.infer<typeof GenerateLetterBodyOutputSchema>;

const letterPrompt = ai.definePrompt({
  name: 'generateLetterBodyPrompt',
  input: { schema: GenerateLetterBodyInputSchema },
  output: { schema: GenerateLetterBodyOutputSchema },
  prompt: `You are an expert documentation specialist for government and university IT tenders.
  Your task is to write a highly formal, professional, and concise covering letter body for an IT solutions quotation.
  
  Target Audience: {{companyName}}, located at {{address}}.
  Attention To: {{customerName}}.
  Subject: {{subject}}

  Guidelines:
  - Use formal English suitable for Government Departments and Universities (like Panjab University).
  - Do NOT include the header, date, ref number, or signature block. ONLY generate the paragraphs for the body.
  - Start with a professional opening (e.g., "With reference to the requirement for...").
  - Mention that the proposed solutions are designed for reliability, scalability, and security.
  - Include a standard paragraph about OEM onsite warranty and technical support.
  - Maintain a respectful and professional tone throughout.
  - Use 2-3 well-structured paragraphs.
  - DO NOT use placeholders; write the full text based on the provided subject.`,
});

export async function generateLetterBody(input: GenerateLetterBodyInput): Promise<GenerateLetterBodyOutput> {
  const { output } = await letterPrompt(input);
  if (!output) {
    throw new Error('Failed to generate letter body.');
  }
  return output;
}
