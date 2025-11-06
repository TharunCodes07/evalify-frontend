import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnswerData } from "@/types/quiz";

interface QuestionActionsProps {
  currentAnswer: AnswerData | undefined;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canNavigate: boolean;
  onClear: () => void;
  onMarkForReview: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function QuestionActions({
  currentAnswer,
  isFirstQuestion,
  isLastQuestion,
  canNavigate,
  onClear,
  onMarkForReview,
  onPrevious,
  onNext,
  onSubmit,
}: QuestionActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4 sm:gap-0">
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <Button
          variant="outline"
          onClick={onClear}
          disabled={!currentAnswer}
          className="gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm"
        >
          <Eraser className="h-4 w-4" />
          <span className="hidden sm:inline">Clear Selection</span>
          <span className="sm:hidden">Clear</span>
        </Button>
        <Button
          variant={currentAnswer?.markedForLater ? "default" : "outline"}
          onClick={onMarkForReview}
          className={cn(
            "gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm",
            currentAnswer?.markedForLater && "bg-amber-600 hover:bg-amber-700",
          )}
        >
          <Flag className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentAnswer?.markedForLater ? "Unmark" : "Mark for Review"}
          </span>
          <span className="sm:hidden">
            {currentAnswer?.markedForLater ? "Unmark" : "Mark"}
          </span>
        </Button>
      </div>

      <div className="flex gap-2 sm:gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion || !canNavigate}
          className="gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-initial"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {isLastQuestion ? (
          <Button
            onClick={onSubmit}
            className="gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-initial"
          >
            <CheckCircle2 className="h-4 w-4" />
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
