import React, { useState, useEffect } from "react";
import { StudentCodingQuestion } from "@/types/student-questions";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AnswerData } from "@/types/quiz";

interface CodingQuestionProps {
  question: StudentCodingQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function CodingQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: CodingQuestionProps) {
  const [localValue, setLocalValue] = useState(
    answer?.answerText ||
      question.codingConfig.templateCode ||
      question.codingConfig.boilerplateCode ||
      "",
  );

  const visibleTestCases = question.testCases.filter(
    (tc) => tc.visibility === "VISIBLE" || tc.visibility === "SAMPLE",
  );

  useEffect(() => {
    setLocalValue(
      answer?.answerText ||
        question.codingConfig.templateCode ||
        question.codingConfig.boilerplateCode ||
        "",
    );
  }, [answer?.answerText, question.codingConfig]);

  const handleChange = (value: string) => {
    if (isDisabled) return;
    setLocalValue(value);
    onAnswerChange({ answerText: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          {question.codingConfig.language}
        </Badge>
        {question.codingConfig.timeLimitMs && (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Time: {question.codingConfig.timeLimitMs}ms
          </span>
        )}
        {question.codingConfig.memoryLimitMb && (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Memory: {question.codingConfig.memoryLimitMb}MB
          </span>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Your Solution</Label>
        <Textarea
          placeholder="Write your code here..."
          className="font-mono text-sm min-h-[400px] resize-none leading-relaxed"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isDisabled}
        />
      </div>

      {visibleTestCases.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Sample Test Cases
          </Label>
          <div className="space-y-3">
            {visibleTestCases.map((testCase, index) => (
              <div
                key={testCase.id}
                className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50"
              >
                <p className="text-sm font-semibold mb-3">
                  Test Case {index + 1}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-2 text-xs font-medium">
                      Input:
                    </p>
                    <pre className="bg-white dark:bg-slate-900 border rounded-lg p-3 text-xs overflow-x-auto font-mono">
                      {testCase.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-2 text-xs font-medium">
                      Expected Output:
                    </p>
                    <pre className="bg-white dark:bg-slate-900 border rounded-lg p-3 text-xs overflow-x-auto font-mono">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
