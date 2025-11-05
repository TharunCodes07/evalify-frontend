import {
  QuestionType,
  TestCaseVisibility,
  ProgrammingLanguage,
  BloomLevel,
  Difficulty,
} from "./questions";

/**
 * Student-safe question types that exclude answers and solutions
 */

// Base student question interface
export interface StudentBaseQuestion {
  id: string;
  questionType: QuestionType;
  text: string;
  marks: number;
  negativeMarks: number;
  topics?: string[];
  bloomLevel?: BloomLevel;
  difficulty?: Difficulty;
  courseOutcome?: number;
  orderIndex: number;
  attachedFiles?: string[];
}

// MCQ Question for students (no isCorrect flag)
export interface StudentMCQQuestion extends StudentBaseQuestion {
  questionType: QuestionType.MCQ;
  options: StudentQuestionOption[];
}

// MMCQ Question for students (no isCorrect flag)
export interface StudentMMCQQuestion extends StudentBaseQuestion {
  questionType: QuestionType.MMCQ;
  options: StudentQuestionOption[];
}

// True/False Question for students (no answer shown)
export interface StudentTrueFalseQuestion extends StudentBaseQuestion {
  questionType: QuestionType.TRUE_FALSE;
  isTrueFalseQuestion: boolean; // Just indicates it's a true/false question
}

// Fill in the Blanks for students (no acceptable answers)
export interface StudentFillInBlanksQuestion extends StudentBaseQuestion {
  questionType: QuestionType.FILL_IN_BLANKS;
  blankConfig: StudentFillInBlanksConfig;
}

// Match the Following for students (no correct pairs)
export interface StudentMatchTheFollowingQuestion extends StudentBaseQuestion {
  questionType: QuestionType.MATCH_THE_FOLLOWING;
  options: StudentQuestionOption[];
}

// Descriptive for students (no model answer)
export interface StudentDescriptiveQuestion extends StudentBaseQuestion {
  questionType: QuestionType.DESCRIPTIVE;
  descriptiveConfig: StudentDescriptiveConfig;
}

// Coding for students (no reference solution)
export interface StudentCodingQuestion extends StudentBaseQuestion {
  questionType: QuestionType.CODING;
  codingConfig: StudentCodingConfig;
  testCases: StudentTestCase[];
}

// File Upload for students
export interface StudentFileUploadQuestion extends StudentBaseQuestion {
  questionType: QuestionType.FILE_UPLOAD;
  fileUploadConfig?: {
    allowedFileTypes?: string[];
    maxFileSize?: number;
  };
}

// Union type for all student question types
export type StudentQuestion =
  | StudentMCQQuestion
  | StudentMMCQQuestion
  | StudentTrueFalseQuestion
  | StudentFillInBlanksQuestion
  | StudentMatchTheFollowingQuestion
  | StudentDescriptiveQuestion
  | StudentCodingQuestion
  | StudentFileUploadQuestion;

// Question Option for students
export interface StudentQuestionOption {
  id: string;
  optionText: string;
  orderIndex: number;
  isCorrect?: boolean; // Only sent for Match the Following: true = left pair, false = right pair. NOT sent for MCQ/MMCQ to prevent answer leakage
  matchPairIds?: string[]; // Only sent for Match the Following right pairs (isCorrect=false)
  // marksWeightage excluded
}

// Fill in the Blanks Config for students
export interface StudentFillInBlanksConfig {
  blankCount: number;
  // acceptableAnswers, blankWeights, evaluationType excluded
}

// Descriptive Config for students
export interface StudentDescriptiveConfig {
  minWords?: number;
  maxWords?: number;
  // modelAnswer, keywords excluded
}

// Coding Config for students
export interface StudentCodingConfig {
  language: ProgrammingLanguage;
  templateCode?: string;
  boilerplateCode?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  // referenceSolution excluded
}

// Test Case for students (only shows visible/sample cases)
export interface StudentTestCase {
  id: string;
  visibility: TestCaseVisibility;
  orderIndex: number;
  // Only populated for VISIBLE and SAMPLE test cases
  input?: string;
  expectedOutput?: string;
  // marksWeightage, generatedFromSolution, floatTolerance, checker excluded
}
