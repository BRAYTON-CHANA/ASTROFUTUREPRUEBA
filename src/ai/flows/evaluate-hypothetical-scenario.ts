'use server';

/**
 * @fileOverview Evaluates a hypothetical scenario about a space object using AI.
 *
 * - evaluateHypotheticalScenario - A function that takes a space object's name and a scenario, and returns an evaluation.
 * - EvaluateHypotheticalScenarioInput - The input type for the function.
 * - EvaluateHypotheticalScenarioOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateHypotheticalScenarioInputSchema = z.object({
  objectName: z.string().describe('The name of the space object.'),
  scenario: z.string().describe('The hypothetical scenario to evaluate.'),
  language: z.string().describe('The language for the response (e.g., "Spanish", "English").'),
});
export type EvaluateHypotheticalScenarioInput = z.infer<typeof EvaluateHypotheticalScenarioInputSchema>;

const EvaluateHypotheticalScenarioOutputSchema = z.object({
  evaluation: z.string().describe('A scientifically-plausible evaluation of the hypothetical scenario.'),
});
export type EvaluateHypotheticalScenarioOutput = z.infer<typeof EvaluateHypotheticalScenarioOutputSchema>;

export async function evaluateHypotheticalScenario(input: EvaluateHypotheticalScenarioInput): Promise<EvaluateHypotheticalScenarioOutput> {
  return evaluateHypotheticalScenarioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateHypotheticalScenarioPrompt',
  input: {schema: EvaluateHypotheticalScenarioInputSchema},
  output: {schema: EvaluateHypotheticalScenarioOutputSchema},
  prompt: `You are an expert astrophysicist with a creative flair and you are a great science communicator. Your task is to evaluate a hypothetical scenario.

**Instructions:**
- **Language:** Always respond in **{{{language}}}**.
- **Tone:** Be creative but ground your answer in scientific principles. Use clear and simple language.
- **Length:** Keep the evaluation concise and to the point (2-3 short paragraphs).

Given a space object and a hypothetical scenario, provide a plausible and engaging evaluation of what might happen.

Space Object: {{{objectName}}}
Hypothetical Scenario: What if... {{{scenario}}}`,
});

const evaluateHypotheticalScenarioFlow = ai.defineFlow({
    name: 'evaluateHypotheticalScenarioFlow',
    inputSchema: EvaluateHypotheticalScenarioInputSchema,
    outputSchema: EvaluateHypotheticalScenarioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
