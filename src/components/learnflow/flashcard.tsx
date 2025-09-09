"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
  topic: string;
}

export default function Flashcard({ front, back, topic }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="group flash-card perspective-[1000px] h-full w-full" onClick={handleFlip}>
      <div className={cn("flash-card-inner relative w-full h-full text-center", { "is-flipped": isFlipped })}>
        {/* Front */}
        <div className="flash-card-front absolute w-full h-full">
          <Card className="flex h-full flex-col justify-between">
            <CardContent className="p-6 flex flex-col items-center justify-center flex-grow">
              <p className="text-sm text-muted-foreground">{topic}</p>
              <p className="mt-4 text-xl font-semibold">{front}</p>
            </CardContent>
            <div className="border-t p-4 flex justify-end">
              <Button size="icon" variant="ghost" className="text-muted-foreground">
                <RotateCw className="h-4 w-4" />
                <span className="sr-only">Flip card</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Back */}
        <div className="flash-card-back absolute w-full h-full">
          <Card className="flex h-full flex-col justify-between">
            <CardContent className="p-6 flex flex-col items-center justify-center flex-grow">
              <p className="text-sm font-medium">{back}</p>
            </CardContent>
            <div className="border-t p-4 flex justify-end">
               <Button size="icon" variant="ghost" className="text-muted-foreground">
                <RotateCw className="h-4 w-4" />
                <span className="sr-only">Flip card</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
