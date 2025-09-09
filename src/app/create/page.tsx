"use client";

import { useState } from 'react';
import UploadSection from '@/components/learnflow/upload-section';
import Dashboard from '@/components/learnflow/dashboard';
import { useToast } from '@/hooks/use-toast';

export default function CreatePage() {
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDocumentProcessed = async (formData: FormData) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/process-pdf', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to process PDF');
      const data = await res.json();
      setDocumentContent(data.text);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error processing PDF",
        description: "There was an error processing your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      {documentContent ? (
        <Dashboard documentContent={documentContent} />
      ) : (
        <UploadSection onProcess={handleDocumentProcessed} isProcessing={isProcessing} title="Create" />
      )}
    </main>
  );
}


