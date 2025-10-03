'use server';

/**
 * @fileOverview Explains astronomical concepts related to space objects using AI.
 *
 * - explainAstronomicalConcept - A function that takes a space object's name and returns a simplified explanation.
 * - ExplainAstronomicalConceptInput - The input type for the explainAstronomicalConcept function.
 * - ExplainAstronomicalConceptOutput - The return type for the explainAstronomicalConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAstronomicalConceptInputSchema = z.object({
  objectName: z.string().describe('The name of the space object to explain.'),
  language: z.string().describe('The language for the response (e.g., "Spanish", "English").'),
});
export type ExplainAstronomicalConceptInput = z.infer<typeof ExplainAstronomicalConceptInputSchema>;

const ExplainAstronomicalConceptOutputSchema = z.object({
  explanation: z.string().describe('A simplified explanation of the space object, its properties, orbit, and potential impact risks.'),
});
export type ExplainAstronomicalConceptOutput = z.infer<typeof ExplainAstronomicalConceptOutputSchema>;

export async function explainAstronomicalConcept(input: ExplainAstronomicalConceptInput): Promise<ExplainAstronomicalConceptOutput> {
  return explainAstronomicalConceptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAstronomicalConceptPrompt',
  input: {schema: ExplainAstronomicalConceptInputSchema},
  output: {schema: ExplainAstronomicalConceptOutputSchema},
  prompt: `You are an expert in astronomy and a great science communicator. Your task is to explain the following space object.

**Instructions:**
- **Language:** Always respond in **{{{language}}}**.
- **Tone:** Use simple, clear, and engaging language. Avoid technical jargon.
- **Length:** Keep the explanation concise, around 2-3 short paragraphs.

Explain the object, its properties, orbit, and potential impact risks in a way that anyone can understand.

Object Name: {{{objectName}}}`,
});

const explainAstronomicalConceptFlow = ai.defineFlow({
    name: 'explainAstronomicalConceptFlow',
    inputSchema: ExplainAstronomicalConceptInputSchema,
    outputSchema: ExplainAstronomicalConceptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
