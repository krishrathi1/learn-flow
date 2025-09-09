"use client";

import { useState } from "react";
import { getQuiz } from "@/app/actions";
import { type GenerateQuizOutput } from "@/ai/flows/knowledge-quiz-generation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileQuestion, CheckCircle, XCircle, Trophy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface QuizTabProps {
  documentContent: string;
}

type Question = GenerateQuizOutput["quiz"][0];

export default function QuizTab({ documentContent }: QuizTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setQuiz([]);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    try {
      const result = await getQuiz({ documentContent });
      setQuiz(result.quiz);
    } catch (e) {
      setError("Failed to generate quiz. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === quiz[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleRestart = () => {
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  const currentQuestion = quiz[currentQuestionIndex];

  if (isFinished) {
    return (
       <Card>
        <CardContent className="pt-6 text-center">
            <Trophy className="mx-auto h-16 w-16 text-yellow-500" />
            <h2 className="mt-4 text-2xl font-bold">Quiz Complete!</h2>
            <p className="mt-2 text-muted-foreground">You scored</p>
            <p className="text-4xl font-bold my-4">{score} / {quiz.length}</p>
            <div className="flex gap-4 justify-center">
                <Button onClick={handleRestart}>Try Again</Button>
                <Button onClick={handleGenerate} variant="outline">Generate New Quiz</Button>
            </div>
        </CardContent>
       </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Quiz</CardTitle>
        <CardDescription>
          Test your understanding of the document with an AI-generated quiz.
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

        {quiz.length === 0 && !isLoading && (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Test your knowledge</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click the button to create a quiz from your document.</p>
            <Button onClick={handleGenerate} disabled={isLoading} className="mt-6">
              {isLoading ? "Generating..." : "Generate Quiz"}
            </Button>
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        )}

        {quiz.length > 0 && !isFinished && (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.length}</p>
                    <p className="text-sm font-medium">Score: {score}</p>
                </div>
                <Progress value={((currentQuestionIndex + 1) / quiz.length) * 100} className="mb-4"/>

                <p className="font-semibold text-lg mb-4">{currentQuestion.question}</p>
                <RadioGroup 
                    onValueChange={(value) => setSelectedAnswer(Number(value))}
                    disabled={showResult}
                    value={selectedAnswer !== null ? String(selectedAnswer) : undefined}
                >
                    {currentQuestion.answers.map((answer, index) => {
                        const isCorrect = index === currentQuestion.correctAnswerIndex;
                        const isSelected = index === selectedAnswer;
                        return (
                            <div key={index} className={cn(
                                "flex items-center space-x-2 p-3 rounded-lg border",
                                showResult && isCorrect && "border-green-500 bg-green-500/10",
                                showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10"
                            )}>
                                <RadioGroupItem value={String(index)} id={`q${currentQuestionIndex}-a${index}`} />
                                <Label htmlFor={`q${currentQuestionIndex}-a${index}`} className="flex-1 cursor-pointer">{answer}</Label>
                                {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-500"/>}
                                {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500"/>}
                            </div>
                        )
                    })}
                </RadioGroup>
            </div>
        )}
      </CardContent>
      {quiz.length > 0 && !isFinished && (
        <CardFooter className="flex justify-end">
             {showResult ? (
                 <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
             ) : (
                <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>Submit</Button>
             )}
        </CardFooter>
      )}
    </Card>
  );
}
