'use server';

/**
 * @fileOverview Flow for generating flashcards from PDF content, categorized by topic using AI.
 *
 * - generateFlashcards - A function that takes PDF content and generates flashcards.
 * - FlashcardGenerationInput - The input type for the generateFlashcards function.
 * - FlashcardGenerationOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlashcardGenerationInputSchema = z.object({
  pdfContent: z
    .string()
    .describe('The text content extracted from the PDF document.'),
});
export type FlashcardGenerationInput = z.infer<typeof FlashcardGenerationInputSchema>;

const FlashcardSchema = z.object({
  topic: z.string().describe('The topic of the flashcard.'),
  front: z.string().describe('The question or term on the front of the flashcard.'),
  back: z.string().describe('The answer or definition on the back of the flashcard.'),
});

const FlashcardGenerationOutputSchema = z.array(FlashcardSchema).describe('An array of flashcards generated from the PDF content.');
export type FlashcardGenerationOutput = z.infer<typeof FlashcardGenerationOutputSchema>;

export async function generateFlashcards(input: FlashcardGenerationInput): Promise<FlashcardGenerationOutput> {
  return flashcardGenerationFlow(input);
}

const flashcardGenerationPrompt = ai.definePrompt({
  name: 'flashcardGenerationPrompt',
  input: {schema: FlashcardGenerationInputSchema},
  output: {schema: FlashcardGenerationOutputSchema},
  prompt: `You are an expert educator, skilled at creating effective flashcards from learning material.

  Given the following text content from a PDF document, generate a set of flashcards that cover the key concepts. Each flashcard should have a topic, a concise question or term on the front, and a clear, accurate answer or definition on the back.

  The generated flashcards must be an array of JSON objects.

  PDF Content: {{{pdfContent}}}
  `,
});

const flashcardGenerationFlow = ai.defineFlow(
  {
    name: 'flashcardGenerationFlow',
    inputSchema: FlashcardGenerationInputSchema,
    outputSchema: FlashcardGenerationOutputSchema,
  },
  async input => {
    const {output} = await flashcardGenerationPrompt(input);
    return output!;
  }
);
