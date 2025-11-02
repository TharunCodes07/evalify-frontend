import { Question } from "./questions";

export interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  topics: string[];
  isPublic: boolean;
  permission?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionBankShare {
  userId: string;
  userName: string;
  userEmail: string;
  permission: string;
  sharedAt: string;
}

// Bank Question Request/Response types
export interface CreateBankQuestionRequest {
  questionType: string;
  text: string;
  explanation?: string;
  marks: number;
  negativeMarks: number;
  topics: string[];
  bloomLevel?: string;
  courseOutcome?: number;
  attachedFiles?: string[];

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

  fileUploadConfig?: {
    allowedFileTypes?: string[];
    maxFileSize?: number;
  };
}

export interface UpdateBankQuestionRequest extends CreateBankQuestionRequest {
  id: string;
}

export type BankQuestionResponse = Question & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
