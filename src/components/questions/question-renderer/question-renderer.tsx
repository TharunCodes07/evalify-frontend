"use client";

import { QuestionType } from "@/types/questions";
import { QuestionRendererProps } from "./types";
import { MCQRenderer } from "./renderers/mcq-renderer";
import { TrueFalseRenderer } from "./renderers/true-false-renderer";
import { FillInBlanksRenderer } from "./renderers/fill-in-blanks-renderer";
import { MatchTheFollowingRenderer } from "./renderers/match-the-following-renderer";
import { DescriptiveRenderer } from "./renderers/descriptive-renderer";
import { CodingRenderer } from "./renderers/coding-renderer";
import { FileUploadRenderer } from "./renderers/file-upload-renderer";
import { QuestionHeader } from "./components/question-header";
import { QuestionExplanation } from "./components/question-explanation";
import { Card } from "@/components/ui/card";

export function QuestionRenderer(props: QuestionRendererProps) {
  const { question, compact = false } = props;

  const getRenderer = () => {
    switch (question.questionType) {
      case QuestionType.MCQ:
      case QuestionType.MMCQ:
        return <MCQRenderer {...props} />;
      case QuestionType.TRUE_FALSE:
        return <TrueFalseRenderer {...props} />;
      case QuestionType.FILL_IN_BLANKS:
        return <FillInBlanksRenderer {...props} />;
      case QuestionType.MATCH_THE_FOLLOWING:
        return <MatchTheFollowingRenderer {...props} />;
      case QuestionType.DESCRIPTIVE:
        return <DescriptiveRenderer {...props} />;
      case QuestionType.CODING:
        return <CodingRenderer {...props} />;
      case QuestionType.FILE_UPLOAD:
        return <FileUploadRenderer {...props} />;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <QuestionHeader {...props} />
        {getRenderer()}
        {(question.explanation || props.studentAnswer?.evaluationExplanation) &&
          props.showCorrectAnswer && (
            <QuestionExplanation
              explanation={question.explanation}
              evaluationExplanation={props.studentAnswer?.evaluationExplanation}
            />
          )}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 pb-4 space-y-4">
        <QuestionHeader {...props} />
        <div className="mt-2">{getRenderer()}</div>
        {(question.explanation || props.studentAnswer?.evaluationExplanation) &&
          props.showCorrectAnswer && (
            <QuestionExplanation
              explanation={question.explanation}
              evaluationExplanation={props.studentAnswer?.evaluationExplanation}
            />
          )}
      </div>
    </Card>
  );
}
