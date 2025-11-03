"use client";

import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { CheckSquare, Square, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import quizQueries from "@/repo/quiz-queries/quiz-queries";
import { BankSummary } from "@/types/bank";
import { QuestionRenderer } from "@/components/questions/question-renderer/question-renderer";
import { Question } from "@/types/questions";
import { Check, X } from "lucide-react";

interface BankQuestionSectionProps {
  quizId: string;
  bankId: string;
  bank: BankSummary;
  selectedQuestions: Set<string>;
  onToggleQuestion: (questionId: string) => void;
  onSelectAll: (questions: Question[]) => void;
  onDeselectAll: () => void;
  onPickRandom: (questions: Question[]) => void;
  randomCount: number;
  onRandomCountChange: (count: number) => void;
}

export function BankQuestionSection({
  quizId,
  bankId,
  bank,
  selectedQuestions,
  onToggleQuestion,
  onSelectAll,
  onDeselectAll,
  onPickRandom,
  randomCount,
  onRandomCountChange,
}: BankQuestionSectionProps) {
  // Lazy load questions for this specific bank - returns Question[] directly
  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["quiz", quizId, "bank-questions", bankId],
    queryFn: () => quizQueries.getBankQuestionsForQuiz(quizId, bankId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const virtualizer = useWindowVirtualizer({
    count: questions.length,
    estimateSize: () => 400,
    overscan: 3,
    getItemKey: (index) => questions[index]?.id ?? index,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [questions.length, virtualizer]);

  const measureRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) virtualizer.measureElement(el);
    },
    [virtualizer],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Controls skeleton */}
        <div className="flex flex-wrap gap-2 items-end">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Questions skeleton */}
        <div className="border rounded-lg p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 pb-4 border-b">
              <Skeleton className="h-5 w-5 rounded shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-end justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectAll(questions)}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={onDeselectAll}>
            <Square className="mr-2 h-4 w-4" />
            Deselect All
          </Button>
        </div>

        <div className="flex gap-2 items-end">
          <div className="space-y-1">
            <Label
              htmlFor={`random-${bank.id}`}
              className="text-xs text-muted-foreground"
            >
              Random count
            </Label>
            <Input
              id={`random-${bank.id}`}
              type="number"
              min={1}
              max={questions.length}
              value={randomCount || ""}
              onChange={(e) =>
                onRandomCountChange(parseInt(e.target.value) || 0)
              }
              className="w-24 h-9"
              placeholder="0"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPickRandom(questions)}
            className="text-primary hover:text-primary"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Pick Random
          </Button>
        </div>
      </div>

      {/* Question List */}
      {questions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No questions in this bank
        </p>
      ) : (
        <TooltipProvider>
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const question = questions[virtualItem.index];
              const isSelected = selectedQuestions.has(question.id!);

              return (
                <div
                  key={question.id}
                  ref={measureRef}
                  data-index={virtualItem.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="pb-6 pl-16">
                    <div
                      className={`cursor-pointer group relative transition-colors ${
                        isSelected
                          ? "ring-2 ring-green-600 rounded-lg"
                          : "hover:bg-accent/30 rounded-lg"
                      }`}
                      onClick={() => onToggleQuestion(question.id!)}
                    >
                      {/* Selection indicator - positioned absolutely outside the card */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute -left-12 top-4 z-10">
                            {isSelected ? (
                              <Check className="h-6 w-6 text-green-600" />
                            ) : (
                              <X className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>
                            {isSelected
                              ? "Click to deselect"
                              : "Click to select"}
                          </p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Question Renderer */}
                      <QuestionRenderer
                        question={question}
                        questionNumber={virtualItem.index + 1}
                        showCorrectAnswer
                        showStudentAnswer={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}
