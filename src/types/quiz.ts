import { Question } from "./questions";

// Quiz related types
export interface Quiz {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  totalMarks?: number;
  passingMarks?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showResults?: boolean;
  allowReview?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Quiz Question Request/Response types
export interface CreateQuizQuestionRequest {
  questionType: string;
  text: string;
  explanation?: string;
  marks: number;
  negativeMarks: number;
  topics: string[];
  bloomLevel?: string;
  courseOutcome?: number;
  attachedFiles?: string[];
  orderIndex: number;

  // Type-specific fields
  options?: {
    optionText: string;
    orderIndex: number;
    isCorrect: boolean;
    marksWeightage?: number;
    matchPairIds?: string[];
  }[];

  trueFalseAnswer?: boolean;

  blankConfig?: {
    blankCount: number;
    acceptableAnswers: Record<number, string[]>;
    blankWeights: Record<number, number>;
    evaluationType: string;
  };

  descriptiveConfig?: {
    modelAnswer?: string;
    keywords?: string[];
    minWords?: number;
    maxWords?: number;
  };

  codingConfig?: {
    language: string;
    templateCode?: string;
    boilerplateCode?: string;
    referenceSolution?: string;
    timeLimitMs?: number;
    memoryLimitMb?: number;
  };

  testCases?: {
    input: string;
    expectedOutput: string;
    visibility: string;
    marksWeightage?: number;
    orderIndex: number;
    generatedFromSolution: boolean;
    floatTolerance?: number;
    checker: string;
  }[];

  allowedFileTypes?: string[];
  maxFileSize?: number;
}

export interface UpdateQuizQuestionRequest extends CreateQuizQuestionRequest {
  id: string;
}

export type QuizQuestionResponse = Question & {
  id: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};
