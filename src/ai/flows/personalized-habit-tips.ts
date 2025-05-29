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
  tips: z.string().describe('Personalized tips for the user to improve consistency with their habits.'),
});
export type PersonalizedHabitTipsOutput = z.infer<typeof PersonalizedHabitTipsOutputSchema>;

export async function personalizedHabitTips(input: PersonalizedHabitTipsInput): Promise<PersonalizedHabitTipsOutput> {
  return personalizedHabitTipsFlow(input);
}

const personalizedHabitTipsPrompt = ai.definePrompt({
  name: 'personalizedHabitTipsPrompt',
  input: {schema: PersonalizedHabitTipsInputSchema},
  output: {schema: PersonalizedHabitTipsOutputSchema},
  prompt: `You are an AI habit coach. A user will provide their habit tracking data and goals. Based on this information, you will provide personalized tips to help them improve consistency with their habits.

Habit Data and Goals: {{{habitData}}}

Tips:`,
});

const personalizedHabitTipsFlow = ai.defineFlow(
  {
    name: 'personalizedHabitTipsFlow',
    inputSchema: PersonalizedHabitTipsInputSchema,
    outputSchema: PersonalizedHabitTipsOutputSchema,
  },
  async input => {
    const {output} = await personalizedHabitTipsPrompt(input);
    return output!;
  }
);
