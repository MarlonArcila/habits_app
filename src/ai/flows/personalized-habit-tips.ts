
// src/ai/flows/personalized-habit-tips.ts
'use server';
/**
 * @fileOverview Flow for generating personalized habit tips based on user data and goals.
 *
 * - personalizedHabitTips - A function that returns personalized habit tips.
 * - PersonalizedHabitTipsInput - The input type for the personalizedHabitTips function.
 * - PersonalizedHabitTipsOutput - The return type for the personalizedHabitTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHabitTipsInputSchema = z.object({
  habitData: z.string().describe('A JSON string containing the user habit tracking data.  Include the habits tracked, the consistency of tracking, and any goals the user has set.'),
});
export type PersonalizedHabitTipsInput = z.infer<typeof PersonalizedHabitTipsInputSchema>;

const PersonalizedHabitTipsOutputSchema = z.object({
  tips: z.string().describe('Personalized tips for the user to improve consistency with their habits, formatted as a single string with each tip as a new paragraph.'),
});
export type PersonalizedHabitTipsOutput = z.infer<typeof PersonalizedHabitTipsOutputSchema>;

export async function personalizedHabitTips(input: PersonalizedHabitTipsInput): Promise<PersonalizedHabitTipsOutput> {
  return personalizedHabitTipsFlow(input);
}

const personalizedHabitTipsPrompt = ai.definePrompt({
  name: 'personalizedHabitTipsPrompt',
  input: {schema: PersonalizedHabitTipsInputSchema},
  output: {schema: PersonalizedHabitTipsOutputSchema},
  prompt: `You are a friendly and encouraging AI habit coach.
Analyze the user's habit tracking data and any stated goals to provide 2-3 concise, actionable, and personalized tips.
Focus on helping them improve consistency, overcome challenges, and stay motivated.
The tips should be formatted as a single string, with each tip as a new paragraph.

User's Habit Data and Goals:
\`\`\`json
{{{habitData}}}
\`\`\`

Based on the data above, provide your personalized tips below:
Tips:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const personalizedHabitTipsFlow = ai.defineFlow(
  {
    name: 'personalizedHabitTipsFlow',
    inputSchema: PersonalizedHabitTipsInputSchema,
    outputSchema: PersonalizedHabitTipsOutputSchema,
  },
  async input => {
    const result = await personalizedHabitTipsPrompt(input);
    if (!result.output) {
      console.error('Personalized tips prompt did not return an output.');
      throw new Error('Failed to generate tips because the AI model returned no output.');
    }
    return result.output;
  }
);

