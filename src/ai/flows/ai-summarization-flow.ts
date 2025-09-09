// src/ai/flows/ai-summarization-flow.ts
'use server';

/**
 * @fileOverview AI-powered summarization flow for PDF documents.
 *
 * - summarizeDocument - A function that takes PDF content and returns a summary.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  pdfContent: z
    .string()
    .describe(
      'The content of the PDF document as a string.'
    ),
  summaryLength: z.enum(['short', 'medium', 'long']).default('short').describe('The desired length of the summary.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `You are an AI expert in document summarization.  Please provide a summary of the following document content.

Document Content:
{{pdfContent}}

Summary Length: {{summaryLength}}

Summary:`, // Removed the Handlebars expression from summaryLength, as requested.
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
