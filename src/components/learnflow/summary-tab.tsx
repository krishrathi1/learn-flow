"use client";

import { useState, useEffect, useRef } from "react";
import { getSummary } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Volume2, Pause, Play } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";

interface SummaryTabProps {
  documentContent: string;
}

export default function SummaryTab({ documentContent }: SummaryTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "long">("short");
  const [error, setError] = useState<string | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup speech synthesis on component unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setSummary("");
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    try {
      const result = await getSummary({ pdfContent: documentContent, summaryLength });
      setSummary(result.summary);
    } catch (e) {
      setError("Failed to generate summary. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
     if (!summary) return;
     if (!('speechSynthesis' in window)) {
        toast({
            title: "Browser not supported",
            description: "Text-to-speech is not supported in your browser.",
            variant: "destructive"
        })
        return;
     }

    if (isSpeaking) {
      if (isPaused) { // Resume
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else { // Pause
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else { // Start speaking
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setError("An error occurred during text-to-speech.");
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Summarization</CardTitle>
        <CardDescription>
          Generate a concise summary of your document. Choose your desired length.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="summary-length">Summary Length</Label>
            <Select value={summaryLength} onValueChange={(v) => setSummaryLength(v as "short" | "medium" | "long")}>
              <SelectTrigger id="summary-length">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : summary ? (
          <Textarea
            readOnly
            value={summary}
            className="h-48 text-base"
          />
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? "Generating..." : summary ? "Regenerate Summary" : "Generate Summary"}
        </Button>
        {summary && (
            <Button variant="outline" onClick={handleSpeak} disabled={isLoading}>
                {isSpeaking && !isPaused ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isSpeaking && !isPaused ? "Pause" : isPaused ? "Resume" : "Listen"}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
