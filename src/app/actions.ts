"use server";

import { summarizeDocument, type SummarizeDocumentInput } from "@/ai/flows/ai-summarization-flow";
import { generateFlashcards, type FlashcardGenerationInput } from "@/ai/flows/flashcard-generation";
import { generateQuiz, type GenerateQuizInput } from "@/ai/flows/knowledge-quiz-generation";
import { generateMindMap, type MindMapInput } from "@/ai/flows/mind-map-generation";
import { createPresentationSlides, type CreatePresentationSlidesInput } from "@/ai/flows/presentation-slide-creation";
import pdf from "pdf-parse/lib/pdf-parse.js";

export const getSummary = async (input: SummarizeDocumentInput) => {
  return await summarizeDocument(input);
};

export const getFlashcards = async (input: FlashcardGenerationInput) => {
  return await generateFlashcards(input);
};

export const getQuiz = async (input: GenerateQuizInput) => {
  return await generateQuiz(input);
};

export const getMindMap = async (input: MindMapInput) => {
  return await generateMindMap(input);
};

export const getSlides = async (input: CreatePresentationSlidesInput) => {
  return await createPresentationSlides(input);
};

export const processPdf = async (formData: FormData) => {
  const file = formData.get("pdf") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);

  return data.text;
};
