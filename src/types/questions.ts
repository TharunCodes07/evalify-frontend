// Enums
export enum QuestionType {
  MCQ = "MCQ",
  MMCQ = "MMCQ",
  TRUE_FALSE = "TRUE_FALSE",
  FILL_IN_BLANKS = "FILL_IN_BLANKS",
  MATCH_THE_FOLLOWING = "MATCH_THE_FOLLOWING",
  DESCRIPTIVE = "DESCRIPTIVE",
  CODING = "CODING",
  FILE_UPLOAD = "FILE_UPLOAD",
}

export enum TestCaseVisibility {
  VISIBLE = "VISIBLE",
  HIDDEN = "HIDDEN",
  SAMPLE = "SAMPLE",
}

export enum ProgrammingLanguage {
  JAVA = "JAVA",
  PYTHON = "PYTHON",
  CPP = "CPP",
  JAVASCRIPT = "JAVASCRIPT",
  TYPESCRIPT = "TYPESCRIPT",
  KOTLIN = "KOTLIN",
  GO = "GO",
  RUST = "RUST",
  C = "C",
}

export enum BloomLevel {
  REMEMBER = "REMEMBER",
  UNDERSTAND = "UNDERSTAND",
  APPLY = "APPLY",
  ANALYZE = "ANALYZE",
  EVALUATE = "EVALUATE",
  CREATE = "CREATE",
}

export enum OutputChecker {
  EXACT = "EXACT",
  TRIMMED = "TRIMMED",
  TOKEN = "TOKEN",
  FLOAT_TOLERANCE = "FLOAT_TOLERANCE",
}

export enum FillInBlanksEvaluationType {
  STRICT = "STRICT",
  NORMAL = "NORMAL",
  HYBRID = "HYBRID",
}

// Base Question Interface
export interface BaseQuestion {
  id?: string;
  questionType: QuestionType;
  text: string;
  explanation?: string;
  marks: number;
  negativeMarks: number;
  topics?: string[];
  bloomLevel?: BloomLevel;
  courseOutcome?: number;
  attachedFiles?: string[];
}

// MCQ Question - extends BaseQuestion
export interface MCQQuestion extends BaseQuestion {
  questionType: QuestionType.MCQ;
  options: QuestionOption[];
}

// MMCQ Question (Multiple Correct) - extends BaseQuestion
export interface MMCQQuestion extends BaseQuestion {
  questionType: QuestionType.MMCQ;
  options: QuestionOption[];
}

// True/False Question - extends BaseQuestion
export interface TrueFalseQuestion extends BaseQuestion {
  questionType: QuestionType.TRUE_FALSE;
  trueFalseAnswer?: boolean;
}

// Fill in the Blanks Question - extends BaseQuestion
export interface FillInBlanksQuestion extends BaseQuestion {
  questionType: QuestionType.FILL_IN_BLANKS;
  blankConfig: FillInBlanksConfig;
}

// Match the Following Question - extends BaseQuestion
export interface MatchTheFollowingQuestion extends BaseQuestion {
  questionType: QuestionType.MATCH_THE_FOLLOWING;
  options: QuestionOption[];
}

// Descriptive Question - extends BaseQuestion
export interface DescriptiveQuestion extends BaseQuestion {
  questionType: QuestionType.DESCRIPTIVE;
  descriptiveConfig: DescriptiveConfig;
}

// Coding Question - extends BaseQuestion
export interface CodingQuestion extends BaseQuestion {
  questionType: QuestionType.CODING;
  codingConfig: CodingConfig;
  testCases: TestCase[];
}

// File Upload Question - extends BaseQuestion
export interface FileUploadQuestion extends BaseQuestion {
  questionType: QuestionType.FILE_UPLOAD;
  allowedFileTypes?: string[];
  maxFileSize?: number;
}

// Union type for all question types
export type Question =
  | MCQQuestion
  | MMCQQuestion
  | TrueFalseQuestion
  | FillInBlanksQuestion
  | MatchTheFollowingQuestion
  | DescriptiveQuestion
  | CodingQuestion
  | FileUploadQuestion;

// Question Option (for MCQ, MMCQ, and Match the Following)
export interface QuestionOption {
  id: string;
  optionText: string;
  orderIndex: number;
  isCorrect: boolean;
  marksWeightage?: number;
  matchPairIds?: string[];
}

export type MCQOption = QuestionOption;

export interface QuestionSettings {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  co: number;
  negativeMarks: number;
  topicIds: string[];
  isQuiz?: boolean;
}

// Fill in the Blanks Configuration
export interface FillInBlanksConfig {
  blankCount: number;
  acceptableAnswers: Record<number, string[]>;
  blankWeights: Record<number, number>;
  evaluationType: FillInBlanksEvaluationType;
}

// Descriptive Answer Configuration
export interface DescriptiveConfig {
  modelAnswer?: string;
  keywords?: string[];
  minWords?: number;
  maxWords?: number;
}

// Coding Configuration
export interface CodingConfig {
  language: ProgrammingLanguage;
  templateCode?: string;
  boilerplateCode?: string;
  referenceSolution?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

// Test Case Configuration
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  visibility: TestCaseVisibility;
  marksWeightage?: number;
  orderIndex: number;
  generatedFromSolution: boolean;
  floatTolerance?: number;
  checker: OutputChecker;
}
