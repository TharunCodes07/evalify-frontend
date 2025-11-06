import React, { useState, useEffect } from "react";
import { StudentDescriptiveQuestion } from "@/types/student-questions";
import { Textarea } from "@/components/ui/textarea";
import { AnswerData } from "@/types/quiz";

interface DescriptiveQuestionProps {
  question: StudentDescriptiveQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function DescriptiveQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: DescriptiveQuestionProps) {
  const [localValue, setLocalValue] = useState(answer?.answerText || "");
  const wordCount = localValue.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setLocalValue(answer?.answerText || "");
  }, [answer?.answerText]);

  const handleChange = (value: string) => {
    if (isDisabled) return;
    setLocalValue(value);
    onAnswerChange({ answerText: value });
  };

  const isUnderMinWords =
    question.descriptiveConfig.minWords &&
    wordCount < question.descriptiveConfig.minWords;
  const isOverMaxWords =
    question.descriptiveConfig.maxWords &&
    wordCount > question.descriptiveConfig.maxWords;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 text-slate-600 dark:text-slate-400">
          {question.descriptiveConfig.minWords && (
            <span>Min: {question.descriptiveConfig.minWords} words</span>
          )}
          {question.descriptiveConfig.maxWords && (
            <span>Max: {question.descriptiveConfig.maxWords} words</span>
          )}
        </div>
        <span
          className={`font-medium ${isUnderMinWords ? "text-amber-600" : isOverMaxWords ? "text-red-600" : "text-emerald-600"}`}
        >
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>
      <Textarea
        placeholder="Write your answer here..."
        className="min-h-[300px] text-base leading-relaxed resize-none"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isDisabled}
      />
    </div>
  );
}
