'use server';

/**
 * @fileOverview Creates presentation slides from a given text.
 *
 * - createPresentationSlides - A function that generates presentation slides from text.
 * - CreatePresentationSlidesInput - The input type for the createPresentationSlides function.
 * - CreatePresentationSlidesOutput - The return type for the createPresentationSlides function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePresentationSlidesInputSchema = z.object({
  text: z.string().describe('The text content from which to create presentation slides.'),
  numSlides: z.number().min(3).max(10).default(5).describe('The desired number of slides in the presentation. Must be between 3 and 10.'),
});
export type CreatePresentationSlidesInput = z.infer<typeof CreatePresentationSlidesInputSchema>;

const CreatePresentationSlidesOutputSchema = z.object({
  slides: z.array(
    z.object({
      title: z.string().describe('The title of the slide.'),
      content: z.string().describe('The content of the slide.'),
    })
  ).describe('An array of slide objects, each containing a title and content.'),
});
export type CreatePresentationSlidesOutput = z.infer<typeof CreatePresentationSlidesOutputSchema>;

export async function createPresentationSlides(input: CreatePresentationSlidesInput): Promise<CreatePresentationSlidesOutput> {
  return createPresentationSlidesFlow(input);
}

const presentationSlidesPrompt = ai.definePrompt({
  name: 'presentationSlidesPrompt',
  input: { schema: CreatePresentationSlidesInputSchema },
  output: { schema: CreatePresentationSlidesOutputSchema },
  prompt: `You are an expert presentation creator. Given the following text, create a presentation with {{numSlides}} slides.

Text: {{{text}}}

Each slide should have a title and content. The content should be concise and informative.

Ensure the slides cover the key points of the text and are suitable for a presentation.

Format the output as a JSON array of slide objects, where each object has a "title" and "content" field.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const createPresentationSlidesFlow = ai.defineFlow(
  {
    name: 'createPresentationSlidesFlow',
    inputSchema: CreatePresentationSlidesInputSchema,
    outputSchema: CreatePresentationSlidesOutputSchema,
  },
  async input => {
    const {output} = await presentationSlidesPrompt(input);
    return output!;
  }
);
