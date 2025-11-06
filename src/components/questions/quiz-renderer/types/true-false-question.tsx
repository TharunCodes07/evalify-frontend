import React from "react";
import { StudentTrueFalseQuestion } from "@/types/student-questions";
import { AnswerData } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface TrueFalseQuestionProps {
  question: StudentTrueFalseQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function TrueFalseQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: TrueFalseQuestionProps) {
  const selectedValue = answer?.answerText;

  const handleSelect = (value: string) => {
    if (isDisabled) return;
    onAnswerChange({ answerText: value });
  };

  return (
    <div className="space-y-4">
      {["true", "false"].map((value) => {
        const isSelected = selectedValue === value;
        return (
          <label
            key={value}
            htmlFor={`${question.id}-${value}`}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50",
              isDisabled && "opacity-60 cursor-not-allowed",
            )}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={value}
                id={`${question.id}-${value}`}
                checked={isSelected}
                onChange={() => handleSelect(value)}
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
            <span className="text-lg font-medium capitalize">{value}</span>
          </label>
        );
      })}
    </div>
  );
}
