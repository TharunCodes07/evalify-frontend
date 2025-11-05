import { Question } from "./questions";

// Quiz Configuration Types
export interface DisplaySettings {
  showQuestionsOneByOne: boolean;
  allowQuestionNavigation: boolean;
}

export interface AttemptSettings {
  maxAttempts: number;
  canReattemptIfFailed: boolean;
  passingPercentage?: number;
}

export interface RandomizationSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  randomizeQuestions: boolean;
}

export interface ScoringSettings {
  negativeMarkingEnabled: boolean;
  negativeMarksValue?: number;
  negativeMarkingQuestionTypes?: string[];
}

export interface AntiCheatingSettings {
  requireFullScreen: boolean;
  preventQuestionCopy: boolean;
  preventTabSwitch: boolean;
  tabSwitchLimit?: number;
  calculatorAccess: boolean;
  autoSubmit: boolean;
}

export interface SecuritySettings {
  passwordProtected: boolean;
  password?: string;
}

export interface QuizConfigDTO {
  display: DisplaySettings;
  attempts: AttemptSettings;
  randomization: RandomizationSettings;
  scoring: ScoringSettings;
  antiCheating: AntiCheatingSettings;
  security: SecuritySettings;
}

// Quiz related types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  config: QuizConfigDTO;
  isPublished: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  semesterCount?: number;
  batchCount?: number;
  courseCount?: number;
  studentCount?: number;
  labCount?: number;
}

// Bank Integration Types
export interface BulkAddQuestionsRequest {
  bankId: string;
  questionIds: string[];
}
export interface QuizDetailResponse {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  config: QuizConfigDTO;
  isPublished: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  semesters: ParticipantInfo[];
  batches: ParticipantInfo[];
  courses: ParticipantInfo[];
  students: ParticipantInfo[];
  labs: ParticipantInfo[];
}

export interface ParticipantInfo {
  id: string;
  name: string;
  additionalInfo?: string;
}

// Create Quiz Request
export interface CreateQuizRequest {
  title: string;
  description?: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  durationMinutes: number;

  semesterIds?: string[];
  batchIds?: string[];
  courseIds?: string[];
  studentIds?: string[];
  labIds?: string[];

  config: QuizConfigDTO;
  createdById: string;
}

// Update Quiz Request
export interface UpdateQuizRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;

  semesterIds?: string[];
  batchIds?: string[];
  courseIds?: string[];
  studentIds?: string[];
  labIds?: string[];

  config?: QuizConfigDTO;
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
  difficulty?: string;
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

  fileUploadConfig?: {
    allowedFileTypes?: string[];
    maxFileSize?: number;
  };
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

// Quiz List Response (for table/grid views)
export interface QuizListResponse {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  isPublished: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  permission?: string; // For shared quizzes: "VIEW" | "EDIT" | null for owner
}

// Quiz Share Types
export interface QuizShare {
  userId: string;
  userName: string;
  userEmail: string;
  permission: "VIEW" | "EDIT";
  sharedAt: string;
}

export interface ShareQuizRequest {
  userIds: string[];
  permission: "VIEW" | "EDIT";
}

// Student Quiz Types - Optimized for Redis-first approach
export interface CourseInfo {
  code: string;
  name: string;
}

export interface LiveQuiz {
  quizId: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  extensionMinutes: number;
  isPasswordProtected: boolean;
  createdByName: string;
  courses: CourseInfo[];
}

export interface CompletedQuiz {
  quizId: string;
  title: string;
  description?: string;
  durationMinutes: number;
  attemptId: number;
  startedAt: string;
  submittedAt: string;
  status: string;
  isLateSubmission: boolean;
  obtainedMarks?: number;
  percentage?: number;
  timeTaken: number;
  extensionMinutes: number;
  createdByName: string;
  courses: CourseInfo[];
}

export interface MissedQuiz {
  quizId: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime: string;
  durationMinutes: number;
  createdByName: string;
  courses: CourseInfo[];
}

export interface PaginationInfo {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

export interface StudentQuizzesResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Types for password validation
export interface ValidateQuizPasswordRequest {
  password: string;
}

export interface ValidateQuizPasswordResponse {
  valid: boolean;
  message?: string;
}

export interface StudentQuizConfig {
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  showQuestionsOneByOne: boolean;
  allowQuestionNavigation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  requireFullScreen: boolean;
  preventQuestionCopy: boolean;
  preventTabSwitch: boolean;
  tabSwitchLimit?: number;
  calculatorAccess: boolean;
  autoSubmit: boolean;
}
