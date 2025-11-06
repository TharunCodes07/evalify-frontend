import React, { useState, useEffect } from "react";
import { StudentFillInBlanksQuestion } from "@/types/student-questions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnswerData } from "@/types/quiz";

interface FillInBlanksQuestionProps {
  question: StudentFillInBlanksQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function FillInBlanksQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: FillInBlanksQuestionProps) {
  const [localBlankValues, setLocalBlankValues] = useState<
    Record<number, string>
  >(answer?.blankValues || {});

  useEffect(() => {
    setLocalBlankValues(answer?.blankValues || {});
  }, [answer?.blankValues]);

  const handleChange = (blankIndex: number, value: string) => {
    if (isDisabled) return;
    const newBlankValues = { ...localBlankValues, [blankIndex]: value };
    setLocalBlankValues(newBlankValues);
    onAnswerChange({ blankValues: newBlankValues });
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: question.blankConfig.blankCount }).map(
        (_, index) => (
          <div key={index}>
            <Label
              htmlFor={`blank-${question.id}-${index}`}
              className="text-sm font-medium mb-2 block"
            >
              Blank {index + 1}
            </Label>
            <Input
              id={`blank-${question.id}-${index}`}
              placeholder={`Enter answer for blank ${index + 1}`}
              value={localBlankValues[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={isDisabled}
              className="text-base"
            />
          </div>
        ),
      )}
    </div>
  );
}
