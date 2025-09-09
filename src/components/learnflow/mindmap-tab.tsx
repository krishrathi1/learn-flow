"use client";

import { useState, useMemo } from "react";
import { getMindMap } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BrainCircuit } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import MindMapNode, { type MindMapNodeData } from "./mindmap-node";
import { ScrollArea } from "../ui/scroll-area";

interface MindmapTabProps {
  documentContent: string;
}

function parseMindMapText(text: string): MindMapNodeData | null {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return null;

  const getIndent = (line: string) => (line.match(/^\s*/)?.[0].length ?? 0) / 2;

  const firstLine = lines[0].trim().replace(/^- /, '');
  const root: MindMapNodeData = { value: firstLine, children: [] };
  const parentStack: { node: MindMapNodeData; indent: number }[] = [{ node: root, indent: getIndent(lines[0]) }];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const indent = getIndent(line);
    const value = line.trim().replace(/^- /, '');
    const node: MindMapNodeData = { value, children: [] };

    // Do not pop the root element; ensure the stack never becomes empty
    while (parentStack.length > 1 && parentStack[parentStack.length - 1].indent >= indent) {
      parentStack.pop();
    }
    // If stack is somehow empty (malformed input), attach to root
    if (parentStack.length === 0) {
      parentStack.push({ node: root, indent: 0 });
    }
    
    parentStack[parentStack.length - 1].node.children.push(node);
    parentStack.push({ node, indent });
  }

  return root;
}


export default function MindmapTab({ documentContent }: MindmapTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapNodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setMindMapData(null);
    try {
      const result = await getMindMap({ documentContent });
      const parsedData = parseMindMapText(result.mindMap);
      if (!parsedData) {
        throw new Error('Mind map parsing failed');
      }
      setMindMapData(parsedData);
    } catch (e) {
      setError("Failed to generate mind map. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-muted/40 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="tracking-tight">Mind Map Generation</CardTitle>
            <CardDescription className="mt-1">Visualize the key concepts and structure of your document with an AI-generated mind map.</CardDescription>
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

        {!mindMapData && !isLoading && (
          <div className="text-center p-10 border-2 border-dashed rounded-xl bg-background/60 backdrop-blur-sm">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">Visualize your document</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click the button to generate a mind map from the content.</p>
            <Button onClick={handleGenerate} disabled={isLoading} className="mt-6 hover:shadow-sm">
              {isLoading ? "Generating..." : "Generate Mind Map"}
            </Button>
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-4 p-4 rounded-xl border bg-background/80 shadow-sm">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-40 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
             <div className="flex items-start space-x-4">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-48 rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {mindMapData && (
          <div className="flex flex-col items-center">
            <ScrollArea className="w-full h-[500px] border rounded-xl p-4 bg-background shadow-sm">
                <div className="mind-map-container">
                    <MindMapNode node={mindMapData} />
                </div>
            </ScrollArea>
             <Button onClick={handleGenerate} disabled={isLoading} variant="outline" className="mt-6 hover:shadow-sm">
              {isLoading ? "Regenerating..." : "Regenerate Mind Map"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
