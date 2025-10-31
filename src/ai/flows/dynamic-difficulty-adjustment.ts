'use server';

/**
 * @fileOverview A flow that adjusts the difficulty of trivia questions based on user performance.
 *
 * - adjustDifficulty - A function that adjusts the difficulty level based on the user's recent performance.
 * - AdjustDifficultyInput - The input type for the adjustDifficulty function, including the current difficulty level and the recent performance data.
 * - AdjustDifficultyOutput - The return type for the adjustDifficulty function, indicating the adjusted difficulty level.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  currentDifficulty: z
    .number()
    .describe(
      'The current difficulty level of the trivia game, on a scale from 1 (easy) to 10 (hard).'
    ),
  recentPerformance: z
    .array(z.boolean())
    .describe(
      'An array of booleans representing the user\'s recent performance. True indicates a correct answer, false indicates an incorrect answer.'
    ),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  adjustedDifficulty: z
    .number()
    .describe(
      'The adjusted difficulty level of the trivia game, on a scale from 1 (easy) to 10 (hard).'
    ),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(input: AdjustDifficultyInput): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are an AI that adjusts the difficulty of a trivia game based on the user's recent performance.

The current difficulty level is {{{currentDifficulty}}}.

The user's recent performance is as follows:
{{#each recentPerformance}}
  {{#if this}}Correct{{else}}Incorrect{{/if}}
{{/each}}

Based on this information, should the difficulty be increased, decreased, or remain the same?

Consider the following:
* If the user is consistently answering questions correctly, increase the difficulty.
* If the user is consistently answering questions incorrectly, decrease the difficulty.
* If the user's performance is mixed, keep the difficulty the same.

Return the adjusted difficulty level as a number between 1 and 10.

Output:
{
  "adjustedDifficulty": // The adjusted difficulty level here.
}
`,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
