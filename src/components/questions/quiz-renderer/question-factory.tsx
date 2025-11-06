import React from "react";
import { StudentQuestion } from "@/types/student-questions";
import { QuestionType } from "@/types/questions";
import { MCQQuestion } from "./types/mcq-question";
import { MMCQQuestion } from "./types/mmcq-question";
import { TrueFalseQuestion } from "./types/true-false-question";
import { FillInBlanksQuestion } from "./types/fill-in-blanks-question";
import { MatchTheFollowingQuestion } from "./types/match-the-following-question";
import { DescriptiveQuestion } from "./types/descriptive-question";
import { CodingQuestion } from "./types/coding-question";
import { FileUploadQuestion } from "./types/file-upload-question";
import { AnswerData } from "@/types/quiz";

interface QuestionFactoryProps {
  question: StudentQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function QuestionFactory({
  question,
  answer,
  onAnswerChange,
  isDisabled = false,
}: QuestionFactoryProps) {
  switch (question.questionType) {
    case QuestionType.MCQ:
      return (
        <MCQQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    case QuestionType.MMCQ:
      return (
        <MMCQQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    case QuestionType.TRUE_FALSE:
      return (
        <TrueFalseQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    case QuestionType.FILL_IN_BLANKS:
      return (
        <FillInBlanksQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    case QuestionType.MATCH_THE_FOLLOWING:
      return (
        <MatchTheFollowingQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    case QuestionType.DESCRIPTIVE:
      return (
        <DescriptiveQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    case QuestionType.CODING:
      return (
        <CodingQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    case QuestionType.FILE_UPLOAD:
      return (
        <FileUploadQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
          isDisabled={isDisabled}
        />
      );
    default:
      return (
        <div className="text-muted-foreground">Unsupported question type</div>
      );
  }
}
