import {
  QuestionType,
  Question,
  ProgrammingLanguage,
  FillInBlanksEvaluationType,
} from "@/types/questions";
import type { ComponentType } from "react";
import MCQComponent from "./create-edit/mcq";
import TrueFalseComponent from "./create-edit/true-false";
import FillInBlanksComponent from "./create-edit/fill-in-blanks";
import MatchTheFollowingComponent from "./create-edit/match-the-following";
import DescriptiveComponent from "./create-edit/descriptive";
import CodingComponent from "./create-edit/coding";
import FileUploadComponent from "./create-edit/file-upload";

export interface QuestionComponentProps<T extends Question = Question> {
  value: T;
  onChange: (question: T) => void;
}

export function getQuestionComponent(
  questionType: QuestionType,
): ComponentType<QuestionComponentProps<Question>> {
  switch (questionType) {
    case QuestionType.MCQ:
    case QuestionType.MMCQ:
      return MCQComponent as ComponentType<QuestionComponentProps<Question>>;
    case QuestionType.TRUE_FALSE:
      return TrueFalseComponent as ComponentType<
        QuestionComponentProps<Question>
      >;
    case QuestionType.FILL_IN_BLANKS:
      return FillInBlanksComponent as ComponentType<
        QuestionComponentProps<Question>
      >;
    case QuestionType.MATCH_THE_FOLLOWING:
      return MatchTheFollowingComponent as ComponentType<
        QuestionComponentProps<Question>
      >;
    case QuestionType.DESCRIPTIVE:
      return DescriptiveComponent as ComponentType<
        QuestionComponentProps<Question>
      >;
    case QuestionType.CODING:
      return CodingComponent as ComponentType<QuestionComponentProps<Question>>;
    case QuestionType.FILE_UPLOAD:
      return FileUploadComponent as ComponentType<
        QuestionComponentProps<Question>
      >;
    default:
      throw new Error(`Unsupported question type: ${questionType}`);
  }
}

export function createDefaultQuestion(questionType: QuestionType): Question {
  const baseQuestion = {
    questionType,
    text: "",
    explanation: "",
    marks: 1,
    negativeMarks: 0,
    topics: [],
    attachedFiles: [],
  };

  switch (questionType) {
    case QuestionType.MCQ:
    case QuestionType.MMCQ:
      return {
        ...baseQuestion,
        questionType,
        options: [],
      };
    case QuestionType.TRUE_FALSE:
      return {
        ...baseQuestion,
        questionType: QuestionType.TRUE_FALSE,
        trueFalseAnswer: true,
      };
    case QuestionType.FILL_IN_BLANKS:
      return {
        ...baseQuestion,
        questionType: QuestionType.FILL_IN_BLANKS,
        blankConfig: {
          blankCount: 0,
          acceptableAnswers: {},
          blankWeights: {},
          evaluationType: FillInBlanksEvaluationType.NORMAL,
        },
      };
    case QuestionType.MATCH_THE_FOLLOWING:
      return {
        ...baseQuestion,
        questionType: QuestionType.MATCH_THE_FOLLOWING,
        options: [],
      };
    case QuestionType.DESCRIPTIVE:
      return {
        ...baseQuestion,
        questionType: QuestionType.DESCRIPTIVE,
        descriptiveConfig: {
          modelAnswer: "",
          keywords: [],
          minWords: undefined,
          maxWords: undefined,
        },
      };
    case QuestionType.CODING:
      return {
        ...baseQuestion,
        questionType: QuestionType.CODING,
        codingConfig: {
          language: ProgrammingLanguage.JAVA,
          templateCode: "",
          boilerplateCode: "",
          referenceSolution: "",
          timeLimitMs: 1000,
          memoryLimitMb: 256,
        },
        testCases: [],
      };
    case QuestionType.FILE_UPLOAD:
      return {
        ...baseQuestion,
        questionType: QuestionType.FILE_UPLOAD,
        fileUploadConfig: {
          allowedFileTypes: [],
          maxFileSize: undefined,
        },
      };
    default:
      throw new Error(`Unsupported question type: ${questionType}`);
  }
}

export function getQuestionTypeDisplayName(questionType: QuestionType): string {
  switch (questionType) {
    case QuestionType.MCQ:
      return "Multiple Choice (Single)";
    case QuestionType.MMCQ:
      return "Multiple Choice (Multiple)";
    case QuestionType.TRUE_FALSE:
      return "True/False";
    case QuestionType.FILL_IN_BLANKS:
      return "Fill in the Blanks";
    case QuestionType.MATCH_THE_FOLLOWING:
      return "Match the Following";
    case QuestionType.DESCRIPTIVE:
      return "Descriptive";
    case QuestionType.CODING:
      return "Coding";
    case QuestionType.FILE_UPLOAD:
      return "File Upload";
    default:
      return questionType;
  }
}

export function getQuestionTypeIcon(questionType: QuestionType): string {
  switch (questionType) {
    case QuestionType.MCQ:
    case QuestionType.MMCQ:
      return "ListChecks";
    case QuestionType.TRUE_FALSE:
      return "CheckCircle";
    case QuestionType.FILL_IN_BLANKS:
      return "FilePenLine";
    case QuestionType.MATCH_THE_FOLLOWING:
      return "Network";
    case QuestionType.DESCRIPTIVE:
      return "FileText";
    case QuestionType.CODING:
      return "Code";
    case QuestionType.FILE_UPLOAD:
      return "Upload";
    default:
      return "HelpCircle";
  }
}
