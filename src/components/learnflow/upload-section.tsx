"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Loader2 } from "lucide-react";

interface UploadSectionProps {
  onProcess: (formData: FormData) => void;
  isProcessing: boolean;
  title?: string;
}

export default function UploadSection({ onProcess, isProcessing, title = "Create" }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);
      onProcess(formData);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <FileUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">{title}</CardTitle>
                <CardDescription>
                    Upload a PDF to get started. We'll use AI to help you learn faster.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="application/pdf"
                  disabled={isProcessing}
                />
                <div 
                    className="border-2 border-dashed border-border rounded-lg p-12 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={handleCardClick}
                >
                    <p className="text-muted-foreground">Click here to upload a PDF</p>
                </div>
                <Button className="mt-6" onClick={handleButtonClick} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Upload PDF and Analyze"
                    )}
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
