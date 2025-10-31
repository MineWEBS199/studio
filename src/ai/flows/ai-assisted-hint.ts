'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-assisted hints for trivia questions.
 *
 * The flow takes a trivia question and the user's selected answer as input and returns a hint to guide the user towards the correct answer.
 *
 * @exports {
 *   getAiAssistedHint,
 *   AiAssistedHintInput,
 *   AiAssistedHintOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedHintInputSchema = z.object({
  question: z.string().describe('The trivia question.'),
  options: z.array(z.string()).describe('The possible answers for the trivia question.'),
  userAnswer: z.string().describe('The user selected answer.'),
  correctAnswer: z.string().describe('The correct answer for the question.'),
});

export type AiAssistedHintInput = z.infer<typeof AiAssistedHintInputSchema>;

const AiAssistedHintOutputSchema = z.object({
  hint: z.string().describe('A hint to guide the user towards the correct answer.'),
});

export type AiAssistedHintOutput = z.infer<typeof AiAssistedHintOutputSchema>;

export async function getAiAssistedHint(input: AiAssistedHintInput): Promise<AiAssistedHintOutput> {
  return aiAssistedHintFlow(input);
}

const aiAssistedHintPrompt = ai.definePrompt({
  name: 'aiAssistedHintPrompt',
  input: {schema: AiAssistedHintInputSchema},
  output: {schema: AiAssistedHintOutputSchema},
  prompt: `You are a helpful trivia assistant. The user has selected an incorrect answer for the following question:

Question: {{{question}}}
Options: {{#each options}}{{{this}}} {{/each}}
User's Answer: {{{userAnswer}}}
Correct Answer: {{{correctAnswer}}}

Provide a hint to guide the user towards the correct answer. The hint should not directly give away the answer, but rather provide a clue or additional information that will help the user deduce the correct answer.
`,
});

const aiAssistedHintFlow = ai.defineFlow(
  {
    name: 'aiAssistedHintFlow',
    inputSchema: AiAssistedHintInputSchema,
    outputSchema: AiAssistedHintOutputSchema,
  },
  async input => {
    const {output} = await aiAssistedHintPrompt(input);
    return output!;
  }
);
