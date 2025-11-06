import React from "react";
import { StudentMMCQQuestion } from "@/types/student-questions";
import { Checkbox } from "@/components/ui/checkbox";
import { AnswerData } from "@/types/quiz";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { cn } from "@/lib/utils";

interface MMCQQuestionProps {
  question: StudentMMCQQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function MMCQQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: MMCQQuestionProps) {
  const selectedOptionIds = answer?.selectedOptionIds || [];

  const handleToggle = (optionId: string) => {
    if (isDisabled) return;
    const newSelected = selectedOptionIds.includes(optionId)
      ? selectedOptionIds.filter((id) => id !== optionId)
      : [...selectedOptionIds, optionId];
    onAnswerChange({ selectedOptionIds: newSelected });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400 italic">
        Select all correct options
      </p>
      {question.options.map((option) => {
        const isSelected = selectedOptionIds.includes(option.id);
        return (
          <label
            key={option.id}
            htmlFor={option.id}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50",
              isDisabled && "opacity-60 cursor-not-allowed",
            )}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <Checkbox
                id={option.id}
                checked={isSelected}
                onCheckedChange={() => handleToggle(option.id)}
                disabled={isDisabled}
                className="h-5 w-5"
              />
            </div>
            <div className="flex-1 text-base leading-relaxed">
              <ContentPreview content={option.optionText} noProse />
            </div>
          </label>
        );
      })}
    </div>
  );
}
