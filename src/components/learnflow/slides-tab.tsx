"use client";

import { useState } from "react";
import { getSlides } from "@/app/actions";
import { type CreatePresentationSlidesOutput } from "@/ai/flows/presentation-slide-creation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Clapperboard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface SlidesTabProps {
  documentContent: string;
}

export default function SlidesTab({ documentContent }: SlidesTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [slides, setSlides] = useState<CreatePresentationSlidesOutput["slides"]>([]);
  const [numSlides, setNumSlides] = useState("5");
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("simple");
  const [fileName, setFileName] = useState<string>("presentation");

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setSlides([]);
    try {
      const result = await getSlides({ text: documentContent, numSlides: parseInt(numSlides) });
      setSlides(result.slides);
    } catch (e) {
      setError("Failed to generate slides. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/ppt/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch("/api/ppt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides, templateId: selectedTemplate, fileName }),
      });
      if (!res.ok) throw new Error("Failed to generate PPTX");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName || "presentation"}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("Failed to download PPTX. Please try again.");
    }
  };

  if (templates.length === 0) {
    // lazy-load once mounted
    void fetchTemplates();
  }

  return (
    <Card className="overflow-hidden border-muted/40 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="tracking-tight">Presentation Slide Creation</CardTitle>
            <CardDescription className="mt-1">Automatically generate a presentation from your document content.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-background to-muted/30">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {slides.length === 0 && !isLoading && (
          <div className="text-center p-10 border-2 border-dashed rounded-xl bg-background/60 backdrop-blur-sm">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clapperboard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">Create your presentation</h3>
            <p className="mt-1 text-sm text-muted-foreground">Select number of slides, pick a template, then generate.</p>
            <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                    <Label htmlFor="num-slides">Number of Slides:</Label>
                     <Select value={numSlides} onValueChange={setNumSlides}>
                        <SelectTrigger id="num-slides" className="w-[80px]">
                            <SelectValue placeholder="5" />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(8)].map((_, i) => (
                                <SelectItem key={i+3} value={String(i+3)}>{i+3}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="template">Template:</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger id="template" className="w-[200px]">
                            <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                            {templates.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Slides"}
                </Button>
            </div>
          </div>
        )}
        
        {isLoading && (
           <div className="w-full flex items-center justify-center">
             <div className="w-full max-w-2xl p-4">
               <div className="aspect-video w-full rounded-xl border bg-background/80 shadow-sm">
                    <div className="space-y-4 p-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>
          </div>
        )}

        {slides.length > 0 && (
          <div className="flex flex-col items-center">
            <Carousel className="w-full max-w-3xl">
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="aspect-video rounded-xl border shadow-sm">
                        <CardHeader>
                            <CardTitle>{index + 1}. {slide.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground whitespace-pre-wrap">{slide.content}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="flex gap-3 mt-6 items-center">
              <Button onClick={handleGenerate} disabled={isLoading} variant="outline" className="hover:shadow-sm">
                {isLoading ? "Regenerating..." : "Regenerate Slides"}
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="file-name">File name:</Label>
                <Input id="file-name" className="w-[220px]" value={fileName} onChange={(e) => setFileName(e.target.value)} />
              </div>
              <Button onClick={handleDownload} variant="default" className="hover:shadow-sm">
                Download PPTX
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
