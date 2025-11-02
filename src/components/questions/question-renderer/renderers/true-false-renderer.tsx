"use client";

import { QuestionRendererProps } from "../types";
import { TrueFalseQuestion } from "@/types/questions";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function TrueFalseRenderer({
  question,
  showCorrectAnswer,
  showStudentAnswer,
  studentAnswer,
  onAnswerEdit,
  isEditable,
}: QuestionRendererProps) {
  const tfQuestion = question as TrueFalseQuestion;
  const correctAnswer = tfQuestion.trueFalseAnswer;
  const studentAnswerValue = studentAnswer?.answerText === "true";
  const hasStudentAnswer = studentAnswer?.answerText !== undefined;

  const handleAnswerChange = (value: boolean) => {
    if (!onAnswerEdit || !question.id) return;
    onAnswerEdit(question.id, {
      ...studentAnswer,
      answerText: value.toString(),
    });
  };

  const renderOption = (value: boolean, label: string) => {
    const isSelected = hasStudentAnswer && studentAnswerValue === value;
    const isCorrect = correctAnswer === value;
    const showStatus = showCorrectAnswer || (showStudentAnswer && isSelected);

    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
          isSelected && showStudentAnswer && "border-primary bg-primary/5",
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
        onClick={() => isEditable && handleAnswerChange(value)}
      >
        <div className="shrink-0">
          {showStatus && isCorrect ? (
            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ) : showStatus && isSelected && !isCorrect ? (
            <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
              <X className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div
              className={cn(
                "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground",
              )}
            >
              {isSelected && <div className="h-3 w-3 rounded-full bg-white" />}
            </div>
          )}
        </div>
        <span className="text-base font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {renderOption(true, "True")}
      {renderOption(false, "False")}

      {showStudentAnswer && !hasStudentAnswer && (
        <div className="text-sm text-muted-foreground italic">
          No answer selected
        </div>
      )}
    </div>
  );
}
