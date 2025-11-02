"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle2 } from "lucide-react";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";

interface QuestionExplanationProps {
  explanation?: string;
  evaluationExplanation?: string;
}

export function QuestionExplanation({
  explanation,
  evaluationExplanation,
}: QuestionExplanationProps) {
  if (!explanation && !evaluationExplanation) return null;

  return (
    <div className="space-y-3 mt-4">
      {/* Question Explanation */}
      {explanation && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">Explanation</div>
            <ContentPreview
              content={explanation}
              noProse
              className="border-0 p-0"
            />
          </AlertDescription>
        </Alert>
      )}

      {/* Evaluation Explanation (from grading/AI feedback) */}
      {evaluationExplanation && (
        <Alert className="border-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Evaluation Feedback
            </div>
            <ContentPreview
              content={evaluationExplanation}
              noProse
              className="border-0 p-0"
            />
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
