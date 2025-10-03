'use server';

import { explainAstronomicalConcept } from '@/ai/flows/explain-astronomical-concepts';
import { evaluateHypotheticalScenario } from '@/ai/flows/evaluate-hypothetical-scenario';

export async function getExplanation(objectName: string, language: string) {
  try {
    if (!objectName) {
      return { success: false, error: 'Object name is required.' };
    }
    const result = await explainAstronomicalConcept({ objectName, language });
    return { success: true, explanation: result.explanation };
  } catch (error) {
    console.error('Error in getExplanation action:', error);
    return { success: false, error: 'An unexpected error occurred while generating the explanation.' };
  }
}

export async function getHypotheticalScenario(objectName: string, scenario: string, language: string) {
  try {
    if (!objectName || !scenario) {
      return { success: false, error: 'Object name and scenario are required.' };
    }
    const result = await evaluateHypotheticalScenario({ objectName, scenario, language });
    return { success: true, evaluation: result.evaluation };
  } catch (error) {
    console.error('Error in getHypotheticalScenario action:', error);
    return { success: false, error: 'An unexpected error occurred while evaluating the scenario.' };
  }
}
