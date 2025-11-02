"use client";

import { QuestionRendererProps } from "../types";
import { MCQQuestion, MMCQQuestion, QuestionType } from "@/types/questions";
import { cn } from "@/lib/utils";
import { Check, X, Circle } from "lucide-react";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";

export function MCQRenderer({
  question,
  showCorrectAnswer,
  showStudentAnswer,
  studentAnswer,
  onAnswerEdit,
  isEditable,
}: QuestionRendererProps) {
  const mcqQuestion = question as MCQQuestion | MMCQQuestion;
  const isMultiple = question.questionType === QuestionType.MMCQ;
  const selectedIds = studentAnswer?.selectedOptionIds || [];

  const handleAnswerChange = (optionId: string) => {
    if (!onAnswerEdit || !question.id) return;

    let newSelectedIds: string[];
    if (isMultiple) {
      newSelectedIds = selectedIds.includes(optionId)
        ? selectedIds.filter((id) => id !== optionId)
        : [...selectedIds, optionId];
    } else {
      newSelectedIds = [optionId];
    }

    onAnswerEdit(question.id, {
      ...studentAnswer,
      selectedOptionIds: newSelectedIds,
    });
  };

  return (
    <div className="space-y-3">
      {mcqQuestion.options
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((option) => {
          const isSelected = selectedIds.includes(option.id);
          const isCorrect = option.isCorrect;
          const showStatus =
            showCorrectAnswer || (showStudentAnswer && isSelected);

          return (
            <div
              key={option.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border-2 transition-all",
                isSelected &&
                  showStudentAnswer &&
                  "border-primary bg-primary/5",
                !isSelected && "border-border hover:border-muted-foreground/30",
                showCorrectAnswer &&
                  isCorrect &&
                  "border-green-500 bg-green-50 dark:bg-green-950/30",
                showCorrectAnswer &&
                  isSelected &&
                  !isCorrect &&
                  "border-red-500 bg-red-50 dark:bg-red-950/30",
                isEditable && onAnswerEdit && "cursor-pointer",
              )}
              onClick={() => isEditable && handleAnswerChange(option.id)}
            >
              <div className="shrink-0 mt-0.5">
                {showStatus ? (
                  <>
                    {isCorrect && (
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {!isCorrect && isSelected && showStudentAnswer && (
                      <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {!isCorrect && !isSelected && (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </>
                ) : (
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground",
                    )}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <ContentPreview
                  content={option.optionText}
                  noProse
                  className="border-0 p-0"
                />
              </div>
            </div>
          );
        })}

      {showStudentAnswer && !showCorrectAnswer && selectedIds.length === 0 && (
        <div className="text-sm text-muted-foreground italic">
          No answer selected
        </div>
      )}
    </div>
  );
}
