'use server';

/**
 * @fileOverview Flow for generating mind maps of concepts in a document using AI.
 *
 * - generateMindMap - A function that generates a mind map from a given document content.
 * - MindMapInput - The input type for the generateMindMap function.
 * - MindMapOutput - The return type for the generateMindMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MindMapInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to generate a mind map for.'),
});
export type MindMapInput = z.infer<typeof MindMapInputSchema>;

const MindMapOutputSchema = z.object({
  mindMap: z.string().describe('A textual representation of the mind map.'),
});
export type MindMapOutput = z.infer<typeof MindMapOutputSchema>;

export async function generateMindMap(input: MindMapInput): Promise<MindMapOutput> {
  return generateMindMapFlow(input);
}

const mindMapPrompt = ai.definePrompt({
  name: 'mindMapPrompt',
  input: {schema: MindMapInputSchema},
  output: {schema: MindMapOutputSchema},
  prompt: `You are an AI expert in creating mind maps from text documents. Your goal is to generate a mind map that visually represents the structure and key concepts of the document. The mind map should be easy to understand and provide a high-level overview of the document's content.

Document Content: {{{documentContent}}}

Create a mind map of the document content above.`,
});

const generateMindMapFlow = ai.defineFlow(
  {
    name: 'generateMindMapFlow',
    inputSchema: MindMapInputSchema,
    outputSchema: MindMapOutputSchema,
  },
  async input => {
    const {output} = await mindMapPrompt(input);
    return output!;
  }
);
