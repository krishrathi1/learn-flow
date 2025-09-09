"use client";

import { useState } from "react";
import { getFlashcards } from "@/app/actions";
import { type FlashcardGenerationOutput } from "@/ai/flows/flashcard-generation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Flashcard from "./flashcard";
import { AlertCircle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface FlashcardsTabProps {
  documentContent: string;
}

export default function FlashcardsTab({ documentContent }: FlashcardsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardGenerationOutput>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setFlashcards([]);
    try {
      const result = await getFlashcards({ pdfContent: documentContent });
      setFlashcards(result);
    } catch (e) {
      setError("Failed to generate flashcards. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flashcard Generation</CardTitle>
        <CardDescription>
          Create interactive flashcards from your document to help you study.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {flashcards.length === 0 && !isLoading && (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Generate your study set</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click the button to create flashcards from your document.</p>
            <Button onClick={handleGenerate} disabled={isLoading} className="mt-6">
              {isLoading ? "Generating..." : "Generate Flashcards"}
            </Button>
          </div>
        )}
        
        {isLoading && (
           <div className="w-full flex items-center justify-center">
             <div className="w-full max-w-md p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className="aspect-[1.5/1] w-full mt-4">
                    <Skeleton className="w-full h-full rounded-lg" />
                </div>
            </div>
          </div>
        )}

        {flashcards.length > 0 && (
          <div className="flex flex-col items-center">
            <Carousel className="w-full max-w-md">
              <CarouselContent>
                {flashcards.map((card, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1 aspect-[1.5/1]">
                       <Flashcard front={card.front} back={card.back} topic={card.topic} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
             <Button onClick={handleGenerate} disabled={isLoading} variant="outline" className="mt-6">
              {isLoading ? "Regenerating..." : "Regenerate Flashcards"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
