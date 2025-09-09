import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BrainCircuit, Clapperboard, FileQuestion, Lightbulb } from "lucide-react";
import SummaryTab from "./summary-tab";
import FlashcardsTab from "./flashcards-tab";
import QuizTab from "./quiz-tab";
import SlidesTab from "./slides-tab";
import MindmapTab from "./mindmap-tab";

interface DashboardProps {
  documentContent: string;
}

export default function Dashboard({ documentContent }: DashboardProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
        <TabsTrigger value="summary" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Summary</span>
        </TabsTrigger>
        <TabsTrigger value="flashcards" className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          <span>Flashcards</span>
        </TabsTrigger>
        <TabsTrigger value="quiz" className="flex items-center gap-2">
          <FileQuestion className="h-4 w-4" />
          <span>Quiz</span>
        </TabsTrigger>
        <TabsTrigger value="slides" className="flex items-center gap-2">
          <Clapperboard className="h-4 w-4" />
          <span>Slides</span>
        </TabsTrigger>
        <TabsTrigger value="mindmap" className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4" />
          <span>Mind Map</span>
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="summary">
          <SummaryTab documentContent={documentContent} />
        </TabsContent>
        <TabsContent value="flashcards">
          <FlashcardsTab documentContent={documentContent} />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizTab documentContent={documentContent} />
        </TabsContent>
        <TabsContent value="slides">
          <SlidesTab documentContent={documentContent} />
        </TabsContent>
        <TabsContent value="mindmap">
          <MindmapTab documentContent={documentContent} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
