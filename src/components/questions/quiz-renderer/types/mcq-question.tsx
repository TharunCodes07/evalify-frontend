import React from "react";
import { StudentMCQQuestion } from "@/types/student-questions";
import { AnswerData } from "@/types/quiz";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { cn } from "@/lib/utils";

interface MCQQuestionProps {
  question: StudentMCQQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function MCQQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: MCQQuestionProps) {
  const selectedOptionId = answer?.selectedOptionIds?.[0];

  const handleSelect = (optionId: string) => {
    if (isDisabled) return;
    onAnswerChange({ selectedOptionIds: [optionId] });
  };

  return (
    <div className="space-y-4">
      {question.options.map((option) => {
        const isSelected = selectedOptionId === option.id;
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
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                id={option.id}
                checked={isSelected}
                onChange={() => handleSelect(option.id)}
                disabled={isDisabled}
                className="peer sr-only"
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600 group-hover:border-primary/50",
                )}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
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
