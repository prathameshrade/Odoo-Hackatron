'use server';

/**
 * @fileOverview An AI agent that suggests relevant skills based on user-provided skill descriptions and identifies skill matches.
 *
 * - suggestSkills - A function that handles the skill suggestion process.
 * - SuggestSkillsInput - The input type for the suggestSkills function.
 * - SuggestSkillsOutput - The return type for the suggestSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsInputSchema = z.object({
  skillDescription: z
    .string()
    .describe('A description of the user provided skill.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe('An array of suggested skills based on the input description.'),
  skillMatches: z
    .record(z.array(z.string()))
    .describe(
      'A record of suggested skill matches for each of the suggested skills.'
    ),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: {schema: SuggestSkillsInputSchema},
  output: {schema: SuggestSkillsOutputSchema},
  prompt: `You are an expert in skill categorization and matching.

  Based on the user's skill description, suggest relevant skills and identify potential skill matches for each suggested skill.

  Skill Description: {{{skillDescription}}}

  Format your response as a JSON object with two keys:

  - suggestedSkills: An array of strings, where each string is a suggested skill.
  - skillMatches: A record (object), where each key is a suggested skill, and the value is an array of strings representing skill matches for that suggested skill.
  `,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
