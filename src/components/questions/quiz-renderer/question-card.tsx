import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { QuestionFactory } from "./question-factory";
import { StudentQuestion } from "@/types/student-questions";
import { AnswerData } from "@/types/quiz";

interface QuestionCardProps {
  question: StudentQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (update: Partial<AnswerData>) => void;
}

export function QuestionCard({
  question,
  answer,
  onAnswerChange,
}: QuestionCardProps) {
  return (
    <Card className="shadow-sm border-0 min-h-[400px] lg:min-h-[calc(100vh-220px)] flex flex-col">
      <CardContent className="px-4 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
        {/* Header with badges */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 pb-3 shrink-0 gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 sm:px-3"
            >
              {question.questionType.replace(/_/g, " ")}
            </Badge>
            {question.difficulty && (
              <Badge
                variant="outline"
                className="text-xs font-medium px-2 sm:px-3"
              >
                {question.difficulty}
              </Badge>
            )}
            {answer?.markedForLater && (
              <Badge className="gap-1.5 text-xs px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-300 dark:border-amber-800">
                <Flag className="h-3 w-3" />
                Marked
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:items-end gap-1.5">
            <Badge className="text-xs px-2 sm:px-3 py-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              {question.marks} MARKS
            </Badge>
            {question.negativeMarks > 0 && (
              <Badge className="text-[10px] px-2 py-0.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                -{question.negativeMarks} MARKS
              </Badge>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
          {/* Question text */}
          <div className="shrink-0">
            <ContentPreview
              content={question.text}
              className="text-base sm:text-lg leading-relaxed"
              noProse={true}
            />
          </div>

          {/* Answer section */}
          <div className="flex-1">
            <QuestionFactory
              question={question}
              answer={answer}
              onAnswerChange={onAnswerChange}
              isDisabled={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
